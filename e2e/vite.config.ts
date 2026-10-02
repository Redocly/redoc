import { defineConfig, type ViteDevServer } from 'vite';

import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { readFileSync, existsSync, cpSync } from 'node:fs';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
/** `redoc/`, the community package root — this file lives at `redoc/e2e/`. */
const REDOC_ROOT = resolve(__dirname, '..');

const FIXTURES_DIR = resolve(__dirname, 'playwright/fixtures');
const EXAMPLES_DIR = resolve(__dirname, 'playwright/examples');

const MIME: Record<string, string> = {
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  '.json': 'application/json',
  '.graphql': 'text/plain',
};

// Same resolution order as ../vite.config.ts: override, own node_modules, then hoisted.
const THEME_CANDIDATES = [
  process.env.REDOC_THEME_PATH && resolve(REDOC_ROOT, process.env.REDOC_THEME_PATH),
  resolve(REDOC_ROOT, 'node_modules/@redocly/theme/src'),
  resolve(REDOC_ROOT, '../node_modules/@redocly/theme/src'),
  resolve(REDOC_ROOT, '../../../node_modules/@redocly/theme/src'),
].filter((p): p is string => Boolean(p));

const THEME_PATH = THEME_CANDIDATES.find((p) => existsSync(p)) ?? THEME_CANDIDATES[0];

function serveDir(name: string, urlPath: string, dir: string) {
  return {
    name,
    configureServer(server: ViteDevServer) {
      server.middlewares.use(urlPath, (req, res, next) => {
        const filePath = join(dir, req.url?.split('?')[0] ?? '');
        if (existsSync(filePath)) {
          const content = readFileSync(filePath);
          res.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream');
          res.end(content);
        } else {
          next();
        }
      });
    },
    writeBundle(options: { dir?: string }) {
      if (!existsSync(dir)) return;
      const outDir = options.dir ?? resolve(__dirname, 'dist');
      cpSync(dir, join(outDir, urlPath), { recursive: true });
    },
  };
}

/**
 * The engine is resolved through `src/api.ts`, so no package alias is needed. The browser shims
 * below are duplicated from `../vite.config.ts` because this app compiles the engine source
 * directly and hits the same node-builtin imports; that file is the source of truth for them.
 */
export default defineConfig({
  plugins: [
    react(),
    serveDir('serve-fixtures', '/fixtures', FIXTURES_DIR),
    serveDir('serve-examples', '/examples', EXAMPLES_DIR),
  ],
  root: __dirname,
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // The e2e app is served locally, so chunk weight is irrelevant here.
    chunkSizeWarningLimit: Infinity,
  },
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      'react-router',
      'styled-components',
      '@redocly/ajv',
      'yaml',
      '@redocly/config',
    ],
    alias: {
      ajv: '@redocly/ajv',
      '@redocly/theme': THEME_PATH,
      '@portal': resolve(THEME_PATH, 'mocks'),
      flexsearch: resolve(
        dirname(createRequire(import.meta.url).resolve('flexsearch')),
        'flexsearch.compact.module.min.js',
      ),
      // The search engine imports the global FlexSearch build as a string to boot its workers.
      'flexsearch-global?raw': `${resolve(
        dirname(createRequire(import.meta.url).resolve('flexsearch')),
        'flexsearch.bundle.min.js',
      )}?raw`,
      linkedom: resolve(REDOC_ROOT, 'src/empty-linkedom.js'),
      path: 'path-browserify',
      'node:path': 'path-browserify',
      buffer: 'buffer',
      http: resolve(REDOC_ROOT, 'src/empty.js'),
      url: 'url',
      fs: resolve(REDOC_ROOT, 'src/empty.js'),
      os: resolve(REDOC_ROOT, 'src/empty.js'),
      tty: resolve(REDOC_ROOT, 'src/empty.js'),
      'node-fetch': resolve(REDOC_ROOT, 'src/empty.js'),
      'node-fetch-h2': resolve(REDOC_ROOT, 'src/empty.js'),
    },
  },
  optimizeDeps: {
    // `?raw` must stay a source string; pre-bundling would hand the engine a module object.
    exclude: ['flexsearch-global?raw'],
    include: ['@redocly/theme', '@redocly/redoc-opentelemetry', 'react-router'],
    rolldownOptions: {
      resolve: {
        mainFields: ['module', 'main'],
      },
    },
  },
  define: {
    __REDOCLY_API_DOCS_VERSION__: JSON.stringify('e2e'),
    __REDOCLY_API_DOCS_REVISION__: JSON.stringify(''),
    'process.env': '{}',
    'process.platform': '"browser"',
    'process.stdout': 'null',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.ENABLE_LOCAL_TELEMETRY': JSON.stringify(''),
    SC_DISABLE_SPEEDY: 'false',
    global: 'globalThis',
  },
  appType: 'spa',
  server: {
    port: 8085,
    host: '127.0.0.1',
    strictPort: true,
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx'],
    },
  },
  preview: {
    port: 8085,
    host: '127.0.0.1',
    strictPort: true,
  },
});
