// @flow

const openOfflineCache = () => window.caches.open('gdl-offline');

export default async function makeAvailableOffline(urls: Array<string>) {
  const cache = await openOfflineCache();
  await cache.addAll(urls);
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
