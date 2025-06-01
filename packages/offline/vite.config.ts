import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        const ext = format === 'es' ? 'mjs' : 'js';
        return `index.${ext}`;
      },
    },
    rollupOptions: {
      external: ['@react-native-async-storage/async-storage'],
      output: {
        preserveModules: false,
      },
    },
    sourcemap: true,
    target: 'esnext',
  },
});
