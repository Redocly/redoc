import { parse as parseGraphQL } from 'graphql';
import * as yaml from 'js-yaml';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { ApiItem } from '../../types/store.js';
import type { OpenAPIDefinition } from '../../types/openapi.js';
import type { AsyncApiDefinition } from '../../types/asyncapi.js';

import { processOpenApiDocument } from '../openapi/index.js';
import { processGraphqlDocument } from '../graphql/index.js';
import { processAsyncApiDocument } from '../asyncapi/index.js';
import { buildItems, buildNavItems } from '../build.js';
import { readFixture, collectAllItems } from './utils.js';
import { CONST_PROTOCOL_VARIANT } from '../../types/asyncapi.js';
import { contentType, itemVariant } from '../../types/common.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';
import { markdocParser } from '../../components/markdoc/markdocParser.js';
import * as openApiStore from '../openapi/store.js';
import * as asyncApiStore from '../asyncapi/store.js';
import * as graphqlStore from '../graphql/store.js';

function walkItemsDeep(items: ApiItem[], visit: (item: ApiItem) => void): void {
  for (const item of items) {
    visit(item);
    const nested = (item as { items?: ApiItem[] }).items;
    if (Array.isArray(nested)) {
      walkItemsDeep(nested, visit);
    }
  }
}

function expectAllContentNull(items: ApiItem[]): void {
  walkItemsDeep(items, (item) => {
    expect(
      item.content,
      `expected content: null for "${item.label ?? item.link ?? '<unknown>'}"`,
    ).toBeNull();
  });
}

function isOverviewLandingContent(content: ApiItem['content']): boolean {
  if (!content) return false;
  return (
    content.contentType === contentType.OVERVIEW ||
    (content.contentType === contentType.ITEM && content.itemVariant === itemVariant.MARKDOWN)
  );
}

function expectNavOnlyContentNull(items: ApiItem[]): void {
  walkItemsDeep(items, (item) => {
    if (isOverviewLandingContent(item.content)) return;
    expect(
      item.content,
      `expected content: null for "${item.label ?? item.link ?? '<unknown>'}"`,
    ).toBeNull();
  });
}

async function measureAverage(run: () => Promise<unknown>, iterations: number): Promise<number> {
  await run();
  const samples: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await run();
    samples.push(performance.now() - start);
  }
  return samples.reduce((a, b) => a + b, 0) / samples.length;
}

describe('Nav-only adapter mode (processContent: false)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('OpenAPI', () => {
    let document: OpenAPIDefinition;

    beforeEach(() => {
      document = yaml.load(readFixture('openapi/schema.yaml')) as OpenAPIDefinition;
    });

    it('preserves navigation structure but sets content to null on every item', async () => {
      const options = {
        ...normalizeOptions({
          specType: 'openapi',
          downloadUrls: [],
          metadata: {},
        }),
        markdownParser: markdocParser,
      };

      const fullRun = await processOpenApiDocument({
        type: 'openapi',
        document,
        basePath: 'openapi/schema',
        options,
      });
      const navRun = await processOpenApiDocument({
        type: 'openapi',
        document,
        basePath: 'openapi/schema',
        options,
        processContent: false,
      });

      expect(navRun.items.length).toBeGreaterThan(0);
      expectNavOnlyContentNull(navRun.items);

      const fullLinks = collectAllItems(fullRun.items)
        .filter((i) => i.type === 'link' || i.type === 'group')
        .map((i) => i.link);
      const navLinks = collectAllItems(navRun.items)
        .filter((i) => i.type === 'link' || i.type === 'group')
        .map((i) => i.link);
      for (const link of navLinks) {
        expect(fullLinks).toContain(link);
      }
    });

    it('does not populate the schema/example store in nav-only mode', async () => {
      const populateSpy = vi.spyOn(openApiStore, 'populateOpenApiStore');
      const options = {
        ...normalizeOptions({
          specType: 'openapi',
          downloadUrls: [],
          metadata: {},
        }),
        markdownParser: markdocParser,
      };

      const { store } = await processOpenApiDocument({
        type: 'openapi',
        document,
        basePath: '/',
        options,
        processContent: false,
      });

      expect(populateSpy).not.toHaveBeenCalled();
      expect(store.schemaStore).toEqual({});
      expect(store.exampleStore).toEqual({});
      expect(store.securitySchemeStore).toEqual({});
    });
  });

  describe('GraphQL', () => {
    it('preserves navigation structure but sets content to null on every item', () => {
      const document = parseGraphQL(readFixture('graphql/schema.graphql'));
      const options = {
        ...normalizeOptions({
          specType: 'graphql',
          downloadUrls: [],
          metadata: {},
          info: {
            title: 'Test GraphQL Schema',
            description: 'A test description',
            version: '1.0.0',
          },
        }),
        markdownParser: markdocParser,
      };

      const fullRun = processGraphqlDocument({
        type: 'graphql',
        document,
        basePath: 'graphql/schema',
        options,
      });
      const navRun = processGraphqlDocument({
        type: 'graphql',
        document,
        basePath: 'graphql/schema',
        options,
        processContent: false,
      });

      expect(navRun.items.length).toBeGreaterThan(0);
      expectAllContentNull(navRun.items);

      const fullLabels = collectAllItems(fullRun.items)
        .filter((i) => i.type === 'group')
        .map((i) => i.label);
      const navLabels = collectAllItems(navRun.items)
        .filter((i) => i.type === 'group')
        .map((i) => i.label);
      expect(navLabels).toEqual(fullLabels);
    });

    it('does not populate the store in nav-only mode', () => {
      const populateSpy = vi.spyOn(graphqlStore, 'populateGraphqlStore');
      const document = parseGraphQL(readFixture('graphql/schema.graphql'));
      const options = {
        ...normalizeOptions({
          specType: 'graphql',
          downloadUrls: [],
          metadata: {},
        }),
        markdownParser: markdocParser,
      };

      const { store } = processGraphqlDocument({
        type: 'graphql',
        document,
        basePath: '/',
        options,
        processContent: false,
      });

      expect(populateSpy).not.toHaveBeenCalled();
      expect(store.schemaStore).toEqual({});
      expect(store.exampleStore).toEqual({});
      expect(store.securitySchemeStore).toEqual({});
    });
  });

  describe('AsyncAPI', () => {
    let document: AsyncApiDefinition;

    beforeEach(() => {
      document = yaml.load(readFixture('asyncapi/schema.yaml')) as AsyncApiDefinition;
    });

    it('preserves navigation structure but sets content to null on every item', () => {
      const options = {
        ...normalizeOptions({
          specType: 'asyncapi',
          downloadUrls: [],
          metadata: {},
          protocol: CONST_PROTOCOL_VARIANT.WSS,
        }),
        markdownParser: markdocParser,
      };

      const fullRun = processAsyncApiDocument({
        type: 'asyncapi',
        document,
        basePath: 'asyncapi/schema',
        options,
      });
      const navRun = processAsyncApiDocument({
        type: 'asyncapi',
        document,
        basePath: 'asyncapi/schema',
        options,
        processContent: false,
      });

      expect(navRun.items.length).toBeGreaterThan(0);
      expectAllContentNull(navRun.items);

      const fullLinks = collectAllItems(fullRun.items)
        .filter((i) => i.type === 'link' || i.type === 'group')
        .map((i) => i.link);
      const navLinks = collectAllItems(navRun.items)
        .filter((i) => i.type === 'link' || i.type === 'group')
        .map((i) => i.link);
      for (const link of navLinks) {
        expect(fullLinks).toContain(link);
      }
    });

    it('does not populate the schema/example store in nav-only mode', () => {
      const populateSpy = vi.spyOn(asyncApiStore, 'populateAsyncApiStore');
      const options = {
        ...normalizeOptions({
          specType: 'asyncapi',
          downloadUrls: [],
          metadata: {},
          protocol: CONST_PROTOCOL_VARIANT.WSS,
        }),
        markdownParser: markdocParser,
      };

      const { store } = processAsyncApiDocument({
        type: 'asyncapi',
        document,
        basePath: '/',
        options,
        processContent: false,
      });

      expect(populateSpy).not.toHaveBeenCalled();
      expect(store.schemaStore).toEqual({});
      expect(store.exampleStore).toEqual({});
      expect(store.securitySchemeStore).toEqual({});
    });
  });

  describe('buildNavItems integration', () => {
    it('returns nav-only items with content: null for OpenAPI', async () => {
      const document = yaml.load(readFixture('openapi/schema.yaml')) as OpenAPIDefinition;
      const { items, specType } = await buildNavItems({
        type: 'openapi',
        document,
        basePath: '/',
        options: { specType: 'openapi', downloadUrls: [], metadata: {} },
        markdownParser: markdocParser,
      });

      expect(specType).toBe('openapi');
      expect(items.length).toBeGreaterThan(0);
      expectNavOnlyContentNull(items);
    });

    it('returns nav-only items with content: null for GraphQL', async () => {
      const document = parseGraphQL(readFixture('graphql/schema.graphql'));
      const { items, specType } = await buildNavItems({
        type: 'graphql',
        document,
        basePath: '/',
        options: { specType: 'graphql', downloadUrls: [], metadata: {} },
        markdownParser: markdocParser,
      });

      expect(specType).toBe('graphql');
      expect(items.length).toBeGreaterThan(0);
      expectAllContentNull(items);
    });

    it('returns nav-only items with content: null for AsyncAPI', async () => {
      const document = yaml.load(readFixture('asyncapi/schema.yaml')) as AsyncApiDefinition;
      const { items, specType } = await buildNavItems({
        type: 'asyncapi',
        document,
        basePath: '/',
        options: { specType: 'asyncapi', downloadUrls: [], metadata: {} },
        markdownParser: markdocParser,
      });

      expect(specType).toBe('asyncapi');
      expect(items.length).toBeGreaterThan(0);
      expectAllContentNull(items);
    });
  });

  describe('buildItems vs buildNavItems', () => {
    const ITERATIONS = 3;

    it('buildNavItems is faster than buildItems on OpenAPI and produces no deep content', async () => {
      const document = yaml.load(readFixture('openapi/schema.yaml')) as OpenAPIDefinition;
      const baseProps = {
        type: 'openapi' as const,
        document,
        basePath: '/',
        options: { specType: 'openapi' as const, downloadUrls: [], metadata: {} },
        markdownParser: markdocParser,
      };

      const fullAvgMs = await measureAverage(() => buildItems(baseProps), ITERATIONS);
      const navAvgMs = await measureAverage(() => buildNavItems(baseProps), ITERATIONS);

      const { items: navItems } = await buildNavItems(baseProps);
      const { items: fullItems } = await buildItems(baseProps);

      let navNodeCount = 0;
      let navNonNullContentCount = 0;
      walkItemsDeep(navItems, (item) => {
        navNodeCount++;
        if (item.content !== null && !isOverviewLandingContent(item.content)) {
          navNonNullContentCount++;
        }
      });
      expect(navNodeCount).toBeGreaterThan(0);
      expect(navNonNullContentCount).toBe(0);

      let fullNonNullContentCount = 0;
      walkItemsDeep(fullItems, (item) => {
        if (item.content !== null) fullNonNullContentCount++;
      });
      expect(fullNonNullContentCount).toBeGreaterThan(0);

      console.info(
        `[buildItems vs buildNavItems] full=${fullAvgMs.toFixed(2)}ms nav=${navAvgMs.toFixed(2)}ms (avg over ${ITERATIONS} runs)`,
      );

      expect(navAvgMs).toBeLessThan(fullAvgMs);
    });
  });
});
