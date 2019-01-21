// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
const {
  publicRuntimeConfig: { SENTRY_PROJECT_ID, SENTRY_PUBLIC_KEY }
} = require('../config');

const googleAnalytics = 'www.google-analytics.com';
const facebookPixel = 'https://connect.facebook.net';

const directives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    googleAnalytics,
    'https://cdn.polyfill.io',
    'https://storage.googleapis.com', // Used by Workbox for PWA/service worker
    facebookPixel
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
  imgSrc: [
    "'self'",
    'data:',
    'https://*.digitallibrary.io',
    'https://*.cloudinary.com',
    googleAnalytics,
    'https://www.facebook.com'
  ],
  connectSrc: [
    "'self'",
    'https://*.digitallibrary.io',
    'https://res.cloudinary.com',
    'https://digitallibrary.eu.auth0.com',
    `https://sentry.io/api/${SENTRY_PROJECT_ID}/store/`,
    googleAnalytics,
    facebookPixel
  ],
  reportUri: `https://sentry.io/api/${SENTRY_PROJECT_ID}/csp-report/?sentry_key=${SENTRY_PUBLIC_KEY}`
};

// We have a different connect directive for the service worker, since a service worker is essentially a script
// See https://qubyte.codes/blog/content-security-policy-and-service-workers
const serviceWorkerDirectives = { ...directives, connectSrc: ['*'] };

module.exports = { normalDirectives: directives, serviceWorkerDirectives };
