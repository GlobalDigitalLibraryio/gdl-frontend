// @flow
import { coverImageUrl } from 'gdl-image';
import localForage from 'localforage';

import type { BookDetails, Chapter } from '../types';
import { fetchChapter } from '../fetch';

const DB_VERSION = 1;
const CACHE_NAME = 'gdl-offline';
// 7 days
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function openCache() {
  return window.caches.open(CACHE_NAME);
}

/**
 * We keep track of when the book was offlined, so we can expire it after a certain time has passed
 */
class TimestampModel {
  timestampStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'timestamp',
    version: DB_VERSION
  });

  getTimestamp = async (id: number | string, language: string) =>
    this.timestampStore.getItem(keyForBook(id, language));

  setTimestamp = async (id: number | string, language: string) =>
    this.timestampStore.setItem(keyForBook(id, language), Date.now());

  deleteTimestamp = async (id: number | string, language: string) =>
    this.timestampStore.removeItem(keyForBook(id, language));
}

export class OfflineLibrary {
  bookStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'books',
    version: DB_VERSION
  });

  timestampModel = new TimestampModel();

  _addImagesToCache = async (book: BookDetails, chapters: Array<Chapter>) => {
    const imageUrls = getImageUrls(book, chapters);
    const cache = await openCache();
    await cache.addAll(imageUrls);
  };

  /**
   * When we clean up images it is important that we use the book data that we alredy have in IndexedDB.
   * This is because if you were to use a book object fetched from the network, it's images could have changed,
   * and then we would be left with stale images
   */
  _deleteImagesFromCache = async (id: number, language: string) => {
    const book = await this._getBookIgnoreCache(id, language);
    if (!book) return;

    const imageUrls = getImageUrls(book, book.chapters);

    const cache = await openCache();
    for (const request of await cache.keys()) {
      if (imageUrls.includes(request.url)) {
        cache.delete(request);
      }
    }
  };

  async _getBookIgnoreCache(
    id: string | number,
    language: string
  ): Promise<?BookDetails> {
    return this.bookStore.getItem(keyForBook(id, language));
  }

  async getBook(id: string | number, language: string): Promise<?BookDetails> {
    const book = await this._getBookIgnoreCache(id, language);
    console.log(book);
    if (!book) return;

    const timestamp = await this.timestampModel.getTimestamp(id, language);
    // Unable to make sense of timestamp. Assume we're okay
    if (!timestamp) {
      // But attempt to rectify it by setting one
      this.timestampModel.setTimestamp(id, language);
      return book;
    }

    // If we have a valid timestamp, then our offlined data is fresh if the
    // timestamp plus maxAgeMs is greater than the current time.
    const now = Date.now();

    const isFresh = timestamp >= now - MAX_AGE_MS;

    if (isFresh) {
      return book;
    }
    this.deleteBook(book);
  }

  /**
   * Get all books in offline collection
   *
   * TODO: Get rid of the books that are expired
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
    await this._deleteImagesFromCache(book.id, book.language.code);

    // NB! Must be last, the other methods depends on the book being in in IndexedDB.
    const result = await this.bookStore.removeItem(keyForBook(book));
    this.timestampModel.deleteTimestamp(book.id, book.language.code);
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

      // Add all the images in the cache
      await this._addImagesToCache(book, chapters);

      book.chapters = chapters;

      // Update
      await this.timestampModel.setTimestamp(book.id, book.language.code);
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
 * Book ids aren't unique. So we make a composite key together with the language
 */
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

/**
 * Get all unique image URLs in a book and it's chapters
 */
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
