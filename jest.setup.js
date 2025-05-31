// Common Jest setup for all packages

// Increase timeout for slower tests
jest.setTimeout(10000);

// Add custom matchers if needed
// expect.extend({
//   // Custom matchers here
// });

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
};

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  // Keep native behaviour for other methods
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 