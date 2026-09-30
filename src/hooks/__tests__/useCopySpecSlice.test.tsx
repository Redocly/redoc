import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { PropsWithChildren, ReactElement } from 'react';
import type { GlobalStoreAtom } from '../../jotai/store.js';
import type { ApiSpecType } from '../../types/common.js';
import type { RouteIndex, RouteItem, TagWithItems } from '../../utils/routing.js';
import type { ApiItemContent } from '../../types/store.js';

import { contentType, itemVariant } from '../../types/common.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { routeIndexAtom } from '../../jotai/routes.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';
import { useCopySpecSlice } from '../useCopySpecSlice.js';

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  return value as T;
}

const SDL = 'type Query {\n  menu: [String]\n  other: Int\n}\n';

function makeRoute(path: string, content: Partial<ApiItemContent>): RouteItem {
  return {
    path,
    label: path,
    content: { contentType: contentType.ITEM, children: [], ...content } as ApiItemContent,
  };
}

function makeRouteIndex(
  routes: RouteItem[],
  groups: TagWithItems[] = [],
  rootPage?: RouteItem,
): RouteIndex {
  return {
    allRoutes: routes,
    tagByPath: new Map(groups.map((group) => [group.tag.path, group])),
    itemToParentTag: new Map(),
    routeIndexByPath: new Map(routes.map((route, index) => [route.path, index])),
    rootPage,
    tags: groups.map((group) => group.tag),
  };
}

function renderCopySpecSlice({
  specType,
  definition,
  definitionUrl = '/specs/api.graphql',
  downloadUrls = [],
  routes,
  groups,
  rootPage,
  pageSlug,
}: {
  specType: ApiSpecType;
  definition: GlobalStoreAtom['definition'];
  definitionUrl?: string | null;
  downloadUrls?: { url: string }[];
  routes: RouteItem[];
  groups?: TagWithItems[];
  rootPage?: RouteItem;
  pageSlug: string;
}) {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({ specType, downloadUrls, metadata: {}, basePath: '' }),
    definition,
    definitionUrl: definitionUrl ?? undefined,
  } as GlobalStoreAtom);
  store.set(routeIndexAtom, makeRouteIndex(routes, groups, rootPage));

  const wrapper = ({ children }: PropsWithChildren): ReactElement => (
    <JotaiProvider store={store}>{children}</JotaiProvider>
  );
  return renderHook(() => useCopySpecSlice(pageSlug), { wrapper });
}

describe('useCopySpecSlice — GraphQL', () => {
  it('returns a graphql slice for an operation page backed by an SDL string', async () => {
    const { result } = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      routes: [makeRoute('menu', { itemVariant: itemVariant.QUERY, meta: { name: 'menu' } })],
      pageSlug: 'menu',
    });

    const slice = expectDefined(result.current);
    expect(slice.contentKind).toBe('graphql');
    expect(slice.scope).toEqual({
      kind: 'graphql-operation',
      operationType: 'query',
      name: 'menu',
    });
    expect(slice.specUrl).toBe('/specs/api.graphql');

    const text = await slice.getText();
    expect(text).toContain('menu: [String]');
    expect(text).not.toContain('other: Int');
  });

  it('returns the raw SDL for the overview page', async () => {
    const { result } = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      routes: [makeRoute('overview', { contentType: contentType.OVERVIEW })],
      pageSlug: 'overview',
    });

    const slice = expectDefined(result.current);
    await expect(slice.getText()).resolves.toBe(SDL);
  });

  it('slices a group page from its member items', async () => {
    const groupRoute = makeRoute('queries', { contentType: contentType.GROUP });
    groupRoute.label = 'Queries';
    const members = [
      makeRoute('queries/menu', { itemVariant: itemVariant.QUERY, meta: { name: 'menu' } }),
      makeRoute('queries/other', { itemVariant: itemVariant.QUERY, meta: { name: 'other' } }),
    ];
    const { result } = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      routes: [groupRoute, ...members],
      groups: [{ tag: groupRoute, items: members }],
      pageSlug: 'queries',
    });

    const slice = expectDefined(result.current);
    expect(slice.scope).toEqual({
      kind: 'graphql-group',
      label: 'Queries',
      members: [
        { kind: 'graphql-operation', operationType: 'query', name: 'menu' },
        { kind: 'graphql-operation', operationType: 'query', name: 'other' },
      ],
    });

    const text = await slice.getText();
    expect(text).toContain('menu: [String]');
    expect(text).toContain('other: Int');
  });

  it('resolves slugs case-insensitively and falls back to the root page for the base path', () => {
    const mixedCase = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      routes: [makeRoute('menu', { itemVariant: itemVariant.QUERY, meta: { name: 'menu' } })],
      pageSlug: 'MENU',
    });
    expect(expectDefined(mixedCase.result.current).scope).toEqual({
      kind: 'graphql-operation',
      operationType: 'query',
      name: 'menu',
    });

    const overview = makeRoute('overview', { contentType: contentType.OVERVIEW });
    const rootFallback = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      routes: [],
      rootPage: overview,
      pageSlug: '',
    });
    expect(expectDefined(rootFallback.result.current).scope).toEqual({ kind: 'document' });

    const unknown = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      routes: [],
      pageSlug: 'ghost',
    });
    expect(unknown.result.current).toBeNull();
  });

  it('rejects getText when the slicer produces no content', async () => {
    const { result } = renderCopySpecSlice({
      specType: 'openapi',
      definition: { openapi: '3.1.0', info: {}, paths: {}, components: { schemas: {} } },
      routes: [
        makeRoute('schemas/ghost', {
          itemVariant: itemVariant.SCHEMA,
          meta: { name: 'Ghost' },
        }),
      ],
      pageSlug: 'schemas/ghost',
    });

    const slice = expectDefined(result.current);
    await expect(slice.getText()).rejects.toThrow('no content produced');
  });

  it('falls back to the first download url when there is no definition url', () => {
    const route = makeRoute('menu', { itemVariant: itemVariant.QUERY, meta: { name: 'menu' } });

    const withDownloadUrl = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      definitionUrl: null,
      downloadUrls: [{ url: 'https://api.example.com/schema.graphql' }],
      routes: [route],
      pageSlug: 'menu',
    });
    expect(expectDefined(withDownloadUrl.result.current).specUrl).toBe(
      'https://api.example.com/schema.graphql',
    );

    const withoutUrls = renderCopySpecSlice({
      specType: 'graphql',
      definition: SDL,
      definitionUrl: null,
      routes: [route],
      pageSlug: 'menu',
    });
    expect(expectDefined(withoutUrls.result.current).specUrl).toBeUndefined();
  });

  it('returns null without a definition', () => {
    const { result } = renderCopySpecSlice({
      specType: 'graphql',
      definition: undefined,
      routes: [makeRoute('menu', { itemVariant: itemVariant.QUERY, meta: { name: 'menu' } })],
      pageSlug: 'menu',
    });

    expect(result.current).toBeNull();
  });
});

describe('useCopySpecSlice — OpenAPI regression', () => {
  it('keeps yaml slices working for record definitions', async () => {
    const definition = {
      openapi: '3.1.0',
      info: { title: 'Pets', version: '1.0.0' },
      paths: {
        '/pets': { get: { operationId: 'listPets', responses: { '200': { description: 'ok' } } } },
      },
    };
    const { result } = renderCopySpecSlice({
      specType: 'openapi',
      definition,
      routes: [
        makeRoute('pets/get', {
          itemVariant: itemVariant.HTTP_ITEM,
          meta: { pointer: '/paths/~1pets/get', isWebhook: false },
        }),
      ],
      pageSlug: 'pets/get',
    });

    const slice = expectDefined(result.current);
    expect(slice.contentKind).toBe('yaml');
    await expect(slice.getText()).resolves.toMatch(/^openapi: 3\.1\.0\n/);
  });
});
