import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('Discriminator', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/discriminator-test');
  });

  test('should render the word "Discriminator" inside class "view-nested-wrapper"', async ({
    page,
  }) => {
    await apiDocs.clickThroughMenu('Create trip with filters');

    const menuSection = apiDocs.section('/discriminator-test/other/createtrip');

    await expect(menuSection.getSection()).toBeVisible();

    await expect(
      page.locator('[data-section-id="switcher"]').filter({ hasText: 'Discriminator' }).first(),
    ).toBeVisible();
  });
});

test.describe('Discriminator sync (allOf-wrapped body)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/cafe/updatecafe?specFileName=discriminator-allof-body.yaml');
  });

  test('schema panel and code-sample dropdown stay in sync', async ({ page }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'cat' });
    await expect(schemaTabs).toBeVisible();

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();

    const variantField = (name: string) =>
      page.locator('span.schema-name', { hasText: new RegExp(`^${name}$`) });

    await expect(codeSampleDropdown).toContainText('cat');
    await expect(variantField('huntingSkill')).toBeVisible();

    await schemaTabs.getByRole('tab', { name: 'dog' }).click();
    await expect(codeSampleDropdown).toContainText('dog');
    await expect(variantField('packSize')).toBeVisible();

    await schemaTabs.getByRole('tab', { name: 'bee' }).click();
    await expect(codeSampleDropdown).toContainText('bee');
    await expect(variantField('honeyPerDay')).toBeVisible();
  });
});

test.describe('Discriminator sync (implicit variants, no mapping)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/pets/updatepet?specFileName=discriminator-allof-body.yaml');
  });

  test('example panel lists variants and follows the schema switcher', async ({ page }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'PetCat' });
    await expect(schemaTabs).toBeVisible();

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();
    await expect(codeSampleDropdown).toContainText('PetCat');

    const requestSample = page
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'petType' })
      .first();
    await expect(requestSample).toContainText('"petType": "PetCat"');
    await expect(requestSample).toContainText('"huntingSkill"');

    await schemaTabs.getByRole('tab', { name: 'PetDog' }).click();

    await expect(codeSampleDropdown).toContainText('PetDog');
    await expect(requestSample).toContainText('"petType": "PetDog"');
    await expect(requestSample).toContainText('"packSize"');
    await expect(requestSample).not.toContainText('"huntingSkill"');
  });
});

test.describe('Discriminator sync (defaultMapping on an allOf-wrapped body)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/documents/updatedocument?specFileName=discriminator-allof-body.yaml');
  });

  test('Default mapping option reaches the example panel and stamps only explicit names', async ({
    page,
  }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'article' });
    await expect(schemaTabs).toBeVisible();
    await expect(schemaTabs).toContainText('Default mapping');

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();

    const requestSample = page
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'docType' })
      .first();
    await expect(requestSample).toContainText('"docType": "article"');
    await expect(requestSample).toContainText('"headline"');

    await schemaTabs.getByRole('tab', { name: /Default mapping/ }).click();

    await expect(codeSampleDropdown).toContainText('Default mapping');
    await expect(requestSample).toContainText('"body"');
    await expect(requestSample).not.toContainText('"headline"');
    // The Default mapping selection has no canonical wire value — no stamp.
    await expect(requestSample).toContainText('"docType": "string"');
  });
});

test.describe('Discriminator sync (oneOf without mapping)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/vehicles/updatevehicle?specFileName=discriminator-allof-body.yaml');
  });

  test('schema switcher drives the request sample', async ({ page }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'Bike' });
    await expect(schemaTabs).toBeVisible();

    const requestSample = page
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'vehicleType' })
      .first();
    await expect(requestSample).toContainText('"gears"');

    await schemaTabs.getByRole('tab', { name: 'Car' }).click();

    await expect(requestSample).toContainText('"doors"');
    await expect(requestSample).not.toContainText('"gears"');
  });
});

test.describe('Discriminator sync (array-item body)', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/discriminator-test');
  });

  test('schema panel and code-sample dropdown stay in sync', async ({ page }) => {
    await apiDocs.clickThroughMenu('Create trip with filters');

    const schemaSwitcher = page
      .locator('[data-section-id="switcher"]')
      .filter({ hasText: 'Discriminator' })
      .first();
    await expect(schemaSwitcher).toBeVisible();

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();
    const schemaSwitcherButton = schemaSwitcher.getByRole('button');

    const variantField = (name: string) =>
      page.locator('span.schema-name', { hasText: new RegExp(`^${name}$`) });
    const selectSchemaOption = async (name: string): Promise<void> => {
      await schemaSwitcherButton.click();
      await page.getByRole('menuitem', { name, exact: true }).click();
    };

    await expect(variantField('from')).toBeVisible();

    await selectSchemaOption('PRICE');
    await expect(codeSampleDropdown).toContainText('PRICE');
    await expect(variantField('maxPrice')).toBeVisible();

    await selectSchemaOption('DURATION');
    await expect(codeSampleDropdown).toContainText('DURATION');
    await expect(variantField('maxHours')).toBeVisible();
  });
});
