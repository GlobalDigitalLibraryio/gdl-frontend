// @flow
const withCSS = require('@zeit/next-css');
const withTM = require('next-plugin-transpile-modules');

const { serverRuntimeConfig, publicRuntimeConfig } = require('./config');

const nextConfig = {
  serverRuntimeConfig,
  publicRuntimeConfig,
  transpileModules: ['gdl-auth', 'gdl-image']
};

module.exports = withCSS(withTM(nextConfig));
