import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

/**
 * Drops two enterprise couplings: the global Languages panel, and the generated request samples.
 * Only the spec's own `x-codeSamples` exist here.
 */
test.describe('Redoc', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await goto(page, '/cafe');
  });

  test('should have basic structure', async ({ page }) => {
    await expect(page.locator('.menu-content')).toBeVisible();
    await expect(apiDocs.getOverview()).toBeVisible();
    await expect(
      apiDocs.getDownloadDescription('panel-download-openapi-description'),
    ).toBeVisible();
    await expect(apiDocs.getServers()).toBeVisible();

    await apiDocs.clickThroughMenu('menu');
    const menuGroup = apiDocs.section('/cafe/menu');
    await expect(menuGroup.getSection()).toBeVisible();

    const showMoreButton = page.locator('[data-testid="show-more-operations"]');
    await expect(showMoreButton).toBeVisible();
    await expect(showMoreButton).toContainText(/Show \d+ more/);
    await showMoreButton.click();
    await expect(showMoreButton).toHaveCount(0);

    await apiDocs.clickThroughMenu('Add a new coffee to the store');
    const addMenuItem = apiDocs.section('/cafe/menu/addmenuitem').getSection();
    await expect(addMenuItem).toBeVisible();
    await expect(addMenuItem.getByRole('heading', { name: 'Request' })).toBeVisible();
    await expect(addMenuItem.getByRole('heading', { name: 'Cookies' })).toBeVisible();
    await expect(addMenuItem.getByRole('heading', { name: 'Headers' })).toBeVisible();
    await expect(addMenuItem.getByRole('heading', { name: 'Responses' })).toBeVisible();
    await expect(addMenuItem.getByText('Invalid input')).toBeVisible();
  });

  test('should offer only the spec-provided x-codeSamples for request samples', async ({
    page,
  }) => {
    await goto(page, '/cafe/menu/updatemenuitem');
    const section = apiDocs.section('/cafe/menu/updatemenuitem').getSection();
    await expect(section).toBeVisible();

    const samples = section.locator('div.panel-request-samples');
    const samplesHeader = samples.locator('[data-component-name="Panel/PanelHeader"]');
    const sourceCode = samples.locator('[data-testid="source-code"]').first();

    // updateMenuItem declares one x-codeSamples entry (PHP), so it is pre-selected here.
    await expect(samplesHeader.getByRole('button', { name: 'PHP' })).toBeVisible();
    await expect(sourceCode).toContainText('$client->menu()->update($form)');

    // Two dropdowns in the header: route, then language.
    await samplesHeader.locator('[data-testid="dropdown"]').last().locator('button').click();
    const menu = page.locator('[data-component-name="Dropdown/DropdownMenu"]');
    await expect(menu.getByRole('menuitem').first()).toBeVisible();

    const offered = (await menu.getByRole('menuitem').allInnerTexts()).map((t) => t.trim()).sort();
    expect(offered).toEqual(['PHP', 'Payload']);
  });
});
