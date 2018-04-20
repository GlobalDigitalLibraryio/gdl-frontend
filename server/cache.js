/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

const LRUCache = require('lru-cache');

const isDev = process.env.NODE_ENV !== 'production';

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 200,
  maxAge: 1000 * 60 * 60 // 1hour
});

/**
 *  Determine if the page is something we want to cache
 */
function isCacheable(req) {
  // Don't cache when developing
  if (isDev) {
    return false;
    // DO NOT CACHE FOR AUTHENTICATED USERS
  } else if (req.cookies.jwt != null) {
    return false;
    // Don't bother caching searches.
  } else if (
    req.path.startsWith('/search') &&
    Object.keys(req.query).length !== 0
  ) {
    return false;
  }

  return true;
}

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
  const { path } = req;

  if (path === '/') {
    const bookLanguage = req.cookies.bookLanguage;
    const bookCategory = req.cookies.bookCategory;
    return `${path}-${bookLanguage}-${bookCategory}`;
  }

  return req.path;
}

function renderAndCache(app) {
  return async function(req, res, pagePath, queryParams) {
    const cacheKey = getCacheKey(req);
    const canUseCache = isCacheable(req);

    // If the page is in the cache. Serve it
    if (canUseCache && ssrCache.has(cacheKey)) {
      res.setHeader('x-cache', 'HIT');
      res.send(ssrCache.get(cacheKey));
      return;
    }

    try {
      // If not found in the cache, render the page as HTML
      const html = await app.renderToHTML(req, res, pagePath, queryParams);

      // Skip the cache if something is wrong
      if (res.statusCode !== 200) {
        res.send(html);
        return;
      }

      if (canUseCache) {
        // Cache the rendered result
        ssrCache.set(cacheKey, html);

        res.setHeader('x-cache', 'MISS');
      }

      res.send(html);
    } catch (err) {
      app.renderError(err, req, res, pagePath, queryParams);
    }
  };
}

module.exports = renderAndCache;
