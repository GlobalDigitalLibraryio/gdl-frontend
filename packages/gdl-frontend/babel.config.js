module.exports = api => {
  api.cache(true);

  const presets = [
    'next/babel',
    '@babel/preset-flow',
    '@emotion/babel-preset-css-prop'
  ];
  const plugins = [
    'inline-react-svg',
    [
      'transform-imports',
      {
        '@material-ui/core': {
          transform: '@material-ui/core/${member}', // eslint-disable-line
          preventFullImport: true
        },
        '@material-ui/icons': {
          transform: '@material-ui/icons/${member}', // eslint-disable-line
          preventFullImport: true
        }
      }
    ],
    ['react-intl', { messageDir: './locale/' }]
  ];

  return {
    presets,
    plugins
  };
};
