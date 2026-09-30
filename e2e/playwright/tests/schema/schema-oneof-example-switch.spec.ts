import { test, expect } from '@playwright/test';

import { goto } from '../../helpers/commands';
import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('OneOf switch updates generated examples', () => {
  test('openapi: selecting a oneOf variant updates the request sample', async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await goto(page, '/oneof-anyof-test');
    await apiDocs.clickThroughMenu('Documents', 'Upload a document');

    const section = apiDocs.section('/oneof-anyof-test/documents/uploaddocument').getSection();
    await expect(section).toBeVisible();

    const requestSample = section
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'entityMetadata' })
      .first();
    await expect(requestSample).toContainText('"pnrId"');

    await section.getByRole('tab', { name: 'EventMetadataWrapper' }).click();

    await expect(requestSample).toContainText('"eventId"');
    await expect(requestSample).not.toContainText('"pnrId"');
  });

  test('asyncapi: selecting a nested oneOf variant updates the payload example (null renders as null)', async ({
    page,
  }) => {
    await goto(page, '/asyncapi-oneof');
    await page.locator('a[href*="/topics/ratings"]').first().click();

    const section = page.locator('[data-section-id*="/topics/ratings"]').first();
    await expect(section).toBeVisible();

    const payloadSample = section
      .locator('[data-testid="source-code"]')
      .filter({ hasText: 'rideId' })
      .first();
    await expect(payloadSample).toContainText('"userType"');

    await section.getByRole('tab', { name: 'null', exact: true }).click();

    await expect(payloadSample).toContainText('"type": null');
    await expect(payloadSample).not.toContainText('"userType"');
  });
});
