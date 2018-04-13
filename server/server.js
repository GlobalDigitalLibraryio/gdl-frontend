// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 @PROJECT@
 *
 * See LICENSE
 */

const express = require('express');
const next = require('next');
const LRUCache = require('lru-cache');
const requestLanguage = require('express-request-language');
const cookieParser = require('cookie-parser');
const glob = require('glob');
const routes = require('../routes');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

const languages = glob.sync('locale/*/messages.js').map(f => f.split('/')[1]);
console.log('> Found translations for the following languages: ', languages);

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});

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

// A list of conditions that will make the request skip the cache
const skipCacheConditions = [
  req => isDev, // Don't cache when developing
  req => req.cookies.jwt != null, // DO NOT CACHE FOR AUTHENTICATED USERS
  req => req.path.startsWith('/search') && Object.keys(req.query).length !== 0 // Don't bother caching searches.
];

async function renderAndCache(req, res, pagePath, queryParams) {
  const cacheKey = getCacheKey(req);

  const canUseCache = !skipCacheConditions.some(condition => condition(req));

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
}

const routerHandler = routes.getRequestHandler(
  app,
  ({ req, res, route, query }) => {
    renderAndCache(req, res, route.page, query);
  }
);

async function setup() {
  await app.prepare();
  const server = express();

  // Health check for AWS
  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get('/health', (req, res) => {
    res.status(200).json({ status: 200, text: 'Health check ok' });
  });

  // Setup the cookie parsing for express
  server.use(cookieParser());
  // Determine language based on query parameter, cookie, or http accept header
  // This middleware injects a language property on the request object.
  server.use(
    requestLanguage({
      languages,
      queryName: 'hl',
      cookie: {
        name: 'language'
      }
    })
  );

  server.use(routerHandler);

  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get('*', (req, res) => {
    // Add cache headers to our static assets if we aren't running in development mode
    if (!isDev && /^\/static\//.test(req.url)) {
      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
    }

    handle(req, res);
  });

  return server;
}

module.exports = setup;
