import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

const SCHEMAS = '/menu/schemas';
const OPTS = '?schemaDefinitionsTagName=Schemas';

const NEAR_TOP_PX = 200;

async function expectSectionPinnedToTop(apiDocs: ApiDocsPage, routeSlug: string): Promise<void> {
  await apiDocs.waitForScrollIdle();
  const section = apiDocs.sectionById(routeSlug);
  await expect(section).toBeInViewport();
  const box = await section.boundingBox();
  if (!box) throw new Error(`Section ${routeSlug} has no bounding box`);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeLessThan(NEAR_TOP_PX);
}

test.describe('Scroll anchoring — a navigated section lands at the top', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test('direct-loading a schema deep in the list pins it to the top (not mid-page)', async () => {
    await apiDocs.open(`${SCHEMAS}/user${OPTS}`);

    await expectSectionPinnedToTop(apiDocs, `${SCHEMAS}/user`);
  });

  test('clicking a schema-title link scrolls to that schema and pins it to the top', async ({
    page,
  }) => {
    await apiDocs.open(`${SCHEMAS}/cafe${OPTS}`);

    await page.getByRole('link', { name: '(Category)', exact: true }).first().click();
    await expect(page).toHaveURL(/\/menu\/schemas\/category/);

    await expectSectionPinnedToTop(apiDocs, `${SCHEMAS}/category`);
  });

  test('clicking a schema-title link from an operation jumps across tags, pinned to the top', async ({
    page,
  }) => {
    await apiDocs.open(`/menu/cafe/getcafebyid${OPTS}`);

    await page.getByRole('link', { name: '(Category)', exact: true }).first().click();
    await expect(page).toHaveURL(/\/menu\/schemas\/category/);

    await expectSectionPinnedToTop(apiDocs, `${SCHEMAS}/category`);
  });
});

test.describe('Scroll-spy URL sync', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test('leaves a freshly-navigated URL alone until the user scrolls', async ({ page }) => {
    await apiDocs.open(`${SCHEMAS}/user${OPTS}`);
    await apiDocs.waitForScrollIdle();

    await expect(page).toHaveURL(/\/menu\/schemas\/user/);
  });

  test('rewrites the URL to the section the user scrolls to', async ({ page }) => {
    await apiDocs.open(`${SCHEMAS}/apiresponse${OPTS}`);

    await expect
      .poll(async () => {
        const box = await apiDocs.sectionById(`${SCHEMAS}/apiresponse`).boundingBox();
        return box ? box.y >= 0 && box.y < NEAR_TOP_PX : false;
      })
      .toBe(true);
    await apiDocs.waitForScrollIdle();
    await expect(page).toHaveURL(/\/menu\/schemas\/apiresponse/);

    await page.mouse.move(700, 400);
    await page.mouse.wheel(0, 4000);
    await apiDocs.waitForScrollIdle();

    await expect(page).not.toHaveURL(/\/menu\/schemas\/apiresponse/);
    await expect(page).toHaveURL(/\/menu\/schemas\/[a-z]/);
  });

  test('scrolling up into the first section keeps the scroll position (no jump to the top)', async ({
    page,
  }) => {
    await apiDocs.open('/streaming-test-cases/jsonl');
    await expectSectionPinnedToTop(apiDocs, '/streaming-test-cases/jsonl');

    await page.mouse.move(700, 400);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => new URL(page.url()).pathname).toBe('/streaming-test-cases');
    await apiDocs.waitForScrollIdle();

    const scrollYAfterFlip = await page.evaluate(() => window.scrollY);
    expect(scrollYAfterFlip).toBeGreaterThan(0);

    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollYAfterFlip);
  });
});

test.describe('Deep-linking to a specific property (e.g. a search-result click)', () => {
  test('scrolls the targeted property to the top (lands on the field, not the header)', async ({
    page,
  }) => {
    const apiDocs = new ApiDocsPage(page);

    await apiDocs.navigateToResponseSchemaDeepLink(
      'menu/updatemenuitem',
      '200',
      '&d=0/category/sub/prop1',
    );
    await apiDocs.waitForScrollIdle();

    const field = page.locator('[id$="t=response&c=200&path=&d=0/category/sub/prop1"]');
    await expect(field).toBeInViewport();
    const box = await field.boundingBox();
    if (!box) throw new Error('The deep-linked property has no bounding box');
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeLessThan(NEAR_TOP_PX);
  });
});

test.describe('Overview markdoc heading → sidebar item', () => {
  test('clicking the generated sidebar item scrolls to its overview section', async ({ page }) => {
    const apiDocs = new ApiDocsPage(page);
    await apiDocs.open('/description-links');

    await page.getByRole('link', { name: 'Pagination', exact: true }).first().click();
    await expect(page).toHaveURL(/\/description-links\/section\/pagination/);

    await expectSectionPinnedToTop(apiDocs, '/description-links/section/pagination');
  });
});
