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
