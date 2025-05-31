// @repo/test-config - Shared test configuration and utilities for Golf Caddy
export const TestConfigVersion = '0.0.0';

// Export all test utilities
export * from './test-utils';
export * from './mocks';
export * from './fixtures';

// Re-export commonly used utilities
export { render, screen, waitFor, act } from '@testing-library/react';
export { renderHook } from '@testing-library/react';
