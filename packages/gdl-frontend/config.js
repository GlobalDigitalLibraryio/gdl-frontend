// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

const dnsResolver = require('./lib/customResolver');

// Immutable, multi environment config
// See https://github.com/zeit/next.js/issues/1488#issuecomment-339324995

const globalVarName = '__GDL_ENVIRONMENT__';

/**
 * Read the GDL environment from a global variable in the client (see _document.js)
 * On the server, we use environment variables.
 * Fallback to 'dev' if none is provided.
 */
const GDL_ENVIRONMENT = (function() {
  return (
    (typeof window !== 'undefined'
      ? window[globalVarName]
      : process.env.GDL_ENVIRONMENT) || 'dev'
  );
})();

function getConfig() {
  const config = {
    common: {
      DEFAULT_LANGUAGE: {
        code: 'en',
        name: 'English'
      },
      GLOBAL_VAR_NAME: globalVarName,
      SENTRY_PROJECT_ID: '1195015',
      SENTRY_PUBLIC_KEY: '7d5b3ec618464d4abceb4b4fc2ee0ed0',
      REPORT_ERRORS: false,
      TRANSLATION_PAGES: true,
      BLOCK_SEARCH_INDEXING: true,
      SEARCH_PAGE_SIZE: 10,
      clientAuth: {
        clientId: 'Hf3lgXrS71nxiiEaHAyRZ3GncgeE2pq5',
        audience: 'gdl_system',
        domain: 'digitallibrary.eu.auth0.com'
      },
      zendeskUrl: 'https://digitallibrary.zendesk.com/hc/en-us/requests/new',
      googleAnalyticsTrackingID: 'N/A'
    },

    dev: {
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1',
      canonical: 'http://localhost:3000'
    },

    local: {
      bookApiUrl: 'http://book-api.gdl-local:40001/book-api/v1',
      canonical: 'http://localhost:40003'
    },

    test: {
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1',
      REPORT_ERRORS: true,
      googleAnalyticsTrackingID: 'UA-111724798-1',
      canonical: 'https://test.digitallibrary.io'
    },

    staging: {
      bookApiUrl: 'https://api.staging.digitallibrary.io/book-api/v1',
      REPORT_ERRORS: true,
      googleAnalyticsTrackingID: 'UA-111796456-1',
      canonical: 'https://staging.digitallibrary.io'
    },

    demo: {
      bookApiUrl: 'https://api.demo.digitallibrary.io/book-api/v1',
      REPORT_ERRORS: true,
      canonical: 'https://demo.digitallibrary.io'
    },

    prod: {
      bookApiUrl: 'https://api.digitallibrary.io/book-api/v1',
      REPORT_ERRORS: true,
      googleAnalyticsTrackingID: 'UA-111771573-1',
      canonical: 'https://digitallibrary.io',
      BLOCK_SEARCH_INDEXING: false
    }
  };

  const toRet = {
    ...config.common,
    // Overwrite with environment specific variables
    ...config[GDL_ENVIRONMENT],
    // Add the environment itself
    GDL_ENVIRONMENT
  };

  // Poor way to determine if we're running in docker, but in that case we access the book api directly, not via the gateway/proxy
  if (typeof window === 'undefined' && process.env.GDL_ENVIRONMENT) {
    // Define a getter method when retrieving the book api url inside Docker.
    // $FlowFixMe
    Object.defineProperty(toRet, 'bookApiUrl', {
      get: dnsResolver('book-api.gdl-local', '/book-api/v1')
    });
  }

  return toRet;
}

module.exports = getConfig();
