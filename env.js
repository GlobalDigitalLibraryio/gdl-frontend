// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

/* eslint-disable no-underscore-dangle */

// If we are on the server, we get the envionment from process, on the client, we read it from ___NEXT_DATA__
// Make sure all pages are wrapped with the withEnv HoC so we can read this from the window object on the client
const ENV =
  (typeof window !== 'undefined'
    ? window.__NEXT_DATA__.props.env
    : process.env) || {};

const gdlEnviroment = ENV.GDL_ENVIRONMENT || 'test';

/**
 * Resolves book API url based on the current environment
 */
function getBookApiDomain(): string {
  switch (gdlEnviroment) {
    case 'prod':
      return 'http://prod-proxy-658342484.eu-central-1.elb.amazonaws.com';
    case 'staging':
      return 'http://staging-proxy-95967625.eu-central-1.elb.amazonaws.com';
    default:
      // test
      return 'http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com';
  }
}

module.exports = {
  bookApiUrl: getBookApiDomain(),
};
