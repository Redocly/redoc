import { type Page, type Locator, expect } from '@playwright/test';

import { goto } from '../helpers/commands';
import { clickThroughMenu } from '../utils/click-through-menu.js';

export class ApiDocsSection {
  readonly page: Page;
  readonly sectionId: string;

  constructor(page: Page, sectionId: string) {
    this.page = page;
    this.sectionId = sectionId;
  }

  getSection() {
    return this.page.locator(`[data-section-id="${this.sectionId}"]`);
  }

  getRequest() {
    return this.getSection().getByText('Request');
  }

  getSamples() {
    return this.page.locator('div.panel-request-samples');
  }

  getSamplesHeader() {
    return this.getSamples().locator('[data-component-name="Panel/PanelHeader"]');
  }

  getResponseSample() {
    return this.getSection()
      .locator('.panel-response-samples')
      .locator('[data-testid="source-code"]');
  }

  async verifyAllSchemaLinksHaveHref() {
    const schemaLinks = this.getSection().locator('a .deep-link-anchor');
    const schemaLinksCount = await schemaLinks.count();
    for (let i = 0; i < schemaLinksCount; i++) {
      await expect(schemaLinks.nth(i).locator('..')).toHaveAttribute('href', /.*/);
    }
  }

  async verifyHeaderDeepLink(headerId: string) {
    const headerDeepLink = this.page.locator(`[id="${headerId}"] .deep-link-anchor > a`);
    await expect(headerDeepLink).toHaveAttribute('href', this.sectionId);
  }
}

export class ApiDocsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Section factory ---

  section(sectionId: string) {
    return new ApiDocsSection(this.page, sectionId);
  }

  // --- Menu ---

  clickThroughMenu(...paths: string[]) {
    return clickThroughMenu(this.page, ...paths);
  }

  // --- Panel (openapi) ---

  getOverview() {
    return this.page.locator('[data-testid="panel-overview"]');
  }

  getDownloadDescription(testId: string) {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  getLanguages() {
    return this.page.locator('[data-testid="panel-languages"]');
  }

  getServers() {
    return this.page.locator('[data-testid="panel-servers"]');
  }

  // --- Actions (openapi) ---

  async verifyPageActionsCopyButtonVisible(): Promise<void> {
    const copyButton = this.page.getByRole('button', { name: 'Copy' }).first();
    await expect(copyButton).toBeVisible();
  }

  async verifyPageActionsCopyButtonClickable(): Promise<void> {
    const copyButton = this.page.getByRole('button', { name: 'Copy' }).first();
    await expect(copyButton).toBeEnabled();
  }

  // --- LeftPanel (graphql) ---

  async getMainLeftMenu() {
    return this.page.locator('[data-component-name="Menu/Menu"]');
  }

  // --- MiddlePanel (graphql) ---

  async getContent() {
    return this.page.locator('#api-content');
  }

  // --- AsyncApi navigation ---

  async waitForPageLoad() {
    await this.page.waitForSelector('.api-content');
  }

  getApiTitleHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  // --- Deep links (asyncapi) ---

  async navigateToChannelDeepLink(sectionName: string, channelName: string) {
    await goto(this.page, `/asyncapi/${sectionName}/topics/${channelName}`);
  }

  async navigateToMessageDeepLink(channelLink: string, messageName: string) {
    await goto(this.page, `/asyncapi/${channelLink}#${channelLink}/messages&m=${messageName}`);
  }

  async navigateToSchemaDeepLink(channelLink: string, messageName: string, schemaName: string) {
    await goto(
      this.page,
      `/asyncapi/${channelLink}#${channelLink}/messages&m=${messageName}&t=payload&path=${schemaName}`,
    );
  }

  async navigateToMessageExample(channelLink: string, messageName: string, exampleName: string) {
    await goto(
      this.page,
      `/asyncapi/${channelLink}#${channelLink}/messages&m=${messageName}&example=${exampleName}`,
    );
  }

  async navigateToMessageHeaders(channelLink: string, messageName: string) {
    await goto(
      this.page,
      `/asyncapi/${channelLink}#${channelLink}/messages&m=${messageName}&t=headers`,
    );
  }

  async getCurrentHash() {
    return this.page.evaluate(() => window.location.hash);
  }

  async getLinkHref(headerText: string) {
    return this.page.locator(`a[aria-label="link to ${headerText}"]`).first().getAttribute('href');
  }

  async isChannelVisible(channelName: string) {
    const element = this.page.locator(`[data-section-id] h2:has-text("${channelName}")`);
    return await element.isVisible();
  }

  async isMessageVisible(sectionId: string, messageName: string) {
    const element = this.page
      .locator(`[data-section-id="${sectionId}"] button:has-text("${messageName}")`)
      .first();
    return await element.isVisible();
  }

  async isSchemaVisible(schemaName: string) {
    const element = this.page.locator(`span:has-text("${schemaName}")`).first();
    return await element.isVisible();
  }

  async waitForChannelLoad(channelName: string) {
    await this.page.waitForSelector(`[data-section-id] h2:has-text("${channelName}")`, {
      state: 'visible',
    });
  }

  async waitForMessageLoad(sectionId: string, messageName: string) {
    await this.page.waitForSelector(
      `[data-section-id="${sectionId}"] button:has-text("${messageName}")`,
      { state: 'visible' },
    );
  }

  async waitForSchemaLoad(schemaName: string) {
    const element = this.page.locator(`span:has-text("${schemaName}")`).first();
    await element.waitFor({ state: 'visible' });
  }

  async refreshPage() {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  private readonly openApiBasePath = '/openapi';

  openApiSection(itemPath: string): Locator {
    return this.page.locator(`[data-section-id="${this.openApiBasePath}/${itemPath}"]`);
  }

  async navigateToResponseCodeDeepLink(itemPath: string, code: string): Promise<void> {
    await goto(this.page, `${this.openApiBasePath}/${itemPath}#${itemPath}/responses&c=${code}`);
  }

  async navigateToResponseSchemaDeepLink(
    itemPath: string,
    code: string,
    path: string,
  ): Promise<void> {
    await goto(
      this.page,
      `${this.openApiBasePath}/${itemPath}#${itemPath}/t=response&c=${code}&path=${path}`,
    );
  }

  async navigateToRequestSchemaDeepLink(
    itemPath: string,
    path: string,
    ct = 'application/json',
  ): Promise<void> {
    const ctPart = ct ? `&ct=${ct}` : '';
    await goto(
      this.page,
      `${this.openApiBasePath}/${itemPath}#${itemPath}/t=request${ctPart}&path=${path}`,
    );
  }

  async open(url: string): Promise<void> {
    await goto(this.page, url);
  }

  descriptionLink(name: string): Locator {
    return this.page.getByRole('link', { name });
  }

  sectionById(routeSlug: string): Locator {
    return this.page.locator(`[data-section-id="${routeSlug}"]`);
  }

  responseCodeTab(itemPath: string, code: string): Locator {
    return this.openApiSection(itemPath)
      .locator('[data-response-codes-tablist] button')
      .filter({ hasText: new RegExp(`^${code}$`) })
      .first();
  }

  async selectResponseCode(itemPath: string, code: string): Promise<void> {
    await this.responseCodeTab(itemPath, code).click();
  }

  responseText(itemPath: string, text: string): Locator {
    return this.openApiSection(itemPath).getByText(text).first();
  }

  async setHash(hash: string): Promise<void> {
    await this.page.evaluate((value) => {
      window.location.hash = value;
    }, hash);
  }

  async navigateToOperation(chanel: string, operationName: string) {
    return goto(this.page, `/asyncapi/${chanel}/operations/${operationName}`);
  }

  getOperationSection(sectionId: string) {
    return this.page.locator(`[data-section-id="${sectionId}"]`);
  }

  getTopicsNavigationList() {
    return this.page.locator('#api-content [data-testid="items-navigation-list"]');
  }

  async scrollUntilHeadingVisible(
    headingName: string | RegExp,
    options?: { maxSteps?: number; stepPx?: number; direction?: 'up' | 'down' },
  ): Promise<void> {
    const maxSteps = options?.maxSteps ?? 40;
    const stepPx = options?.stepPx ?? 500;
    const direction = options?.direction ?? 'down';
    const delta = direction === 'up' ? -stepPx : stepPx;
    const heading = this.page.getByRole('heading', { name: headingName }).first();

    for (let step = 0; step < maxSteps; step++) {
      if (await heading.isVisible()) {
        return;
      }
      await this.page.mouse.wheel(0, delta);
      await this.page.waitForTimeout(100);
    }

    await expect(heading).toBeVisible({ timeout: 5000 });
  }

  async expectOperationSectionAbsent(sectionId: string): Promise<void> {
    await expect(this.getOperationSection(sectionId)).toHaveCount(0);
  }

  async expectOperationSectionNotInViewport(sectionId: string): Promise<void> {
    const section = this.getOperationSection(sectionId);
    if ((await section.count()) === 0) {
      return;
    }
    await expect(section).not.toBeInViewport();
  }

  /**
   * Wait until the page has stopped scrolling (lazy mounts and wheel momentum
   * settled). Click deep links only from an idle page — a click mid-scroll can
   * be overwritten by scroll-spy's URL sync before the navigation applies.
   */
  async waitForScrollIdle(): Promise<void> {
    await this.page.evaluate(
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
  }

  async expectOperationSectionMountable(
    sectionId: string,
    operationTitle: string,
    options?: { direction?: 'up' | 'down' },
  ): Promise<void> {
    await this.scrollUntilHeadingVisible(operationTitle, {
      direction: options?.direction ?? 'up',
      maxSteps: 50,
    });
    await expect(this.getOperationSection(sectionId)).toBeVisible();
    await expect(
      this.getOperationSection(sectionId).getByRole('heading', { name: operationTitle }),
    ).toBeVisible();
  }

  // --- Message section (asyncapi) ---

  messagesBlock(channelMessagesSectionId: string): Locator {
    return this.page.locator(`[data-section-id*="${channelMessagesSectionId}"]`).first();
  }

  messageTab(channelMessagesSectionId: string, label: string): Locator {
    return this.messageSwitcher(channelMessagesSectionId).getByRole('tab', {
      name: label,
      exact: true,
    });
  }

  messageExamplePanel(channelSectionId: string): Locator {
    return this.sectionById(channelSectionId).locator('.panel-response-samples');
  }

  messageSwitcher(channelMessagesSectionId: string): Locator {
    return this.page
      .locator(
        `[data-section-id*="${channelMessagesSectionId}"] [data-component-name="Segmented/Segmented"]`,
      )
      .first();
  }

  /**
   * Top of the message switcher once a message deep-link click has settled.
   * After the click the switcher briefly keeps the previous message's element
   * id, so the first scroll lands on the section fallback and re-pins a frame
   * later — wait for the switcher to re-render with the clicked message's id
   * and for its position to be stable before sampling. (The URL is no settle
   * signal: scroll-spy silently rewrites the hash while the page settles.)
   */
  async settledMessageSwitcherTop(
    channelMessagesSectionId: string,
    messageKey: string,
  ): Promise<number> {
    await this.page
      .locator(`[id$="${channelMessagesSectionId}&m=${messageKey}"]`)
      .first()
      .waitFor({ state: 'attached' });

    const switcher = this.messageSwitcher(channelMessagesSectionId);
    await expect(switcher).toBeVisible();

    let previousTop = Number.NaN;
    await expect(async () => {
      const top = (await switcher.boundingBox())?.y ?? Number.NaN;
      const settled = Math.abs(top - previousTop) < 1;
      previousTop = top;
      expect(settled).toBe(true);
    }).toPass({ timeout: 5000 });

    return previousTop;
  }

  // --- Binding panels (asyncapi) ---

  /**
   * Right-panel binding panel ("Topic configuration", "Operation configuration",
   * "Message configuration") scoped to the item section that owns it — the page
   * renders one panel per visible channel/operation, so the section id is required.
   */
  bindingPanel(sectionId: string, headerText: string): Locator {
    return this.sectionById(sectionId)
      .locator('.panel-api-docs')
      .filter({
        has: this.page.getByTestId('Panel/PanelHeader').getByText(headerText, { exact: true }),
      })
      .first();
  }

  /** Value cell next to a row label inside a binding panel (Row = Label + ValueCell). */
  bindingRowValue(panel: Locator, label: string): Locator {
    return panel.locator(
      `xpath=.//span[normalize-space(.)=${JSON.stringify(label)}]/following-sibling::*[1]`,
    );
  }

  // --- Broker server modal (asyncapi) ---

  brokerRow(brokerName: string): Locator {
    return this.page.getByTestId('BrokerPanel/BrokerItem').filter({ hasText: brokerName });
  }

  getBrokerModal(): Locator {
    return this.page.getByTestId('BrokerModal/BrokerModal');
  }

  async openBrokerModal(brokerName: string): Promise<void> {
    await this.brokerRow(brokerName).getByText('More details', { exact: true }).click();
    await expect(this.getBrokerModal()).toBeVisible();
  }

  brokerModalTab(name: 'Overview' | 'Configuration'): Locator {
    return this.getBrokerModal().getByRole('tab', { name });
  }

  getBrokerOverviewSection(): Locator {
    return this.page.getByTestId('BrokerOverviewSection/BrokerOverviewSection');
  }

  getBrokerBindingsSection(): Locator {
    return this.page.getByTestId('BrokerBindingsSection/BrokerBindingsSection');
  }

  async closeBrokerModal(): Promise<void> {
    await this.getBrokerModal().locator('[data-testid="close"]').click();
  }
}
