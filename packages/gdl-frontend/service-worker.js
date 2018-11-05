/* global workbox */
workbox.core.setCacheNameDetails({ prefix: 'gdl' });

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {}); // eslint-disable-line

// Google fonts. See https://developers.google.com/web/tools/workbox/guides/common-recipes
// Cache the Google Fonts stylesheets with a stale while revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets'
  })
);

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // One year
        maxEntries: 30
      }),
      new workbox.cacheableResponse.Plugin({ statuses: [0, 200] })
    ]
  })
);

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    return event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline'))
    );
  }
});

const imageRegExp = /^https:\/\/res\.cloudinary\.com/;
const bookDetailsRegExp = /\/book-api\/v1\/books\/[\w-]+\/\d+$/;
const chapterRegExp = /\/book-api\/v1\/books\/[\w-]+\/\d+\/chapters\/\d+$/;

workbox.routing.registerRoute(
  ({ url, event }) => {
    return (
      imageRegExp.test(url.href) ||
      bookDetailsRegExp.test(url.href) ||
      chapterRegExp.test(url.href)
    );
  },
  workbox.strategies.cacheFirst({
    cacheName: 'gdl-offline',
    matchOptions: {
      ignoreVary: true
    },
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      }),
      {
        // Only add to the cache if this was offlined already
        // cacheWillUpdate: async ({ request, response, event }) () => {
        //   return null;
        //   // const cache = await self.caches.open('gdl-offline');
        //   // return (await cache.match(request)) ? response : null;
        // }
        // We never add to cache. Adding to cache is explictily done by the user by making a book available offline
        cacheWillUpdate: () => null
      }
    ]
  })
);

// urlPattern: /^https:\/\/images\.(.+)\.digitallibrary\.io/,
// handler: 'cacheFirst',
// options: {
//   cacheName: 'gdl-images',
//   expiration: {
//     maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//     maxEntries: 60
//     // this should probably be true?
//     // purgeOnQuotaError: true
//   },
//   // cacheableResponse: {
//   //   statuses: [0, 200]
//   // },
//   // fetchOptions: {
//   //   mode: 'no-cors',
//   // },
//   matchOptions: {
//     ignoreSearch: false
//   }
