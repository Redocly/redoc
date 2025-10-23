import { test, expect } from '@playwright/test';

import Section from '../page-objects/Section';
import Menu from '../page-objects/Menu';

test.describe('Menu', () => {
  let menu: Menu;

  test.beforeEach(async ({ page }) => {
    menu = new Menu(page);
    await page.goto('/pages/menu.html');
  });

  test('should render menu with auto generated tags', async ({ page }) => {
    await page.goto('/pages/menu.html');

    await menu.clickThroughMenu('pet');
    const menuItems = await menu.verifyAllMenuItemsHaveHref();
    await expect(menuItems).toHaveCount(14);
    await menu.clickThroughMenu('pet');
    await menu.clickThroughMenu('store');
    await expect(menuItems).toHaveCount(9);
    await menu.clickThroughMenu('store');

    await menu.clickThroughMenu('user');
    await expect(menuItems).toHaveCount(12);
  });

  test('should render menu with predefined tags', async ({ page }) => {
    await page.goto('/pages/menu.html?specFileName=menu-with-tags.yaml');

    await menu.clickThroughMenu('pet');
    const menuItems = await menu.verifyAllMenuItemsHaveHref();
    await expect(menuItems).toHaveCount(16);

    await menu.clickThroughMenu('ApiResponse');
    const catSection = new Section(page, 'pet/cat');
    await expect(catSection.getSection()).toBeVisible();
    await expect(catSection.getSection().locator('h2')).toContainText('Cat');

    await menu.clickThroughMenu('pet'); // switch to pet list
    await menu.clickThroughMenu('pet'); // close menu

    await menu.clickThroughMenu('store');
    await expect(menuItems).toHaveCount(9);
    await menu.clickThroughMenu('store');

    await menu.clickThroughMenu('user');
    await expect(menuItems).toHaveCount(12);
  });

  test('should render menu with predefined tags and groups', async ({ page }) => {
    await page.goto('/pages/menu.html?specFileName=menu-with-tag-groups.yaml');

    await menu.clickThroughMenu('pet');
    const menuItems = await menu.verifyAllMenuItemsHaveHref();
    await expect(menuItems).toHaveCount(5);
  });
});
