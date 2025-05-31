import { defineConfig, type UserConfig } from 'vitest/config';
import path from 'path';

// Base Vitest configuration
export const createBaseVitestConfig = (packageDir: string): UserConfig => {
  return {
    test: {
      globals: true,
      environment: 'node',
      setupFiles: [],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.config.*',
          '**/*.d.ts',
          '**/*.test.*',
          '**/*.spec.*',
        ],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(packageDir, './src'),
      },
    },
  };
};

// Vitest configuration for React Native packages
export const createReactNativeVitestConfig = (packageDir: string): UserConfig => {
  const baseConfig = createBaseVitestConfig(packageDir);

  return {
    ...baseConfig,
    test: {
      ...baseConfig.test,
      environment: 'jsdom',
      setupFiles: [path.resolve(__dirname, './setup/react-native.ts')],
    },
  };
};

// Vitest configuration for Node.js packages
export const createNodeVitestConfig = (packageDir: string): UserConfig => {
  const baseConfig = createBaseVitestConfig(packageDir);

  return {
    ...baseConfig,
    test: {
      ...baseConfig.test,
      environment: 'node',
    },
  };
};

// Vitest configuration for library packages
export const createLibraryVitestConfig = (packageDir: string): UserConfig => {
  const baseConfig = createBaseVitestConfig(packageDir);

  return {
    ...baseConfig,
    test: {
      ...baseConfig.test,
      environment: 'happy-dom',
    },
  };
};

// Helper to create a defineConfig wrapper for a package
export const definePackageConfig = (
  packageDir: string,
  type: 'react-native' | 'node' | 'library' = 'library'
): ReturnType<typeof defineConfig> => {
  let config: UserConfig;

  switch (type) {
    case 'react-native':
      config = createReactNativeVitestConfig(packageDir);
      break;
    case 'node':
      config = createNodeVitestConfig(packageDir);
      break;
    case 'library':
    default:
      config = createLibraryVitestConfig(packageDir);
      break;
  }

  return defineConfig(config);
};
