import { test, expect, type Page } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';

test.describe('Discriminator', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/discriminator-test');
  });

  test('should render the word "Discriminator" inside class "view-nested-wrapper"', async ({
    page,
  }) => {
    await apiDocs.clickThroughMenu('Create trip with filters');

    const menuSection = apiDocs.section('/discriminator-test/other/createtrip');

    await expect(menuSection.getSection()).toBeVisible();

    await expect(
      page.locator('[data-section-id="switcher"]').filter({ hasText: 'Discriminator' }).first(),
    ).toBeVisible();
  });
});

test.describe('Discriminator sync (allOf-wrapped body)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/cafe/updatecafe?specFileName=discriminator-allof-body.yaml');
  });

  test('schema panel and code-sample dropdown stay in sync', async ({ page }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'cat' });
    await expect(schemaTabs).toBeVisible();

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();

    const variantField = (name: string) =>
      page.locator('span.schema-name', { hasText: new RegExp(`^${name}$`) });

    await expect(codeSampleDropdown).toContainText('cat');
    await expect(variantField('huntingSkill')).toBeVisible();

    await schemaTabs.getByRole('tab', { name: 'dog' }).click();
    await expect(codeSampleDropdown).toContainText('dog');
    await expect(variantField('packSize')).toBeVisible();

    await schemaTabs.getByRole('tab', { name: 'bee' }).click();
    await expect(codeSampleDropdown).toContainText('bee');
    await expect(variantField('honeyPerDay')).toBeVisible();
  });
});

test.describe('Discriminator sync (implicit variants, no mapping)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/pets/updatepet?specFileName=discriminator-allof-body.yaml');
  });

  test('example panel lists variants and follows the schema switcher', async ({ page }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'PetCat' });
    await expect(schemaTabs).toBeVisible();

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();
    await expect(codeSampleDropdown).toContainText('PetCat');

    const requestSample = page
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'petType' })
      .first();
    await expect(requestSample).toContainText('"petType": "PetCat"');
    await expect(requestSample).toContainText('"huntingSkill"');

    await schemaTabs.getByRole('tab', { name: 'PetDog' }).click();

    await expect(codeSampleDropdown).toContainText('PetDog');
    await expect(requestSample).toContainText('"petType": "PetDog"');
    await expect(requestSample).toContainText('"packSize"');
    await expect(requestSample).not.toContainText('"huntingSkill"');
  });
});

test.describe('Discriminator sync (defaultMapping on an allOf-wrapped body)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/documents/updatedocument?specFileName=discriminator-allof-body.yaml');
  });

  test('Default mapping option reaches the example panel and stamps only explicit names', async ({
    page,
  }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'article' });
    await expect(schemaTabs).toBeVisible();
    await expect(schemaTabs).toContainText('Default mapping');

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();

    const requestSample = page
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'docType' })
      .first();
    await expect(requestSample).toContainText('"docType": "article"');
    await expect(requestSample).toContainText('"headline"');

    await schemaTabs.getByRole('tab', { name: /Default mapping/ }).click();

    await expect(codeSampleDropdown).toContainText('Default mapping');
    await expect(requestSample).toContainText('"body"');
    await expect(requestSample).not.toContainText('"headline"');
    // The Default mapping selection has no canonical wire value — no stamp.
    await expect(requestSample).toContainText('"docType": "string"');
  });
});

test.describe('Discriminator sync (oneOf without mapping)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/vehicles/updatevehicle?specFileName=discriminator-allof-body.yaml');
  });

  test('schema switcher drives the request sample', async ({ page }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'Bike' });
    await expect(schemaTabs).toBeVisible();

    const requestSample = page
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'vehicleType' })
      .first();
    await expect(requestSample).toContainText('"gears"');

    await schemaTabs.getByRole('tab', { name: 'Car' }).click();

    await expect(requestSample).toContainText('"doors"');
    await expect(requestSample).not.toContainText('"gears"');
  });
});

test.describe('Discriminator sync (array-item body)', () => {
  let apiDocs: ApiDocsPage;
  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto('/discriminator-test');
  });

  test('schema panel and code-sample dropdown stay in sync', async ({ page }) => {
    await apiDocs.clickThroughMenu('Create trip with filters');

    const schemaSwitcher = page
      .locator('[data-section-id="switcher"]')
      .filter({ hasText: 'Discriminator' })
      .first();
    await expect(schemaSwitcher).toBeVisible();

    const codeSampleDropdown = page
      .locator('div.panel-request-samples')
      .getByLabel('Discriminator');
    await expect(codeSampleDropdown).toBeVisible();
    const schemaSwitcherButton = schemaSwitcher.getByRole('button');

    const variantField = (name: string) =>
      page.locator('span.schema-name', { hasText: new RegExp(`^${name}$`) });
    const selectSchemaOption = async (name: string): Promise<void> => {
      await schemaSwitcherButton.click();
      await page.getByRole('menuitem', { name, exact: true }).click();
    };

    await expect(variantField('from')).toBeVisible();

    await selectSchemaOption('PRICE');
    await expect(codeSampleDropdown).toContainText('PRICE');
    await expect(variantField('maxPrice')).toBeVisible();

    await selectSchemaOption('DURATION');
    await expect(codeSampleDropdown).toContainText('DURATION');
    await expect(variantField('maxHours')).toBeVisible();
  });
});

test.describe('Discriminator whose listed variants inherit it through allOf', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/other/sendnotification?specFileName=discriminator-listed-variants.yaml');
  });

  test('lists every variant and shows the inherited and own fields of the selected one', async ({
    page,
  }) => {
    const schemaSwitcherButton = page
      .locator('[data-section-id="switcher"]')
      .filter({ hasText: 'Discriminator' })
      .first()
      .getByRole('button');
    const variantField = (name: string) =>
      page.locator('span.schema-name', { hasText: new RegExp(`^${name}$`) });

    await expect(schemaSwitcherButton).toHaveText('email');
    await expect(variantField('type')).toBeVisible();
    await expect(variantField('country')).toBeVisible();

    await schemaSwitcherButton.click();
    await expect(page.getByRole('menu').getByRole('menuitem').filter({ hasText: /\S/ })).toHaveText(
      [
        'email',
        'sms',
        'mms',
        'push',
        'voice',
        'fax',
        'webhook',
        'pager',
        'letter',
        'kiosk',
        'inbox',
        'rss',
        'chat',
        'banner',
        'radio',
        'tv',
        'feed',
        'postcard',
        'signage',
      ],
    );
    await page.getByRole('menuitem', { name: 'chat', exact: true }).click();

    await expect(schemaSwitcherButton).toHaveText('chat');
    await expect(variantField('type')).toBeVisible();
    await expect(variantField('replyAddress')).toBeVisible();
    await expect(variantField('forwardAddress')).toBeVisible();
    await expect(variantField('autoConfirmation')).toBeVisible();
    await expect(variantField('country')).toHaveCount(0);
  });
});

test.describe('Discriminator hosts that share graph-bearing properties', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/menu/accounts/upsertaccount?specFileName=discriminator-shared-host-properties.yaml',
    );
  });

  test('renders the variants of a host whose sibling host redeclares the shared fields', async ({
    page,
  }) => {
    const variantTabs = page
      .getByRole('tablist')
      .filter({ has: page.getByRole('tab', { name: 'business', exact: true }) });
    const variantField = (name: string) =>
      page.locator('span.schema-name', { hasText: new RegExp(`^${name}$`) });

    // merging each shared field as a whole subtree walked the activity graph; the page never rendered
    await expect(variantTabs.getByRole('tab', { selected: true })).toHaveText('person');
    await expect(variantField('firstName')).toBeVisible();
    await expect(variantField('activityLog')).toBeVisible();
    await expect(variantTabs.getByRole('tab')).toHaveText(['person', 'business']);

    await variantTabs.getByRole('tab', { name: 'business' }).click();

    await expect(variantTabs.getByRole('tab', { selected: true })).toHaveText('business');
    await expect(variantField('registrationNumber')).toBeVisible();
    await expect(variantField('members')).toBeVisible();
    await expect(variantField('firstName')).toHaveCount(0);
  });
});

test.describe('Schema page of an object that its subtypes extend through allOf', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      '/menu/schemas/personaccount?schemaDefinitionsTagName=Schemas&specFileName=discriminator-inherited-base-page.yaml',
    );
  });

  test('renders the subtype page whose fields reach a graph that refers back to it', async ({
    page,
  }) => {
    const field = (name: string) =>
      page.locator('span.schema-name', { hasText: new RegExp(`^${name}$`) });

    // with the page's own schema as the allOf cycle target nothing was cached; the page never rendered
    await expect(field('firstName')).toBeVisible();
    await expect(field('history')).toBeVisible();
    await expect(field('id')).toBeVisible();
  });
});

test.describe('Discriminator sync (variant property references part of the host)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu/drinks/createdrink?specFileName=discriminator-subschema-ref.yaml');
  });

  test('request sample renders and follows the schema switcher', async ({ page }) => {
    const schemaTabs = page.getByRole('tablist').filter({ hasText: 'coffee' });
    await expect(schemaTabs).toBeVisible();

    const requestSample = page
      .locator('.panel-request-samples [data-testid="source-code"]')
      .filter({ hasText: 'kind' })
      .first();
    await expect(requestSample).toContainText('"kind": "coffee"');
    await expect(requestSample).toContainText('"shots"');

    await schemaTabs.getByRole('tab', { name: 'tea' }).click();

    await expect(requestSample).toContainText('"kind": "tea"');
    await expect(requestSample).toContainText('"leaf"');
    await expect(requestSample).not.toContainText('"shots"');
  });
});

test.describe('Discriminator samples next to refs into part of a schema', () => {
  const fixture = 'specFileName=discriminator-subschema-regressions.yaml';
  const samples = (page: Page, operationId: string) => {
    const section = new ApiDocsPage(page).section(`/menu/samples/${operationId}`).getSection();
    return {
      section,
      request: section.locator('.panel-request-samples [data-testid="source-code"]').first(),
      response: section.locator('.panel-response-samples [data-testid="source-code"]').first(),
    };
  };

  test('a variant that inherits the host and refs its property follows the switcher', async ({
    page,
  }) => {
    await page.goto(`/menu/samples/createanimal?${fixture}`);
    const { section, request, response } = samples(page, 'createanimal');
    const schemaTabs = section.getByRole('tablist').filter({ hasText: 'bird' }).first();
    await expect(schemaTabs).toBeVisible();

    for (const sample of [request, response]) {
      await expect(sample).toContainText('"kind": "bird"');
      await expect(sample).toContainText('"wings"');
    }

    await schemaTabs.getByRole('tab', { name: 'fish' }).click();

    for (const sample of [request, response]) {
      await expect(sample).toContainText('"kind": "fish"');
      await expect(sample).toContainText('"fins"');
      await expect(sample).not.toContainText('"wings"');
    }
  });

  test('a chain of hosts that refs point into keeps samples within the depth limit', async ({
    page,
  }) => {
    await page.goto('/menu/samples/createchain?specFileName=discriminator-host-chain.yaml');
    const { request, response } = samples(page, 'createchain');

    await expect(response).toContainText('"kind": "H0X"');
    await expect(request).toContainText('"kind": "H0X"');
    expect((await request.innerText()).length).toBeLessThan(20_000);
  });

  test('a primitive host enum does not replace the selected option', async ({ page }) => {
    await page.goto(`/menu/samples/createcode?${fixture}`);
    const { request, response } = samples(page, 'createcode');

    for (const sample of [request, response]) {
      await expect(sample).toContainText('Z9');
      await expect(sample).not.toContainText('A1');
    }
  });

  test('an allOf part that refs a oneOf gives the same request and response sample', async ({
    page,
  }) => {
    await page.goto(`/menu/samples/createshape?${fixture}`);
    const { section, request, response } = samples(page, 'createshape');
    await expect(request).toContainText('"id"');
    await expect(response).toContainText('"id"');

    const squareTab = section.getByRole('tab', { name: 'Square' }).first();
    await squareTab.click();

    await expect(response).toContainText('"id"');
    const [requestText, responseText] = [await request.innerText(), await response.innerText()];
    for (const field of ['"radius"', '"side"']) {
      expect(requestText.includes(field), field).toBe(responseText.includes(field));
    }
  });
});
