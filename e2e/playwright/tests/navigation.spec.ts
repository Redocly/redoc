import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('Navigation (OpenAPI)', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/cafe');
    await apiDocs.waitForPageLoad();
  });

  test('menu: should open the operation details when the operation IDs have quotes', async ({
    page,
  }) => {
    await apiDocs.clickThroughMenu('menu', 'OperationId with quotes');

    await expect(page.getByRole('heading', { name: 'OperationId with quotes' })).toBeVisible();

    await expect(page).toHaveURL(/operationidwith%22quotes/);
  });

  test('menu: should encode URL when the operation IDs have backslashes', async ({ page }) => {
    await apiDocs.clickThroughMenu('menu', 'OperationId with backslash');
    await expect(page.getByRole('heading', { name: 'OperationId with backslash' })).toBeVisible();

    await expect(page).toHaveURL(/operationidwith%5Cbackslash/i);
  });

  test('menu: should open a tag description section with its content', async ({ page }) => {
    await apiDocs.clickThroughMenu('customer', 'Custom section 1');

    await expect(page).toHaveURL(/\/cafe\/customer\/custom-section-1$/);
    await expect(page.getByRole('heading', { name: 'Custom section 1' })).toBeVisible();
    await expect(page.getByText('Nullam pretium erat ut augue mollis')).toBeVisible();
  });

  test('deepLink: should exists deep links for all properties', async () => {
    await apiDocs.clickThroughMenu('menu', 'Add a new coffee to the store');
    const addCafeOperation = apiDocs.section('/cafe/menu/addmenuitem');
    await addCafeOperation.verifyAllSchemaLinksHaveHref();

    await apiDocs.clickThroughMenu('customer', 'Create customer');
    const createUserOperation = apiDocs.section('/cafe/customer/createcustomer');
    await createUserOperation.verifyAllSchemaLinksHaveHref();
  });

  test('deepLink: should exists deep links for headers', async () => {
    await apiDocs.clickThroughMenu('Introduction');

    await apiDocs
      .section('/cafe/section/openapi-specification')
      .verifyHeaderDeepLink('section/openapi-specification');
    await apiDocs
      .section('/cafe/section/openapi-specification/subheader-1')
      .verifyHeaderDeepLink('section/openapi-specification/subheader-1');
    await apiDocs
      .section('/cafe/section/openapi-specification/subheader-2')
      .verifyHeaderDeepLink('section/openapi-specification/subheader-2');
    await apiDocs
      .section('/cafe/section/openapi-specification/subheader-3')
      .verifyHeaderDeepLink('section/openapi-specification/subheader-3');
    await apiDocs
      .section('/cafe/section/openapi-specification/subheader-4')
      .verifyHeaderDeepLink('section/openapi-specification/subheader-4');
  });
});

test.describe('Navigation (GraphQL)', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);

    await page.goto('/');
    await apiDocs.waitForPageLoad();
  });

  test('should display basic navigation structure', async () => {
    const menu = await apiDocs.getMainLeftMenu();
    await expect(menu).toBeVisible();

    const panel = await apiDocs.getContent();
    await expect(panel).toBeVisible();
  });

  test('should display Object type details and have correct links', async ({ page }) => {
    await page.goto('/other/objects');
    await apiDocs.waitForPageLoad();

    const objectsSection = page.locator('[data-section-id="/other/objects"]');
    await expect(objectsSection).toBeVisible();

    const objectItemLink = page
      .locator('[data-component-name="Menu/MenuItem"] a[href^="/other/objects/"]')
      .first();
    await expect(objectItemLink).toBeVisible();
    await expect(objectItemLink).toHaveAttribute('href', /\/other\/objects\/[^/]+$/);
  });

  test('should display Query details and have correct links', async ({ page }) => {
    await page.goto('/other/queries');
    await apiDocs.waitForPageLoad();

    const queriesSection = page.locator('[data-section-id="/other/queries"]');
    await expect(queriesSection).toBeVisible();

    const queryItemLink = page
      .locator('[data-component-name="Menu/MenuItem"] a[href^="/other/queries/"]')
      .first();
    await expect(queryItemLink).toBeVisible();
    await expect(queryItemLink).toHaveAttribute('href', /\/other\/queries\/[^/]+$/);
  });

  test('should navigate to referenced field when clicking field link', async ({ page }) => {
    await page.goto('/other/objects/license');
    await apiDocs.waitForPageLoad();

    const refFieldLink = page
      .locator('a[href*="/other/objects/license#other/objects/license/graphql-fields"]')
      .first();
    await expect(refFieldLink).toBeVisible();

    const href = await refFieldLink.getAttribute('href');
    expect(href).toContain('#');
    expect(href).toContain('other/objects/license/graphql-fields');

    const hashBeforeClick = new URL(page.url()).hash;
    await refFieldLink.click();
    await expect.poll(() => new URL(page.url()).hash).not.toBe(hashBeforeClick);
    await expect.poll(() => new URL(page.url()).hash).toContain('graphql-fields');
  });

  test('should scope field deep link IDs with parent type name', async ({ page }) => {
    await page.goto('/other/objects/license');
    await apiDocs.waitForPageLoad();

    const fieldLink = page
      .locator(
        'a[href*="/other/objects/license#other/objects/license/t=field&path=license.permissions"]',
      )
      .first();
    await expect(fieldLink).toBeVisible();
    await expect(fieldLink).toHaveAttribute(
      'href',
      expect.stringMatching(/#other\/objects\/license\/t=field&path=license\.[^&]+/i),
    );
  });

  test('should scope argument deep link IDs with parent operation name', async ({ page }) => {
    await page.goto('/other/queries/codeofconduct');
    await apiDocs.waitForPageLoad();

    const argLink = page
      .locator(
        'a[href*="/other/queries/codeofconduct#other/queries/codeofconduct/t=argument&path=codeofconduct.key&arg=key"]',
      )
      .first();
    await expect(argLink).toBeVisible();
    await expect(argLink).toHaveAttribute(
      'href',
      expect.stringMatching(
        /#other\/queries\/codeofconduct\/t=argument&path=codeofconduct\.[^&]+&arg=[^&]+/i,
      ),
    );
  });

  test('should display Enum values and have correct links', async ({ page }) => {
    await page.goto('/other/enums');
    await apiDocs.waitForPageLoad();

    const enumsSection = page.locator('[data-section-id="/other/enums"]');
    await expect(enumsSection).toBeVisible();

    const enumItemLink = page
      .locator('[data-component-name="Menu/MenuItem"] a[href^="/other/enums/"]')
      .first();
    await expect(enumItemLink).toBeVisible();
    await expect(enumItemLink).toHaveAttribute('href', /\/other\/enums\/[^/]+$/);
  });

  test('should display "Implemented by" section on interface page', async ({ page }) => {
    await page.goto('/other/interfaces/gitsignature');
    await apiDocs.waitForPageLoad();

    const section = page.locator('[data-section-id="/other/interfaces/gitsignature"]');
    const implementedBy = section.locator('[id$="/gitsignature/implemented-by"]').locator('..');
    await expect(implementedBy).toBeVisible();

    const expectedTypes = {
      GpgSignature: '/other/objects/gpgsignature',
      SmimeSignature: '/other/objects/smimesignature',
      UnknownSignature: '/other/objects/unknownsignature',
    };

    for (const [typeName, href] of Object.entries(expectedTypes)) {
      const link = implementedBy.getByRole('link', { name: typeName });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    }
  });

  test('should navigate to implementing type when clicking link in "Implemented by"', async ({
    page,
  }) => {
    await page.goto('/other/interfaces/gitsignature');
    await apiDocs.waitForPageLoad();

    const section = page.locator('[data-section-id="/other/interfaces/gitsignature"]');
    const implementedBy = section.locator('[id$="/gitsignature/implemented-by"]').locator('..');

    const link = implementedBy.getByRole('link', { name: 'GpgSignature' });
    await link.click();

    await expect(page).toHaveURL('/other/objects/gpgsignature');
    await apiDocs.waitForPageLoad();

    const heading = page.getByRole('heading', { name: 'GpgSignature', level: 2 });
    await expect(heading).toBeVisible();
  });
});
