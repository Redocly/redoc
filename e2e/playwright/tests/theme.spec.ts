import { test, expect } from '@playwright/test';

import type { Page } from '@playwright/test';

import { ApiDocsPage } from '../page-objects/ApiDocsPage';

test.describe('Theme', () => {
  test('colors.primary.main', async ({ page }) => {
    await page.goto('/theme-colors-primary');

    await expect(page.locator('.api-content')).toBeVisible();

    await expect(page.locator('[id="section/introduction"]')).toHaveCSS(
      'color',
      'rgb(255, 102, 102)',
    );
  });

  test('centered middle-panel with max-width', async ({ page }) => {
    await page.goto('/theme-middle-panel');

    await expect(page.locator('[data-testid="middle-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="middle-panel"]')).toHaveCSS('max-width', 'none');

    const width = await page
      .locator('[data-testid="middle-panel"]')
      .evaluate((el) => (el as HTMLElement).offsetWidth);
    expect(width).toBeLessThan(750);
  });

  test('should apply styles to right panel headers', async ({ page }) => {
    await page.goto('/theme#tag/cafe');

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

    const menu = new ApiDocsPage(page);
    await menu.clickThroughMenu('menu', 'Update an existing menu item');

    // Scoped to the samples panel, not an absolute index: header count differs by edition.
    const titleElement = page
      .locator('.panel-response-samples')
      .getByTestId('Panel/PanelHeaderTitle')
      .first();
    await titleElement.evaluate((element) => element.scrollIntoView());
    await expect(titleElement).toHaveCSS('color', 'rgb(255, 102, 102)');
    await expect(titleElement).toHaveCSS('font-size', '16px');
    await expect(titleElement).toHaveCSS('font-weight', '700');
    await expect(titleElement).toHaveCSS('line-height', '22px');
  });

  test.describe('schema nesting level colors', () => {
    async function expandNestedLevels(page: Page, basePath: string) {
      await page.goto(`${basePath}/levels/nestedlevels`);
      const section = page.locator(`[data-section-id="${basePath}/levels/nestedlevels"]`);
      await section.locator('[data-testid="schema-expand-all-button"]').click();

      const exactName = (name: string) =>
        page.locator('.schema-name', { hasText: new RegExp(`^${name}$`) });
      // The fixture nests `field<n>` inside the object property `level<n>`.
      const nestedLevel = (level: number) => ({
        name: section.locator(exactName(`field${level}`)),
        line: section
          .locator('[data-schema-nested-open="true"] > div', { has: exactName(`field${level}`) })
          .last(),
        circle: section
          .locator('.schema-property-item', { has: exactName(`level${level}`) })
          .last()
          .locator('[data-schema-nested-open="true"] > button > span')
          .first(),
      });

      for (let level = 1; level <= 10; level++) {
        const { name } = nestedLevel(level);
        await name.scrollIntoViewIfNeeded();
        await expect(name).toBeVisible();
      }

      return { nestedLevel, topLevelName: section.locator(exactName('field0')) };
    }

    test('colors nested property names with the default palette', async ({ page }) => {
      const { nestedLevel } = await expandNestedLevels(page, '/schema-nested-levels');

      await expect(nestedLevel(1).name).toHaveCSS('color', 'rgb(69, 97, 219)');
      await expect(nestedLevel(1).line).toHaveCSS('border-left-color', 'rgb(69, 97, 219)');
      await expect(nestedLevel(2).name).toHaveCSS('color', 'rgb(37, 88, 184)');
      await expect(nestedLevel(9).name).toHaveCSS('color', 'rgb(91, 76, 204)');
      await expect(nestedLevel(10).name).toHaveCSS('color', 'rgb(69, 97, 219)');
    });

    test('switches the default palette to its dark colors in dark mode', async ({ page }) => {
      const { nestedLevel } = await expandNestedLevels(page, '/schema-nested-levels');
      await page.evaluate(() => document.documentElement.classList.add('dark'));

      await expect(nestedLevel(1).name).toHaveCSS('color', 'rgb(135, 163, 255)');
      await expect(nestedLevel(9).name).toHaveCSS('color', 'rgb(156, 142, 244)');
    });

    test('applies --schema-nested-level-<n>-color to every level it cycles to', async ({
      page,
    }) => {
      const { nestedLevel, topLevelName } = await expandNestedLevels(
        page,
        '/theme-schema-nested-levels',
      );
      const custom = 'rgb(1, 2, 3)';

      for (const level of [1, 10]) {
        await expect(nestedLevel(level).name).toHaveCSS('color', custom);
        await expect(nestedLevel(level).line).toHaveCSS('border-left-color', custom);
        await expect(nestedLevel(level).circle).toHaveCSS('color', custom);
        await expect(nestedLevel(level).circle).toHaveCSS('border-top-color', custom);
      }
      await expect(nestedLevel(2).name).toHaveCSS('color', 'rgb(37, 88, 184)');
      await expect(topLevelName).not.toHaveCSS('color', custom);
    });
  });

  test('should apply proper paddings to markdown htmlWrap', async ({ page }) => {
    await page.goto('/cafe');

    const menu = new ApiDocsPage(page);

    await menu.clickThroughMenu('The Order Model');

    const section = page.locator("[data-section-id='/cafe/cafe_model']");
    await expect(section).toBeVisible();

    const schema = section.locator("[data-testid='schema-definition']");
    await expect(schema).toBeVisible();

    await expect(schema).toHaveCSS('padding-left', '0px');
    await expect(schema).toHaveCSS('padding-right', '0px');
  });
});
