import { expect, test } from '../test.js';

import { Search } from '../page-objects/Search.js';
import { StandalonePage } from '../page-objects/StandalonePage.js';

// One spec type exercises the click → deep-link → section-visible path end to end; the
// AsyncAPI/GraphQL index builds are covered by engine.ce.test.ts and init-graphql.ce.test.ts.
const SPEC_TYPES = [{ label: 'OpenAPI', specUrl: '/specs/cafe/openapi.yaml', term: 'menu' }];

for (const { label, specUrl, term } of SPEC_TYPES) {
  test(`indexes a ${label} definition and its hits deep-link into the docs`, async ({ page }) => {
    const apiDocs = new StandalonePage(page);
    await apiDocs.goto(`/pages/options-attributes.html?spec-url=${specUrl}`);

    const search = new Search(page);
    const results = await search.expectHitsFor(term);
    expect(await results.count()).toBeGreaterThan(0);

    await results.first().click();
    await expect(search.dialog).toHaveCount(0);

    const hash = new URL(page.url()).hash;
    expect(hash).toMatch(/^#\/.+/);
    const sectionId = hash.replace(/^#/, '').split('&')[0];
    await expect(apiDocs.section(sectionId).first()).toBeVisible();
  });
}
