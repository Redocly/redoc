import { test, expect } from '@playwright/test';

import Menu from '../../page-objects/Menu';
import Panel from '../../page-objects/Panel';
import Section from '../../page-objects/Section';

test.describe('Components', () => {
  let menu: Menu;
  let panel: Panel;
  let updatePetSection: Section;

  test.describe('MediaTypeSamples', () => {
    test.beforeEach(async ({ page }) => {
      menu = new Menu(page);
      panel = new Panel(page);
      updatePetSection = new Section(page, 'pet/updatepet');
      await page.goto('/index.html');

      await menu.clickThroughMenu('pet', 'Update an existing pet');
      updatePetSection.getSection().isVisible();
      const panelHeader = updatePetSection.getSamplesHeader();
      const payloadButton = panelHeader.getByRole('button', { name: 'PHP' }).first();
      await expect(payloadButton).toBeVisible();
      await payloadButton.click();
      await panelHeader.getByRole('menuitem', { name: 'Payload' }).locator('span').first().click();
    });

    test('should sync response with request on init', async ({ page }) => {
      const catOption = await panel.samples.locator('option[value="cat"]');
      await expect(catOption).not.toBeVisible();

      await page.locator('[id="pet/updatepet"]').evaluate((element) => element.scrollIntoView());
      const catLabel = await panel.getLabel('cat');
      await expect(catLabel).toHaveCount(1);
    });

    test('should activate tab where example present', async ({ page }) => {
      const catLabel = await panel.getLabel('cat');
      await expect(catLabel).toHaveCount(1);

      await page
        .locator('#pet\\/updatepet .property')
        .locator('button[title="dog"]')
        .getByText('dog')
        .click();

      const dogLabel = await panel.getLabel('dog');
      await expect(dogLabel).toHaveCount(1);
    });
  });
});
