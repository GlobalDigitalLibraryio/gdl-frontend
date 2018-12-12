// @flow
const withTM = require('next-plugin-transpile-modules');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// Add source maps in production for Sentry
const withSourceMaps = require('@zeit/next-source-maps');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const InlinePrecacheManifestPlugin = require('./inlinePrecacheManifestPlugin');
const { serverRuntimeConfig, publicRuntimeConfig } = require('./config');
const { ANALYZE } = process.env;

// See https://developers.google.com/web/tools/workbox/modules/workbox-build
const swDest = 'service-worker.js';
const workboxOpts = {
  swSrc: 'service-worker.js',
  globDirectory: '.'
};

const nextConfig = {
  serverRuntimeConfig,
  publicRuntimeConfig,
  transpileModules: ['gdl-auth', 'gdl-apollo-client'],
  webpack(config, options) {
    // If we are running in dev mode, add a dummy service worker
    if (options.dev) {
      config.plugins.push(
        new CopyWebpackPlugin([{ from: 'service-worker-dev.js', to: swDest }])
      );
      // Generate the workbox service worker (for the client build only)
    } else if (!options.isServer) {
      config.plugins.push(
        // Get rid of any leftover precache manifest from previous builds
        new CleanWebpackPlugin(['precache-manifest.*.js'], {
          root: config.output.path
        }),
        new WorkboxPlugin.InjectManifest(workboxOpts),
        // Custom webpack plugin to transform the precache manifest generated by workbox
        new InlinePrecacheManifestPlugin({
          outputPath: config.output.path,
          urlPrefix: config.assetPrefix,
          buildId: options.buildId,
          swDest
        })
      );

      if (config.optimization && config.optimization.minimizer) {
        for (const plugin of config.optimization.minimizer) {
          if (plugin.constructor.name === 'TerserPlugin') {
            plugin.options.sourceMap = true;
            break;
          }
        }
      }
    }

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
