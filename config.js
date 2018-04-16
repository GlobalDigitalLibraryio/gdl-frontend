// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

// Immutable, multi environment config
// See https://github.com/zeit/next.js/issues/1488#issuecomment-339324995

const globalVarName = '__GDL_ENVIRONMENT__';

/**
 * Read the GDL environment from a global variable in the client (see _document.js)
 * On the server, we use environment variables.
 * Fallback to 'test' if none is provided.
 */
const GDL_ENVIRONMENT = (function() {
  return (
    (process.browser ? window[globalVarName] : process.env.GDL_ENVIRONMENT) ||
    'test'
  );
})();

function getConfig() {
  const config = {
    common: {
      DEFAULT_LANGUAGE_CODE: 'en',
      GLOBAL_VAR_NAME: globalVarName,
      STATIC_PAGES_ONLY: false,
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

    local: {
      bookApiUrl: 'http://book-api.gdl-local:40001/book-api/v1'
    },

    test: {
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'UA-111724798-1'
    },

    staging: {
      bookApiUrl: 'https://api.staging.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'UA-111796456-1'
    },

    prod: {
      bookApiUrl: 'https://api.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'UA-111771573-1',
      STATIC_PAGES_ONLY: true,
      TRANSLATION_PAGES: false,
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
    if (!process.browser && process.env.GDL_ENVIRONMENT) {
        toRet.bookApiUrl = 'http://book-api.gdl-local/book-api/v1';
        const dns = eval("require('dns')");
        const { promisify } = require('util');

        const resolve4 = promisify(dns.resolve4);
        resolve4('book-api.gdl-local', { ttl: true }).then(addresses => {
            console.log(addresses);
            toRet.bookApiUrl = `http://${addresses[0].address}/book-api/v1`;
        });
    }

    return toRet;
}

module.exports = getConfig();
