import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('OneOf/AnyOf Titles', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/oneof-anyof-test');
  });

  test('should display correct oneOf child titles in EntityMetadata without parent title override', async ({
    page,
  }) => {
    await apiDocs.clickThroughMenu('Documents', 'Upload a document');

    const uploadDocumentSection = apiDocs.section('/oneof-anyof-test/documents/uploaddocument');

    await expect(uploadDocumentSection.getSection()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'PnrMetadataWrapper' })).toBeVisible();
    await expect(
      page.getByText(
        'PnrMetadataWrapper (object) or EventMetadataWrapper (object) or LegMetadataWrapper (object)',
      ),
    ).toBeVisible();
    await expect(page.getByText('(EntityMetadata)')).toBeVisible();
  });

  test('should display correct anyOf child titles in Plan and not show Recursive label', async ({
    page,
  }) => {
    await apiDocs.clickThroughMenu('Plans', 'Create a plan');

    const createPlanSection = apiDocs.section('/oneof-anyof-test/plans/createplan');

    await expect(createPlanSection.getSection()).toBeVisible();

    const requestTablist = page.getByRole('tablist').first();

    await expect(requestTablist.getByRole('tab', { name: 'OneTimeSalePlan' })).toBeVisible();
    await expect(requestTablist.getByRole('tab', { name: 'SubscriptionPlan' })).toBeVisible();
    await expect(requestTablist.getByRole('tab', { name: 'TrialOnlyPlan' })).toBeVisible();

    await expect(page.getByText('Recursive')).not.toBeVisible();
  });
});
