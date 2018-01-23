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
const routes = require('../routes');
const { requestToken } = require('./lib/auth');
const { RATE_LIMIT_TOKEN_GLOBAL_VAR } = require('../lib/auth/constants');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = routes.getRequestHandler(app);

/* eslint-disable no-console */

const languages = glob.sync('locale/*/messages.js').map(f => f.split('/')[1]);
console.log('Found translations for the following languages: ', languages);

app
  .prepare()
  .then(() => {
    const server = express();

    // Gzip responses
    server.use(compression());

    // 404 all requests for favicons since we don't have one, and it attempts to match with our next routes
    // $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
    server.get('/favicon.ico', (req, res) => res.sendStatus(404));

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
    server.get('*', async (req, res) => {
      // Generate a token so our backend won't be rate limited
      if (!app.isInternalUrl(req)) {
        try {
          const token = await requestToken();
          // Set the token in a global var so we can access it when fetching on the server
          global[RATE_LIMIT_TOKEN_GLOBAL_VAR] = token.access_token;
        } catch (error) {
          console.warn(
            'Unable to generate token. Session will be rate limited'
          );
        }
      }
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
