module.exports = {
  root: true,
  extends: ['./packages/eslint-config/base'],
  overrides: [
    {
      files: ['packages/ui/**/*.{ts,tsx}'],
      extends: ['./packages/eslint-config/react-native'],
    },
    {
      files: ['packages/db/**/*.ts', 'packages/trpc/**/*.ts'],
      extends: ['./packages/eslint-config/node'],
    },
  ],
}; 