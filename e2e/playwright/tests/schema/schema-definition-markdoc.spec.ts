import { test, expect } from '@playwright/test';

import { ApiDocsPage } from '../../page-objects/ApiDocsPage';
import { boundingBoxesInOneFrame } from '../../utils/bounding-boxes';

const BASE = '/schema-definition-markdoc';

test.describe('SchemaDefinition in OpenAPI Markdoc', () => {
  let apiDocs: ApiDocsPage;

  test.beforeEach(async ({ page }) => {
    apiDocs = new ApiDocsPage(page);
    await page.goto(BASE);
  });

  test('renders schemaDefinition embedded in info.description on the overview page', async ({
    page,
  }) => {
    const overviewSchemaDef = page.locator('[data-testid="schema-definition"]').first();
    await expect(overviewSchemaDef).toBeVisible();
    await expect(
      overviewSchemaDef.locator('.schema-name').filter({ hasText: /^name$/ }),
    ).toBeVisible();
    await expect(page.getByText('Overview intro text.')).toBeVisible();
    await expect(page.getByText('Overview outro text.')).toBeVisible();
  });

  test('preserves order of prose and schemaDefinition in a tag description', async ({ page }) => {
    await apiDocs.clickThroughMenu('Pet tag');

    const tagSection = apiDocs.section(`${BASE}/pet_tag`).getSection().first();
    await expect(tagSection).toBeVisible();

    const before = tagSection.getByText('Tag description before schema.');
    const after = tagSection.getByText('Tag description after schema.');
    const schemaDef = tagSection.locator('[data-testid="schema-definition"]').first();

    await expect(before).toBeVisible();
    await expect(schemaDef).toBeVisible();
    await expect(after).toBeVisible();

    const [beforeBox, schemaBox, afterBox] = await boundingBoxesInOneFrame(page, [
      before,
      schemaDef,
      after,
    ]);

    expect(beforeBox.y).toBeLessThan(schemaBox.y);
    expect(schemaBox.y).toBeLessThan(afterBox.y);
  });

  test('renders schemaDefinition in a tag description with its own example panel', async () => {
    await apiDocs.clickThroughMenu('Pet tag');

    const tagSection = apiDocs.section(`${BASE}/pet_tag`).getSection().first();
    const schemaDef = tagSection.locator('[data-testid="schema-definition"]');

    await expect(schemaDef).toHaveCount(1);
    await expect(schemaDef.locator('.schema-name').filter({ hasText: /^name$/ })).toBeVisible();
    await expect(schemaDef.getByText('Pet name', { exact: true })).toBeVisible();

    await expect(schemaDef.locator('.panel-response-samples')).toBeVisible();
  });

  test('splits multiple schemaDefinitions into separate sibling blocks', async () => {
    await apiDocs.clickThroughMenu('Multiple schemas tag');

    const tagSection = apiDocs.section(`${BASE}/multi_tag`).getSection();
    const schemaDefs = tagSection.locator('[data-testid="schema-definition"]');

    await expect(schemaDefs).toHaveCount(2);
    await expect(tagSection.getByText('First schema:')).toBeVisible();
    await expect(tagSection.getByText('Second schema:')).toBeVisible();

    await expect(
      schemaDefs
        .nth(0)
        .locator('.schema-name')
        .filter({ hasText: /^name$/ }),
    ).toBeVisible();
    await expect(schemaDefs.nth(1).locator('[data-testid="schema-enum-values"]')).toBeVisible();
    await expect(schemaDefs.nth(0).locator('[data-testid="schema-enum-values"]')).toHaveCount(0);
  });

  test('renders schemaDefinition alongside prose in the response description', async () => {
    await apiDocs.clickThroughMenu('Pet tag', 'Get pet');

    const opSection = apiDocs.section(`${BASE}/pet_tag/getpet`).getSection();
    const schemaDefs = opSection.locator('[data-testid="schema-definition"]');

    await expect(schemaDefs).toHaveCount(2);

    const responseSchemaDef = schemaDefs.filter({
      has: opSection.page().locator('[data-testid="schema-enum-values"]'),
    });
    await expect(responseSchemaDef).toHaveCount(1);

    await expect(opSection.getByText('Response description top.')).toBeVisible();
    await expect(responseSchemaDef.getByText('Response description top.')).toHaveCount(0);
  });

  test('schemaDefinition body sits in the middle panel and its samples in the right panel', async () => {
    await apiDocs.clickThroughMenu('Pet tag');

    const schemaDef = apiDocs
      .section(`${BASE}/pet_tag`)
      .getSection()
      .first()
      .locator('[data-testid="schema-definition"]')
      .first();
    await expect(schemaDef).toBeVisible();

    const middlePanel = schemaDef.locator('[data-testid="middle-panel"]').first();
    const rightPanel = schemaDef.locator('[data-testid="right-panel"]').first();

    await expect(middlePanel.locator('.schema-name').filter({ hasText: /^name$/ })).toBeVisible();
    await expect(rightPanel.locator('.schema-name').filter({ hasText: /^name$/ })).toHaveCount(0);

    await expect(rightPanel.locator('.panel-response-samples')).toBeVisible();
    await expect(middlePanel.locator('.panel-response-samples')).toHaveCount(0);
  });

  test('hides readOnly fields when showReadOnly=false', async () => {
    await apiDocs.clickThroughMenu('Read-only hidden');

    const schemaDef = apiDocs
      .section(`${BASE}/read_only_hidden_tag`)
      .getSection()
      .locator('[data-testid="schema-definition"]')
      .first();

    await expect(schemaDef.locator('.schema-name').filter({ hasText: /^id$/ })).toBeVisible();
    await expect(schemaDef.locator('.schema-name').filter({ hasText: /^createdAt$/ })).toHaveCount(
      0,
    );
  });

  test('shows writeOnly fields when showWriteOnly=true', async () => {
    await apiDocs.clickThroughMenu('Write-only visible');

    const schemaDef = apiDocs
      .section(`${BASE}/write_only_visible_tag`)
      .getSection()
      .locator('[data-testid="schema-definition"]')
      .first();

    await expect(schemaDef.locator('.schema-name').filter({ hasText: /^password$/ })).toBeVisible();
    await expect(schemaDef.getByText('write-only', { exact: true })).toBeVisible();
  });

  test('renders nested schema title inline only, not as a duplicate row above its fields', async () => {
    await apiDocs.clickThroughMenu('Nested title');

    const schemaDef = apiDocs
      .section(`${BASE}/nested_title_tag`)
      .getSection()
      .locator('[data-testid="schema-definition"]')
      .first();
    await expect(schemaDef).toBeVisible();

    await schemaDef.getByRole('button', { name: '+ Show property' }).click();
    await expect(
      schemaDef.locator('.schema-name').filter({ hasText: /^base64SvgSignature$/ }),
    ).toBeVisible();

    await expect(schemaDef.getByText('(Signature)', { exact: true })).toHaveCount(1);
  });

  test('hides oneOf variant fields behind a Show properties toggle', async () => {
    await apiDocs.clickThroughMenu('OneOf collapse');

    const schemaDef = apiDocs
      .section(`${BASE}/oneof_collapse_tag`)
      .getSection()
      .locator('[data-testid="schema-definition"]')
      .first();
    await expect(schemaDef).toBeVisible();

    const pnrId = schemaDef.locator('.schema-name').filter({ hasText: /^pnrId$/ });
    const showToggle = schemaDef.getByRole('button', { name: /Show property/ });

    await expect(pnrId).toHaveCount(0);
    await expect(showToggle).toBeVisible();

    await showToggle.click();

    await expect(pnrId).toBeVisible();
  });
});
