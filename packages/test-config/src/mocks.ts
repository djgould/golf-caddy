import { vi, beforeAll, afterAll } from 'vitest';

// Mock for AsyncStorage
export const mockAsyncStorage = {
  getItem: vi.fn(() => Promise.resolve(null)),
  setItem: vi.fn(() => Promise.resolve()),
  removeItem: vi.fn(() => Promise.resolve()),
  clear: vi.fn(() => Promise.resolve()),
  getAllKeys: vi.fn(() => Promise.resolve([])),
  multiGet: vi.fn(() => Promise.resolve([])),
  multiSet: vi.fn(() => Promise.resolve()),
  multiRemove: vi.fn(() => Promise.resolve()),
};

// Mock for React Navigation
export const mockNavigation = {
  navigate: vi.fn(),
  goBack: vi.fn(),
  dispatch: vi.fn(),
  reset: vi.fn(),
  setParams: vi.fn(),
  addListener: vi.fn(() => ({ remove: vi.fn() })),
  removeListener: vi.fn(),
  canGoBack: vi.fn(() => true),
  getParent: vi.fn(),
  getState: vi.fn(() => ({ routes: [], index: 0 })),
  setOptions: vi.fn(),
};

// Mock for React Native modules
export const mockNativeModules = {
  StatusBarManager: {
    HEIGHT: 20,
    getHeight: vi.fn((callback: (result: { height: number }) => void) => callback({ height: 20 })),
  },
  DeviceInfo: {
    getDeviceId: vi.fn(() => 'test-device-id'),
    getSystemVersion: vi.fn(() => '14.0'),
    getModel: vi.fn(() => 'iPhone'),
  },
};

// Mock for fetch API
export const createMockFetch = (response: any, options?: { status?: number; ok?: boolean }) => {
  return vi.fn(() =>
    Promise.resolve({
      ok: options?.ok ?? true,
      status: options?.status ?? 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url: '',
      clone: vi.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: vi.fn(),
      blob: vi.fn(),
      formData: vi.fn(),
    } as unknown as Response)
  );
};

// Mock for console methods
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeAll(() => {
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
  });

  afterAll(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
  });

  return {
    log: console.log as ReturnType<typeof vi.fn>,
    error: console.error as ReturnType<typeof vi.fn>,
    warn: console.warn as ReturnType<typeof vi.fn>,
    info: console.info as ReturnType<typeof vi.fn>,
  };
};
