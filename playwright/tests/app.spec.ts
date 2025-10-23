import { test, expect } from '@playwright/test';

import Section from '../page-objects/Section';
import Panel from '../page-objects/Panel';
import Menu from '../page-objects/Menu';

test.describe('Redoc', () => {
  let addPetSection: Section;
  let petSection: Section;
  let panel: Panel;
  let menu: Menu;

  test.beforeEach(async ({ page }) => {
    addPetSection = new Section(page, 'pet/addpet');
    petSection = new Section(page, 'pet');
    panel = new Panel(page);
    menu = new Menu(page);
    await page.goto('/index.html');
  });

  test('should have basic structure', async ({ page }) => {
    await expect(page.locator('.menu-content')).toBeVisible();
    await expect(panel.getOverview()).toBeVisible();
    await expect(panel.getDownloadDescription()).toBeVisible();
    await expect(panel.getServers()).toBeVisible();

    await menu.clickThroughMenu('pet');
    const showMoreButton = petSection.getOperationNavigationList().getByText('Show 3 more...');
    await expect(showMoreButton).toBeVisible();
    await showMoreButton.click();
    await expect(petSection.getOperationNavigationList()).toBeVisible();

    await menu.clickThroughMenu('Add a new pet to the store');
    await expect(addPetSection.getSection()).toBeVisible();
    await expect(addPetSection.getRequest()).toBeVisible();
    await expect(addPetSection.getCookies()).toBeVisible();
    await expect(addPetSection.getHeaders()).toBeVisible();
    await expect(addPetSection.getBody()).toBeVisible();
    await expect(addPetSection.getResponses()).toBeVisible();
  });

  test('should have download panel with defined urls', async () => {
    const yamlLink = panel.getDownloadDescription().getByText('definition.yaml');
    await expect(yamlLink).toHaveAttribute('href');
    await expect(yamlLink).toHaveAttribute('download');

    const jsonLink = panel.getDownloadDescription().getByText('definition.json');
    await expect(jsonLink).toHaveAttribute('href');
    await expect(jsonLink).toHaveAttribute('download');
  });

  test.describe('Operation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/index.html');
    });

    test('should check expand all', async () => {
      await menu.clickThroughMenu('pet', 'Add a new pet to the store');
      const expandButton = addPetSection.getSection().getByText('Expand all');
      await expandButton.click();
      await expect(addPetSection.getSection().getByText('Collapse all')).toBeVisible();
      await expect(addPetSection.getBody()).toBeVisible();
    });

    test('should change request payload', async () => {
      await menu.clickThroughMenu('pet', 'Add a new pet to the store');
      const panelHeader = addPetSection.getSamplesHeader();
      const payloadButton = panelHeader.getByText('C#').first();
      await expect(payloadButton).toBeVisible();
      await payloadButton.click();
      await expect(panelHeader.getByText('Payload').first()).toBeVisible();
      await panelHeader.getByText('Payload').first().click();
      await expect(addPetSection.getSamplesHeader().first()).toBeVisible();
      await expect(addPetSection.getSamplesHeader().getByText('Payload').first()).toBeVisible();
    });
  });
});
