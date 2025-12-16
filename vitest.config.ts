import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  optimizeDeps: {
    exclude: ['htmlparser2'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    root: __dirname,
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    include: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/bundle/**',
      '**/lib/**',
      '**/playground/**',
      '**/playwright/**',
      '**/scripts/**',
      '**/__mocks__/**',
      '**/src/icons/**',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/index.ts',
        '**/types.ts',
        '**/src/types/**',
        '**/src/icons/**',
        '**/events/**',
        '**/__snapshots__/**',
        '**/__fixtures__/**',
        '**/__tests__/**',
        '**/__mocks__/**',
      ],
      thresholds: {
        statements: 78,
        branches: 68,
        functions: 75,
        lines: 78,
      },
    },
  },
  resolve: {
    alias: {
      path: 'path-browserify',
    },
    preserveSymlinks: false,
  },
});
