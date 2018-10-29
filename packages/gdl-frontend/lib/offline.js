// @flow
import { coverImageUrl } from 'gdl-image';
import type { BookDetails } from '../types';
import { getBookUrl } from '../fetch';

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

export const supportsOffline = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

export const runsServiceWorker = async () =>
  Boolean(await window.navigator.serviceWorker.getRegistration('/'));

/**
 * Fetches the book and the chapter via the service worker and adds them to the offline cache
 */
export async function makeAvailableOffline(book: BookDetails) {
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
 * Check if the book is already in the offline cache
 */
export async function isAvailableOffline(book: BookDetails) {
  const cache = await openOfflineCache();
  const requests = await cache.keys();
  const bookUrl = getBookUrl(book);
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

/**
 * Remove book from offline availability
 */
export async function removeFromAvailableOffline(book: BookDetails) {
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

export async function getTimestamp(book: BookDetails) {
  const cache = await openOfflineCache();
  const response = await cache.match(getBookUrl(book));

  console.log(response);

  response.headers.forEach(h => console.log(h));
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
