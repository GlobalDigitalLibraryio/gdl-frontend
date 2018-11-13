module.exports = api => {
  api.cache(true);

  const presets = ['next/babel', '@babel/preset-flow'];
  const plugins = ['emotion'];

  return {
    presets,
    plugins
  };
};
