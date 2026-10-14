import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route('**/otel.cloud.redocly.com/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    await use(context);
  },
});
