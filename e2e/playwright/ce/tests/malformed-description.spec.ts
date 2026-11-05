import { expect, test } from '../test.js';

import { StandalonePage } from '../page-objects/StandalonePage.js';

test('renders a malformed description, skipping and reporting invalid code samples', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const apiDocs = new StandalonePage(page);
  await apiDocs.goto('/pages/init-imperative.html?case=malformed');

  await expect(apiDocs.alert).toHaveCount(0);
  expect(
    errors.some((text) => text.includes('[api-docs] Skipped invalid x-codeSamples entries')),
  ).toBe(true);

  await apiDocs.clickThroughMenu('pets', 'Numeric operationId');
  const numeric = apiDocs.section('/pets/12345');
  await expect(numeric).toBeVisible();
  await expect(numeric).toContainText('name');

  await apiDocs.clickThroughMenu('pets', 'Broken code samples');
  await expect(apiDocs.section('/pets/getpet')).toBeVisible();
  await expect(apiDocs.section('/pets/getpet')).toContainText('200');
  await expect(apiDocs.alert).toHaveCount(0);
});
