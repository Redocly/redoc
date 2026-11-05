import { test, expect } from '@playwright/test';

import { goto } from '../helpers/commands';

test.describe('Security details modal', () => {
  test.use({ viewport: { width: 1440, height: 360 } });

  test('fits a short window and keeps the title and close button in view while scrolling', async ({
    page,
  }) => {
    await goto(page, '/cafe/menu/addmenuitem');
    await page.getByText('View security details').first().click();

    const dialog = page.getByRole('dialog', { name: 'Security' });
    await expect(dialog).toBeVisible();

    await dialog.getByText('Flow type').first().hover();
    await page.mouse.wheel(0, 2000);

    await expect(dialog.getByText('Security', { exact: true })).toBeInViewport();
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeInViewport();
    await expect(dialog.getByText('read your menu items').last()).toBeInViewport();
  });

  test('returns focus to the opener after Escape', async ({ page }) => {
    await goto(page, '/cafe/menu/addmenuitem');
    const opener = page
      .locator('[id="menu/addmenuitem"]')
      .getByRole('button', { name: 'View security details' });
    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: 'Security' })).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(opener).toBeFocused();
  });
});
