// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 @PROJECT@
 *
 * See LICENSE
 */

const express = require('express');
const next = require('next');
const requestLanguage = require('express-request-language');
const cookieParser = require('cookie-parser');
const glob = require('glob');
const routes = require('../routes');
const { getToken } = require('./lib/auth');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = routes.getRequestHandler(app);

const languages = glob.sync('locale/*/messages.js').map(f => f.split('/')[1]);
console.log('> Found translations for the following languages: ', languages);

async function setup() {
  await app.prepare();
  const server = express();

  // 404 all requests for favicons since we don't have one, and it attempts to match with our next routes
  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get('/favicon.ico', (req, res) => res.sendStatus(404));

  /**
   * Generate access tokens for anonymous users
   */
  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get('/get_token', async (req, res) => {
    try {
      const token = await getToken();
      res.json(token);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

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

  // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
  server.get('*', (req, res) => {
    // Add cache headers to our static assets if we aren't running in development mode
    if (!dev && /^\/static\//.test(req.url)) {
      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
    }

    handle(req, res);
  });

  return server;
}

module.exports = setup;
