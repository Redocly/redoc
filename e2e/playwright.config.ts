import { defineConfig, devices } from '@playwright/test';

/**
 * Drops the shared OTel reporter, which posts to a collector that only exists in the monorepo.
 * No screenshot tests: pixel comparison stays with the enterprise suite. `toMatchAriaSnapshot`
 * is unaffected — those snapshots are inline text, not images.
 */
const shard =
  process.env.SHARD_INDEX && process.env.SHARD_TOTAL
    ? { current: Number(process.env.SHARD_INDEX), total: Number(process.env.SHARD_TOTAL) }
    : undefined;

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,
  timeout: process.env.CI ? 60_000 : 30_000,
  shard,
  reporter: process.env.CI
    ? [['github'], ['list'], ['blob'], ['json', { outputFile: 'results.json' }]]
    : [['html']],
  expect: {
    timeout: process.env.CI ? 10_000 : 5_000,
    toMatchAriaSnapshot: {
      pathTemplate: '__snapshots__/{testFilePath}/{arg}{ext}',
    },
  },
  use: {
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 300000,
    testIdAttribute: 'data-component-name',
    trace: 'on-first-retry',
  },
  /**
   * `source` compiles `src/` with Vite; `bundles` drives the built distribution served statically.
   * Separate servers because the Vite app never touches `bundles/`.
   */
  projects: [
    {
      name: 'source',
      testDir: './playwright/tests',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        baseURL: 'http://127.0.0.1:8085',
      },
    },
    {
      name: 'bundles',
      testDir: './playwright/ce/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:8084',
      },
    },
  ],

  webServer: [
    {
      command: 'npx vite preview --config e2e/vite.config.ts',
      cwd: '..',
      port: 8085,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npx http-server ./e2e/playwright/ce --port 8084 -c-1',
      cwd: '..',
      port: 8084,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
