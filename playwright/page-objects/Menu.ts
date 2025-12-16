import { type Page, expect } from '@playwright/test';

import { clickThroughMenu } from './click-through-menu.js';

export default class Menu {
  readonly page: Page;

  constructor(page) {
    this.page = page;
  }

  async verifyAllMenuItemsHaveHref() {
    const menuItems = this.page.locator('[data-component-name="Menu/MenuItem"] > a');
    const count = await menuItems.count();
    for (let i = 0; i < count; i++) {
      const item = menuItems.nth(i);
      await expect(item).toHaveAttribute('href', /.+/);
    }
    return menuItems;
  }

  clickThroughMenu(...paths: string[]) {
    return clickThroughMenu(this.page, ...paths);
  }
}
