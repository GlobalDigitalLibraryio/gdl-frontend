// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
const { GDL_ENVIRONMENT } = require('gdl-config');

const bookApiUrl = () => {
  switch (GDL_ENVIRONMENT) {
    case 'local':
      return 'http://book-api.gdl-local:40001/book-api/v1';
    case 'dev':
      return 'https://api.test.digitallibrary.io/book-api/v1';
    case 'prod':
      return 'https://api.digitallibrary.io/book-api/v1';
    default:
      return `https://api.${GDL_ENVIRONMENT}.digitallibrary.io/book-api/v1`;
  }
};

const imageApiUrl = () => {
  switch (GDL_ENVIRONMENT) {
    case 'local':
      return 'http://image-api.gdl-local:40002/image-api/v2';
    case 'dev':
      return 'https://api.test.digitallibrary.io/image-api/v2';
    case 'prod':
      return 'https://api.digitallibrary.io/image-api/v2';
    default:
      return `https://api.${GDL_ENVIRONMENT}.digitallibrary.io/image-api/v2`;
  }
};

module.exports = {
  serverRuntimeConfig: {
    port: process.env.ADMIN_FRONTEND_PORT || 3010
  },
  publicRuntimeConfig: {
    imageApiUrl: imageApiUrl(),
    bookApiUrl: bookApiUrl()
  }
};
