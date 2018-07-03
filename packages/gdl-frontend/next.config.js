const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { ANALYZE } = process.env;
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withSourceMaps({
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
});
