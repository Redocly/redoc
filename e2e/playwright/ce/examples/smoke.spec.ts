import { expect, test } from '@playwright/test';

import { StandalonePage } from '../page-objects/StandalonePage.js';
import { BUNDLE_URL, loadExamples } from './manifests.js';

// Every example renders the same Cafe API, so one sidebar path proves them all.
const MENU_PATH = ['Orders', 'List all orders'];
const HEADING = 'List all orders';

for (const example of loadExamples()) {
  test(`[${example.name}] renders the docs`, async ({ page, context }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const requests: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('request', (request) => requests.push(request.url()));

    const startUrl = `${example.baseURL}/`;
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(startUrl);

    await apiDocs.clickThroughMenu(...MENU_PATH);
    await expect(page.getByRole('heading', { name: HEADING }).first()).toBeVisible();
    await expect(page, 'navigating updates the deep link').not.toHaveURL(startUrl);

    // The deep link must survive a fresh load: this is what each example's server or router
    // (nginx SPA fallback, Next catch-all, hash routing) is there for.
    const freshTab = await context.newPage();
    freshTab.on('pageerror', (error) => pageErrors.push(error.message));
    freshTab.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await freshTab.goto(page.url());
    await expect(freshTab.getByRole('heading', { name: HEADING }).first()).toBeInViewport();
    await freshTab.close();

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    if (!example.usesNpm) {
      expect(requests, 'the page loaded the local build').toContain(BUNDLE_URL);
      // The spec itself may come from a CDN; only the Redoc bundle must not.
      expect(
        requests.filter((url) => url.endsWith('/redoc.standalone.js') && url !== BUNDLE_URL),
      ).toEqual([]);
    }
  });
}
