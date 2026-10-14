import { type Page } from '@playwright/test';

export const goto = async (page: Page, url: string) => {
  await page.goto(url);
  await page.waitForSelector('.ready');
};
