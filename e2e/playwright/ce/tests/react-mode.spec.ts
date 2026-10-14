import { expect, test } from '../test.js';

import {
  StandalonePage,
  gotoReactCase,
  gotoReactCaseRaw,
  readWindowState,
} from '../page-objects/StandalonePage.js';

test('renders from a definition URL', async ({ page }) => {
  const apiDocs = await gotoReactCase(page, 'definition-url');

  await expect(apiDocs.section('/react').first()).toContainText('Redocly Cafe');
  expect((await readWindowState(page)).loaded).toEqual([{ ok: true }]);
});

test('renders from a parsed definition object', async ({ page }) => {
  const apiDocs = await gotoReactCase(page, 'definition-object');

  await expect(apiDocs.section('/react').first()).toContainText('Inline definition object');
});

test('renders from a raw GraphQL SDL string', async ({ page }) => {
  const apiDocs = await gotoReactCase(page, 'graphql-sdl');

  await expect(
    apiDocs.sidebar.locator('[data-testid="menu-item-label"]', { hasText: 'Queries' }).first(),
  ).toBeVisible();
  expect((await readWindowState(page)).caseError).toBeUndefined();
});

test('renders a Swagger 2 document converted through the exported helper', async ({ page }) => {
  const apiDocs = await gotoReactCase(page, 'swagger2');

  await expect(apiDocs.section('/react').first()).toContainText('Converted from Swagger 2');
});

test('drives the low-level Redoc export with a caller-owned store', async ({ page }) => {
  const apiDocs = await gotoReactCaseRaw(page, 'low-level');

  await expect(apiDocs.section('/react').first()).toBeVisible();
  await expect(apiDocs.section('/react/products').first()).toBeAttached();
  await expect(apiDocs.sidebar).toHaveCount(0);
  expect((await readWindowState(page)).loaded).toEqual([{ ok: true }]);
});

test('shows children until the definition resolves, then replaces them', async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/specs/cafe/openapi.yaml', async (route) => {
    await held;
    await route.continue();
  });

  await gotoReactCaseRaw(page, 'children');
  const placeholder = page.locator('[data-testid="loading-placeholder"]');
  await expect(placeholder).toBeVisible();

  release();
  await expect(placeholder).toHaveCount(0);
  await expect(new StandalonePage(page).sidebar).toBeVisible();
});

test('uses path routing under basePath, unlike the standalone hash default', async ({ page }) => {
  const apiDocs = await gotoReactCaseRaw(page, 'base-path');
  await apiDocs.sidebar.waitFor({ state: 'visible' });
  await apiDocs.clickThroughMenu('Products');

  await expect(page).toHaveURL(/\/react\/docs\/products$/);
  expect(new URL(page.url()).hash).toBe('');
});
