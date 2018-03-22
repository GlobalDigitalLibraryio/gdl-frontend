// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

// Immutable, multi environment config
// See https://github.com/zeit/next.js/issues/1488#issuecomment-339324995

// Access the book api directly on the server, not via the gateway/proxy
const localBookApiUrl = 'http://book-api.gdl-local/book-api/v1';

function getConfig() {
  const globalVarName = '__GDL_ENVIRONMENT__';

  const config = {
    common: {
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
      // Fallback to test environment
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'N/A'
    },

    local: {
      bookApiUrl: localBookApiUrl
    },

    test: {
      bookApiUrl: process.browser
        ? 'https://api.test.digitallibrary.io/book-api/v1'
        : localBookApiUrl,
      googleAnalyticsTrackingID: 'UA-111724798-1'
    },

    staging: {
      bookApiUrl: process.browser
        ? 'https://api.staging.digitallibrary.io/book-api/v1'
        : localBookApiUrl,
      googleAnalyticsTrackingID: 'UA-111796456-1',
      TRANSLATION_PAGES: false
    },

    prod: {
      bookApiUrl: process.browser
        ? 'https://api.digitallibrary.io/book-api/v1'
        : localBookApiUrl,
      googleAnalyticsTrackingID: 'UA-111771573-1',
      STATIC_PAGES_ONLY: true,
      TRANSLATION_PAGES: false,
      BLOCK_SEARCH_INDEXING: false
    }
  };

  return {
    ...config.common,
    // Overwrite with environment specific variables
    ...config[
      (process.browser ? window[globalVarName] : process.env.GDL_ENVIRONMENT) ||
        'common'
    ] // Fallback to 'common' So Flow doesn't scream at us
  };
}

module.exports = getConfig();
