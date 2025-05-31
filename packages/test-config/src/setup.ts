import { expect, vi, beforeEach, afterEach } from 'vitest';
import { customMatchers } from './test-utils';

// Add custom matchers
expect.extend(customMatchers);

// Mock timers by default
vi.useFakeTimers();

// Global test setup
export const setupTests = () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Cleanup after each test
  afterEach(() => {
    vi.useRealTimers();
  });

  // Global error handler for unhandled promises
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
  });
};

// React Native specific setup
export const setupReactNativeTests = () => {
  // Mock React Native modules
  vi.mock('react-native', async () => {
    const RN = await vi.importActual<any>('react-native');

    return {
      ...RN,
      Platform: {
        ...RN.Platform,
        select: vi.fn((obj) => obj.default || obj.ios),
      },
      NativeModules: {
        ...RN.NativeModules,
        SettingsManager: {
          settings: {},
        },
      },
      Dimensions: {
        get: vi.fn(() => ({ width: 375, height: 812 })),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      Alert: {
        alert: vi.fn(),
      },
      Linking: {
        openURL: vi.fn(),
        canOpenURL: vi.fn(() => Promise.resolve(true)),
        getInitialURL: vi.fn(() => Promise.resolve(null)),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    };
  });

  // Mock AsyncStorage
  vi.mock('@react-native-async-storage/async-storage', () => ({
    default: {
      getItem: vi.fn(() => Promise.resolve(null)),
      setItem: vi.fn(() => Promise.resolve()),
      removeItem: vi.fn(() => Promise.resolve()),
      clear: vi.fn(() => Promise.resolve()),
      getAllKeys: vi.fn(() => Promise.resolve([])),
      multiGet: vi.fn(() => Promise.resolve([])),
      multiSet: vi.fn(() => Promise.resolve()),
      multiRemove: vi.fn(() => Promise.resolve()),
    },
  }));
};

// Node.js specific setup
export const setupNodeTests = () => {
  // Mock environment variables
  process.env.NODE_ENV = 'test';

  // Mock fetch for Node.js
  global.fetch = vi.fn();

  // Reset fetch mock before each test
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
  });
};
