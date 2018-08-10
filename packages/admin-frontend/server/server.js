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
const { GDL_ENVIRONMENT } = require('gdl-config');

const {
  serverRuntimeConfig: { port }
} = require('../config');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });

async function setup() {
  await app.prepare();
  const server = express();

  if (isDev || GDL_ENVIRONMENT === 'dev') {
    app.setAssetPrefix(`http://localhost:${port}`);
  } else if (GDL_ENVIRONMENT === 'local') {
    // NB! If you try to access admin-frontend through the nginx proxy locally
    // you probably want to comment out this part and set /admin as the prefix
    app.setAssetPrefix('http://localhost:40006/');
  } else {
    app.setAssetPrefix('/admin');
  }

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
