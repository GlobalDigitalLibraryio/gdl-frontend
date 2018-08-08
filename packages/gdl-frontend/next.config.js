// @flow
const withTM = require('@weco/next-plugin-transpile-modules');

// Add source maps in production for Sentry
const withSourceMaps = require('@zeit/next-source-maps');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { serverRuntimeConfig, publicRuntimeConfig } = require('./config');
const { ANALYZE } = process.env;

const nextConfig = {
  serverRuntimeConfig,
  publicRuntimeConfig,
  transpileModules: ['gdl-auth'],
  webpack(config, options) {
    if (ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: options.isServer ? 8888 : 8889,
          openAnalyzer: true
        })
      );
    }
    return config;
  }
};

module.exports = withSourceMaps(withTM(nextConfig));
