// @repo/build-config - Shared build configuration for Golf Caddy
export const BuildConfigVersion = '0.0.0';

// Build environments
export type BuildEnvironment = 'development' | 'staging' | 'production';

// Build targets
export type BuildTarget = 'web' | 'ios' | 'android' | 'node';

// Common build options
export interface BuildOptions {
  environment: BuildEnvironment;
  target: BuildTarget;
  sourcemap: boolean;
  minify: boolean;
  analyze?: boolean;
}

// Get environment-specific build options
export const getBuildOptions = (env: BuildEnvironment): Partial<BuildOptions> => {
  switch (env) {
    case 'development':
      return {
        environment: 'development',
        sourcemap: true,
        minify: false,
      };
    case 'staging':
      return {
        environment: 'staging',
        sourcemap: true,
        minify: true,
      };
    case 'production':
      return {
        environment: 'production',
        sourcemap: false,
        minify: true,
      };
    default:
      return {
        environment: 'development',
        sourcemap: true,
        minify: false,
      };
  }
};

// Common external dependencies for bundling
export const commonExternals = [
  'react',
  'react-native',
  'react-dom',
  '@react-native-async-storage/async-storage',
  'react-native-mmkv',
];

// Node.js specific externals
export const nodeExternals = [
  ...commonExternals,
  'fs',
  'path',
  'crypto',
  'stream',
  'util',
  'os',
  'child_process',
];

// Build paths
export const buildPaths = {
  src: 'src',
  dist: 'dist',
  build: 'build',
  cache: '.turbo',
} as const;

// Bundle size limits (in KB)
export const bundleSizeLimits = {
  library: 50,
  component: 100,
  application: 500,
} as const;

// Development server configuration
export interface DevServerConfig {
  port: number;
  host: string;
  https: boolean;
  open: boolean;
}

export const defaultDevServerConfig: DevServerConfig = {
  port: 3000,
  host: 'localhost',
  https: false,
  open: false,
};

// Source map options
export type SourceMapOption = boolean | 'inline' | 'external' | 'hidden';

// Get source map configuration based on environment
export const getSourceMapConfig = (env: BuildEnvironment): SourceMapOption => {
  switch (env) {
    case 'development':
      return 'inline';
    case 'staging':
      return 'external';
    case 'production':
      return 'hidden';
    default:
      return true;
  }
};
