import type { Page } from '@playwright/test';

const waitForScrollIdle = (page: Page) =>
  page.evaluate(
    (capMs: number) =>
      new Promise<void>((resolve) => {
        let last = window.scrollY;
        let stableFrames = 0;
        const deadline = performance.now() + capMs;
        const tick = () => {
          if (performance.now() >= deadline) return resolve();
          const y = window.scrollY;
          if (Math.abs(y - last) < 1) {
            if (++stableFrames >= 3) return resolve();
          } else {
            stableFrames = 0;
          }
          last = y;
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    1500,
  );

const EXPAND_SETTLE_CAP_MS = 3000;

export async function clickThroughMenu(page: Page, ...paths: string[]): Promise<void> {
  for (const path of paths) {
    await waitForScrollIdle(page);
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
      await element.click();
      const cap = new Promise<void>((resolve) => setTimeout(resolve, EXPAND_SETTLE_CAP_MS));
      await Promise.race([expandSettled, cap]);
    } else {
      await element.click();
    }
  }
}
