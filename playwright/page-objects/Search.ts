import { type Page, expect } from '@playwright/test';

export default class Search {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Search field/trigger selectors
  getSearchTrigger() {
    return this.page.locator('[data-testid="search-trigger"]');
  }

  // Search dialog selectors
  getSearchDialog() {
    return this.page.locator('[data-testid="search-dialog"]');
  }

  getSearchDialogInput() {
    return this.page.locator('[data-component-name="Search/SearchInput"] > input');
  }

  getSearchResults() {
    return this.page.locator('[data-component-name="Search/SearchItem"]');
  }

  getSearchMessage() {
    return this.page.locator('[data-testid="search-message"]');
  }

  getSearchDialogCancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  // Actions
  async clickSearchTrigger(): Promise<void> {
    await this.getSearchTrigger().click();
  }

  async openSearchDialog(): Promise<void> {
    await this.clickSearchTrigger();
    await expect(this.getSearchDialog()).toBeVisible();
  }

  async openSearchDialogWithKeyboard(isMac: boolean = false): Promise<void> {
    const key = isMac ? 'Meta+K' : 'Control+K';
    await this.page.keyboard.press(key);
    await expect(this.getSearchDialog()).toBeVisible();
  }

  async searchFor(query: string): Promise<void> {
    await this.getSearchDialogInput().fill(query);
    // Wait a bit for search results to load
    await this.page.waitForTimeout(500);
  }

  async closeSearchDialog(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.getSearchDialog()).not.toBeVisible();
  }

  async closeSearchDialogWithCancel(): Promise<void> {
    await this.getSearchDialogCancelButton().click();
    await expect(this.getSearchDialog()).not.toBeVisible();
  }

  // Assertions
  async verifySearchTriggerVisible(): Promise<void> {
    await expect(this.getSearchTrigger()).toBeVisible();
  }

  async verifySearchDialogVisible(): Promise<void> {
    await expect(this.getSearchDialog()).toBeVisible();
    await expect(this.getSearchDialogInput()).toBeVisible();
  }

  async verifySearchDialogNotVisible(): Promise<void> {
    await expect(this.getSearchDialog()).not.toBeVisible();
  }

  async verifySearchResultsVisible(expectedCount?: number): Promise<void> {
    await expect(this.getSearchResults().first()).toBeVisible();
    if (expectedCount !== undefined) {
      await expect(this.getSearchResults()).toHaveCount(expectedCount);
    }
  }

  async verifyNoResults(): Promise<void> {
    await expect(this.getSearchMessage()).toContainText('No results');
    await expect(this.getSearchResults()).toHaveCount(0);
  }

  async verifyPlaceholderMessage(): Promise<void> {
    await expect(this.getSearchMessage()).toContainText('Search endpoints, schemas, and more...');
  }

  async verifySearchInputFocused(): Promise<void> {
    await expect(this.getSearchDialogInput()).toBeFocused();
  }
}
