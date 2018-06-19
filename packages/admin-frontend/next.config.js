// @flow
const withCSS = require('@zeit/next-css');
const withTM = require('@weco/next-plugin-transpile-modules');

module.exports = withCSS(
  withTM({ transpileModules: ['gdl-auth', 'gdl-config'] })
);
