import { test } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('Page Actions Copy Button Tests', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/cafe');
  });

  test('Should show copy button on main section and be clickable', async () => {
    await apiDocs.clickThroughMenu('Introduction');
    await apiDocs.verifyPageActionsCopyButtonVisible();
    await apiDocs.verifyPageActionsCopyButtonClickable();
  });

  test('Should show copy button on operation and be clickable', async () => {
    await apiDocs.clickThroughMenu('menu', 'Add a new coffee to the store');
    await apiDocs.verifyPageActionsCopyButtonVisible();
    await apiDocs.verifyPageActionsCopyButtonClickable();
  });

});
