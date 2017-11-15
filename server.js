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
const compression = require('compression');
const routes = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = routes.getRequestHandler(app);

const languages = glob.sync('locale/*/messages.js').map(f => f.split('/')[1]);
console.log('Found translations for the following languages: ', languages);

app
  .prepare()
  .then(() => {
    const server = express();

    // Gzip responses
    server.use(compression());

    // 404 all requests for favicons since we don't have one, and it attempts to match with our next routes
    server.get('/favicon.ico', (req, res) => res.sendStatus(404));

    // Health check for AWS
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
          name: 'language',
        },
      }),
    );

    server.get('*', (req, res) => {
      handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
