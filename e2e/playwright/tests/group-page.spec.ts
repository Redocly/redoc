import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('Group page', () => {
  test('"+ Show" expands the collapsed group in place without scrolling it to the top', async ({
    page,
  }) => {
    const apiDocs = new ApiDocsPage(page);
    await goto(page, '/cafe');

    const group = apiDocs.section('/cafe/menu').getSection();
    const showButton = group.getByRole('button', { name: '+ Show' });
    const heading = group.getByRole('heading', { name: /menu$/, level: 2 }).first();
    const headingTop = async () => (await heading.boundingBox())?.y ?? Number.NaN;

    await group.scrollIntoViewIfNeeded();
    await expect(showButton).toBeVisible();
    await group.evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 250),
    );
    await expect(showButton).toBeInViewport();

    const headingTopBefore = await headingTop();
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(headingTopBefore).toBeGreaterThan(200);

    await showButton.click();

    await expect(page).toHaveURL(/\/cafe\/menu$/);
    await expect(showButton).toHaveCount(0);
    await expect(group.locator('[data-testid="show-more-operations"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(Math.abs((await headingTop()) - headingTopBefore)).toBeLessThanOrEqual(2);
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - scrollYBefore),
    ).toBeLessThanOrEqual(2);
  });
});
