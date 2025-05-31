/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    './react.js',
    'plugin:react-native/all',
  ],
  plugins: ['react-native'],
  env: {
    'react-native/react-native': true,
  },
  rules: {
    // React Native specific
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': ['error', {
      skip: ['Button'],
    }],
    
    // Disable web-specific rules
    'react/jsx-no-target-blank': 'off',
  },
}; 