import { expect, vi } from 'vitest';

// Custom matchers for common assertions
export const customMatchers = {
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
  toHaveNoViolations(received: any) {
    const pass = received.violations && received.violations.length === 0;
    if (pass) {
      return {
        message: () => 'expected accessibility violations',
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected no accessibility violations but found ${received.violations?.length || 'unknown'}`,
        pass: false,
      };
    }
  },
};

// Helper to create async delay
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper to suppress console errors in tests
export const suppressConsoleError = (fn: () => void | Promise<void>) => {
  const originalError = console.error;
  console.error = vi.fn();

  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      console.error = originalError;
    });
  }

  console.error = originalError;
  return result;
};

// Helper to create test IDs
export const createTestId = (component: string, element: string) =>
  `${component}-${element}`.toLowerCase();

// Type-safe mock function helper
export function createMockFunction<T extends (...args: any[]) => any>(
  implementation?: T
): ReturnType<typeof vi.fn<T>> {
  return vi.fn(implementation);
}
