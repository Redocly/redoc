import { expect, test } from '../test.js';

import { StandalonePage } from '../page-objects/StandalonePage.js';

const CODE_SAMPLES = '/fixtures/code-samples.yaml';

const optionsUrl = (params: Record<string, string>) =>
  `/pages/options-attributes.html?${new URLSearchParams(params).toString()}`;

test('boots from a module script tag with the documented export surface', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const apiDocs = new StandalonePage(page);
  await apiDocs.goto('/pages/auto-init.html');

  await expect(apiDocs.section('/').first()).toContainText('Redocly Cafe');
  expect(
    await page.evaluate(
      async (url) => Object.keys(await import(url)).sort(),
      '/bundles/redoc.standalone.js',
    ),
  ).toEqual(['RedocStandalone', 'hydrate', 'init']);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test.describe('attribute to option conversion', () => {
  test('kebab-case attributes become camelCase options', async ({ page }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(
      optionsUrl({ 'spec-url': CODE_SAMPLES, 'schema-definitions-tag-name': 'Schemas' }),
    );

    await expect(
      apiDocs.sidebar.locator('[data-testid="menu-item-label"]', { hasText: 'Schemas' }),
    ).toBeVisible();
  });

  test('an already-camelCase attribute is not recognized', async ({ page }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(
      optionsUrl({ 'spec-url': CODE_SAMPLES, schemaDefinitionsTagName: 'Schemas' }),
    );

    await expect(apiDocs.sidebar.locator('[data-testid="menu-item-label"]').first()).toBeVisible();
    await expect(
      apiDocs.sidebar.locator('[data-testid="menu-item-label"]', { hasText: 'Schemas' }),
    ).toHaveCount(0);
  });
});

test.describe('routing', () => {
  test('defaults to hash routing', async ({ page }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto('/pages/auto-init.html');
    await apiDocs.clickThroughMenu('Products');

    await expect(page).toHaveURL(/\/pages\/auto-init\.html#\/products$/);
  });

  test('router="history" switches to path-based URLs', async ({ page }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(optionsUrl({ router: 'history' }));
    await apiDocs.clickThroughMenu('Products');

    await expect(page).toHaveURL(/\/products$/);
    expect(new URL(page.url()).hash).toBe('');
  });
});

test.describe('spec type resolution', () => {
  test('an unrecognized type-of-usage does not break rendering', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(optionsUrl({ 'type-of-usage': 'not-a-real-usage' }));

    await expect(apiDocs.section('/').first()).toContainText('Redocly Cafe');
    expect(pageErrors).toEqual([]);
  });
});
