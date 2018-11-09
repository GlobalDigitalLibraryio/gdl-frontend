/* global self, workbox */
workbox.core.setCacheNameDetails({ prefix: 'gdl' });

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

// // Cache the Google Fonts webfont files with a cache first strategy for 1 year.
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

// Offline testing
// urlPattern: /^\/offline/,
// handler: 'cacheFirst',
// options: {
//   cacheName: 'gdl-offline',
//   expiration: {
//     maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
//   }
// }
