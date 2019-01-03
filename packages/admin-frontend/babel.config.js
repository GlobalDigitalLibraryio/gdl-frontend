module.exports = api => {
  api.cache(true);

  const presets = [
    'next/babel',
    '@babel/preset-flow',
    '@emotion/babel-preset-css-prop'
  ];

  return {
    presets
  };
};
