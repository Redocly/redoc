import { test, expect } from '@playwright/test';

import type { Page } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

/** The discriminator lives in the payload sample, and the default tab differs by edition. */
async function selectPayloadSample(page: Page): Promise<void> {
  const languageSwitcher = page
    .locator('div.panel-request-samples [data-component-name="Panel/PanelHeader"]')
    .first()
    .locator('[data-testid="dropdown"]')
    .last();
  const active = (await languageSwitcher.locator('button').first().innerText()).trim();
  if (active === 'Payload') return;
  await languageSwitcher.locator('button').first().click();
  await page
    .locator('[data-component-name="Dropdown/DropdownMenu"]')
    .getByRole('menuitem', { name: 'Payload', exact: true })
    .click();
}

test.describe('MediaTypeSamples', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/cafe');
  });

  test('should sync response with request on init', async ({ page }) => {
    await apiDocs.clickThroughMenu('menu', 'Update an existing menu item');
    const operationSection = page.locator('[data-section-id="/cafe/menu/updatemenuitem"]').first();
    await expect(operationSection).toBeVisible();

    await selectPayloadSample(page);

    const schemaDiscriminatorTabs = operationSection.locator('[data-section-id="switcher"]');
    await expect(schemaDiscriminatorTabs.getByRole('tab', { name: 'coffee' })).toBeVisible();

    const rightPanel = operationSection
      .locator('[data-component-name="Panel/PanelBody"]')
      .filter({ has: page.locator('button[aria-label="Discriminator"]') })
      .first();
    const codeSampleDiscriminator = rightPanel.locator('button[aria-label="Discriminator"]');
    await expect(codeSampleDiscriminator).toContainText('coffee');
  });

  test('should activate tab where example present', async ({ page }) => {
    await apiDocs.clickThroughMenu('menu', 'Update an existing menu item');
    const operationSection = page.locator('[data-section-id="/cafe/menu/updatemenuitem"]').first();
    await expect(operationSection).toBeVisible();
    await selectPayloadSample(page);
    const rightPanel = page
      .locator('[data-component-name="Panel/PanelBody"]')
      .filter({ has: page.locator('button[aria-label="Discriminator"]') })
      .first();
    const codeSampleDiscriminator = rightPanel.locator('button[aria-label="Discriminator"]');
    await expect(codeSampleDiscriminator).toContainText('coffee');

    const pastryTab = page
      .locator(
        '[id="menu/updatemenuitem/t=request&ct=application/json&path=itemtype"] > [data-section-id="switcher"]',
      )
      .getByRole('tab', { name: 'pastry' });
    await expect(pastryTab).toBeVisible();
    await pastryTab.click();

    await expect(codeSampleDiscriminator).toContainText('pastry');
  });
});
