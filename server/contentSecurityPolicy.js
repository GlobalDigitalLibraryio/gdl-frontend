// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

const directives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    'https://cdn.polyfill.io',
    'https://www.google-analytics.com'
  ],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'https://*.digitallibrary.io'],
  connectSrc: [
    "'self'",
    'https://*.digitallibrary.io',
    'https://digitallibrary.eu.auth0.com'
  ],
  reportUri: '/csp-report'
};

module.exports = { directives };
