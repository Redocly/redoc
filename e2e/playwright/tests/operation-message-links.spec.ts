import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

const PUBLISH_RIDE_REQUEST_SECTION =
  '/asyncapi/rides/topics/ride-requests/operations/publishriderequest';

test.describe('Operation MessageLinks (AsyncAPI)', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await apiDocs.navigateToOperation('rides/topics/ride-requests', 'publishriderequest');
    await apiDocs.waitForPageLoad();
  });

  test('renders an Operation/MessageLinks block with a clickable tag per linked message', async () => {
    const operationSection = apiDocs.getOperationSection(PUBLISH_RIDE_REQUEST_SECTION);
    const links = operationSection.locator('[data-component-name="Operation/MessageLinks"]');
    await expect(links).toBeVisible();

    const tagLink = links.getByRole('link', { name: 'Ride Request', exact: true });
    await expect(tagLink).toBeVisible();
  });

  test('clicking a message tag navigates to the channel page with a deep link to that message', async ({
    page,
  }) => {
    const sectionId = '/asyncapi/rides/topics/ride-requests/messages';
    const messageName = 'Ride Request';

    await apiDocs
      .getOperationSection(PUBLISH_RIDE_REQUEST_SECTION)
      .locator('[data-component-name="Operation/MessageLinks"]')
      .getByRole('link', { name: messageName, exact: true })
      .click();

    await apiDocs.waitForMessageLoad(sectionId, messageName);

    await expect(page).toHaveURL(/\/asyncapi\/rides\/topics\/ride-requests/);
    expect(await apiDocs.isMessageVisible(sectionId, messageName)).toBe(true);
    await expect(page.locator(`a[href*="messages&m=requestride"]`).first()).toBeVisible();
  });
});
