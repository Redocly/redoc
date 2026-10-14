import { defineConfig, devices } from '@playwright/test';

import { BUNDLE_DIR, BUNDLE_PORT, REDOC_ROOT } from './playwright/ce/examples/manifests.js';

/**
 * Builds and starts every project in examples/ (globalSetup), then runs the shared smoke against
 * each page. Separate from playwright.config.ts because this one needs Docker.
 * `EXAMPLES=react,javascript` limits the run; `npm run build` must have produced `BUNDLE_DIR`.
 */
export default defineConfig({
  testDir: './playwright/ce/examples',
  globalSetup: './playwright/ce/examples/global-setup.ts',
  globalTeardown: './playwright/ce/examples/global-teardown.ts',
  outputDir: '../test-results/examples',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [['github'], ['list']]
    : [['list'], ['html', { outputFolder: '../playwright-report/examples', open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npx http-server ${BUNDLE_DIR} --port ${BUNDLE_PORT} --cors -c-1 -s`,
    cwd: REDOC_ROOT,
    port: BUNDLE_PORT,
    reuseExistingServer: !process.env.CI,
  },
});
