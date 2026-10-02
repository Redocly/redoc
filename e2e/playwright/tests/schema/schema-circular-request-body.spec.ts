import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

const TAG = 'Circular references';

const OPERATIONS = {
  onlyCircular: {
    menuLabel: 'Only circular fields — button hidden',
    sectionId: '/circular/circular-references/paths/~1circular~1only-circular-fields/post',
    bodyId: 'circular-references/paths/~1circular~1only-circular-fields/post/request/body',
  },
  circularPlusNested: {
    menuLabel: 'Circular field + real nested field — button shown',
    sectionId: '/circular/circular-references/paths/~1circular~1circular-plus-nested/post',
    bodyId: 'circular-references/paths/~1circular~1circular-plus-nested/post/request/body',
  },
} as const;

test.describe('Circular request body schemas', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/circular');
    await page.waitForSelector('.ready');
  });

  test('only-circular-fields: self is a flat Recursive row without nested self tree', async () => {
    const { menuLabel, sectionId, bodyId } = OPERATIONS.onlyCircular;

    await apiDocs.clickThroughMenu(TAG, menuLabel);

    const section = apiDocs.section(sectionId).getSection();
    await expect(section).toBeVisible();

    const body = section.locator(`[id="${bodyId}"]`);
    await expect(body).toBeVisible();

    await expect(body.getByText('Recursive')).toBeVisible();
    await expect(body.getByRole('link', { name: 'link to self' })).toHaveCount(1);
    await expect(body.locator('[data-schema-nested-open="true"]')).toHaveCount(0);
  });

  test('circular-plus-nested: Recursive on self, meta stays expandable with createdAt', async ({
    page,
  }) => {
    const { menuLabel, sectionId, bodyId } = OPERATIONS.circularPlusNested;

    await apiDocs.clickThroughMenu(TAG, menuLabel);

    const section = apiDocs.section(sectionId).getSection();
    await expect(section).toBeVisible();

    const body = section.locator(`[id="${bodyId}"]`);
    await expect(body).toBeVisible();

    await expect(body.getByText('Recursive')).toBeVisible();
    await expect(body.getByRole('link', { name: 'link to self' })).toHaveCount(1);
    await expect(body.locator('a[href*="path=self/self"]')).toHaveCount(0);

    await expect(body.getByRole('link', { name: 'link to meta' })).toBeVisible();
    await page.getByRole('button', { name: '+ Show property' }).click();
    await expect(body.getByRole('link', { name: 'link to createdAt' })).toBeVisible();
    await expect(body.locator('[data-schema-nested-open="true"]')).toHaveCount(1);
  });
});
