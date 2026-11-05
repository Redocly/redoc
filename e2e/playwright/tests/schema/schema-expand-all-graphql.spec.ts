import { test, expect, type Locator } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('Expand all button — GraphQL', () => {
  let toggle: Locator;
  let fieldToggle: Locator;

  test.beforeEach(async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await page.goto('/other/queries/search');
    await apiDocs.waitForPageLoad();

    toggle = page.locator('h5:text-is("Arguments") ~ [data-testid="schema-expand-all-button"]');
    fieldToggle = page.locator('[id$="&arg=type"]').getByRole('button', { name: /return type/i });
  });

  test('arguments — the label follows manual field toggles', async () => {
    await expect(toggle).toHaveText('Expand all');

    await fieldToggle.click();
    await expect(toggle).toHaveText('Collapse all');

    await fieldToggle.click();
    await expect(toggle).toHaveText('Expand all');
  });

  test('arguments — Expand all reopens a field closed by hand', async () => {
    await toggle.click();
    await expect(toggle).toHaveText('Collapse all');

    await fieldToggle.click();
    await expect(toggle).toHaveText('Expand all');

    await toggle.click();
    await expect(toggle).toHaveText('Collapse all');
    await expect(fieldToggle).toHaveText(/Hide return type/);
  });

  test('return type — a deep link reopens fields closed by Collapse all', async ({ page }) => {
    const returnTypeToggle = page.locator(
      'h5:text-is("Return type") ~ [data-testid="schema-expand-all-button"]',
    );
    const cursorHash = 'other/queries/search/t=field&path=searchresultitemconnection.edges.cursor';
    const cursorField = page.locator(`[id="${cursorHash}"]`);

    await returnTypeToggle.click();
    await expect(cursorField).toBeVisible();
    await returnTypeToggle.click();
    await expect(cursorField).toHaveCount(0);

    await page.evaluate((hash) => {
      window.location.hash = hash;
    }, cursorHash);
    await expect(cursorField).toBeInViewport();
  });
});
