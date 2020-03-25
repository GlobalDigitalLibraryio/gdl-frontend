// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
const { GDL_ENVIRONMENT } = require('gdl-config');

const statisticsUrl = () => {
  switch (GDL_ENVIRONMENT) {
    case 'local':
      return 'https://localhost:3000/admin-service';
    case 'dev':
      return 'https://api.test.digitallibrary.io/admin-service';
    case 'prod':
      return 'https://api.digitallibrary.io/admin-service';
    default:
      return `https://api.${GDL_ENVIRONMENT}.digitallibrary.io/admin-service`;
  }
};

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

const baseUrl = () => {
  switch (GDL_ENVIRONMENT) {
    case 'local':
      return 'http://localhost:3000';
    case 'dev':
      return 'https://test.digitallibrary.io';
    case 'prod':
      return 'https://digitallibrary.io';
    default:
      return `https://${GDL_ENVIRONMENT}.digitallibrary.io`;
  }
};

module.exports = {
  serverRuntimeConfig: {
    port: process.env.ADMIN_FRONTEND_PORT || 3010
  },
  publicRuntimeConfig: {
    imageApiUrl: imageApiUrl(),
    bookApiUrl: bookApiUrl(),
    statisticsUrl: statisticsUrl(),
    baseUrl: baseUrl()
  }
};
