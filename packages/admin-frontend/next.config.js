// @flow
const withCSS = require('@zeit/next-css');
const withTM = require('@weco/next-plugin-transpile-modules');

const { serverRuntimeConfig, publicRuntimeConfig } = require('./config');

const nextConfig = {
  serverRuntimeConfig,
  publicRuntimeConfig,
  transpileModules: ['gdl-auth']
};

module.exports = withCSS(withTM(nextConfig));
