import { expect, type Page } from '@playwright/test';

const EXPAND_SETTLE_CAP_MS = 3000;
const STEP_TIMEOUT_MS = 5000;
const PATH_TIMEOUT_MS = 20_000;

export async function clickThroughMenu(page: Page, ...paths: string[]): Promise<void> {
  // the sidebar re-syncs expansion to the active item (useMenuItemExpanded), so scroll-spy can
  // collapse a group we just opened and detach the child mid-click — retry the whole path,
  // a single step cannot reopen its parent
  await expect(async () => {
    for (const [index, path] of paths.entries()) {
      const element = page
        .locator('[data-component-name="Menu/MenuItem"] [data-testid="menu-item-label"]')
        .filter({ has: page.getByText(path, { exact: true }) })
        .first();
      await expect(element).toBeVisible({ timeout: STEP_TIMEOUT_MS });

      // clicking an expanded group collapses it and its children become unclickable
      const isExpandedGroup = await element
        .locator('[data-component-name="icons/ChevronDownIcon/ChevronDownIcon"]')
        .isVisible();
      if (isExpandedGroup && index < paths.length - 1) continue;

      const isClosedGroup = await element
        .locator('[data-component-name="icons/ChevronRightIcon/ChevronRightIcon"]')
        .isVisible();

      if (isClosedGroup) {
        const expandSettled = page
          .evaluate(
            () =>
              new Promise<void>((resolve) => {
                const done = () => {
                  document.body.removeEventListener('menu:expand-end', done);
                  resolve();
                };
                document.body.addEventListener('menu:expand-end', done);
              }),
          )
          .catch(() => {});
        await element.click({ timeout: STEP_TIMEOUT_MS });
        const cap = new Promise<void>((resolve) => setTimeout(resolve, EXPAND_SETTLE_CAP_MS));
        await Promise.race([expandSettled, cap]);
      } else {
        await element.click({ timeout: STEP_TIMEOUT_MS });
      }
    }
  }).toPass({ timeout: PATH_TIMEOUT_MS });
}
