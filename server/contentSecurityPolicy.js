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
  fontSrc: ["'self'", 'data:'],
  imgSrc: ["'self'", 'data:', 'https://*.digitallibrary.io', googleAnalytics],
  connectSrc: [
    "'self'",
    'https://*.digitallibrary.io',
    'https://digitallibrary.eu.auth0.com',
    googleAnalytics
  ],
  reportUri: '/csp-report'
};

module.exports = { directives };
