import { defineConfig, devices } from '@playwright/test';

/**
 * Builds the Docker image around the local `npm run build` bundle (globalSetup), starts one
 * container per env variant and runs the smoke against each. `VARIANTS=hash-root` limits the run.
 */
export default defineConfig({
  testDir: './playwright/ce/docker',
  globalSetup: './playwright/ce/docker/global-setup.ts',
  globalTeardown: './playwright/ce/docker/global-teardown.ts',
  outputDir: '../test-results/docker',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: { ...devices['Desktop Chrome'], trace: 'on-first-retry' },
});
