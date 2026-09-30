import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

const EXPAND_SETTLE_CAP_MS = 3000;

export class StandalonePage {
  constructor(private readonly page: Page) {}

  get sidebar(): Locator {
    return this.page.locator('.menu-content');
  }

  get attributionLink(): Locator {
    return this.sidebar.locator('a[href="https://redocly.com/redoc/"]');
  }

  get alert(): Locator {
    return this.page.locator('[role="alert"]');
  }

  /** The panel header also holds the server dropdown; only that one carries the HTTP-verb tag. */
  get languageDropdown(): Locator {
    return this.page
      .locator('[data-testid="dropdown"]')
      .filter({ hasNot: this.page.locator('[data-component-name="Tag/Tag"]') })
      .filter({ hasNot: this.page.locator('button[aria-label="More actions"]') });
  }

  section(sectionId: string): Locator {
    return this.page.locator(`[data-section-id="${sectionId}"]`);
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.sidebar.waitFor({ state: 'visible' });
  }

  async gotoExpectingFailure(url: string): Promise<void> {
    await this.page.goto(url);
    await this.alert.waitFor({ state: 'visible' });
  }

  /** Matches a descendant of the label: the label itself also contains the HTTP verb badge. */
  async clickThroughMenu(...labels: string[]): Promise<void> {
    for (const label of labels) {
      const item = this.page
        .locator(
          `[data-component-name="Menu/MenuItem"] [data-testid="menu-item-label"] :text-is("${label}")`,
        )
        .first();
      await item.waitFor({ state: 'visible' });

      const isCollapsedGroup = await item.evaluate((element) =>
        Boolean(
          element
            .closest('[data-component-name="Menu/MenuItem"]')
            ?.querySelector('[data-component-name="icons/ChevronRightIcon/ChevronRightIcon"]'),
        ),
      );

      if (!isCollapsedGroup) {
        await item.click();
        continue;
      }

      // The app emits `menu:expand-end`, so expanding never needs a sleep.
      const expanded = this.page
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
      await item.click();
      await Promise.race([
        expanded,
        new Promise<void>((resolve) => setTimeout(resolve, EXPAND_SETTLE_CAP_MS)),
      ]);
    }
  }

  async openLanguageOptions(): Promise<string[]> {
    const trigger = this.languageDropdown.first().locator('button').first();
    await trigger.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await trigger.click();
    const items = this.languageOption();
    await expect(items.first()).toBeVisible();
    return (await items.allInnerTexts()).map((text) => text.trim());
  }

  /**
   * The menu renders in a portal on `document.body`. Scoping to `Dropdown/DropdownMenu` also
   * avoids the media-type `<select>`'s native `<option>` elements.
   */
  languageOption(name?: string): Locator {
    const menu = this.page.locator('[data-component-name="Dropdown/DropdownMenu"]');
    return name ? menu.getByRole('menuitem', { name, exact: true }) : menu.getByRole('menuitem');
  }
}

/** The host rewrites the URL to the case's base path before mounting. */
export async function gotoReactCase(page: Page, caseName: string): Promise<StandalonePage> {
  const apiDocs = new StandalonePage(page);
  await apiDocs.goto(`/react/?case=${caseName}`);
  return apiDocs;
}

/** For cases that render no sidebar. */
export async function gotoReactCaseRaw(page: Page, caseName: string): Promise<StandalonePage> {
  await page.goto(`/react/?case=${caseName}`);
  return new StandalonePage(page);
}

export async function readWindowState(page: Page): Promise<{
  initError?: string;
  loaded?: Array<{ ok: boolean; message?: string }>;
  caseError?: string;
  styleTags?: string;
  events?: Array<Record<string, unknown>>;
}> {
  return page.evaluate(() => ({
    initError: window.__initError,
    loaded: window.__loaded,
    caseError: window.__caseError,
    styleTags: window.__styleTags,
    events: window.__events,
  }));
}
