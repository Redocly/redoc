import { test, expect } from '@playwright/test';

import Menu from '../../page-objects/Menu';

test.describe('Components', () => {
  let menu: Menu;

  test.describe('MediaTypesSwitch', () => {
    test.beforeEach(async ({ page }) => {
      menu = new Menu(page);
      await page.goto('/index.html');
    });

    test('should render all defined switchers', async ({ page }) => {
      await menu.clickThroughMenu('pet', 'Add a new pet to the store');
      await expect(page.locator('.dropdown-select')).toHaveCount(8);
    });
  });
});
