// @flow

const openOfflineCache = () => window.caches.open('gdl-offline');

async function addOfflineUrls(urls: Array<string>) {
  const cache = await openOfflineCache();
  try {
    await cache.addAll(urls);
  } catch (error) {
    // TODO: Delete any URLs that was added before the error occurred
  }
}

export async function makeAvailableOffline(book) {
  return addOfflineUrls([
    'https://api.test.digitallibrary.io/book-api/v1/books/en/27',
    ...book.chapters.map(c => c.url)
  ]);
}

// Prototyping... NOT TESTED
export async function deleteBook(bookId: string) {
  const cache = await openOfflineCache();
  for (const request of await cache.keys()) {
    if (request.url.includes(bookId)) {
      cache.delete(request);
    }
  }
}

export async function getOfflineChapter(url: string) {
  const cache = await openOfflineCache();
  return cache.match(url);
}

export async function getOfflineBooks() {
  const regexp = /\/books\/en\/\d+$/;
  const cache = await openOfflineCache();
  const requestKeys = await cache.keys();
  const bookRequests = requestKeys.filter(req => req.url.match(regexp));

  const bookResponses = await Promise.all(
    bookRequests.map(r => cache.match(r))
  );

  return await Promise.all(bookResponses.map(res => res.json()));
}
