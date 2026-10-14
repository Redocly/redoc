import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('Expand all button — AsyncAPI', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/asyncapi/rides/topics/ride-requests');
    await apiDocs.waitForPageLoad();
  });

  test('message payload — Collapse all hides nested fields, Expand all reveals them', async ({
    page,
  }) => {
    const toggle = page.locator('[data-testid="schema-expand-all-button"]');
    const nestedField = page.locator('.schema-name', { hasText: /^latitude$/ });

    await expect(toggle).toHaveText('Collapse all');
    await expect(nestedField.first()).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveText('Expand all');
    await expect(nestedField).toHaveCount(0);

    await toggle.click();
    await expect(toggle).toHaveText('Collapse all');
    await expect(nestedField.first()).toBeVisible();
  });

  test('switching message tabs stays on the user-selected tab', async ({ page }) => {
    const cancellationTab = page.getByRole('tab', { name: /Ride Request Cancellation/i });
    const requestTab = page.getByRole('tab', { name: /^Ride Request$/i });

    await cancellationTab.click();
    await expect(page.getByText(/cancellation message for a ride/i)).toBeVisible();

    await requestTab.click();
    await expect(page.getByText(/initiates the ride flow/i)).toBeVisible();

    await cancellationTab.click();
    await expect(page.getByText(/cancellation message for a ride/i)).toBeVisible();
  });
});
