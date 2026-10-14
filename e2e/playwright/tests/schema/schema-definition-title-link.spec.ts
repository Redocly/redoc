import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('Schema definition title links', () => {
  test('a schema title links to that schema’s definition page', async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await apiDocs.open('/menu/schemas/cafe?schemaDefinitionsTagName=Schemas');

    await page.getByRole('link', { name: '(Category)' }).first().click();

    await expect(page).toHaveURL(/\/menu\/schemas\/category$/);
  });
});
