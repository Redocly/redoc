import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Theme is aliased to source, same as the build. Resolution order: explicit
// REDOC_THEME_PATH override → own node_modules (standalone repo) → hoisted
// installs walking up (running inside the Redocly monorepo).
const THEME_CANDIDATES = [
  process.env.REDOC_THEME_PATH && resolve(__dirname, process.env.REDOC_THEME_PATH),
  resolve(__dirname, 'node_modules/@redocly/theme/src'),
  resolve(__dirname, '../node_modules/@redocly/theme/src'),
  resolve(__dirname, '../../../node_modules/@redocly/theme/src'),
].filter((p): p is string => Boolean(p));

const THEME_PATH = THEME_CANDIDATES.find((p) => existsSync(p)) ?? THEME_CANDIDATES[0];
const FLEXSEARCH_DIST = dirname(createRequire(import.meta.url).resolve('flexsearch'));

export default defineConfig({
  test: {
    globals: true,
    reporters: process.env.CI ? ['verbose', 'json'] : ['default'],
    outputFile: {
      json: 'report.test-timing.json',
    },
    environment: 'jsdom',
    root: __dirname,
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    include: ['src/**/__tests__/**/*.test.[jt]s?(x)', 'src/**/?(*.)+(test).[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/bundles/**',
      '**/lib/**',
      '**/playground/**',
      '**/__mocks__/**',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/index.ts',
        '**/types.ts',
        '**/src/types/**',
        '**/__snapshots__/**',
        '**/__fixtures__/**',
        '**/__tests__/**',
        '**/__mocks__/**',
      ],
    },
  },
  resolve: {
    alias: {
      path: 'path-browserify',
      '@redocly/theme': THEME_PATH,
      '@portal': resolve(THEME_PATH, 'mocks'),
      'flexsearch-global?raw': `${resolve(FLEXSEARCH_DIST, 'flexsearch.bundle.min.js')}?raw`,
    },
    dedupe: ['react', 'react-dom', 'styled-components'],
    preserveSymlinks: false,
  },
});
