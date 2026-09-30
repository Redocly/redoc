import { expect, test } from '../test.js';

import type { Page } from '@playwright/test';

import { Search } from '../page-objects/Search.js';
import { StandalonePage } from '../page-objects/StandalonePage.js';

type Attributes = Record<string, string | number | boolean>;

const INITIALIZED = 'event.com.redocly.redoc.initialized';
const VIEWED = 'event.com.redocly.page.viewed';
const PAGE_TIME = 'event.com.redocly.page.time';
const SIDEBAR_ITEM = 'event.com.redocly.sidebarItem.clicked';
const RESPONSE_TAB = 'event.com.redocly.responseCodeTab.clicked';
const SEARCH_QUERY = 'event.com.redocly.search.query';
const SEARCH_RESULT = 'event.com.redocly.searchResult.clicked';
const LOGO = 'event.com.redocly.logo.clicked';
const PAGE_URN = 'urn:redocly:redoc:ui:page';
const FLUSH_SETTLE_MS = 6000;

function captureSpans(page: Page): () => Record<string, Attributes[]> {
  const spans: Record<string, Attributes[]> = {};
  void page.route('**/otel.cloud.redocly.com/**', async (route) => {
    const body = route.request().postDataJSON() as {
      resourceSpans?: {
        scopeSpans?: {
          spans?: {
            name: string;
            attributes?: {
              key: string;
              value: {
                stringValue?: string;
                intValue?: string;
                doubleValue?: number;
                boolValue?: boolean;
              };
            }[];
          }[];
        }[];
      }[];
    } | null;
    for (const rs of body?.resourceSpans ?? []) {
      for (const ss of rs.scopeSpans ?? []) {
        for (const span of ss.spans ?? []) {
          const attributes: Attributes = {};
          for (const a of span.attributes ?? []) {
            const { stringValue, intValue, doubleValue, boolValue } = a.value;
            if (stringValue !== undefined) attributes[a.key] = stringValue;
            else if (intValue !== undefined) attributes[a.key] = Number(intValue);
            else if (doubleValue !== undefined) attributes[a.key] = doubleValue;
            else if (boolValue !== undefined) attributes[a.key] = boolValue;
          }
          (spans[span.name] ??= []).push(attributes);
        }
      }
    }
    await route.fulfill({ status: 204, body: '' });
  });
  return () => spans;
}

async function flushTelemetry(page: Page): Promise<void> {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('pagehide'));
  });
}

async function expectAttribution(
  page: Page,
  url: string,
  ready: () => Promise<void>,
  expected: { specType: 'openapi' | 'asyncapi' | 'graphql'; typeOfUsage: string },
): Promise<void> {
  const spans = captureSpans(page);
  await page.goto(url);
  await ready();
  await flushTelemetry(page);

  await expect
    .poll(() => spans()[INITIALIZED]?.length ?? 0, { timeout: FLUSH_SETTLE_MS })
    .toBeGreaterThan(0);

  const [initial] = spans()[INITIALIZED];
  expect(initial['cloudevents.event_data.initial.spec_type']).toBe(expected.specType);
  expect(initial['cloudevents.event_data.initial.type_of_usage']).toBe(expected.typeOfUsage);
  expect(initial['cloudevents.event_data.initial.layout']).toBeTruthy();

  const [viewed] = spans()[VIEWED] ?? [];
  expect(viewed, 'page.viewed accompanies redoc.initialized').toBeDefined();
  expect(viewed['cloudevents.event_data.page.spec_type']).toBe(expected.specType);
}

const sidebarVisible = (page: Page) => () =>
  page.locator('.menu-content').waitFor({ state: 'visible' });

const reactLoaded = (page: Page) => async () => {
  await page.waitForFunction(() => (window as { __loaded?: unknown[] }).__loaded?.length);
};

test.describe('<redoc> tag (autoInit)', () => {
  test('OpenAPI document → spec_type openapi, type_of_usage html', async ({ page }) => {
    await expectAttribution(page, '/pages/options-attributes.html', sidebarVisible(page), {
      specType: 'openapi',
      typeOfUsage: 'html',
    });
  });

  test('AsyncAPI document detected from its content', async ({ page }) => {
    await expectAttribution(
      page,
      '/pages/options-attributes.html?spec-url=/fixtures/search-events.yaml',
      sidebarVisible(page),
      { specType: 'asyncapi', typeOfUsage: 'html' },
    );
  });

  test('GraphQL schema detected from the .graphql URL', async ({ page }) => {
    await expectAttribution(
      page,
      '/pages/options-attributes.html?spec-url=/fixtures/search-cases.graphql',
      sidebarVisible(page),
      { specType: 'graphql', typeOfUsage: 'html' },
    );
  });

  test('a spec-type attribute can no longer override detection', async ({ page }) => {
    await expectAttribution(
      page,
      '/pages/options-attributes.html?spec-type=asyncapi',
      sidebarVisible(page),
      { specType: 'openapi', typeOfUsage: 'html' },
    );
  });

  test('type-of-usage="docker" is reported as docker', async ({ page }) => {
    await expectAttribution(
      page,
      '/pages/options-attributes.html?type-of-usage=docker',
      sidebarVisible(page),
      { specType: 'openapi', typeOfUsage: 'docker' },
    );
  });

  test('an unknown type-of-usage falls back to html instead of leaking through', async ({
    page,
  }) => {
    await expectAttribution(
      page,
      '/pages/options-attributes.html?type-of-usage=not-a-real-usage',
      sidebarVisible(page),
      { specType: 'openapi', typeOfUsage: 'html' },
    );
  });
});

test('init() called from page JavaScript reports html', async ({ page }) => {
  await expectAttribution(page, '/pages/init-imperative.html?case=events', sidebarVisible(page), {
    specType: 'openapi',
    typeOfUsage: 'html',
  });
});

test.describe('React embedding', () => {
  test('<RedocStandalone definitionUrl> → openapi, react', async ({ page }) => {
    await expectAttribution(page, '/react/?case=definition-url', reactLoaded(page), {
      specType: 'openapi',
      typeOfUsage: 'react',
    });
  });

  test('<RedocStandalone definition={object}> → openapi, react', async ({ page }) => {
    await expectAttribution(page, '/react/?case=definition-object', reactLoaded(page), {
      specType: 'openapi',
      typeOfUsage: 'react',
    });
  });

  test('<RedocStandalone definition={sdl string}> → graphql, react', async ({ page }) => {
    await expectAttribution(page, '/react/?case=graphql-sdl', reactLoaded(page), {
      specType: 'graphql',
      typeOfUsage: 'react',
    });
  });

  test('low-level <Redoc> with a caller-owned store → openapi, react', async ({ page }) => {
    await expectAttribution(page, '/react/?case=low-level', reactLoaded(page), {
      specType: 'openapi',
      typeOfUsage: 'react',
    });
  });
});

test.describe('interaction payload privacy', () => {
  test('UI events carry the constant page URN, counts and kinds, never the host or names', async ({
    page,
    context,
  }) => {
    const spans = captureSpans(page);
    const apiDocs = new StandalonePage(page);
    const search = new Search(page);

    await apiDocs.goto('/pages/options-attributes.html');
    await apiDocs.clickThroughMenu('Products');
    await expect(apiDocs.section('/products').first()).toBeVisible();

    await page.locator('[data-response-codes-tablist] [role="tab"]').last().click();

    const hits = await search.expectHitsFor('product');
    await hits.first().click();

    const [attributionTab] = await Promise.all([
      context.waitForEvent('page'),
      apiDocs.attributionLink.click(),
    ]);
    await attributionTab.close();

    await flushTelemetry(page);

    await expect
      .poll(() => spans()[PAGE_TIME]?.length ?? 0, { timeout: FLUSH_SETTLE_MS })
      .toBeGreaterThan(0);

    const origin = new URL(page.url()).origin;
    const all = Object.values(spans()).flat();
    expect(all.length).toBeGreaterThan(0);
    for (const attributes of all) {
      for (const [key, value] of Object.entries(attributes)) {
        if (typeof value === 'string' && key.startsWith('cloudevents.event_data.')) {
          expect(value, `${key} must not carry the hosting origin`).not.toContain(origin);
        }
      }
      expect(attributes).not.toHaveProperty('cloudevents.event_data.page.referrer');
    }

    const [sidebarItem] = spans()[SIDEBAR_ITEM] ?? [];
    expect(sidebarItem, 'sidebar click reported').toBeDefined();
    expect(sidebarItem['cloudevents.event_data.sidebar.type']).toMatch(/^(link|group)$/);
    expect(sidebarItem['cloudevents.event_data.sidebar.depth']).toEqual(expect.any(Number));
    expect(sidebarItem['cloudevents.event_data.page.uri']).toBe(PAGE_URN);

    const [responseTab] = spans()[RESPONSE_TAB] ?? [];
    expect(responseTab, 'response tab click reported').toBeDefined();
    expect(responseTab['cloudevents.event_data.tab.status_class']).toMatch(/^([1-5]xx|default)$/);

    const [query] = spans()[SEARCH_QUERY] ?? [];
    expect(query, 'search query reported').toBeDefined();
    expect(query['cloudevents.event_data.search.result_count']).toEqual(expect.any(Number));
    expect(query['cloudevents.event_data.search.word_count']).toBe(1);

    const [result] = spans()[SEARCH_RESULT] ?? [];
    expect(result, 'search result click reported').toBeDefined();
    expect(result['cloudevents.event_data.search.index']).toBe(0);
    expect(result).not.toHaveProperty('cloudevents.event_data.search.url');

    expect(spans()[LOGO]?.length ?? 0, 'attribution link click reported').toBeGreaterThan(0);

    const viewedViaSidebar = (spans()[VIEWED] ?? []).find(
      (attributes) => attributes['cloudevents.event_data.page.via'] === 'sidebar',
    );
    expect(viewedViaSidebar, 'a route change through the sidebar is reported').toBeDefined();
    expect(viewedViaSidebar?.['cloudevents.event_data.page.uri']).toBe(PAGE_URN);

    const pageTime = spans()[PAGE_TIME].at(-1) as Attributes;
    expect(pageTime['cloudevents.event_data.page.duration_ms']).toEqual(expect.any(Number));
    expect(pageTime['cloudevents.event_data.page.sidebar_clicks']).toBeGreaterThanOrEqual(1);
    expect(pageTime['cloudevents.event_data.page.searches']).toBeGreaterThanOrEqual(1);
    expect(pageTime['cloudevents.event_data.page.uri']).toBe(PAGE_URN);
  });
});
