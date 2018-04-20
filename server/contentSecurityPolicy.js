// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

const googleAnalytics = 'www.google-analytics.com';

const directives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    'https://cdn.polyfill.io',
    googleAnalytics
  ],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'https://*.digitallibrary.io', googleAnalytics],
  connectSrc: [
    "'self'",
    'https://*.digitallibrary.io',
    'https://digitallibrary.eu.auth0.com'
  ],
  reportUri: '/csp-report'
};

module.exports = { directives };
