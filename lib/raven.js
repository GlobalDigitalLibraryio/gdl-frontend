// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

// This is configured in package.json to load raven-js in the brower, and raven for node on the server
const Raven = require('raven');
const config = require('../config');

if (process.env.NODE_ENV === 'production' && config.REPORT_ERRORS) {
  Raven.config(
    `https://${config.SENTRY_PUBLIC_KEY}@sentry.io/${config.SENTRY_PROJECT_ID}`,
    {
      environment: config.GDL_ENVIRONMENT
    }
  ).install();
}

module.exports = Raven;
