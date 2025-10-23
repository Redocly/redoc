import type { Page } from '@playwright/test';

export async function clickThroughMenu(page: Page, ...paths: string[]) {
  for (const path of paths) {
    const selector = `[data-component-name="Menu/MenuItem"] [data-testid="menu-item-label"] :text-is("${path}")`;
    const element = page.locator(selector).first();
    await element.waitFor({ state: 'visible' });
    const elementHandle = await element.elementHandle();

    const isClosedGroup =
      (await elementHandle?.evaluate((el: HTMLElement) => {
        const menuItem = el.closest('[data-component-name="Menu/MenuItem"]');
        const chevronRight = menuItem?.querySelector(
          '[data-component-name="icons/ChevronRightIcon/ChevronRightIcon"]',
        );
        return Boolean(chevronRight);
      })) ?? false;

    if (isClosedGroup) {
      const waitForExpand = page.evaluate(() => {
        return new Promise<void>((resolve) => {
          const expandListener = () => {
            document.body.removeEventListener('menu:expand-end', expandListener);
            resolve();
          };

          document.body.addEventListener('menu:expand-end', expandListener);
        });
      });
      await element.click();
      await waitForExpand;
    } else {
      await element.click();
    }
  }
}
