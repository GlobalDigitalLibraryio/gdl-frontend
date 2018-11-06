// @flow
import { coverImageUrl } from 'gdl-image';
import localForage from 'localforage';

import type { BookDetails, Chapter } from '../types';
import { getBookUrl, fetchChapter } from '../fetch';

function keyForBook(book) {
  return `${book.id}-${book.language.code}`;
}

const CACHE_NAME = 'gdl-offline';
function openCache() {
  return window.caches.open(CACHE_NAME);
}

//function getAllChapters(book) {}

export class OfflineCollection {
  bookStore = localForage.createInstance({
    name: 'offline',
    storeName: 'books'
  });

  chapterStore = localForage.createInstance({
    name: 'offline',
    storeName: 'chapters'
  });

  _addChapter = async (chapter: Chapter) => {
    return this.chapterStore.setItem(chapter.id, chapter);
  };

  _addImages = async (book: BookDetails, chapters: Array<Chapter>) => {
    let imageUrls = chapters.reduce(
      (images, chapter) => images.concat(chapter.images),
      []
    );
    // Remove duplicates. Some chapters use the same image. The publisher logo, for instance, is often repeated in the chapters
    imageUrls = [...new Set(imageUrls)];

    const cache = await openCache();
    await cache.addAll(imageUrls);
  };

  /**
   * Check if the book is available offline
   */
  async isBookAvailableOffline(book: BookDetails) {
    const value = await this.bookStore.getItem(keyForBook(book));
    return Boolean(value);
  }

  /**
   * Get all books in offline collection
   */
  async getOfflineBooks(): Promise<Array<BookDetails>> {
    const books = [];

    await this.bookStore.iterate(value => {
      books.push(value);
      return;
    });

    return books;
  }

  /**
   * Clears whole offline collection
   */
  async purgeOfflineBooks() {
    return Promise.all([
      this.bookStore.clear(),
      this.chapterStore.clear(),
      window.caches.delete(CACHE_NAME)
    ]);
  }

  async removeBookAvailableOffline(book: BookDetails) {
    const result = await this.bookStore.removeItem(keyForBook(book));
    return Boolean(result);
  }

  async makeBookAvailableOffline(book: BookDetails) {
    try {
      const chapterResults = await Promise.all(
        book.chapters.map(chapter =>
          fetchChapter(book.id, chapter.id, book.language.code)
        )
      );

      const chapters = chapterResults.map(c => c.data);
      await Promise.all(chapters.map(this._addChapter));
      await this._addImages(book, chapters);
      await this.bookStore.setItem(keyForBook(book), book);
      return true;
    } catch (error) {
      console.error(error);
      // If something went wrong when offlining the book, cleanup after ourselves
      this.removeBookAvailableOffline(book);
      return false;
    }
  }
}

/**
 * Returns a promise that resolves to the cache object.
 * If the cache doesn't exist, the cache is created and the promise resolves
 * to this new cache object instead.
 */
const openOfflineCache = () => window.caches.open('gdl-offline');

/**
 * Returns a promise that resolves to true if the cache exists and deletes it.
 */
export function purgeOfflineBooks() {
  return window.caches.delete('gdl-offline');
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

/**
 * Fetches the book, the chapters and the images and adds them to the offline cache
 */
export async function makeBookAvailableOffline(book: BookDetails) {
  let bookUrls = [];
  let imageUrls = [];
  const cache = await openOfflineCache();
  try {
    bookUrls = getUrlsForBook(book);
    await cache.addAll(bookUrls);
    imageUrls = await getUniqueChapterImageUrls(book);
    await cache.addAll(imageUrls);

    return true;
  } catch (error) {
    // If something went wrong when offlining the book, cleanup after ourselves
    bookUrls.concat(imageUrls).forEach(url => cache.delete(url));
    return false;
  }
}

/**
 * Remove book from offline availability
 */
export async function removeBookAvailableOffline(book: BookDetails) {
  const cache = await openOfflineCache();
  const urls = getUrlsForBook(book).concat(
    await getUniqueChapterImageUrls(book)
  );

  for (const request of await cache.keys()) {
    if (urls.includes(request.url)) {
      cache.delete(request);
    }
  }
}

/**
 * Check if the book is already in the offline cache
 */
export async function isBookAvailableOffline(book: BookDetails) {
  const cache = await openOfflineCache();
  const requests = await cache.keys();
  const bookUrl = getBookUrl(book);
  getTimestamp(book);
  return Boolean(requests.find(r => r.url === bookUrl));
}

/**
 * Get all books that are offlined
 */
export async function getOfflineBooks(): Promise<Array<BookDetails>> {
  // Assume all URLs in the offline cache that looks like '/books/sw-ke/2151' or '/books/en/2' are books
  const bookUrlRegExp = /\/books\/[\w-]+\/\d+$/; // Add v1 prefix?

  const cache = await openOfflineCache();
  const requestKeys = await cache.keys();
  const bookRequests = requestKeys.filter(req => req.url.match(bookUrlRegExp));

  const bookResponses = await Promise.all(
    bookRequests.map(r => cache.match(r))
  );
  return await Promise.all(bookResponses.map(res => res.json()));
}

export async function getTimestamp(book: BookDetails) {
  const cache = await openOfflineCache();
  const response = await cache.match(getBookUrl(book));

  console.log(response);

  response && response.headers.forEach(h => console.log(h));
  // JS is extremely lenient, so it should be able to parse the date header value
  return response ? new Date(response.headers.get('Date')) : null;
}

/**
 * Get the URLs for a book (exlcuded images in chapters)
 */
function getUrlsForBook(book: BookDetails) {
  const urls = [getBookUrl(book), ...book.chapters.map(c => c.url)];

  if (book.coverImage) {
    urls.push(coverImageUrl(book.coverImage));
  }
  return urls;
}

/**
 * Get the image urls from the chapters. Required the chapters to be offlined already since
 * we read from the cache.
 */
async function getUniqueChapterImageUrls(book) {
  const cache = await openOfflineCache();

  const chapterUrls = book.chapters.map(c => c.url);

  let imageUrls = [];
  for (const url of chapterUrls) {
    const response = await cache.match(url);
    if (!response) continue;
    const chapter = await response.json();
    imageUrls = imageUrls.concat(chapter.images);
  }

  // Remove duplicates, some chapters use the same image, like the pubisher logo
  return [...new Set(imageUrls)];
}
