import { expect, test } from '../test.js';

import { StandalonePage } from '../page-objects/StandalonePage.js';

const CODE_SAMPLES = '/pages/options-attributes.html?spec-url=/fixtures/code-samples.yaml';

test('the sidebar carries the Redocly attribution', async ({ page }) => {
  const apiDocs = new StandalonePage(page);
  await apiDocs.goto('/pages/auto-init.html');

  await expect(apiDocs.attributionLink).toBeVisible();
  await expect(apiDocs.attributionLink).toContainText('API docs by');
  await expect(apiDocs.attributionLink).toHaveAttribute('target', '_blank');
});

test('code blocks render controls but no report button', async ({ page }) => {
  const apiDocs = new StandalonePage(page);
  await apiDocs.goto(CODE_SAMPLES);
  await apiDocs.clickThroughMenu('beans', 'Create a bean');

  const section = apiDocs.section('/beans/createbean');
  const codeBlock = section.locator('[data-component-name="CodeBlock/CodeBlockControls"]');
  await expect(codeBlock.locator('[data-testid="copy-button"]').first()).toBeVisible();
  await expect(section.locator('[data-testid="report-button"]')).toHaveCount(0);
});
