import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { ApiItem } from '../../../../types/store.js';
import type {
  OperationInfo,
  OpenApiBuildContext as BuildContext,
  TagData,
  OpenAPIDefinition,
  OpenAPITag,
} from '../../../../types/openapi.js';

import { buildGroupContent } from '../../group/content.js';
import { addTagItems, processTagGroups, processRootTags } from '../../group/item.js';
import { openApiContext } from '../../buildContext.js';
import { createBuildContext } from '../../build/context.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { createStoreContext, toRecord } from '../../../helpers.js';

const mockedGroupContent = { contentType: 'group' as const, children: [] };
const mockedItemContent = { contentType: 'item' as const, children: [] };

vi.mock('../../group/content.js', async (importOriginal) => ({
  ...((await importOriginal()) as Record<string, unknown>),
  buildGroupContent: vi.fn(() => mockedGroupContent),
}));

vi.mock('../../items/operation/content.js', async (importOriginal) => ({
  ...((await importOriginal()) as Record<string, unknown>),
  buildItemContent: vi.fn(() => mockedItemContent),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function makeTagData(
  name: string,
  operations: OperationInfo[] = [],
  tagOverrides?: Partial<OpenAPITag>,
  children: string[] = [],
): TagData {
  return { tag: { name, ...tagOverrides }, operations, children };
}

const mockDocument: OpenAPIDefinition = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0' },
  paths: {},
};

const mockOptions = normalizeOptions({
  specType: 'openapi',
  downloadUrls: [],
  metadata: {},
  basePath: '/api',
});

function makeContext(tags: Record<string, TagData>, tagOrder?: string[]): BuildContext {
  return {
    storeCtx: createStoreContext(toRecord(mockDocument)),
    document: mockDocument,
    options: mockOptions,
    basePath: '/api',
    downloadUrls: [],
    languages: [],
    tagsMap: new Map(Object.entries(tags)),
    collectedTagOrder: tagOrder ?? Object.keys(tags),
    badgeTags: [],
    processContent: true,
  };
}

const petsOperation: OperationInfo = {
  pointer: '/paths/~1pets/get',
  pathName: '/pets',
  httpVerb: 'get',
  isWebhook: false,
  isAdditionalOperation: false,
  tags: ['Pets'],
};

describe('addTagItems', () => {
  it('routes to processRootTags when no x-tagGroups present', () => {
    const context = makeContext({ Pets: makeTagData('Pets', [petsOperation]) });
    const document = { openapi: '3.0.0', info: { title: 'My API', version: '1.0.0' }, paths: {} };
    const items: ApiItem[] = [];

    openApiContext.run(context, () => addTagItems(document, items));

    expect(items[0]).toMatchObject({ type: 'group', label: 'Pets' });
  });

  it('renders the default "webhooks" tag alongside top-level tags when collected', () => {
    const webhookOp: OperationInfo = {
      pointer: '/webhooks/~1notification/post',
      pathName: '/notification',
      httpVerb: 'post',
      isWebhook: true,
      isAdditionalOperation: false,
      tags: ['webhooks'],
    };
    const context = makeContext(
      {
        tasks: makeTagData('tasks'),
        webhooks: makeTagData('webhooks', [webhookOp]),
      },
      ['webhooks'],
    );
    const document = {
      openapi: '3.1.0',
      info: { title: 'My API', version: '1.0.0' },
      paths: {},
      tags: [{ name: 'tasks' }],
    } as OpenAPIDefinition;
    const items: ApiItem[] = [];

    openApiContext.run(context, () => addTagItems(document, items));

    const labels = items.filter((i) => i.type === 'group').map((i) => i.label);
    expect(labels).toEqual(['tasks', 'webhooks']);
  });

  it('routes to processTagGroups when x-tagGroups present', () => {
    const context = makeContext({ Pets: makeTagData('Pets', [petsOperation]) });
    const document = {
      openapi: '3.0.0',
      info: { title: 'My API', version: '1.0.0' },
      paths: {},
      'x-tagGroups': [{ name: 'Animals', tags: ['Pets'] }],
    };
    const items: ApiItem[] = [];

    openApiContext.run(context, () => addTagItems(document, items));

    expect(items[0]).toMatchObject({ type: 'separator', label: 'Animals' });
    expect(items[1]).toMatchObject({ type: 'group', label: 'Pets' });
  });

  it('ignores x-tagGroups when any tag is nested (matches openapi-docs precedence)', () => {
    const context = makeContext({
      Animals: makeTagData('Animals', [petsOperation], {}, ['Dogs']),
      Dogs: makeTagData('Dogs', [], { parent: 'Animals' }),
    });
    const document = {
      openapi: '3.0.0',
      info: { title: 'My API', version: '1.0.0' },
      paths: {},
      'x-tagGroups': [{ name: 'Some Group', tags: ['Animals'] }],
    } as OpenAPIDefinition;
    const items: ApiItem[] = [];

    openApiContext.run(context, () => addTagItems(document, items));

    expect(items.find((i) => i.type === 'separator')).toBeUndefined();
    expect(items.map((i) => i.label)).toEqual(['Animals']);
    const animals = items[0];
    const animalsChildGroups = (animals.items as ApiItem[]).filter((i) => i.type === 'group');
    expect(animalsChildGroups.map((g) => g.label)).toEqual(['Dogs']);
  });
});

describe('processTagGroups', () => {
  it('creates a separator and group items for each x-tagGroup', () => {
    const context = makeContext({
      Pets: makeTagData('Pets', [petsOperation]),
      Users: makeTagData('Users'),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () =>
      processTagGroups(
        [
          { name: 'Animals', tags: ['Pets'] },
          { name: 'People', tags: ['Users'] },
        ],
        items,
      ),
    );

    expect(items.map((i) => i.label)).toEqual(['Animals', 'Pets', 'People', 'Users']);
    expect(items[0].type).toBe('separator');
    expect(items[1].type).toBe('group');
  });

  it('does not append tags that are not part of any x-tagGroup', () => {
    const context = makeContext({
      Pets: makeTagData('Pets', [petsOperation]),
      Users: makeTagData('Users'),
      Orphans: makeTagData('Orphans'),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () =>
      processTagGroups([{ name: 'Animals', tags: ['Pets', 'Users'] }], items),
    );

    expect(items.map((i) => i.label)).toEqual(['Animals', 'Pets', 'Users']);
    expect(items.some((i) => i.label === 'Orphans')).toBe(false);
  });

  it('renders an x-tagGroups tag that is used by an operation but not declared in top-level tags (regression: museum.yml "Attractions")', () => {
    const document: OpenAPIDefinition = {
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0' },
      tags: [{ name: 'Accommodations' }] as OpenAPITag[],
      paths: {
        '/accommodations': {
          get: { operationId: 'listAccommodations', tags: ['Accommodations'], responses: {} },
        },
        '/attractions': {
          // 'Attractions' is used by this operation but NOT in the top-level tags array
          get: { operationId: 'listAttractions', tags: ['Attractions'], responses: {} },
        },
      },
      'x-tagGroups': [{ name: 'Travel services', tags: ['Accommodations', 'Attractions'] }],
    };

    const context = createBuildContext({
      document,
      options: mockOptions,
      basePath: '/api',
      storeCtx: createStoreContext(toRecord(document)),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () => addTagItems(document, items));

    expect(items.map((i) => i.label)).toEqual(['Travel services', 'Accommodations', 'Attractions']);
  });

  it('renders a tag in every group that lists it (openapi-docs parity: no cross-group dedupe)', () => {
    const context = makeContext({ Pets: makeTagData('Pets', [petsOperation]) });
    const items: ApiItem[] = [];

    openApiContext.run(context, () =>
      processTagGroups(
        [
          { name: 'A', tags: ['Pets'] },
          { name: 'B', tags: ['Pets'] },
        ],
        items,
      ),
    );

    // openapi-docs getTagGroupsItems renders the tag once per group (with the
    // same id/href); api-docs matches that — no cross-group deduplication.
    expect(items.map((i) => ({ type: i.type, label: i.label }))).toEqual([
      { type: 'separator', label: 'A' },
      { type: 'group', label: 'Pets' },
      { type: 'separator', label: 'B' },
      { type: 'group', label: 'Pets' },
    ]);
  });
});

describe('processRootTags', () => {
  it('calls buildGroupContent and pushes a group item with correct shape', () => {
    const context = makeContext({ Pets: makeTagData('Pets', [petsOperation]) });
    const items: ApiItem[] = [];

    openApiContext.run(context, () => processRootTags(['Pets'], new Set(), items));

    expect(vi.mocked(buildGroupContent)).toHaveBeenCalledOnce();
    expect(items[0]).toMatchObject({
      type: 'group',
      label: 'Pets',
      link: '/api/pets',
      content: mockedGroupContent,
    });
  });

  it('skips child tags', () => {
    const context = makeContext({ Pets: makeTagData('Pets', [petsOperation]) });
    const items: ApiItem[] = [];

    openApiContext.run(context, () => processRootTags(['Pets'], new Set(['Pets']), items));

    expect(items).toHaveLength(0);
  });
});

describe('OpenAPI 3.2 tag features', () => {
  it('badge/audience kind tags are excluded from navigation as child tags', () => {
    const context = makeContext({
      Animals: makeTagData('Animals', [petsOperation]),
      Premium: makeTagData('Premium', [], { kind: 'badge', parent: 'Animals' }),
      External: makeTagData('External', [], { kind: 'audience', parent: 'Animals' }),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () =>
      processRootTags(['Animals', 'Premium', 'External'], new Set(), items),
    );

    const groupLabels = items.filter((i) => i.type === 'group').map((i) => i.label);
    expect(groupLabels).toContain('Animals');
    expect(groupLabels).not.toContain('Premium');
    expect(groupLabels).not.toContain('External');
  });

  it('nested tags are rendered as children of their parent', () => {
    const context = makeContext({
      Animals: makeTagData('Animals', [petsOperation], {}, ['Dogs']),
      Dogs: makeTagData('Dogs', [], { parent: 'Animals' }),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () =>
      processRootTags(['Animals', 'Dogs'], new Set(['Dogs']), items),
    );

    expect(items).toHaveLength(1);
    expect(items[0].label).toBe('Animals');
    const childGroups = (items[0].items as ApiItem[]).filter((i) => i.type === 'group');
    expect(childGroups).toHaveLength(1);
    expect(childGroups[0].label).toBe('Dogs');
  });

  it('passes breadcrumbs to buildGroupContent for nested tags', () => {
    const context = makeContext({
      Animals: makeTagData('Animals', [], {}, ['Dogs']),
      Dogs: makeTagData('Dogs', [], { parent: 'Animals' }, ['Puppies']),
      Puppies: makeTagData('Puppies', [], { parent: 'Dogs' }),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () =>
      processRootTags(['Animals', 'Dogs', 'Puppies'], new Set(['Dogs', 'Puppies']), items),
    );

    const calls = vi.mocked(buildGroupContent).mock.calls;
    const puppiesCall = calls.find((c) => c[0].tagName === 'Puppies');
    expect(puppiesCall?.[0].breadcrumbs).toEqual([{ label: 'Animals' }, { label: 'Dogs' }]);
  });

  it('passes childTags to buildGroupContent for parent tags', () => {
    const context = makeContext({
      Animals: makeTagData('Animals', [], {}, ['Dogs', 'Cats']),
      Dogs: makeTagData('Dogs', [], { parent: 'Animals', summary: 'All dog breeds' }),
      Cats: makeTagData('Cats', [], { parent: 'Animals' }),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () =>
      processRootTags(['Animals', 'Dogs', 'Cats'], new Set(['Dogs', 'Cats']), items),
    );

    const animalsCall = vi
      .mocked(buildGroupContent)
      .mock.calls.find((c) => c[0].tagName === 'Animals');
    expect(animalsCall?.[0].childTags).toEqual([
      { displayName: 'All dog breeds', summary: 'All dog breeds', slug: '/api/animals/dogs' },
      { displayName: 'Cats', summary: undefined, slug: '/api/animals/cats' },
    ]);
  });

  it('uses x-displayName for tag labels when summary is not set', () => {
    const context = makeContext({
      Pets: makeTagData('Pets', [petsOperation], { 'x-displayName': 'Pet Animals' }),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () => processRootTags(['Pets'], new Set(), items));

    expect(items[0].label).toBe('Pet Animals');
  });

  it('uses summary for tag labels when x-displayName is not set', () => {
    const context = makeContext({
      Pets: makeTagData('Pets', [petsOperation], { summary: 'Pet Animals Summary' }),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () => processRootTags(['Pets'], new Set(), items));

    expect(items[0].label).toBe('Pet Animals Summary');
  });

  it('prioritises summary over x-displayName when both are present', () => {
    const context = makeContext({
      Pets: makeTagData('Pets', [petsOperation], {
        summary: 'Pet Animals (from summary)',
        'x-displayName': 'Pet Animals (from x-displayName)',
      }),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () => processRootTags(['Pets'], new Set(), items));

    expect(items[0].label).toBe('Pet Animals (from summary)');
  });

  it('falls back to the tag name when neither summary nor x-displayName is set', () => {
    const context = makeContext({
      Pets: makeTagData('Pets', [petsOperation]),
    });
    const items: ApiItem[] = [];

    openApiContext.run(context, () => processRootTags(['Pets'], new Set(), items));

    expect(items[0].label).toBe('Pets');
  });
});

