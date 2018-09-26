// @flow
import type { BookDetails } from '../types';

const openOfflineCache = () => window.caches.open('gdl-offline');

export const supportsOffline = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

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
  return Boolean(
    requests.find(
      r =>
        r.url ===
        `https://api.test.digitallibrary.io/book-api/v1/books/${
          book.language.code
        }/${book.id}`
    )
  );
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

/**
 * Get the URLs for a book (exlcuded images in chapters)
 */
function getUrlsForBook(book: BookDetails) {
  const urls = [
    `https://api.test.digitallibrary.io/book-api/v1/books/${
      book.language.code
    }/${book.id}`,
    ...book.chapters.map(c => c.url)
  ];

  if (book.coverImage) {
    urls.push(book.coverImage.url);
  }
  return urls;
}

/**
 * Get the image urls from the chapters. Required the chapters to be offlined already since
 * we read from the cache.
 */
async function getUniqueChapterImageUrls(book) {
  let imageUrls = [];
  const cache = await openOfflineCache();

  const chapterUrls = book.chapters.map(c => c.url);

  for (const url of chapterUrls) {
    const response = await cache.match(url);
    if (!response) continue;
    const chapter = await response.json();
    imageUrls = imageUrls.concat(chapter.images);
  }

  // Remove duplicates
  return [...new Set(imageUrls)];
}
