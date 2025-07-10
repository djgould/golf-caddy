import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        server: resolve(__dirname, 'src/server.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        // Node.js built-ins
        'node:fs',
        'node:path',
        'node:url',
        'node:crypto',
        'node:events',
        'node:buffer',
        'node:stream',
        'node:http',
        'node:https',
        'node:net',
        'node:tls',
        'node:os',
        'node:util',
        // Dependencies that should remain external
        'fastify',
        '@fastify/cors',
        '@trpc/server',
        'dotenv',
        'jsonwebtoken',
        'superjson',
        'zod',
        '@repo/db',
        '@prisma/client',
      ],
    },
    target: 'node18',
    sourcemap: true,
    ssr: true,
    outDir: 'dist',
  },
});
