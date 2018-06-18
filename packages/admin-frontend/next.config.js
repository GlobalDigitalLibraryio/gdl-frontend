// @flow
const withCSS = require('@zeit/next-css');
const withTM = require('@weco/next-plugin-transpile-modules');

//module.exports = withCSS();
module.exports = withTM({ transpileModules: ['gdl-auth'] });

/*module.exports = withCSS({
  webpack(config, { defaultLoaders }) {
    console.log(defaultLoaders);
    config.module.rules.push(
      // Process any JS outside of the app with Babel.
      // Unlike the application JS, we only compile the standard ES features.
      {
        //test: /\.js$/,
        test: path.resolve('./node_modules/gdl-')
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: true,
          compact: false,
          //presets: [require.resolve('babel-preset-react-app/dependencies')],
          cacheDirectory: true
        }
      }
    );
    return config;
  }
});*/
