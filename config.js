// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

// Immutable, multi environment config
// See https://github.com/zeit/next.js/issues/1488#issuecomment-339324995

function getConfig() {
  const globalVarName = '__GDL_ENVIRONMENT__';

  const config = {
    common: {
      GLOBAL_VAR_NAME: globalVarName,
      STATIC_PAGES_ONLY: false,
      clientAuth: {
        clientId: 'Hf3lgXrS71nxiiEaHAyRZ3GncgeE2pq5',
        audience: 'gdl_system',
        domain: 'digitallibrary.eu.auth0.com',
      },
      serverAuth: {
        // These aren't visible to the client as they are defined as environment variables on the server
        clientId: process.browser ? undefined : process.env.GDL_AUTH_CLIENT_ID,
        clientSecret: process.browser ? undefined : process.env.GDL_AUTH_CLIENT_SECRET,
        audience: 'gdl_system',
        authUrl: 'https://digitallibrary.eu.auth0.com/oauth/token',
      },
      // Fallback to test environment
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'N/A',
    },

    local: {
      bookApiUrl: 'http://api-gateway.gdl-local/book-api/v1',
    },

    test: {
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'UA-111724798-1',
    },

    staging: {
      bookApiUrl: 'https://api.staging.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'UA-111796456-1',
    },

    prod: {
      bookApiUrl: 'https://api.digitallibrary.io/book-api/v1',
      googleAnalyticsTrackingID: 'UA-111771573-1',
      STATIC_PAGES_ONLY: true,
    }
  };

  return {
    ...config.common,
    // Overwrite with environment specific variables
    ...config[(process.browser ? window[globalVarName] : process.env.GDL_ENVIRONMENT) || 'common'], // Fallback to 'common' So Flow doesn't scream at us
  };
}

module.exports = getConfig();
