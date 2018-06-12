// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

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
    (process.browser ? window[globalVarName] : process.env.GDL_ENVIRONMENT) ||
    'dev'
  );
})();

function getConfig() {
  const config = {
    common: {
      GLOBAL_VAR_NAME: globalVarName
    },

    dev: {
      imageApiUrl: 'http://localhost/image-api/v2'
    },

    local: {
      imageApiUrl: 'https://api.test.digitallibrary.io/image-api/v2'
    },

    test: {
      imageApiUrl: 'https://api.test.digitallibrary.io/image-api/v2'
    },

    staging: {
      imageApiUrl: 'https://api.staging.digitallibrary.io/image-api/v2'
    },

    demo: {
      imageApiUrl: 'https://api.demo.digitallibrary.io/image-api/v2'
    },

    prod: {
      imageApiUrl: 'https://api.digitallibrary.io/image-api/v2'
    }
  };

  return {
    ...config.common,
    // Overwrite with environment specific variables
    ...config[GDL_ENVIRONMENT],
    // Add the environment itself
    GDL_ENVIRONMENT
  };
}

module.exports = getConfig();
