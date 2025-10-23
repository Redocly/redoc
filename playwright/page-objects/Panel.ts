import { type Page } from '@playwright/test';

export default class Panel {
  readonly page: Page;
  readonly samplesSelector: string;

  constructor(page) {
    this.page = page;
    this.samplesSelector = '#pet\\/updatepet [data-testid="example-switch"]';
  }

  getOverview() {
    return this.page.locator('[data-testid="panel-overview"]');
  }

  getDownloadDescription() {
    return this.page.locator('[data-testid="panel-download-openapi-description"]');
  }

  getServers() {
    return this.page.locator('[data-testid="panel-servers"]');
  }

  get samples() {
    return this.page.locator(this.samplesSelector);
  }

  async getLabel(text: string) {
    return this.samples.locator('.dropdown-wrapper > label').getByText(text);
  }
}
