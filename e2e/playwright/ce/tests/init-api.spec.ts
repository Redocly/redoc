import { expect, test } from '../test.js';

import { StandalonePage, readWindowState } from '../page-objects/StandalonePage.js';

const initUrl = (caseName: string) => `/pages/init-imperative.html?case=${caseName}`;

test('delivers analytics events to the host callbacks', async ({ page }) => {
  const apiDocs = new StandalonePage(page);
  await apiDocs.goto(initUrl('events'));
  await apiDocs.clickThroughMenu('beans', 'Create a bean');

  await apiDocs.openLanguageOptions();
  await apiDocs.languageOption('Python').click();

  await expect
    .poll(async () => (await readWindowState(page)).events?.length ?? 0)
    .toBeGreaterThan(0);

  const { events } = await readWindowState(page);
  expect(events?.[0]).toMatchObject({
    eventType: 'CodeSampleLanguageSwitched',
    action: 'LanguageSwitched',
    resource: 'Redocly_CodeSample',
    lang: 'Python',
    label: 'Python',
    operationId: 'POST:/beans',
    operationPath: '/beans',
    operationHttpVerb: 'POST',
  });
});

test('surfaces an unparseable definition as an alert instead of a blank page', async ({ page }) => {
  const apiDocs = new StandalonePage(page);
  await apiDocs.gotoExpectingFailure(initUrl('bad-definition'));

  await expect(apiDocs.alert).toContainText('Failed to load API definition');
  await expect(apiDocs.sidebar).toHaveCount(0);
});
