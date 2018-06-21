// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
const { GDL_ENVIRONMENT } = require('gdl-config');

// Immutable, multi environment config
// See https://github.com/zeit/next.js/issues/1488#issuecomment-339324995

function getConfig() {
  const config = {
    common: {},
    dev: {
      imageApiUrl: 'https://api.test.digitallibrary.io/image-api/v2',
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1'
    },

    local: {
      imageApiUrl: 'https://api.test.digitallibrary.io/image-api/v2',
      bookApiUrl: 'http://book-api.gdl-local:40001/book-api/v1'
    },

    test: {
      imageApiUrl: 'https://api.test.digitallibrary.io/image-api/v2',
      bookApiUrl: 'https://api.test.digitallibrary.io/book-api/v1'
    },

    staging: {
      imageApiUrl: 'https://api.staging.digitallibrary.io/image-api/v2',
      bookApiUrl: 'https://api.staging.digitallibrary.io/book-api/v1'
    },

    demo: {
      imageApiUrl: 'https://api.demo.digitallibrary.io/image-api/v2',
      bookApiUrl: 'https://api.demo.digitallibrary.io/book-api/v1'
    },

    prod: {
      imageApiUrl: 'https://api.digitallibrary.io/image-api/v2',
      bookApiUrl: 'https://api.digitallibrary.io/book-api/v1'
    }
  };

  return {
    ...config.common,
    // Overwrite with environment specific variables
    ...config[GDL_ENVIRONMENT]
  };
}

module.exports = getConfig();
