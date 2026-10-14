import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('OneOf/AnyOf Titles', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/oneof-recursion');
  });

  test('should not display duplicate description', async ({ page }) => {
    await apiDocs.clickThroughMenu('Cases', 'Error');

    const section = apiDocs.section('/oneof-recursion/cases/error');

    await expect(section.getSection()).toBeVisible();
    await expect(
      page.locator('[id="cases/error/path=example_property"]').getByText('Any of:'),
    ).toBeVisible();
    await expect(
      page.locator('[id="cases/error/path=example_property"]').getByText('A plain text value'),
    ).toHaveCount(1);
    await expect(
      page
        .locator('[id="cases/error/path=allowedvalues"]')
        .getByText('List of allowed values. Available for custom fields with types'),
    ).toHaveCount(1);
    // an array variant without an items schema accepts any items
    await expect(
      page
        .locator('[id="cases/error/path=allowedvalues"]')
        .getByRole('tab', { name: 'Array of any' }),
    ).toBeVisible();
    await expect(
      page.locator('[id="cases/error/path=example_property"]').getByText('Complex'),
    ).not.toBeVisible();
    await expect(
      page.locator('[id="cases/error/path=example_property"]').getByText('Recursive'),
    ).not.toBeVisible();
  });

  test('should display correct anyOf/oneOf without recursion label and duplications', async ({
    page,
  }) => {
    await apiDocs.clickThroughMenu('Cases', 'OneOfTitle');
    const section = apiDocs.section('/oneof-recursion/cases/oneoftitle');
    await expect(section.getSection()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Rate Limited Problem' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Rate Limited JSONAPI' })).toBeVisible();
    await expect(section.getSection().getByText('Any of:')).toHaveCount(1);
    await expect(section.getSection().getByText('One of:')).toHaveCount(2);
    await expect(section.getSection().getByText('A plain text value')).toHaveCount(1);
    await expect(
      section
        .getSection()
        .getByText('List of allowed values. Available for custom fields with types'),
    ).toHaveCount(1);
    await expect(section.getSection().getByText('Complex')).not.toBeVisible();
    await expect(section.getSection().getByText('Recursive')).not.toBeVisible();
  });

  test('should display correct oneOf with labels and descriptions', async ({ page }) => {
    await apiDocs.clickThroughMenu('Cases', 'OneOf labels and descriptions');
    const section = apiDocs.section('/oneof-recursion/cases/oneoflabelsanddescriptions');
    await expect(section.getSection()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Static Data Request' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Custom Data Request' })).toBeVisible();
    await expect(
      page.locator('[id="cases/oneoflabelsanddescriptions/request/body"]').getByText('One of:'),
    ).toHaveCount(1);

    await expect(
      page.locator('[id="cases/oneoflabelsanddescriptions/request/body"]').getByText('Complex'),
    ).not.toBeVisible();
    await expect(
      page.locator('[id="cases/oneoflabelsanddescriptions/request/body"]').getByText('Recursive'),
    ).not.toBeVisible();
  });

  test('should display correct descriptions without recursion label', async ({ page }) => {
    await apiDocs.clickThroughMenu('Cases', 'Show description in specific case');
    const section = apiDocs.section('/oneof-recursion/cases/showdescriptioninspecificcase');
    await expect(section.getSection()).toBeVisible();
    const responseId =
      'cases/showdescriptioninspecificcase/t=response&c=200&path=contractsignature';

    await expect(
      page.locator(`[id="${responseId}"]`).getByText('The signature SVG for the contract document'),
    ).toHaveCount(1);

    await expect(page.locator(`[id="${responseId}"]`).getByText('Complex')).not.toBeVisible();
    await expect(page.locator(`[id="${responseId}"]`).getByText('Recursive')).not.toBeVisible();
  });

  test('should display correct schema without recursion label', async ({ page }) => {
    await apiDocs.clickThroughMenu('Cases', 'Default case');
    const section = apiDocs.section('/oneof-recursion/cases/defaultcase');
    await expect(section.getSection()).toBeVisible();

    await expect(page.locator('[id="cases/defaultcase"]').getByText('Complex')).not.toBeVisible();
    await expect(page.locator('[id="cases/defaultcase"]').getByText('Recursive')).not.toBeVisible();
  });

  test('should display correct oneOf schema without recursion label and correct labels', async ({
    page,
  }) => {
    await apiDocs.clickThroughMenu('Cases', 'Upload a document');
    const section = apiDocs.section('/oneof-recursion/cases/uploaddocument');
    await expect(section.getSection()).toBeVisible();

    await expect(page.getByRole('tab', { name: 'PnrMetadataWrapper' })).toBeVisible();
    await expect(
      page
        .locator('[id="cases/uploaddocument/request/body"]')
        .getByText('Metadata for associated entity of document'),
    ).toHaveCount(1);

    await expect(
      page.locator('[id="cases/uploaddocument/request/body"]').getByText('Complex'),
    ).not.toBeVisible();
    await expect(
      page.locator('[id="cases/uploaddocument/request/body"]').getByText('Recursive'),
    ).not.toBeVisible();
  });
});
