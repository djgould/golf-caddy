import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        metro: resolve(__dirname, 'src/metro.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'js';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: ['@expo/metro-config'],
      output: {
        preserveModules: false,
      },
    },
    sourcemap: true,
    target: 'esnext',
  },
});
