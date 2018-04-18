// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

const express = require('express');
const next = require('next');
const requestLanguage = require('express-request-language');
const cookieParser = require('cookie-parser');
const glob = require('glob');
const routes = require('../routes');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

const languages = glob.sync('locale/*/messages.js').map(f => f.split('/')[1]);
console.log('> Found translations for the following languages: ', languages);

// Setup cache for rendered HTML
const renderAndCache = require('./cache')(app);

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
