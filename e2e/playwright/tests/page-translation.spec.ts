import { test, expect, type Page } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

const GET_PET_PATH = '/page-translation/pets/getpet';
const CREATE_PET_PATH = '/page-translation/pets/createpet';
const MESSAGE_OPERATION_PATH =
  '/page-translation-asyncapi/channels/petevents/operations/publishpetevent';

/** Simulates browser page translation: replaces text nodes, skipping `translate="no"` subtrees. */
async function translatePage(page: Page): Promise<void> {
  await page.evaluate(() => {
    const frame = document.createElement('iframe');
    frame.hidden = true;
    document.body.append(frame);
    const natives = frame.contentWindow?.Node.prototype;
    if (!natives) throw new Error('No frame to borrow DOM methods from');

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
    for (const node of textNodes) {
      const parent = node.parentElement;
      if (!parent || !node.data.trim() || parent.closest('script, style, [translate="no"]')) {
        continue;
      }
      const font = document.createElement('font');
      natives.appendChild.call(font, document.createTextNode(node.data));
      natives.replaceChild.call(parent, font, node);
    }
  });
}

test.describe('Page translation', () => {
  let apiDocs: ApiDocsPage;

  async function openTranslated(page: Page, path: string): Promise<void> {
    await page.goto(path);
    await apiDocs.waitForPageLoad();
    await translatePage(page);
  }

  async function selectExample(page: Page, panel: string, example: string): Promise<void> {
    await apiDocs
      .section(CREATE_PET_PATH)
      .getSection()
      .locator(panel)
      .getByRole('button', { name: 'Example' })
      .click();
    await page.getByRole('menuitem', { name: example }).click();
  }

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test.afterEach(async ({ page }) => {
    await expect(
      page.getByText('Something went wrong rendering the API documentation.'),
    ).toHaveCount(0);
  });

  test('copies the page for LLMs', async ({ page }) => {
    await openTranslated(page, GET_PET_PATH);
    const copyButton = apiDocs
      .section(GET_PET_PATH)
      .getSection()
      .getByRole('button', { name: 'Copy', exact: true })
      .first();

    await copyButton.click();

    await expect(copyButton).toBeVisible();
  });

  test('switches the response code', async ({ page }) => {
    await openTranslated(page, GET_PET_PATH);
    const section = apiDocs.section(GET_PET_PATH).getSection();

    await section.getByRole('tab', { name: '404' }).click();

    await expect(section.getByText('No pet matches this identifier.')).toBeVisible();
  });

  test('expands and folds the JSON sample', async ({ page }) => {
    await openTranslated(page, GET_PET_PATH);
    const section = apiDocs.section(GET_PET_PATH);
    const sample = section.getResponseSample();

    await section
      .getSection()
      .locator('.panel-response-samples [data-testid="expand-all"]')
      .click();
    await expect(sample).toContainText('75001');

    await sample.getByRole('button', { name: 'collapse' }).first().click();
    await expect(sample).not.toContainText('"good"');
  });

  test('switches the schema variant', async ({ page }) => {
    await openTranslated(page, CREATE_PET_PATH);
    const section = apiDocs.section(CREATE_PET_PATH).getSection();

    await section.getByRole('tab', { name: 'Dog' }).first().click();

    await expect(section.getByText('Dog name.')).toBeVisible();
  });

  test('switches the request example', async ({ page }) => {
    await openTranslated(page, CREATE_PET_PATH);

    await selectExample(page, '.panel-request-samples', 'A dog');

    await expect(page.getByText('Plain dog example.')).toBeVisible();
  });

  test('switches the response example', async ({ page }) => {
    await openTranslated(page, CREATE_PET_PATH);

    await selectExample(page, '.panel-response-samples', 'A dog');

    await expect(page.getByText('Returns a dog.')).toBeVisible();
  });

  test('switches the callback example', async ({ page }) => {
    await openTranslated(page, CREATE_PET_PATH);
    const section = apiDocs.section(CREATE_PET_PATH).getSection();
    await section.getByRole('button', { name: 'Pet created callback' }).click();
    await translatePage(page);

    await selectExample(page, '.panel-callback-samples', 'Second event');

    await expect(page.getByText('Second event.')).toBeVisible();
  });

  test('switches the AsyncAPI message', async ({ page }) => {
    await openTranslated(page, MESSAGE_OPERATION_PATH);

    await page.getByRole('tab', { name: 'Pet deleted' }).first().click();

    await expect(page.getByText('Sent when a pet is deleted.')).toBeVisible();
    await expect(page.getByText('Matches the request.')).toBeVisible();
  });
});
