import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

// `updateMenuItem` (PUT) declares response codes 100/200/400/404/405 with distinct
// descriptions, which lets us assert the active code from rendered content (the
// response tabs expose active state only via styling, not an aria/data attribute).
const ITEM = 'menu/updatemenuitem';

const DESC = {
  '100': 'Test response code to have tab in Code Samples to the left of 200',
  '200': 'successful operation',
  '400': 'Invalid ID supplied',
  '404': 'Menu item not found',
} as const;

test.describe('Deep links openapi — response codes', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test('selects a response code from a deep link', async () => {
    await apiDocs.navigateToResponseCodeDeepLink(ITEM, '404');

    await expect(apiDocs.responseText(ITEM, DESC['404'])).toBeVisible();
    expect(await apiDocs.getCurrentHash()).toBe(`#${ITEM}/responses&c=404`);
  });

  test('a changed deep link overrides the stored selection', async () => {
    await apiDocs.navigateToResponseCodeDeepLink(ITEM, '200');
    await expect(apiDocs.responseText(ITEM, DESC['200'])).toBeVisible();

    await apiDocs.setHash(`${ITEM}/responses&c=404`);
    await expect(apiDocs.responseText(ITEM, DESC['404'])).toBeVisible();
    await expect(apiDocs.responseText(ITEM, DESC['200'])).not.toBeVisible();
  });

  test('clicking a code tab wins over a stale deep link', async () => {
    await apiDocs.navigateToResponseCodeDeepLink(ITEM, '404');
    await expect(apiDocs.responseText(ITEM, DESC['404'])).toBeVisible();

    await apiDocs.selectResponseCode(ITEM, '200');
    await expect(apiDocs.responseText(ITEM, DESC['200'])).toBeVisible();
    await expect(apiDocs.responseText(ITEM, DESC['404'])).not.toBeVisible();
  });

  test('an unknown response code falls back to the first code', async () => {
    await apiDocs.navigateToResponseCodeDeepLink(ITEM, '999');

    await expect(apiDocs.responseText(ITEM, DESC['100'])).toBeVisible();
  });
});

test.describe('Deep links openapi — nested schema', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test('navigates to a nested response schema property', async () => {
    await apiDocs.navigateToResponseSchemaDeepLink(ITEM, '200', '&d=0/category/sub/prop1');

    await expect(apiDocs.responseText(ITEM, 'prop1')).toBeVisible();
    expect(await apiDocs.getCurrentHash()).toBe(
      `#${ITEM}/t=response&c=200&path=&d=0/category/sub/prop1`,
    );
  });

  test('navigates to a nested request schema property', async () => {
    await apiDocs.navigateToRequestSchemaDeepLink(ITEM, '&d=0/category/sub/prop1');

    await expect(apiDocs.responseText(ITEM, 'prop1')).toBeVisible();
    expect(await apiDocs.getCurrentHash()).toBe(
      `#${ITEM}/t=request&ct=application/json&path=&d=0/category/sub/prop1`,
    );
  });
});

test.describe('Deep links openapi — scroll anchoring', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(({ page }) => {
    apiDocs = new ApiDocsPage(page);
  });

  test('scrolls the responses section into view for a sub-param hash', async () => {
    await apiDocs.navigateToResponseCodeDeepLink(ITEM, '404');

    await expect(apiDocs.page.locator(`[id="${ITEM}/responses"]`)).toBeInViewport();
  });
});

const DL = {
  operation: '/description-links/things/listthings',
  pagination: '/description-links/section/pagination',
  getWidget: '/description-links/widgets/getwidget',
} as const;

test.describe('Deep links openapi — in-description link redirects', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await apiDocs.open(DL.operation);
    await expect(apiDocs.sectionById(DL.operation)).toBeVisible();
  });

  test('clicking a `#section/…` link routes to the overview section (no hash flash)', async () => {
    await apiDocs.descriptionLink('Go to pagination').click();

    // Clean route URL, no leftover `#section/pagination`: the click was resolved to the section
    // route up-front instead of flashing through `…/listthings#section/pagination`.
    await expect(apiDocs.page).toHaveURL(/\/description-links\/section\/pagination$/);
    await expect(apiDocs.sectionById(DL.pagination)).toBeInViewport();
    await expect(apiDocs.sectionById(DL.operation)).toHaveCount(0);
  });

  test('clicking a legacy `#operation/…` link routes to that operation', async () => {
    await apiDocs.descriptionLink('Go to Get a widget').click();

    await expect(apiDocs.sectionById(DL.getWidget)).toBeVisible();
    await expect(apiDocs.sectionById(DL.operation)).toHaveCount(0);
    await expect(apiDocs.page).not.toHaveURL(/#operation/);
  });

  test('clicking a legacy `#tag/…` link routes to that tag', async () => {
    await apiDocs.descriptionLink('Go to Widgets').click();

    await expect(apiDocs.sectionById(DL.getWidget)).toBeVisible();
    await expect(apiDocs.sectionById(DL.operation)).toHaveCount(0);
    await expect(apiDocs.page).not.toHaveURL(/#tag/);
  });

  test('clicking a dangling `#section/…` link (no such route) stays on the page', async () => {
    await apiDocs.descriptionLink('Missing section').click();

    await expect(apiDocs.page).toHaveURL(/\/things\/listthings#section\/does-not-exist$/);
    await expect(apiDocs.sectionById(DL.operation)).toBeInViewport();
  });
});

// The same resolution must work on a direct load (pasted link / SSR) where there is no click — the
// browser starts on `…/listthings#section/pagination` and the reactive redirect takes over.
test.describe('Deep links openapi — in-description hash redirect (direct load)', () => {
  test('a directly-loaded operation URL with a `#section/…` hash redirects to the section', async ({
    page,
  }) => {
    const apiDocs = new ApiDocsPage(page);
    await apiDocs.open(`${DL.operation}#section/pagination`);

    await expect(apiDocs.sectionById(DL.pagination)).toBeInViewport();
    await expect(apiDocs.sectionById(DL.operation)).toHaveCount(0);
  });
});
