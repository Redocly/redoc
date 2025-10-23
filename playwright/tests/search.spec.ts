import { test } from '@playwright/test';

import Search from '../page-objects/Search';

test.describe('Search', () => {
  let search: Search;

  test.beforeEach(async ({ page }) => {
    search = new Search(page);
    await page.goto('/index.html');
    await page.waitForSelector('.api-content', { state: 'visible' });
  });

  test('search field is visible', async () => {
    await search.verifySearchTriggerVisible();
  });

  test('search dialog opens on search field click', async () => {
    await search.clickSearchTrigger();
    await search.verifySearchDialogVisible();
    await search.verifySearchInputFocused();
  });

  test('search dialog opens on hotkeys combination', async () => {
    // Test both Mac (Cmd+K) and PC (Ctrl+K) shortcuts
    const isMac = process.platform === 'darwin';

    await search.openSearchDialogWithKeyboard(isMac);
    await search.verifySearchDialogVisible();
    await search.verifySearchInputFocused();

    // Close and test the other key combination as well
    await search.closeSearchDialog();
    await search.openSearchDialogWithKeyboard(!isMac);
    await search.verifySearchDialogVisible();
  });

  test('when search in search dialog "pet" query we have some results', async () => {
    await search.openSearchDialog();
    await search.searchFor('pet');
    await search.verifySearchResultsVisible();
  });

  test('when search in search dialog "foo bar baz" query we don\'t have results', async () => {
    await search.openSearchDialog();
    await search.searchFor('foo bar baz');
    await search.verifyNoResults();
  });

  test('search dialog can be closed with escape key', async () => {
    await search.openSearchDialog();
    await search.closeSearchDialog();
    await search.verifySearchDialogNotVisible();
  });

  test('search dialog can be closed with cancel button on mobile', async () => {
    await search.openSearchDialog();
    // Only test cancel button if it's visible (mobile view)
    const cancelButton = search.getSearchDialogCancelButton();
    if (await cancelButton.isVisible()) {
      await search.closeSearchDialogWithCancel();
      await search.verifySearchDialogNotVisible();
    } else {
      // Fallback to escape key if cancel button is not visible
      await search.closeSearchDialog();
      await search.verifySearchDialogNotVisible();
    }
  });

  test('search shows placeholder message when empty', async () => {
    await search.openSearchDialog();
    await search.verifyPlaceholderMessage();
  });
});
