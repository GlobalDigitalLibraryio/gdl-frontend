// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

// Gets the environment on both the client and the server. On the client it is set in _document.js
// See https://github.com/zeit/next.js/issues/1488#issuecomment-289108931
const gdlEnviroment = process.browser
  ? window.GDL_ENVIRONMENT
  : process.env.GDL_ENVIRONMENT || 'test';

/**
 * Resolves book API url based on the current environment
 */
const bookApiUrl = (() => {
  switch (gdlEnviroment) {
    case 'prod':
      return 'http://prod-proxy-658342484.eu-central-1.elb.amazonaws.com/book-api/v1';
    case 'staging':
      return 'http://staging-proxy-95967625.eu-central-1.elb.amazonaws.com/book-api/v1';
    case 'test':
      return 'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/v1';
    case 'local':
      return 'http://proxy.gdl-local/book-api/v1';
    default:
      // test
      return 'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/v1';
  }
})();

const IS_PROD = gdlEnviroment === 'prod';

module.exports = {
  bookApiUrl,
  IS_PROD,
};
