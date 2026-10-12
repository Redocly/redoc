import { expect, test } from '../test.js';

import { StandalonePage } from '../page-objects/StandalonePage.js';

import type { Locator, Page } from '@playwright/test';

const CODE_SAMPLES = '/pages/options-attributes.html?spec-url=/fixtures/code-samples.yaml';

async function openCreateBean(page: Page): Promise<{ apiDocs: StandalonePage; sample: Locator }> {
  const apiDocs = new StandalonePage(page);
  await apiDocs.goto(CODE_SAMPLES);
  await apiDocs.clickThroughMenu('beans', 'Create a bean');
  const sample = apiDocs
    .section('/beans/createbean')
    .locator('[data-testid="source-code"]')
    .first();
  await expect(sample).toBeVisible();
  return { apiDocs, sample };
}

/** Distinct computed token colors: a highlighted sample paints more than the base text color. */
async function tokenColors(sample: Locator): Promise<string[]> {
  return sample
    .locator('.th-token')
    .evaluateAll((spans) => [...new Set(spans.map((span) => getComputedStyle(span).color))]);
}

test('colors the curl sample as shell', async ({ page }) => {
  const { sample } = await openCreateBean(page);

  await expect(sample.locator('code.th-code--shell')).toBeVisible();
  await expect(sample.locator('.token')).toHaveCount(0);
  expect((await tokenColors(sample)).length).toBeGreaterThanOrEqual(2);
});

test('colors the sample in the switched language', async ({ page }) => {
  const { apiDocs, sample } = await openCreateBean(page);

  await apiDocs.openLanguageOptions();
  await apiDocs.languageOption('Python').click();

  await expect(sample.locator('code.th-code--python')).toBeVisible();
  await expect(sample.locator('.th-keyword').first()).toContainText('import');
  expect((await tokenColors(sample)).length).toBeGreaterThanOrEqual(2);
});

test('keeps the sample colored in dark mode', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('redoc.colorMode', 'dark'));
  const { sample } = await openCreateBean(page);

  await expect(page.locator('html')).toHaveClass(/dark/);
  expect((await tokenColors(sample)).length).toBeGreaterThanOrEqual(2);
});
