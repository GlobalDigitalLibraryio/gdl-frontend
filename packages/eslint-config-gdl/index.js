module.exports = {
  extends: ['react-app', 'plugin:jest/recommended'],
  rules: {
    // Disable because Next.js's Link passes href to child
    'jsx-a11y/anchor-is-valid': false
  }
};
