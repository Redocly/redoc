import { defineConfig } from 'vite';
import reactSwc from '@vitejs/plugin-react-swc';
import reactVite from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { bundleStats } from 'rollup-plugin-bundle-stats';

import pkg from './package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BANNER = `/** 
 * @license MIT
 * (c) Copyright 2025 Redocly LLC, all rights reserved.
 * -------------------------------------------------------------
 * Version: ${pkg.version}
 **/`;

export default defineConfig(({ command, mode }) => {
  const reactPlugin =
    mode === 'standalone-e2e'
      ? reactVite()
      : reactSwc({
          plugins: [['@swc/plugin-styled-components', {}]],
        });

  const isStandalone = mode === 'standalone-e2e' || mode === 'standalone';

  return {
    plugins: [reactPlugin, bundleStats()],
    root: command === 'serve' ? 'playground' : undefined,
    resolve: {
      alias: {
        '@redocly/theme': resolve(__dirname, 'node_modules/@redocly/theme/src/'),
        path: 'path-browserify',
        buffer: 'buffer',
        http: resolve(__dirname, 'src/empty.js'),
        url: 'url-polyfill',
        yaml: resolve(__dirname, 'src/empty.js'),
        fs: resolve(__dirname, 'src/empty.js'),
        os: resolve(__dirname, 'src/empty.js'),
        tty: resolve(__dirname, 'src/empty.js'),
        'node-fetch': resolve(__dirname, 'src/empty.js'),
        'node-fetch-h2': resolve(__dirname, 'src/empty.js'),
        flexsearch: resolve(
          __dirname,
          'node_modules/flexsearch/dist/flexsearch.compact.module.min.js',
        ),
      },
    },
    define: {
      'process.env': '{}',
      'process.platform': '"browser"',
      'process.stdout': 'null',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      global: 'globalThis',
    },
    build: {
      outDir: 'bundles',
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, isStandalone ? 'src/standalone.tsx' : 'src/index.ts'),
        fileName: isStandalone ? 'redoc.standalone' : 'redoc',
        formats: ['es'],
      },
      sourcemap: command === 'serve',
      minify: 'esbuild',
      rollupOptions: {
        input: resolve(__dirname, isStandalone ? 'src/standalone.tsx' : 'src/index.ts'),
        external: isStandalone
          ? ['esprima', 'node-fetch', '@redocly/ajv']
          : ['esprima', 'node-fetch', '@redocly/ajv', 'react', 'react-dom'],
        output: {
          inlineDynamicImports: true,
          interop: 'auto',
          entryFileNames: isStandalone ? 'redoc.standalone.js' : 'redoc.js',
          preserveModules: false,
          banner: BANNER,
        },
        treeshake: 'recommended',
      },
      target: 'esnext',
    },
    server: {
      port: 7700,
      open: true,
    },
  };
});
