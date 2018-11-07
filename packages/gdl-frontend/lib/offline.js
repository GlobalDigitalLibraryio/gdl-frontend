// @flow
import { coverImageUrl } from 'gdl-image';
import localForage from 'localforage';

import type { BookDetails, Chapter } from '../types';
import { fetchChapter } from '../fetch';

const DB_VERSION = 1;
const CACHE_NAME = 'gdl-offline';

function keyForBook(
  bookOrId: string | number | BookDetails,
  language?: string
) {
  return arguments.length > 1
    ? // $FlowFixMe
      `${bookOrId}-${language}`
    : // $FlowFixMe
      `${bookOrId.id}-${bookOrId.language.code}`;
}

function openCache() {
  return window.caches.open(CACHE_NAME);
}

function getImageUrls(book: BookDetails, chapters: Array<Chapter>) {
  let imageUrls = chapters.reduce(
    (images, chapter) => images.concat(chapter.images),
    []
  );
  // Remove duplicates. Some chapters use the same image. The publisher logo, for instance, is often repeated in the chapters
  imageUrls = [...new Set(imageUrls)];

  if (book.coverImage) {
    imageUrls.push(coverImageUrl(book.coverImage));
  }
  return imageUrls;
}

export class OfflineCollection {
  bookStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'books',
    version: DB_VERSION
  });

  timestampStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'timestamp',
    version: DB_VERSION
  });

  _addImages = async (book: BookDetails, chapters: Array<Chapter>) => {
    const imageUrls = getImageUrls(book, chapters);
    const cache = await openCache();
    await cache.addAll(imageUrls);
  };

  /**
   * When we clean up images it is important that we use the book data that we alredy have in IndexedDB.
   * This is because if you were to use a book object fetched from the network, it's images could have changed,
   * and then we would be left with stale images
   */
  _deleteImages = async (id: number, language: string) => {
    const book = await this.getBook(id, language);
    if (!book) return;

    const imageUrls = getImageUrls(book, book.chapters);

    const cache = await openCache();
    for (const request of await cache.keys()) {
      if (imageUrls.includes(request.url)) {
        cache.delete(request);
      }
    }
  };

  async getBook(id: string | number, language: string): Promise<?BookDetails> {
    return this.bookStore.getItem(keyForBook(id, language));
  }

  /**
   * Get all books in offline collection
   */
  async getBooks(): Promise<Array<BookDetails>> {
    const books = [];

    await this.bookStore.iterate(value => {
      books.push(value);
      return;
    });

    return books;
  }

  async getChapter(
    bookId: string | number,
    chapterId: string | number,
    language: string
  ): Promise<?Chapter> {
    const book = await this.getBook(bookId, language);

    // Yes. we are comparing number to string 😱
    return book ? book.chapters.find(c => c.id == chapterId) : undefined;
  }

  /**
   * Clears whole offline collection
   */
  async clear() {
    return Promise.all([
      this.bookStore.clear(),
      window.caches.delete(CACHE_NAME)
    ]);
  }

  async deleteBook(book: BookDetails) {
    await this._deleteImages(book.id, book.language.code);

    // NB! Must be last, the other methods depends on the book being in in IndexedDB.
    const result = await this.bookStore.removeItem(keyForBook(book));
    this.timestampStore.removeItem(keyForBook(book));
    return Boolean(result);
  }

  async addBook(book: BookDetails) {
    try {
      // Get all the chapters for the book, and ensure we fetched them okay.
      const chapterResults = await Promise.all(
        book.chapters.map(chapter =>
          fetchChapter(book.id, chapter.id, book.language.code)
        )
      );

      const chapters = chapterResults.map(c => c.data);
      book.chapters = chapters;

      // Add all the images in the cache
      await this._addImages(book, chapters);

      await this.timestampStore.setItem(keyForBook(book), Date.now());
      await this.bookStore.setItem(keyForBook(book), book);
      return true;
    } catch (error) {
      console.error(error);
      // If something went wrong when offlining the book, cleanup after ourselves
      this.deleteBook(book);
      return false;
    }
  }
}

/**
 * Check if the client is offline
 */
export const clientIsOffline = () =>
  typeof window !== 'undefined' && !window.navigator.onLine;

/**
 * Check if the client supports serviceworkers
 */
export const clientSupportsOffline = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

/**
 * Make sure we're running a service worker in the top scope
 */
export const runsServiceWorker = async () =>
  Boolean(await window.navigator.serviceWorker.getRegistration('/'));
