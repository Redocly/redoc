import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('Expand all button gating', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/expand-all-test');
  });

  test('all-primitive body — button must not appear', async () => {
    await apiDocs.clickThroughMenu('Expand', 'Primitive body');

    const section = apiDocs.section('/expand-all-test/expand/primitivebody');
    await expect(section.getRequest()).toBeVisible();

    const expandButton = section.getSection().locator('[data-testid="schema-expand-all-button"]');
    await expect(expandButton).toHaveCount(0);
  });

  test('body with nested object — button toggles and expands/collapses fields', async () => {
    await apiDocs.clickThroughMenu('Expand', 'Nested body');

    const section = apiDocs.section('/expand-all-test/expand/nestedbody');
    await expect(section.getRequest()).toBeVisible();

    const toggle = section.getSection().locator('[data-testid="schema-expand-all-button"]');
    const nestedField = section.getSection().locator('.schema-name', { hasText: /^street$/ });

    await expect(toggle).toHaveText('Expand all');

    await toggle.click();
    await expect(toggle).toHaveText('Collapse all');
    await expect(nestedField).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveText('Expand all');
    await expect(nestedField).toHaveCount(0);
  });

  test('multi-key — Expand all affects BOTH query param schema AND request body', async () => {
    await apiDocs.clickThroughMenu('Expand', 'Multi-key');

    const section = apiDocs.section('/expand-all-test/expand/multikey');
    await expect(section.getRequest()).toBeVisible();

    const toggle = section.getSection().locator('[data-testid="schema-expand-all-button"]');

    const queryField = section.getSection().locator('.schema-name', { hasText: /^cityCode$/ });
    const bodyField = section.getSection().locator('.schema-name', { hasText: /^timestamp$/ });

    await expect(toggle).toHaveText('Expand all');

    await toggle.click();
    await expect(toggle).toHaveText('Collapse all');

    await expect(queryField).toBeVisible();
    await expect(bodyField).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveText('Expand all');
    await expect(queryField).toHaveCount(0);
    await expect(bodyField).toHaveCount(0);
  });
});
