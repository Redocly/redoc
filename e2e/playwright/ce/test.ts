import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/otel.cloud.redocly.com/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    await use(page);
  },
});
