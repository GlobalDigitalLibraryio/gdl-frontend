module.exports = {
  extends: 'ndla',
  env: {
    jest: true,
  },
  rules: {
    quotes: ['error', 'single'],
    'react/prop-types': [2, { ignore: ['children', 'className', 't'] }],
  },
};
