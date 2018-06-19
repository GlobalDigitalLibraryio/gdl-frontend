// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import { GDL_ENVIRONMENT } from 'gdl-config';

// Immutable, multi environment config
// See https://github.com/zeit/next.js/issues/1488#issuecomment-339324995

function getConfig() {
  const config = {
    common: {},
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
    ...config[GDL_ENVIRONMENT]
  };
}

module.exports = getConfig();
