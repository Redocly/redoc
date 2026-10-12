import { expect, test } from '@playwright/test';

import { StandalonePage } from '../page-objects/StandalonePage.js';
import { HEADING, IMAGE, MENU_PATH, docker, loadVariants } from './variants.js';

for (const variant of loadVariants()) {
  test(`[${variant.name}] renders and keeps deep links`, async ({ page, context }) => {
    const errors: string[] = [];
    const watch = (target: typeof page): string[] => {
      const requests: string[] = [];
      target.on('pageerror', (error) => errors.push(error.message));
      target.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      target.on('request', (request) => requests.push(new URL(request.url()).pathname));
      return requests;
    };
    const requests = watch(page);

    const startUrl = `${variant.baseURL}${variant.startPath}`;
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(startUrl);
    await expect(page).toHaveTitle(variant.title);

    await apiDocs.clickThroughMenu(...MENU_PATH);
    await expect(page.getByRole('heading', { name: HEADING }).first()).toBeVisible();
    await expect(page, 'navigating updates the deep link').not.toHaveURL(startUrl);

    const freshTab = await context.newPage();
    const freshRequests = watch(freshTab);
    await freshTab.goto(page.url());
    await expect(freshTab.getByRole('heading', { name: HEADING }).first()).toBeInViewport();
    await freshTab.close();

    // an HTML fallback for a wrong spec path can still render a heading; check the request itself
    expect(requests, 'the start page requests the spec').toContain(variant.specPath);
    expect(freshRequests, 'a reloaded deep link requests the spec').toContain(variant.specPath);

    expect(errors).toEqual([]);
    expect(
      requests.some((path) => path.startsWith(`${variant.assetPrefix}redoc.standalone.`)),
      `the bundle loads from ${variant.assetPrefix}`,
    ).toBe(true);
  });
}

test('the hashed bundle is cached for good, the page is revalidated', async ({ request }) => {
  const [variant] = loadVariants();
  const page = await request.get(`${variant.baseURL}${variant.startPath}`);
  expect(page.headers()['cache-control']).toBe('no-cache');
  const bundle = /src="([^"]*redoc\.standalone\.[0-9a-f]+\.js)"/.exec(await page.text())?.[1];
  expect(bundle).toBeDefined();
  const asset = await request.get(new URL(bundle ?? '', page.url()).href);
  expect(asset.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
});

test.describe('start-up checks', () => {
  for (const [name, env, message] of [
    ['an empty SPEC_URL', ['-e', 'SPEC_URL='], 'SPEC_URL is empty'],
    [
      'a full-URL BASE_PATH',
      ['-e', 'BASE_PATH=https://cdn.example.com/redoc/'],
      'BASE_PATH must be',
    ],
  ] as const) {
    test(`exits on ${name}`, async () => {
      const failure = await docker(['run', '--rm', ...env, IMAGE]).then(
        () => undefined,
        (error: Error) => error.message,
      );
      expect(failure).toContain(message);
    });
  }
});
