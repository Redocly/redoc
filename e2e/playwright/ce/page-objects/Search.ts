import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

export class Search {
  constructor(private readonly page: Page) {}

  get trigger(): Locator {
    return this.page.locator('[data-testid="search-trigger"]');
  }

  get dialog(): Locator {
    return this.page.locator('[data-testid="search-dialog"]');
  }

  /**
   * By component name, not test id: the theme's `SearchInput`/`SearchItem` declare explicit props,
   * so the `data-testid`s set in the source never reach the DOM.
   */
  get input(): Locator {
    return this.dialog.locator('[data-component-name="Search/SearchInput"] input');
  }

  get results(): Locator {
    return this.dialog.locator('[data-component-name="Search/SearchItem"]');
  }

  get message(): Locator {
    return this.page.locator('[data-testid="search-message"]');
  }

  async open(): Promise<void> {
    await this.trigger.click();
    await expect(this.dialog).toBeVisible();
  }

  /** `fill`, not `value`: the dialog is controlled. */
  async searchFor(term: string): Promise<void> {
    await this.input.fill(term);
  }

  async expectHitsFor(term: string): Promise<Locator> {
    await this.open();
    await this.searchFor(term);
    await expect(this.results.first()).toBeVisible();
    return this.results;
  }
}
