import { expect, test } from '../test.js';

import type { Page } from '@playwright/test';

import { StandalonePage } from '../page-objects/StandalonePage.js';

const COLLECTOR = '**/otel.cloud.redocly.com/**';
const TELEMETRY_FLUSH_SETTLE_MS = 4000;

async function interceptCollector(page: Page): Promise<() => number> {
  let attempts = 0;
  await page.route(COLLECTOR, async (route) => {
    attempts += 1;
    await route.fulfill({ status: 204, body: '' });
  });
  return () => attempts;
}

async function renderThenForceTelemetryFlush(page: Page, query: string): Promise<void> {
  const apiDocs = new StandalonePage(page);
  await apiDocs.goto(`/pages/options-attributes.html?${query}`);
  await apiDocs.clickThroughMenu('Products');
  await expect(apiDocs.section('/products').first()).toBeVisible();

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('pagehide'));
  });
}

test('disable-telemetry="true" sends nothing to the collector', async ({ page }) => {
  const attempts = await interceptCollector(page);

  await renderThenForceTelemetryFlush(page, 'disable-telemetry=true');
  await page.waitForTimeout(TELEMETRY_FLUSH_SETTLE_MS);

  expect(attempts()).toBe(0);
});

test('a bare disable-telemetry attribute does NOT opt out', async ({ page }) => {
  const attempts = await interceptCollector(page);

  await renderThenForceTelemetryFlush(page, 'disable-telemetry=');

  expect(
    await page.evaluate(() => document.querySelector('redoc')?.getAttribute('disable-telemetry')),
  ).toBe('');
  await expect.poll(attempts, { timeout: TELEMETRY_FLUSH_SETTLE_MS }).toBeGreaterThan(0);
});
