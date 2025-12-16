import { test, expect } from '@playwright/test';

import Menu from '../page-objects/Menu';

test.describe('Theme', () => {
  test('colors.primary.main', async ({ page }) => {
    await page.goto('/pages/theme-colors-primary.html');

    await expect(page.locator('.api-content')).toBeVisible();
    await expect(page.locator('#section\\/Introduction').first()).toHaveCSS(
      'color',
      'rgb(255, 102, 102)',
    );
  });

  test('centered middle-panel with max-width', async ({ page }) => {
    await page.goto('/pages/theme-middle-panel.html');

    await expect(page.locator('.api-info')).toBeVisible();
    await expect(page.locator('.api-info')).toHaveCSS('max-width', 'none');

    const width = await page.locator('.api-info').evaluate((el) => el.offsetWidth);
    expect(width).toBeLessThan(750);
  });

  test('should apply styles to right panel headers', async ({ page }) => {
    await page.goto('/pages/theme.html');

    await page.waitForSelector('.api-content', { state: 'visible' });

    await page.evaluate(() => {
      const styleEl = document.createElement('style');
      document.head.appendChild(styleEl);
      styleEl.textContent = `
        :root {
        --color-warm-grey-11: red;
        --color-warm-grey-8: blue;
        --color-primary-500: red;
        --color-primary-100: #f66;
        --link-text-color: var(--color-primary-500);
        --link-hover-text-color: var(--color-primary-100);
        --panel-heading-text-color: var(--color-primary-100);
        --panel-samples-heading-text-color: var(--color-primary-100);
        --font-size-base: 16px;
        --panel-samples-heading-font-weight: 700;
        --panel-samples-heading-line-height: 20px;
        --panel-samples-heading-font-family: "Times New Roman";
        }
      `;
    });

    const menu = new Menu(page);
    await menu.clickThroughMenu('pet', 'Update an existing pet');

    const titleElement = await page
      .locator('.panel-response-samples [data-testid="title"]')
      .first();
    await titleElement.evaluate((element) => element.scrollIntoView());
    await expect(titleElement).toHaveCSS('color', 'rgb(255, 102, 102)');
    await expect(titleElement).toHaveCSS('font-size', '16px');
    await expect(titleElement).toHaveCSS('font-weight', '700');
    await expect(titleElement).toHaveCSS('line-height', '22px');
    await expect(titleElement).toHaveCSS('font-family', '"Times New Roman"');
  });
});
