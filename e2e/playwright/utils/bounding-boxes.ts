import type { Locator, Page } from '@playwright/test';

// Measure all boxes in one frame: panels stream in above a section and the
// deep-link auto-scroll shifts content between separate boundingBox() calls,
// which skews positions measured one after another. Reading every rect inside a
// single page.evaluate captures them at one scroll offset, so their relative
// order is stable regardless of settle/scroll timing.
export async function boundingBoxesInOneFrame(page: Page, locators: Locator[]) {
  const handles = [];
  for (const locator of locators) {
    const handle = await locator.elementHandle();
    if (!handle) throw new Error('Expected element to be attached');
    handles.push(handle);
  }
  return page.evaluate(
    (els) =>
      els.map((el) => {
        const { y, height } = el.getBoundingClientRect();
        return { y, height };
      }),
    handles,
  );
}
