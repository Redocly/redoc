import { test, expect } from '@playwright/test';

import type { Page } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test.describe('Malformed descriptions render without crashing', () => {
  test('openapi: wrong-typed values build, and invalid code samples are skipped and reported', async ({
    page,
  }) => {
    const errors = collectConsoleErrors(page);
    const apiDocs = new ApiDocsPage(page);
    await goto(page, '/malformed');

    await expect(apiDocs.getApiTitleHeading()).toContainText('Malformed OpenAPI');
    await expect(page.getByText('https://{env}.example.com')).toBeVisible();
    await expect(page.getByText(/Show\s+variables?/)).toHaveCount(0);
    await expect(page.locator('[role="alert"]')).toHaveCount(0);
    expect(
      errors.some((text) => text.includes('[api-docs] Skipped invalid x-codeSamples entries')),
    ).toBe(true);
    expect(errors.some((text) => text.includes('Ignored "x-badges"'))).toBe(true);
    expect(
      errors.some((text) => text.includes('[api-docs] Could not bundle the API description')),
    ).toBe(true);

    await apiDocs.clickThroughMenu('pets', 'Numeric operationId');
    const numeric = apiDocs.section('/malformed/pets/12345').getSection();
    await expect(numeric).toBeVisible();
    await expect(numeric).toContainText('id');
    await expect(numeric).toContainText('name');
    await expect(numeric).not.toContainText('Beta');
    await expect(numeric).not.toContainText('Stable');

    await apiDocs.clickThroughMenu('pets', 'Broken code samples');
    const brokenSamples = apiDocs.section('/malformed/pets/getpet').getSection();
    await expect(brokenSamples).toBeVisible();
    await expect(brokenSamples).toContainText('200');
    await expect(page.locator('[role="alert"]')).toHaveCount(0);
  });

  test('asyncapi: the parts that cannot build are dropped and reported', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await goto(page, '/malformed-asyncapi');
    await page.locator('.menu-content a[href$="/queues/user"]').click();

    const channel = page.locator('[data-section-id="/malformed-asyncapi/queues/user"]');
    await expect(channel).toBeVisible();
    await expect(channel).toContainText('users');
    await expect(channel).not.toContainText('Beta');
    expect(errors.some((text) => text.includes('Ignored "x-badges"'))).toBe(true);
    expect(
      errors.some((text) => text.includes('[api-docs] Could not build the "amqp" binding')),
    ).toBe(true);
    expect(errors.some((text) => text.includes('[api-docs] Rendering error'))).toBe(false);
    await expect(page.locator('[role="alert"]')).toHaveCount(0);
  });
});
