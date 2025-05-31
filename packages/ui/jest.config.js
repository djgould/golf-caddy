module.exports = {
  displayName: '@repo/ui',
  preset: 'react-native',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/*.spec.{ts,tsx}',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/test-setup.ts',
  ],
  transformIgnorePatterns: [],
  transform: {
    '^.+\\.(js)$': ['babel-jest', { plugins: ['babel-plugin-syntax-hermes-parser'] }],
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/index.ts',
    '!src/__mocks__/**',
  ],
  testTimeout: 10000,
}; 