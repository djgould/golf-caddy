// @ts-nocheck
// TODO: Add proper Jest types

// Mock winston before importing the logger module
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

jest.mock('winston', () => ({
  createLogger: jest.fn(() => mockLogger),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
    printf: jest.fn(),
    metadata: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

// Now import the logger module - it will use our mocked winston
import { createLogger, logInfo, logError, logDebug, logWarning, logPerformance } from './index';

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLogger', () => {
    it('should create a logger instance', () => {
      const logger = createLogger({ service: 'test-service' });
      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
    });
  });

  describe('log functions', () => {
    it('should call logger.info for logInfo', () => {
      logInfo('Test message', { userId: '123' });
      expect(mockLogger.info).toHaveBeenCalledWith('Test message', { userId: '123' });
    });

    it('should call logger.error for logError', () => {
      const error = new Error('Test error');
      logError(error, { userId: '123' });
      expect(mockLogger.error).toHaveBeenCalledWith('Test error', {
        error: {
          name: 'Error',
          message: 'Test error',
          stack: expect.any(String),
        },
        userId: '123',
      });
    });

    it('should call logger.debug for logDebug', () => {
      logDebug('Debug message', { feature: 'test' });
      expect(mockLogger.debug).toHaveBeenCalledWith('Debug message', { feature: 'test' });
    });

    it('should call logger.warn for logWarning', () => {
      logWarning('Warning message', { action: 'test' });
      expect(mockLogger.warn).toHaveBeenCalledWith('Warning message', { action: 'test' });
    });
  });

  describe('logPerformance', () => {
    it('should log performance metrics', () => {
      logPerformance('test-operation', 1500, { userId: '123' });

      expect(mockLogger.info).toHaveBeenCalledWith('Performance: test-operation', {
        performance: {
          operation: 'test-operation',
          duration: 1500,
          unit: 'ms',
        },
        userId: '123',
      });
    });
  });
});
