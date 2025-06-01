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
      external: ['react', 'react-native'],
      output: {
        preserveModules: false,
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
        },
      },
    },
    sourcemap: true,
    target: 'esnext',
  },
});
