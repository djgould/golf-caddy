import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    '@tanstack/react-query',
    '@tanstack/query-sync-storage-persister',
    'react-native-mmkv',
  ],
});
