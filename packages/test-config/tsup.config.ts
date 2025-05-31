import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    vitest: 'src/vitest.ts',
    'react-native': 'src/react-native.ts',
    setup: 'src/setup.ts',
  },
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['vitest', '@testing-library/react', '@testing-library/react-native'],
});
