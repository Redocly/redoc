import { test, expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

import { goto } from '../../helpers/commands';

/** The discriminator lives in the payload sample, and the default tab differs by edition. */
async function selectPayloadSample(page: Page, operationSection: Locator): Promise<void> {
  const languageSwitcher = operationSection
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
  test.beforeEach(async ({ page }) => {
    await goto(page, '/cafe/menu/updatemenuitem');
  });

  test('should sync response with request on init', async ({ page }) => {
    const operationSection = page.locator('[data-section-id="/cafe/menu/updatemenuitem"]');
    await expect(operationSection).toBeVisible();

    await selectPayloadSample(page, operationSection);

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
    const operationSection = page.locator('[data-section-id="/cafe/menu/updatemenuitem"]');
    await expect(operationSection).toBeVisible();
    await selectPayloadSample(page, operationSection);
    const rightPanel = operationSection
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
