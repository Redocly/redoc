import { test, expect } from '@playwright/test';

import Section from '../page-objects/Section';
import Menu from '../page-objects/Menu';

test.describe('Navigation', () => {
  let menu: Menu;

  test.beforeEach(async ({ page }) => {
    menu = new Menu(page);
    await page.goto('/index.html');
  });

  test('menu: should open the operation details when the operation IDs have quotes', async ({
    page,
  }) => {
    await menu.clickThroughMenu('pet', 'OperationId with quotes');
    await expect(page.locator('[data-testid="operation-item-header"]').nth(2)).toContainText(
      'OperationId with quotes',
    );

    await expect(page).toHaveURL(/.*operationidwith%22quotes/);
  });

  test('menu: should encode URL when the operation IDs have backslashes', async ({ page }) => {
    await menu.clickThroughMenu('pet', 'OperationId with backslash');
    await expect(page.locator('[data-testid="operation-item-header"]').nth(3)).toContainText(
      'OperationId with backslash',
    );

    await expect(page).toHaveURL(/.*operationidwith%5Cbackslash/i);
  });

  test('deepLink: should exists deep links for all properties', async ({ page }) => {
    await menu.clickThroughMenu('pet', 'Add a new pet to the store');
    const addPetOperation = new Section(page, 'pet/addpet');
    await addPetOperation.verifyAllSchemaLinksHaveHref();

    await page.evaluate(() => window.scrollTo(0, 0));

    await menu.clickThroughMenu('user', 'Create user');
    const createUserOperation = new Section(page, 'user/createuser');
    await createUserOperation.verifyAllSchemaLinksHaveHref();
  });

  test('deepLink: should exists deep links for headers', async ({ page }) => {
    await menu.clickThroughMenu('Introduction');

    const introSection = new Section(page, 'section');
    await introSection.verifyHeaderDeepLink('section/OpenAPI-Specification');
    await introSection.verifyHeaderDeepLink('section/openapi-specification/Subheader-1');
    await introSection.verifyHeaderDeepLink('section/openapi-specification/Subheader-2');
    await introSection.verifyHeaderDeepLink('section/openapi-specification/Subheader-3');
    await introSection.verifyHeaderDeepLink('section/openapi-specification/Subheader-4');
  });
});
