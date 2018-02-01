// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 @PROJECT@
 *
 * See LICENSE
 */

const express = require('express');

const app = express();

/**
 * Spin up own server for redirecting requests.
 * ELB routes insecure requests to this server, which returns a permanent secure redirect
 */

// $FlowFixMe: https://github.com/flowtype/flow-typed/issues/1120
app.get('*', (req, res) => {
  // Prevent ip address leak when empty host
  const hostname = req.get('Host');
  if (hostname == null) {
    res.send(400);
  }
  res.redirect(301, `https://${hostname}${req.url}`);
});

module.exports = app;
