// @flow
import { coverImageUrl } from 'gdl-image';
import localForage from 'localforage';

import type { BookDetails, Chapter } from '../../types';
import TimestampModel from './TimestampModel';
import { keyForBook, CACHE_NAME } from './index';

// 7 days
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function openCache() {
  return window.caches.open(CACHE_NAME);
}

export default class OfflineLibrary {
  bookStore = localForage.createInstance({
    name: CACHE_NAME,
    storeName: 'books'
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
  _deleteImagesFromCache = async (id: number | string, language: string) => {
    const book = await this._getBookWithoutExpiration(id, language);
    if (!book) return;

    // $FlowFixMe
    const imageUrls = getImageUrls(book, book.chapters);

    const cache = await openCache();
    for (const request of await cache.keys()) {
      if (imageUrls.includes(request.url)) {
        cache.delete(request);
      }
    }
  };

  /**
   * Expires entries older than the given timestamp
   */
  async _expireEntries(expireOlderThanTimestamp: number) {
    const entries = await this.timestampModel.getTimeStamps();

    const oldEntries = entries.filter(
      entry => entry.timestamp < expireOlderThanTimestamp
    );

    await Promise.all(
      oldEntries.map(entry => this.deleteBook(entry.id, entry.language))
    );
  }

  async _getBookWithoutExpiration(
    id: string | number,
    language: string
  ): Promise<?BookDetails> {
    return this.bookStore.getItem(keyForBook(id, language));
  }

  async getBook(id: string | number, language: string): Promise<?BookDetails> {
    const book = await this._getBookWithoutExpiration(id, language);
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
    this.deleteBook(book.id, book.language.code);
  }

  /**
   * Get all books in the offline library
   *
   */
  async getBooks(): Promise<Array<BookDetails>> {
    await this._expireEntries(Date.now() - MAX_AGE_MS);

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

    // Yes. we are comparing a number to string, yolo 😱
    // $FlowFixMe
    return book ? book.chapters.find(c => c.id == chapterId) : undefined; // eslint-disable-line eqeqeq
  }

  /**
   * Clears whole library
   */
  async clear() {
    return Promise.all([
      this.timestampModel.clear(),
      this.bookStore.clear(),
      window.caches.delete(CACHE_NAME)
    ]);
  }

  async deleteBook(id: number | string, language: string) {
    await this._deleteImagesFromCache(id, language);

    this.timestampModel.deleteTimestamp(id, language);
    // NB! Must be last, the other methods depends on the book being in in IndexedDB.
    return await this.bookStore.removeItem(keyForBook(id, language));
  }

  async addBook(book: BookDetails) {
    try {
      // Get all the chapters for the book, and ensure we fetched them okay.
      const chapters = await Promise.all(
        book.chapters.map(async chapter => {
          const result = await fetchChapter(
            book.id,
            chapter.id,
            book.language.code
          );
          if (!result.isOk) throw new Error();
          return result.data;
        })
      );

      // Add all the images to the cache
      await this._addImagesToCache(book, chapters);

      /**
       * We cheat a bit here. The book details object from the API
       * doesn't have chapters with content. Since we don't want to keep track of each chapter
       * individually we add it to the the book and store that.
       * So that means that book we store actually have an extra property on each chapter, the content!
       */
      const bookWithFullChapters = { ...book, chapters };

      await this.timestampModel.setTimestamp(book.id, book.language.code);
      await this.bookStore.setItem(keyForBook(book), bookWithFullChapters);

      return true;
    } catch (error) {
      // If something went wrong when offlining the book, cleanup after ourselves
      this.deleteBook(book.id, book.language.code);
      return false;
    }
  }
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
