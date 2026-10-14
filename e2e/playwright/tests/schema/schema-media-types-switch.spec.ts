import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('MediaTypesSwitch', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/cafe');
  });

  test('should render all defined switchers', async ({ page }) => {
    await apiDocs.clickThroughMenu('menu', 'Add a new coffee to the store');

    const operationSection = page.locator('[data-section-id="/cafe/menu/addmenuitem"]').first();
    await expect(operationSection).toBeVisible();
    await expect(page.getByRole('button', { name: 'POST /menu', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'application/json' }).first()).toBeVisible();
    await expect(
      page.locator('[id="menu/addmenuitem/request/body"]').getByRole('tab', { name: 'pastry' }),
    ).toBeVisible();
    await expect(
      page.locator('[id="menu/addmenuitem/request/body"]').getByRole('tab', { name: 'tea' }),
    ).toBeVisible();
  });
});
