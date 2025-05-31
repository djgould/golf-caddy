// Shared tsup configuration builder
import type { Options } from 'tsup';
import { getBuildOptions, getSourceMapConfig, type BuildEnvironment } from './index';

export interface TsupConfigOptions {
  entry?: string | string[] | Record<string, string>;
  external?: string[];
  dts?: boolean;
  env?: BuildEnvironment;
  platform?: 'node' | 'browser' | 'neutral';
  formats?: Array<'cjs' | 'esm' | 'iife'>;
}

/**
 * Create a base tsup configuration with sensible defaults
 */
export const createTsupConfig = (options: TsupConfigOptions = {}): Options => {
  const {
    entry = ['src/index.ts'],
    external = [],
    dts = true,
    env = (process.env.NODE_ENV as BuildEnvironment) || 'development',
    platform = 'neutral',
    formats = ['cjs', 'esm'],
  } = options;

  const buildOptions = getBuildOptions(env);
  const sourcemap = getSourceMapConfig(env);

  return {
    entry,
    format: formats,
    dts,
    splitting: false,
    sourcemap: sourcemap === 'hidden' ? false : sourcemap === 'external' ? true : sourcemap,
    clean: true,
    external,
    platform,
    minify: buildOptions.minify,
    target: 'es2022',
    keepNames: true,
    treeshake: env === 'production',
    env: {
      NODE_ENV: env,
    },
  } as Options;
};

/**
 * Create tsup config for React Native packages
 */
export const createReactNativeTsupConfig = (options: TsupConfigOptions = {}): Options => {
  return createTsupConfig({
    ...options,
    platform: 'neutral',
    external: ['react', 'react-native', 'react-dom', ...(options.external || [])],
  });
};

/**
 * Create tsup config for Node.js packages
 */
export const createNodeTsupConfig = (options: TsupConfigOptions = {}): Options => {
  return createTsupConfig({
    ...options,
    platform: 'node',
    external: [
      'fs',
      'path',
      'crypto',
      'stream',
      'util',
      'os',
      'child_process',
      'http',
      'https',
      'net',
      'tls',
      'dns',
      'events',
      'zlib',
      ...(options.external || []),
    ],
  });
};

/**
 * Create tsup config for UI component libraries
 */
export const createUILibraryTsupConfig = (options: TsupConfigOptions = {}): Options => {
  const config = createReactNativeTsupConfig({
    ...options,
    dts: options.dts ?? true,
    entry: options.entry || ['src/index.ts'],
  });

  return config;
};
