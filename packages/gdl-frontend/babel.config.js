module.exports = api => {
  api.cache(true);

  const presets = [
    'next/babel',
    '@babel/preset-flow',
    '@lingui/babel-preset-react'
  ];
  const plugins = [
    'emotion',
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
    ]
  ];

  return {
    presets,
    plugins
  };
};