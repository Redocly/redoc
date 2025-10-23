import { type Page, expect } from '@playwright/test';

export default class Section {
  readonly page: Page;
  readonly sectionId: string;

  constructor(page, sectionId: string = 'pet/addpet') {
    this.page = page;
    this.sectionId = sectionId;
  }

  getSection() {
    return this.page.locator(`[data-section-id="${this.sectionId}"]`);
  }

  getOperationNavigationList() {
    return this.getSection().locator('[data-testid="operation-navigation-list"]');
  }

  getRequest() {
    return this.getSection().getByText('Request');
  }

  getCookies() {
    return this.getSection().getByText('Cookies');
  }

  getHeaders() {
    return this.getSection().getByText('Headers');
  }

  getBody() {
    return this.getSection().getByText('Body');
  }

  getResponses() {
    return this.getSection().getByText('Responses');
  }

  getSamples() {
    return this.page.locator('div.panel-container-request-samples');
  }

  getSamplesHeader() {
    return this.getSamples().locator('[data-component-name="Panel/PanelHeader"]');
  }

  async verifyAllSchemaLinksHaveHref() {
    const schemaLinks = await this.getSection().locator('a .schema-name').count();
    for (let i = 0; i < schemaLinks; i++) {
      await expect(
        this.getSection().locator('a .schema-name').nth(i).locator('..'),
      ).toHaveAttribute('href', /.*/);
    }
  }

  async verifyHeaderDeepLink(headerId: string) {
    await expect(this.page.locator(`[id="${headerId}"] a`)).toHaveAttribute(
      'href',
      new RegExp(`.*#${headerId.replace(/\//g, '\\/')}`),
    );
  }
}
