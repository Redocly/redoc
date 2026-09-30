import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as yaml from 'js-yaml';
import { describe, it, expect, beforeAll } from 'vitest';

import type { ApiItem } from '../../types/store.js';
import type { RawApiDocsOptions } from '../../types/options.js';
import type { OpenAPIDefinition } from '../../types/openapi.js';
import type { RouteItem, TagWithItems } from '../routing.js';

import { buildItems } from '../../adapters/build.js';
import { markdocParser } from '../../components/markdoc/markdocParser.js';
import {
  buildRouteIndex,
  buildTopLevelEntries,
  buildEagerSlugs,
  collectRoutesRecursively,
  resolveRouteByPathname,
} from '../routing.js';
import {
  makeContent,
  makeGroupContent,
  makeLinkItem,
  makeGroupItem,
  makeGroupWithoutLink,
  makeSeparatorItem,
  makeRouteItem,
  makeTagWithItems,
  runCollect,
} from './routing.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let apiItems: ApiItem[] = [];

beforeAll(async () => {
  const yamlContent = readFileSync(resolve(__dirname, '__fixtures__/openapi-3-1.yaml'), 'utf-8');
  const document = yaml.load(yamlContent) as OpenAPIDefinition;

  const options: RawApiDocsOptions = {
    specType: 'openapi',
    downloadUrls: [{ url: './spec/openapi-3-1.yaml' }],
    metadata: {},
  };

  const { items } = await buildItems({
    type: 'openapi',
    document,
    basePath: '/',
    options,
    markdownParser: markdocParser,
  });
  apiItems = items;
});

describe('collectRoutesRecursively', () => {
  it('should produce empty results for an empty input', () => {
    const { allRoutes, tagsWithItems } = runCollect([]);
    expect(allRoutes).toHaveLength(0);
    expect(tagsWithItems).toHaveLength(0);
  });

  describe('link items', () => {
    it('should add a link item to allRoutes', () => {
      const { allRoutes } = runCollect([makeLinkItem('/ops/list', 'List')]);
      expect(allRoutes).toHaveLength(1);
      expect(allRoutes[0].path).toBe('/ops/list');
      expect(allRoutes[0].label).toBe('List');
    });

    it('should not add a link item to tagsWithItems', () => {
      const { tagsWithItems } = runCollect([makeLinkItem('/ops/list', 'List')]);
      expect(tagsWithItems).toHaveLength(0);
    });

    it('should add a link item to parentTag.items when parentTag is provided', () => {
      const allRoutes: RouteItem[] = [];
      const tagsWithItems: TagWithItems[] = [];
      const parentTag: TagWithItems = { tag: makeRouteItem('/parent'), items: [] };

      collectRoutesRecursively({
        apiItems: [makeLinkItem('/parent/child', 'Child')],
        allRoutes,
        tagsWithItems,
        parentTag,
      });

      expect(allRoutes).toHaveLength(1);
      expect(parentTag.items).toHaveLength(1);
      expect(parentTag.items[0].path).toBe('/parent/child');
    });

    it('should preserve badge and deprecated fields from link items', () => {
      const badge = { name: 'GET', color: 'blue' };
      const item: ApiItem = {
        type: 'link',
        link: '/ops/get',
        label: 'Get',
        routeSlug: '/ops/get',
        content: makeContent(),
        badges: [badge],
        deprecated: true,
      };
      const { allRoutes } = runCollect([item]);
      expect(allRoutes[0].badges).toEqual([badge]);
      expect(allRoutes[0].deprecated).toBe(true);
    });
  });

  describe('group items with link', () => {
    it('should add a group with non-null content to tagsWithItems when there is no parentTag', () => {
      const { allRoutes, tagsWithItems } = runCollect([
        makeGroupItem('/pets', 'Pets', [], makeGroupContent()),
      ]);
      expect(allRoutes).toHaveLength(1);
      expect(allRoutes[0].path).toBe('/pets');
      expect(tagsWithItems).toHaveLength(1);
      expect(tagsWithItems[0].tag.path).toBe('/pets');
    });

    it('should not add a group with null content to tagsWithItems', () => {
      const { allRoutes, tagsWithItems } = runCollect([
        makeGroupItem('/section/intro', 'Intro', [], null),
      ]);
      expect(allRoutes).toHaveLength(1);
      expect(tagsWithItems).toHaveLength(0);
    });

    it('should add a group to parentTag.items instead of tagsWithItems when nested', () => {
      const allRoutes: RouteItem[] = [];
      const tagsWithItems: TagWithItems[] = [];
      const parentTag: TagWithItems = { tag: makeRouteItem('/parent'), items: [] };

      collectRoutesRecursively({
        apiItems: [makeGroupItem('/parent/sub', 'Sub', [], makeGroupContent())],
        allRoutes,
        tagsWithItems,
        parentTag,
      });

      expect(tagsWithItems).toHaveLength(0);
      expect(parentTag.items).toHaveLength(1);
      expect(parentTag.items[0].path).toBe('/parent/sub');
    });

    it('should recursively collect child link items into the group tag', () => {
      const children: ApiItem[] = [
        makeLinkItem('/pets/list', 'List Pets'),
        makeLinkItem('/pets/create', 'Create Pet'),
      ];
      const { allRoutes, tagsWithItems } = runCollect([makeGroupItem('/pets', 'Pets', children)]);

      expect(allRoutes).toHaveLength(3);
      expect(tagsWithItems[0].items).toHaveLength(2);
      expect(tagsWithItems[0].items.map((r) => r.path)).toEqual(['/pets/list', '/pets/create']);
    });

    it('should use routeSlug as route path when available', () => {
      const item: ApiItem = {
        type: 'link',
        link: '/ops/list',
        label: 'List',
        routeSlug: '/custom-slug/list',
        content: makeContent(),
      };
      const { allRoutes } = runCollect([item]);
      expect(allRoutes[0].path).toBe('/custom-slug/list');
    });

    it('should decode uppercase %5C and lowercase %5c backslash encodings to the same literal backslash path', () => {
      const itemWithUppercase: ApiItem = {
        type: 'link',
        link: '/menu/op%5Cname',
        label: 'Op',
        routeSlug: '/menu/op%5Cname',
        content: makeContent(),
      };
      const itemWithLowercase: ApiItem = {
        type: 'link',
        link: '/menu/op%5cname',
        label: 'Op',
        routeSlug: '/menu/op%5cname',
        content: makeContent(),
      };

      const { allRoutes: upper } = runCollect([itemWithUppercase]);
      const { allRoutes: lower } = runCollect([itemWithLowercase]);

      expect(upper[0].path).toBe('/menu/op\\name');
      expect(lower[0].path).toBe('/menu/op\\name');
      expect(upper[0].path).toBe(lower[0].path);
    });

    it('should decode other percent-encoded characters in routeSlug', () => {
      const item: ApiItem = {
        type: 'link',
        link: '/ops/caf%C3%A9',
        label: 'Café',
        routeSlug: '/ops/caf%C3%A9',
        content: makeContent(),
      };
      const { allRoutes } = runCollect([item]);
      expect(allRoutes[0].path).toBe('/ops/café');
    });
  });

  describe('group items without link', () => {
    it('should not add a route for a group without a link', () => {
      const { allRoutes } = runCollect([makeGroupWithoutLink('Unlinkable Group')]);
      expect(allRoutes).toHaveLength(0);
    });

    it('should pass child items through with the same parentTag', () => {
      const allRoutes: RouteItem[] = [];
      const tagsWithItems: TagWithItems[] = [];
      const parentTag: TagWithItems = { tag: makeRouteItem('/parent'), items: [] };

      collectRoutesRecursively({
        apiItems: [
          makeGroupWithoutLink('Wrapper', [
            makeLinkItem('/parent/child-a', 'Child A'),
            makeLinkItem('/parent/child-b', 'Child B'),
          ]),
        ],
        allRoutes,
        tagsWithItems,
        parentTag,
      });

      expect(allRoutes).toHaveLength(2);
      expect(parentTag.items.map((r) => r.path)).toEqual(['/parent/child-a', '/parent/child-b']);
    });

    it('should hoist top-level children of a linkless group into tagsWithItems', () => {
      const { tagsWithItems } = runCollect([
        makeGroupWithoutLink('Wrapper', [
          makeGroupItem('/dogs', 'Dogs'),
          makeGroupItem('/cats', 'Cats'),
        ]),
      ]);
      expect(tagsWithItems.map((t) => t.tag.path)).toEqual(['/dogs', '/cats']);
    });
  });

  describe('separator items', () => {
    it('should ignore separators that have no items', () => {
      const { allRoutes, tagsWithItems } = runCollect([makeSeparatorItem()]);
      expect(allRoutes).toHaveLength(0);
      expect(tagsWithItems).toHaveLength(0);
    });

    it('should recursively process separator child items with the same parentTag', () => {
      const { allRoutes, tagsWithItems } = runCollect([
        makeSeparatorItem([makeGroupItem('/dogs', 'Dogs'), makeGroupItem('/cats', 'Cats')]),
      ]);
      expect(allRoutes).toHaveLength(2);
      expect(tagsWithItems.map((t) => t.tag.path)).toEqual(['/dogs', '/cats']);
    });
  });

  describe('complex nested structures', () => {
    it('should collect a realistic multi-group hierarchy', () => {
      const items: ApiItem[] = [
        makeLinkItem('/', 'Overview'),
        makeSeparatorItem([makeGroupItem('/pets', 'Pets', [makeLinkItem('/pets/list', 'List')])]),
        makeSeparatorItem([
          makeGroupItem('/orders', 'Orders', [makeLinkItem('/orders/list', 'List')]),
        ]),
      ];

      const { allRoutes, tagsWithItems } = runCollect(items);

      expect(allRoutes.map((r) => r.path)).toEqual([
        '/',
        '/pets',
        '/pets/list',
        '/orders',
        '/orders/list',
      ]);
      expect(tagsWithItems).toHaveLength(2);
      expect(tagsWithItems[0].tag.path).toBe('/pets');
      expect(tagsWithItems[0].items.map((r) => r.path)).toEqual(['/pets/list']);
      expect(tagsWithItems[1].tag.path).toBe('/orders');
    });

    it('should preserve insertion order across mixed item types', () => {
      const items: ApiItem[] = [
        makeLinkItem('/', 'Overview'),
        makeGroupItem('/alpha', 'Alpha', [makeLinkItem('/alpha/a1', 'A1')]),
        makeGroupWithoutLink('Phantom', [makeGroupItem('/beta', 'Beta')]),
        makeGroupItem('/gamma', 'Gamma', []),
      ];

      const { allRoutes, tagsWithItems } = runCollect(items);

      expect(allRoutes.map((r) => r.path)).toEqual(['/', '/alpha', '/alpha/a1', '/beta', '/gamma']);
      expect(tagsWithItems.map((t) => t.tag.path)).toEqual(['/alpha', '/beta', '/gamma']);
    });
  });

  describe('with items built from openapi-3-1.yaml', () => {
    it('should produce routes for all navigable items', () => {
      const { allRoutes, tagsWithItems } = runCollect(apiItems as ApiItem[]);

      expect(allRoutes.length).toBeGreaterThan(0);
      expect(tagsWithItems.length).toBeGreaterThan(0);

      for (const route of allRoutes) {
        expect(typeof route.path).toBe('string');
        expect(route.path.length).toBeGreaterThan(0);
      }
    });

    it('should produce the expected top-level tags from openapi-3-1.yaml', () => {
      const { tagsWithItems } = runCollect(apiItems as ApiItem[]);
      const tagPaths = tagsWithItems.map((t) => t.tag.path);

      expect(tagPaths).toContain('/menu');
      expect(tagPaths).toContain('/cafe');
      expect(tagPaths).toContain('/customer');
      expect(tagPaths).toContain('/menu_model');
      expect(tagPaths).toContain('/cafe_model');
    });

    it('should not include section groups (null content) in tagsWithItems', () => {
      const { tagsWithItems } = runCollect(apiItems as ApiItem[]);
      const tagPaths = tagsWithItems.map((t) => t.tag.path);

      // Section groups (null content) must be excluded; no tag path should be a section path.
      expect(tagPaths.some((p) => p.includes('/section/'))).toBe(false);
    });

    it('should associate child items with their parent tag', () => {
      const { tagsWithItems } = runCollect(apiItems as ApiItem[]);
      const menuTag = tagsWithItems.find((t) => t.tag.path === '/menu');

      expect(menuTag).toBeDefined();
      expect(menuTag?.items.length).toBeGreaterThan(0);

      for (const item of menuTag?.items ?? []) {
        expect(item.path.startsWith('/menu')).toBe(true);
      }
    });
  });
});

describe('buildRouteIndex', () => {
  it('should return empty maps when called with empty arrays', () => {
    const maps = buildRouteIndex([], [], '/');
    expect(maps.allRoutes).toHaveLength(0);
    expect(maps.tagByPath.size).toBe(0);
    expect(maps.itemToParentTag.size).toBe(0);
    expect(maps.routeIndexByPath.size).toBe(0);
    expect(maps.rootPage).toBeUndefined();
    expect(maps.tags).toHaveLength(0);
  });

  describe('tagByPath', () => {
    it('should map each tag path to its TagWithItems entry', () => {
      const petsTag = makeTagWithItems('/pets');
      const ordersTag = makeTagWithItems('/orders');
      const maps = buildRouteIndex([], [petsTag, ordersTag], '/');

      expect(maps.tagByPath.get('/pets')).toBe(petsTag);
      expect(maps.tagByPath.get('/orders')).toBe(ordersTag);
    });
  });

  describe('itemToParentTag', () => {
    it('should map each item path to its parent TagWithItems', () => {
      const child1 = makeRouteItem('/pets/list');
      const child2 = makeRouteItem('/pets/create');
      const petsTag = makeTagWithItems('/pets', [child1, child2]);
      const maps = buildRouteIndex([], [petsTag], '/');

      expect(maps.itemToParentTag.get('/pets/list')).toBe(petsTag);
      expect(maps.itemToParentTag.get('/pets/create')).toBe(petsTag);
    });

    it('should map items from multiple tags independently', () => {
      const petItem = makeRouteItem('/pets/list');
      const orderItem = makeRouteItem('/orders/list');
      const petsTag = makeTagWithItems('/pets', [petItem]);
      const ordersTag = makeTagWithItems('/orders', [orderItem]);
      const maps = buildRouteIndex([], [petsTag, ordersTag], '/');

      expect(maps.itemToParentTag.get('/pets/list')).toBe(petsTag);
      expect(maps.itemToParentTag.get('/orders/list')).toBe(ordersTag);
    });
  });

  describe('routeIndexByPath', () => {
    it('should map each route path to its index in allRoutes', () => {
      const routes = [makeRouteItem('/'), makeRouteItem('/pets'), makeRouteItem('/orders')];
      const maps = buildRouteIndex(routes, [], '/');

      expect(maps.routeIndexByPath.get('/')).toBe(0);
      expect(maps.routeIndexByPath.get('/pets')).toBe(1);
      expect(maps.routeIndexByPath.get('/orders')).toBe(2);
    });

    it('should also index decoded versions of percent-encoded paths', () => {
      const encoded = '/pets/%C3%A9l%C3%A8ve';
      const decoded = '/pets/élève';
      const route = makeRouteItem(encoded, 'Eleve');
      const maps = buildRouteIndex([route], [], '/');

      expect(maps.routeIndexByPath.get(encoded)).toBe(0);
      expect(maps.routeIndexByPath.get(decoded)).toBe(0);
    });

    it('should store exactly one entry for a plain path with a non-matching basePath', () => {
      const route = makeRouteItem('/pets/simple');
      const maps = buildRouteIndex([route], [], '/other');

      expect(maps.routeIndexByPath.get('/pets/simple')).toBe(0);
      expect(maps.routeIndexByPath.size).toBe(1);
    });

    it('indexes routes under their full path regardless of basePath', () => {
      const route = makeRouteItem('/docs/pets', 'Pets');
      const maps = buildRouteIndex([route], [], '/docs');

      expect(maps.routeIndexByPath.get('/docs/pets')).toBe(0);
    });

    it('should find a route that contains a literal backslash in its path', () => {
      const route = makeRouteItem('/menu/op\\name', 'Op');
      const maps = buildRouteIndex([route], [], '/');

      expect(maps.routeIndexByPath.get('/menu/op\\name')).toBe(0);
    });
  });

  describe('rootPage and tags', () => {
    it('should set rootPage to the first element of allRoutes', () => {
      const routes = [makeRouteItem('/'), makeRouteItem('/pets')];
      const maps = buildRouteIndex(routes, [], '/');
      expect(maps.rootPage).toBe(routes[0]);
    });

    it('should set rootPage to undefined when allRoutes is empty', () => {
      const maps = buildRouteIndex([], [], '/');
      expect(maps.rootPage).toBeUndefined();
    });

    it('should expose tags as an ordered array of tag RouteItems', () => {
      const alpha = makeTagWithItems('/alpha');
      const beta = makeTagWithItems('/beta');
      const maps = buildRouteIndex([], [alpha, beta], '/');

      expect(maps.tags).toEqual([alpha.tag, beta.tag]);
    });
  });

  describe('integration: collectRoutesRecursively → buildRouteIndex', () => {
    it('should build consistent maps from a realistic item tree', () => {
      const items: ApiItem[] = [
        makeLinkItem('/', 'Overview'),
        makeGroupItem('/pets', 'Pets', [
          makeLinkItem('/pets/list', 'List Pets'),
          makeLinkItem('/pets/create', 'Create Pet'),
        ]),
        makeGroupItem('/orders', 'Orders', [makeLinkItem('/orders/list', 'List Orders')]),
      ];

      const allRoutes: RouteItem[] = [];
      const tagsWithItems: TagWithItems[] = [];
      collectRoutesRecursively({ apiItems: items, allRoutes, tagsWithItems, parentTag: null });
      const maps = buildRouteIndex(allRoutes, tagsWithItems, '/');

      expect(maps.rootPage?.path).toBe('/');
      expect(maps.tags.map((t) => t.path)).toEqual(['/pets', '/orders']);
      expect(maps.tagByPath.has('/pets')).toBe(true);
      expect(maps.tagByPath.has('/orders')).toBe(true);
      expect(maps.itemToParentTag.get('/pets/list')?.tag.path).toBe('/pets');
      expect(maps.itemToParentTag.get('/pets/create')?.tag.path).toBe('/pets');
      expect(maps.itemToParentTag.get('/orders/list')?.tag.path).toBe('/orders');
    });

    it('should decode %5C and %5c backslash routeSlugs to the same literal path, findable in routeIndexByPath', () => {
      const itemWithUppercase: ApiItem = {
        type: 'link',
        link: '/menu/op%5Cwith-backslash',
        label: 'Op',
        routeSlug: '/menu/op%5Cwith-backslash',
        content: makeContent(),
      };
      const itemWithLowercase: ApiItem = {
        type: 'link',
        link: '/menu/op%5cwith-backslash',
        label: 'Op',
        routeSlug: '/menu/op%5cwith-backslash',
        content: makeContent(),
      };

      const { allRoutes: upper, tagsWithItems: twi1 } = runCollect([itemWithUppercase]);
      const { allRoutes: lower, tagsWithItems: twi2 } = runCollect([itemWithLowercase]);

      expect(upper[0].path).toBe('/menu/op\\with-backslash');
      expect(lower[0].path).toBe('/menu/op\\with-backslash');

      expect(
        buildRouteIndex(upper, twi1, '/').routeIndexByPath.get('/menu/op\\with-backslash'),
      ).toBe(0);
      expect(
        buildRouteIndex(lower, twi2, '/').routeIndexByPath.get('/menu/op\\with-backslash'),
      ).toBe(0);
    });

    it('should build correct maps from items generated from openapi-3-1.yaml', () => {
      const allRoutes: RouteItem[] = [];
      const tagsWithItems: TagWithItems[] = [];
      collectRoutesRecursively({
        apiItems: apiItems as ApiItem[],
        allRoutes,
        tagsWithItems,
        parentTag: null,
      });
      const maps = buildRouteIndex(allRoutes, tagsWithItems, '/');

      expect(maps.rootPage?.path).toBe('/');
      expect(maps.allRoutes).toBe(allRoutes);
      expect(maps.tags).toHaveLength(tagsWithItems.length);

      for (const tagData of tagsWithItems) {
        expect(maps.tagByPath.get(tagData.tag.path)).toBe(tagData);
      }

      for (const tagData of tagsWithItems) {
        for (const item of tagData.items) {
          expect(maps.itemToParentTag.get(item.path)).toBeDefined();
        }
      }
      for (let i = 0; i < allRoutes.length; i++) {
        expect(maps.routeIndexByPath.get(allRoutes[i].path)).toBe(i);
      }
    });
  });
});

describe('resolveRouteByPathname', () => {
  const root = makeRouteItem('/docs/dev-docs/api');
  const op = makeRouteItem('/docs/dev-docs/api/operations/get-store');
  const routeIndex = buildRouteIndex([root, op], [], '/docs/dev-docs/api');

  it('matches an exact route path', () => {
    expect(resolveRouteByPathname(routeIndex, '/docs/dev-docs/api/operations/get-store')).toBe(op);
  });

  it('resolves the API index document to the root page', () => {
    // The API is referenced by its `output:` index path (e.g. from a sidebar
    // href); it must land on the API root, not "page not found".
    expect(resolveRouteByPathname(routeIndex, '/docs/dev-docs/api/index.yaml')).toBe(root);
    expect(resolveRouteByPathname(routeIndex, '/docs/dev-docs/api/index.json')).toBe(root);
  });

  it('resolves the index path without an extension to the root page', () => {
    expect(resolveRouteByPathname(routeIndex, '/docs/dev-docs/api/index')).toBe(root);
  });

  it('is case-insensitive for the index document', () => {
    expect(resolveRouteByPathname(routeIndex, '/docs/dev-docs/api/INDEX.yaml')).toBe(root);
  });

  it('returns undefined for a genuinely unknown path', () => {
    expect(resolveRouteByPathname(routeIndex, '/docs/dev-docs/api/nope')).toBeUndefined();
  });
});

describe('buildTopLevelEntries', () => {
  function indexFromItems(items: ApiItem[]) {
    const { allRoutes, tagsWithItems, allTagsWithItems } = runCollect(items);
    return buildRouteIndex(allRoutes, tagsWithItems, '/', allTagsWithItems);
  }

  it('promotes each top-level tag to an entry and skips its items (they render inside it)', () => {
    const index = indexFromItems([
      makeLinkItem('/', 'Overview'),
      makeGroupItem('/pets', 'Pets', [
        makeLinkItem('/pets/list', 'List'),
        makeLinkItem('/pets/create', 'Create'),
      ]),
    ]);

    const entries = buildTopLevelEntries(index);

    // The overview link and the Pets tag are top-level; the two ops are not.
    expect(entries.map((e) => e.sectionId)).toEqual(['/', '/pets']);
    const pets = entries.find((e) => e.sectionId === '/pets');
    expect(pets?.children.map((c) => c.path)).toEqual(['/pets/list', '/pets/create']);
  });

  it('skips section-pointer routes (null content) and nested items from the top level', () => {
    const index = indexFromItems([
      makeLinkItem('/', 'Overview'),
      // A section pointer: a link whose body lives inside another page.
      makeLinkItem('/#intro', 'Intro', null),
      makeGroupItem('/pets', 'Pets', [makeLinkItem('/pets/list', 'List')]),
    ]);

    const entries = buildTopLevelEntries(index);

    expect(entries.map((e) => e.sectionId)).toEqual(['/', '/pets']);
    expect(entries.some((e) => e.sectionId === '/#intro')).toBe(false);
  });

  it('flattens an AsyncAPI group -> channel(ITEM) -> operations, gating the ops by the group', () => {
    const index = indexFromItems([
      makeGroupItem('/messaging', 'Messaging', [
        // A channel is a group with ITEM content, holding its operations.
        makeGroupItem(
          '/messaging/ratings',
          'Ratings',
          [
            makeLinkItem('/messaging/ratings/publish', 'Publish'),
            makeLinkItem('/messaging/ratings/receive', 'Receive'),
          ],
          makeContent(),
        ),
      ]),
    ]);

    const entries = buildTopLevelEntries(index);

    expect(entries.map((e) => e.sectionId)).toEqual(['/messaging']);
    const messaging = entries[0];
    // Channel + both operations are flattened into the group in source order.
    expect(messaging.children.map((c) => c.path)).toEqual([
      '/messaging/ratings',
      '/messaging/ratings/publish',
      '/messaging/ratings/receive',
    ]);
    // Because the channel is an ITEM, its operations inherit the channel's own
    // gate (the parent group), so they render whenever the group is in scope.
    expect(messaging.children.map((c) => c.gatePath)).toEqual([
      '/messaging',
      '/messaging',
      '/messaging',
    ]);
  });

  it('gates a nested GROUP sub-tag’s items by the sub-tag itself, not the parent', () => {
    const index = indexFromItems([
      makeGroupItem('/parent', 'Parent', [
        // A nested GROUP sub-tag (default group content) with its own items.
        makeGroupItem('/parent/child', 'Child', [makeLinkItem('/parent/child/op', 'Op')]),
      ]),
    ]);

    const [parent] = buildTopLevelEntries(index);

    expect(parent.children.map((c) => c.path)).toEqual(['/parent/child', '/parent/child/op']);
    // The sub-tag itself is gated by the parent group; its item is gated by the
    // sub-tag (a GROUP hub gates its own descendants).
    expect(parent.children.map((c) => c.gatePath)).toEqual(['/parent', '/parent/child']);
  });
});

describe('buildEagerSlugs', () => {
  function indexFromItems(items: ApiItem[]) {
    const { allRoutes, tagsWithItems, allTagsWithItems } = runCollect(items);
    return buildRouteIndex(allRoutes, tagsWithItems, '/', allTagsWithItems);
  }

  it('returns an empty set when there is no active route', () => {
    const index = indexFromItems([makeLinkItem('/', 'Overview')]);
    expect(buildEagerSlugs(undefined, index).size).toBe(0);
  });

  it('eager-mounts an active operation on its own', () => {
    const index = indexFromItems([
      makeLinkItem('/', 'Overview'),
      makeGroupItem('/pets', 'Pets', [makeLinkItem('/pets/list', 'List')]),
    ]);
    const active = resolveRouteByPathname(index, '/pets/list');

    expect([...buildEagerSlugs(active, index)]).toEqual(['/pets/list']);
  });

  it('eager-mounts an active tag AND its first renderable child', () => {
    const index = indexFromItems([
      makeLinkItem('/', 'Overview'),
      makeGroupItem('/pets', 'Pets', [
        makeLinkItem('/pets/list', 'List'),
        makeLinkItem('/pets/create', 'Create'),
      ]),
    ]);
    const active = resolveRouteByPathname(index, '/pets');

    expect([...buildEagerSlugs(active, index)].sort()).toEqual(['/pets', '/pets/list']);
  });

  it('eager-mounts the root page for a section-pointer route (null content)', () => {
    const index = indexFromItems([
      makeLinkItem('/', 'Overview'),
      makeLinkItem('/#intro', 'Intro', null),
    ]);
    const active = resolveRouteByPathname(index, '/#intro');

    expect([...buildEagerSlugs(active, index)]).toEqual(['/']);
  });
});
