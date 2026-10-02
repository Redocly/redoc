import { expect, test } from '../test.js';

import { StandalonePage } from '../page-objects/StandalonePage.js';

/**
 * Deep links against the drop-in page: hash router, no `basePath` — the configuration the
 * published bundle ships with, and the one the `source` project cannot reach (it serves every
 * fixture from a path router under its own base path).
 */
const DROP_IN = '/pages/auto-init.html';
const LIST_ORDERS = 'orders/listorders';
const UPDATE_ORDER = 'orders/updateorder';

/** A hash router holds the route in the fragment, so a deep link carries two `#`. */
function deepLink(itemId: string, suffix: string): string {
  return `${DROP_IN}#/${itemId}#${itemId}/${suffix}`;
}

function field(itemId: string, suffix: string): string {
  return `[id="${itemId}/${suffix}"]`;
}

test('opens a response other than the first one', async ({ page }) => {
  const apiDocs = new StandalonePage(page);
  const target = 't=response&c=403&path=type';

  await apiDocs.goto(deepLink(UPDATE_ORDER, target));

  await expect(page.locator(field(UPDATE_ORDER, target))).toBeInViewport();
});

test('expands array items to reach a nested field', async ({ page }) => {
  const apiDocs = new StandalonePage(page);
  const target = 't=response&c=200&path=items[]/customername';

  await apiDocs.goto(deepLink(LIST_ORDERS, target));

  await expect(page.locator(field(LIST_ORDERS, target))).toBeInViewport();
});

test('the URL an anchor click puts in the address bar opens the same field', async ({
  page,
  context,
}) => {
  const apiDocs = new StandalonePage(page);
  const target = 't=request&in=query&path=filter';
  await apiDocs.goto(`${DROP_IN}#/${LIST_ORDERS}`);

  const row = page.locator(field(LIST_ORDERS, target));
  await row.hover();
  await row.locator('[data-deep-link-anchor] a').click();
  await expect.poll(() => page.url()).toContain(`#${LIST_ORDERS}/${target}`);

  const recipient = await context.newPage();
  await recipient.goto(page.url());
  await expect(recipient.locator(field(LIST_ORDERS, target))).toBeInViewport();
  await recipient.close();
});
