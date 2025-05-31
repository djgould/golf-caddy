/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['./base.js'],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // Node.js specific
    'no-process-exit': 'error',
    'no-path-concat': 'error',
    'no-sync': 'warn',
    
    // Allow console in Node.js environments
    'no-console': 'off',
    
    // Allow require in Node.js
    '@typescript-eslint/no-var-requires': 'off',
  },
}; 