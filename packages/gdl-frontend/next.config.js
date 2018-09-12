// @flow
const withTM = require('@weco/next-plugin-transpile-modules');
const withOffline = require('next-offline');

// Add source maps in production for Sentry
const withSourceMaps = require('@zeit/next-source-maps');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { serverRuntimeConfig, publicRuntimeConfig } = require('./config');
const { ANALYZE } = process.env;

// See https://developers.google.com/web/tools/workbox/modules/workbox-build
const workboxOpts = {
  runtimeCaching: [
    // Google fonts. See https://developers.google.com/web/tools/workbox/guides/common-recipes
    {
      // Cache the Google Fonts stylesheets with a stale while revalidate strategy.
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'staleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets'
      }
    },
    {
      // Cache the Google Fonts webfont files with a cache first strategy for 1 year.
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365, // One year
          maxEntries: 30
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ]
};

const nextConfig = {
  serverRuntimeConfig,
  publicRuntimeConfig,
  transpileModules: ['gdl-auth'],
  dontAutoRegisterSw: true, // We do this ourselves
  workboxOpts,
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

module.exports = withSourceMaps(withTM(withOffline(nextConfig)));
