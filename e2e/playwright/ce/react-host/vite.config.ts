import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REDOC_ROOT = resolve(__dirname, '../../../..');

/**
 * Consumes the *built* ESM library: `redoc` resolves to the build output, so the externals it
 * keeps have to come from the host, as they would for anyone who installed the package.
 */
export default defineConfig({
  root: __dirname,
  base: '/react/',
  plugins: [react()],
  resolve: {
    alias: {
      redoc: resolve(REDOC_ROOT, 'bundles/redoc.js'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: resolve(__dirname, '../react'),
    emptyOutDir: true,
    target: 'esnext',
  },
});
