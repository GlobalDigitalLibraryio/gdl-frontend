// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
const { SENTRY_PROJECT_ID, SENTRY_PUBLIC_KEY } = require('../config');

const googleAnalytics = 'www.google-analytics.com';

const directives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    googleAnalytics,
    'https://cdn.polyfill.io'
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ],
  fontSrc: [
    "'self'",
    'data:',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ],
  imgSrc: ["'self'", 'data:', 'https://*.digitallibrary.io', googleAnalytics],
  connectSrc: [
    "'self'",
    'https://*.digitallibrary.io',
    'https://digitallibrary.eu.auth0.com',
    `https://sentry.io/api/${SENTRY_PROJECT_ID}/store/`,
    googleAnalytics
  ],
  reportUri: `https://sentry.io/api/${SENTRY_PROJECT_ID}/csp-report/?sentry_key=${SENTRY_PUBLIC_KEY}`
};

module.exports = { directives };
