import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        vitest: resolve(__dirname, 'src/vitest.ts'),
        'react-native': resolve(__dirname, 'src/react-native.ts'),
        setup: resolve(__dirname, 'src/setup.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'js';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: (id) => {
        return !id.startsWith('.') && !id.startsWith('/');
      },
      output: {
        preserveModules: false,
      },
    },
    sourcemap: true,
    target: 'node18',
  },
});
