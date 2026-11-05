import { parse as parseGraphQL } from 'graphql';
import * as yaml from 'js-yaml';
import { describe, it, expect, beforeAll } from 'vitest';

import type { ApiItem } from '../../types/store.js';
import type { ItemVariant } from '../../types/common.js';

import { buildItems } from '../build.js';
import { readFixture, collectAllItems, filterByContentType, filterByItemVariant } from './utils.js';
import { validateContentLinks } from './validateContentLinks.js';
import { expectStoreReferencesResolve } from './store-references.js';
import { markdocParser } from '../../components/markdoc/markdocParser.js';

const BASE_PATH = 'docs/api';

type BuildProps = Parameters<typeof buildItems>[0];

const specs: Array<{
  name: string;
  type: BuildProps['type'];
  load: () => unknown;
  leafVariant: ItemVariant;
}> = [
  {
    name: 'OpenAPI',
    type: 'openapi',
    load: () => yaml.load(readFixture('openapi/schema.yaml')),
    leafVariant: 'httpItem',
  },
  {
    name: 'OpenAPI MCP',
    type: 'openapi',
    load: () => yaml.load(readFixture('openapi/mcp.yaml')),
    leafVariant: 'httpItem',
  },
  {
    name: 'AsyncAPI',
    type: 'asyncapi',
    load: () => yaml.load(readFixture('asyncapi/schema.yaml')),
    leafVariant: 'channel',
  },
  {
    name: 'GraphQL',
    type: 'graphql',
    load: () => parseGraphQL(readFixture('graphql/schema.graphql')),
    leafVariant: 'query',
  },
];

describe.each(specs)('buildItems content contract: $name', ({ type, load, leafVariant }) => {
  let result: Awaited<ReturnType<typeof buildItems>>;
  let allItems: ApiItem[];

  beforeAll(async () => {
    result = await buildItems({
      type,
      document: load(),
      basePath: BASE_PATH,
      options: { specType: type, downloadUrls: [], metadata: {} },
      markdownParser: markdocParser,
    } as unknown as BuildProps);
    allItems = collectAllItems(result.items);
  });

  it('emits relative, lowercase content links only', () => {
    expect(() => validateContentLinks(allItems, BASE_PATH)).not.toThrow();
  });

  it('emits absolute item links that carry the base path', () => {
    const linked = allItems.filter((item) => typeof item.link === 'string');

    expect(linked.length).toBeGreaterThan(0);
    for (const item of linked) {
      expect(item.link?.replace(/^\//, '')).toMatch(new RegExp(`^${BASE_PATH}(/|$)`));
    }
  });

  it('includes the overview, groups and leaf items', () => {
    expect(filterByContentType(allItems, 'overview').length).toBeGreaterThan(0);
    expect(filterByContentType(allItems, 'group').length).toBeGreaterThan(0);
    expect(filterByItemVariant(allItems, leafVariant).length).toBeGreaterThan(0);
  });

  it('references only ids the store holds', () => {
    expect(() => expectStoreReferencesResolve(result.items, result.store)).not.toThrow();
  });
});
