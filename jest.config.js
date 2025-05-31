module.exports = {
  // Use the projects field to run Jest in multiple packages
  projects: ['<rootDir>/packages/*'],
  
  // Common settings that will be inherited by all projects
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.turbo/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/*.config.{js,ts}',
  ],
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  
  // Transform files with ts-jest
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
      },
    }],
  },
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@repo/(.*)$': '<rootDir>/packages/$1/src',
  },
  
  // Test environment
  testEnvironment: 'node',
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/.turbo/',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}; 