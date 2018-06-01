// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const config = require('../config');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });

console.log('> GDL environment: ', config.GDL_ENVIRONMENT);
console.log('> Will report errors: ', config.REPORT_ERRORS);

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

  server.use(app.getRequestHandler());

  return server;
}

module.exports = setup;
