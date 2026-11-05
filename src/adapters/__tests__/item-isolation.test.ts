import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import type { ApiItemContent } from '../../types/store.js';
import type * as HelpersModule from '../helpers.js';
import type * as SecurityModule from '../asyncapi/utils/security.js';
import type * as OperationModule from '../openapi/utils/operation.js';
import type * as ParseMarkdownModule from '../utils/parseMarkdown.js';

import { prepareApiDocs } from '../../RedocStandalone.js';
import { MAX_BUILD_ERRORS } from '../build.js';
import { withErrorHandling } from '../helpers.js';

// Stand-ins for a malformed value that throws inside the AsyncAPI builders.
vi.mock('../asyncapi/utils/security.js', async (importOriginal) => {
  const original = await importOriginal<typeof SecurityModule>();
  return {
    ...original,
    buildSecurityRequirements: vi.fn(
      (...args: Parameters<typeof original.buildSecurityRequirements>) => {
        if (JSON.stringify(args[0]).includes('x-broken')) throw new TypeError('n is not iterable');
        return original.buildSecurityRequirements(...args);
      },
    ),
  };
});
// Throws in the nav build of one operation, outside its content builder.
vi.mock('../openapi/utils/operation.js', async (importOriginal) => {
  const original = await importOriginal<typeof OperationModule>();
  return {
    ...original,
    getOperationData: vi.fn((...args: Parameters<typeof original.getOperationData>) => {
      if ('x-broken-item' in args[0]) throw new TypeError('n is not iterable');
      return original.getOperationData(...args);
    }),
  };
});
// Throws in the tag page builder.
vi.mock('../utils/parseMarkdown.js', async (importOriginal) => {
  const original = await importOriginal<typeof ParseMarkdownModule>();
  return {
    ...original,
    parseMarkdown: vi.fn((...args: Parameters<typeof original.parseMarkdown>) => {
      if (args[0] === 'x-broken') throw new TypeError('n is not iterable');
      return original.parseMarkdown(...args);
    }),
  };
});
vi.mock('../helpers.js', async (importOriginal) => {
  const original = await importOriginal<typeof HelpersModule>();
  return {
    ...original,
    registerSchema: vi.fn((...args: Parameters<typeof original.registerSchema>) => {
      if (JSON.stringify(args[2]).includes('x-broken')) throw new TypeError('n is not iterable');
      const { data } = args[2];
      if (original.isRecord(data) && typeof data['x-error'] === 'string') {
        throw new TypeError(data['x-error']);
      }
      return original.registerSchema(...args);
    }),
  };
});

// One item per spec throws in its content builder via the `x-broken` marker the mocks above turn
// into a throw.
const okResponses = { '200': { description: 'ok' } };

const ITEM_SPECS: Record<string, Record<string, unknown>> = {
  'OpenAPI 3.1': {
    openapi: '3.1.0',
    info: { title: 'T', version: '1' },
    paths: {
      '/a': {
        get: {
          summary: 'Broken',
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string', 'x-broken': true } }],
          responses: okResponses,
        },
      },
      '/b': { get: { summary: 'Fine', responses: okResponses } },
    },
  },
  'AsyncAPI 3.0': {
    asyncapi: '3.0.0',
    info: { title: 'T', version: '1' },
    channels: { fineChannel: { address: 'b' } },
    operations: {
      broken: {
        action: 'send',
        title: 'Broken',
        security: [{ 'x-broken': true }],
        channel: { $ref: '#/channels/fineChannel' },
      },
      fine: { action: 'send', title: 'Fine', channel: { $ref: '#/channels/fineChannel' } },
    },
  },
  'AsyncAPI 2.6': {
    asyncapi: '2.6.0',
    info: { title: 'T', version: '1' },
    channels: {
      brokenChannel: {
        publish: { operationId: 'broken', summary: 'Broken', security: [{ 'x-broken': [] }] },
      },
      fineChannel: { publish: { operationId: 'fine', summary: 'Fine' } },
    },
  },
};

const BROKEN_CHANNEL_SPEC: Record<string, unknown> = {
  asyncapi: '3.0.0',
  info: { title: 'T', version: '1' },
  channels: {
    brokenChannel: {
      title: 'Broken channel',
      address: 'users.{id}',
      parameters: { id: { description: 'x-broken' } },
    },
  },
  operations: {
    fine: { action: 'send', title: 'Fine', channel: { $ref: '#/channels/brokenChannel' } },
  },
};

const load = (spec: Record<string, unknown>) =>
  prepareApiDocs({ spec, basePath: '/', convertedDownload: false });

/** Every object in `value` with this `label`. */
function labelled(value: unknown, label: string): Array<Record<string, unknown>> {
  if (!value || typeof value !== 'object') return [];
  const own =
    (value as Record<string, unknown>).label === label ? [value as Record<string, unknown>] : [];
  return own.concat(Object.values(value).flatMap((child) => labelled(child, label)));
}

/** The nav items with this `label` (content nodes carry `label` too). */
function navItems(items: unknown, label: string): Array<Record<string, unknown>> {
  return labelled(items, label).filter((item) => 'content' in item);
}

describe('an item whose content fails to build', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(Object.entries(ITEM_SPECS))(
    '%s: is skipped, reported, and the rest still builds',
    async (_name, spec) => {
      const { items, store } = await load(spec);

      const broken = labelled(items, 'Broken').find((item) => 'content' in item);
      expect(broken?.content).toEqual(expect.objectContaining({ children: [] }));
      expect(labelled(items, 'Fine').length).toBeGreaterThan(0);
      expect(store.buildErrors).toEqual([
        { id: 'buildItem', name: 'TypeError', message: 'n is not iterable' },
      ]);
      expect(console.error).toHaveBeenCalledWith(
        '[api-docs] %s:',
        'Could not build "Broken" from the API description',
        expect.any(TypeError),
      );
    },
  );

  it('reports with the description title when the failure is outside an item, keeping the overview', async () => {
    const spec = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {},
      components: { schemas: { Broken: { type: 'object', 'x-broken': true } } },
    };
    const { items, store } = await load(spec);

    expect(items).toEqual([
      {
        type: 'link',
        label: 'T',
        link: '/',
        routeSlug: '/',
        content: { contentType: 'overview', children: [] },
      },
    ]);
    expect(store.buildErrors).toEqual([
      { id: 'buildDocument', name: 'TypeError', message: 'n is not iterable' },
    ]);
    expect(console.error).toHaveBeenCalledWith(
      '[api-docs] %s:',
      'Could not build the API description "T"',
      expect.any(TypeError),
    );
  });

  it('OpenAPI: a numeric operationId and a null tag entry build like strings and nothing', async () => {
    const spec = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [null, 'x', { name: 'Pets' }],
      paths: {
        '/a': {
          get: {
            operationId: 12345,
            summary: 'Numeric',
            'x-codeSamples': 42,
            responses: okResponses,
          },
        },
        '/b': { get: { tags: [null], summary: 'Null tag', responses: okResponses } },
        '/c': { get: { tags: ['Pets'], summary: 'Fine', responses: okResponses } },
      },
    };
    const { items, store } = await load(spec);

    expect(navItems(items, 'Numeric')).toEqual([expect.objectContaining({ link: '/other/12345' })]);
    expect(navItems(items, 'Null tag').length).toBe(1);
    expect(labelled(items, 'Pets')[0]).toEqual(
      expect.objectContaining({ items: [expect.objectContaining({ label: 'Fine' })] }),
    );
    expect(store.buildErrors).toBeUndefined();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('OpenAPI: invalid x-codeSamples entries are skipped and reported once, non-array parameters are none', async () => {
    const samples = [
      null,
      { lang: 'python' },
      { label: 'cURL', source: 'curl label-only' },
      { lang: 'curl', source: 'curl valid' },
    ];
    const spec = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/a': {
          parameters: 'invalid',
          get: {
            summary: 'First',
            parameters: {},
            'x-codeSamples': samples,
            responses: okResponses,
          },
          post: { summary: 'Second', 'x-codeSamples': samples, responses: okResponses },
        },
      },
    };
    const { items, store } = await load(spec);

    for (const label of ['First', 'Second']) {
      const content = JSON.stringify(navItems(items, label)[0]?.content);
      expect(content).toContain('curl valid');
      expect(content).toContain('curl label-only');
    }
    expect(store.buildErrors).toEqual([
      {
        id: 'invalidValue',
        name: 'TypeError',
        message: 'Each x-codeSamples entry needs a string source and a string lang or label',
      },
    ]);
  });

  it('OpenAPI: an operation whose item fails to build is skipped and the rest builds', async () => {
    const spec = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/a': { get: { summary: 'Broken', 'x-broken-item': true, responses: okResponses } },
        '/b': { get: { summary: 'Fine', responses: okResponses } },
      },
    };
    const { items, store } = await load(spec);

    expect(navItems(items, 'Broken')).toEqual([]);
    expect(navItems(items, 'Fine').length).toBe(1);
    expect(navItems(items, 'T').length).toBe(1);
    expect(store.buildErrors).toEqual([
      { id: 'buildItem', name: 'TypeError', message: 'n is not iterable' },
    ]);
    expect(console.error).toHaveBeenCalledWith(
      '[api-docs] %s:',
      'Could not build "Broken" from the API description',
      expect.any(TypeError),
    );
  });

  it('OpenAPI: a tag page whose content fails to build is emptied and keeps its operations', async () => {
    const spec = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [
        {
          name: 'Pets',
          'x-displayName': 'Broken group',
          externalDocs: { url: 'https://example.com', description: 'x-broken' },
        },
      ],
      paths: {
        '/a': { get: { tags: ['Pets'], summary: 'Fine', responses: okResponses } },
      },
    };
    const { items, store } = await load(spec);

    const group = labelled(items, 'Broken group')[0];
    expect(group?.content).toEqual({ contentType: 'group', children: [] });
    expect(group?.items).toEqual([expect.objectContaining({ label: 'Fine' })]);
    expect(store.buildErrors).toEqual([
      { id: 'buildItem', name: 'TypeError', message: 'n is not iterable' },
    ]);
    expect(console.error).toHaveBeenCalledWith(
      '[api-docs] %s:',
      'Could not build "Broken group" from the API description',
      expect.any(TypeError),
    );
  });

  it('AsyncAPI: a channel that fails is skipped', async () => {
    const { store } = await load(BROKEN_CHANNEL_SPEC);
    expect(store.buildErrors).toEqual([
      { id: 'buildItem', name: 'TypeError', message: 'n is not iterable' },
    ]);
    expect(console.error).toHaveBeenCalledWith(
      '[api-docs] %s:',
      'Could not build "Broken channel" from the API description',
      expect.any(TypeError),
    );
  });

  it('keeps the build errors of concurrent builds apart', async () => {
    const clean = {
      openapi: '3.1.0',
      info: { title: 'Clean', version: '1' },
      paths: { '/b': { get: { summary: 'Fine', responses: okResponses } } },
    };

    const [broken, fine] = await Promise.all([load(ITEM_SPECS['OpenAPI 3.1']), load(clean)]);

    expect(broken.store.buildErrors).toEqual([
      { id: 'buildItem', name: 'TypeError', message: 'n is not iterable' },
    ]);
    expect(fine.store.buildErrors).toBeUndefined();
  });
});

describe('build errors in the store', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const specWithFailingOperations = (messages: string[]) => ({
    openapi: '3.1.0',
    info: { title: 'T', version: '1' },
    paths: Object.fromEntries(
      messages.map((message, index) => [
        `/op${index}`,
        {
          get: {
            summary: `Op ${index}`,
            parameters: [
              { name: 'q', in: 'query', schema: { type: 'string', 'x-error': message } },
            ],
            responses: okResponses,
          },
        },
      ]),
    ),
  });

  it('keeps one entry for the same error from several operations, and logs each', async () => {
    const { store } = await load(specWithFailingOperations(['same', 'same', 'same']));

    expect(store.buildErrors).toEqual([{ id: 'buildItem', name: 'TypeError', message: 'same' }]);
    expect(console.error).toHaveBeenCalledTimes(3);
  });

  it('keeps distinct errors in report order, up to the cap', async () => {
    const messages = Array.from({ length: MAX_BUILD_ERRORS + 5 }, (_, index) => `error ${index}`);
    const { store } = await load(specWithFailingOperations(messages));

    expect(store.buildErrors).toEqual(
      messages
        .slice(0, MAX_BUILD_ERRORS)
        .map((message) => ({ id: 'buildItem', name: 'TypeError', message })),
    );
    expect(console.error).toHaveBeenCalledTimes(messages.length);
  });
});

describe('OpenAPI: a malformed security requirement list', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const specWithSecurity = (
    documentSecurity: unknown,
    operationSecurity?: unknown,
  ): Record<string, unknown> => ({
    openapi: '3.1.0',
    info: { title: 'T', version: '1' },
    ...(documentSecurity !== undefined && { security: documentSecurity }),
    components: {
      securitySchemes: { api: { type: 'apiKey', name: 'X-Key', in: 'header' } },
    },
    paths: {
      '/a': {
        get: {
          summary: 'First',
          ...(operationSecurity !== undefined && { security: operationSecurity }),
          responses: okResponses,
        },
      },
      '/b': { get: { summary: 'Second', responses: okResponses } },
    },
  });

  /** Every object in `value` whose `key` is `expected`. */
  function nodesWith(
    value: unknown,
    key: string,
    expected: string,
  ): Array<Record<string, unknown>> {
    if (!value || typeof value !== 'object') return [];
    const record = value as Record<string, unknown>;
    const own = record[key] === expected ? [record] : [];
    return own.concat(Object.values(value).flatMap((child) => nodesWith(child, key, expected)));
  }

  it.each([
    ['document', { api: [] }],
    ['document', [null]],
    ['operation', { api: [] }],
    ['operation', [null]],
  ])('%s security %j builds every operation without an error', async (level, security) => {
    const spec =
      level === 'document' ? specWithSecurity(security) : specWithSecurity(undefined, security);
    const { items, store } = await load(spec);

    for (const label of ['First', 'Second']) {
      const [item] = navItems(items, label);
      expect(nodesWith(item?.content, 'operationType', 'http')).toHaveLength(1);
      expect(nodesWith(item?.content, 'nodeType', 'security')).toEqual([]);
    }
    expect(store.buildErrors).toBeUndefined();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('uses the document security for an operation whose own security is not a list', async () => {
    const inherited = await load(specWithSecurity([{ api: ['read'] }]));
    const malformedOwn = await load(specWithSecurity([{ api: ['read'] }], { api: [] }));

    expect(malformedOwn.items).toEqual(inherited.items);
    expect(malformedOwn.store.buildErrors).toBeUndefined();
  });

  it('skips a non-object requirement and keeps the valid ones', async () => {
    const valid = await load(specWithSecurity([{ api: ['read'] }, {}]));
    const mixed = await load(specWithSecurity([null, { api: ['read'] }, 'api', {}]));

    expect(mixed.items).toEqual(valid.items);
    expect(mixed.store.buildErrors).toBeUndefined();
  });

  it('renders a valid security requirement list', async () => {
    const { items, store } = await load(specWithSecurity([{ api: ['read'] }]));

    const [item] = navItems(items, 'First');
    expect(nodesWith(item?.content, 'nodeType', 'security')).toEqual([
      {
        nodeType: 'security',
        requirements: [
          {
            schemes: [
              expect.objectContaining({
                name: 'api',
                scopes: ['read'],
                type: 'apiKey',
                paramName: 'X-Key',
                in: 'header',
              }),
            ],
          },
        ],
      },
    ]);
    const [codeSample] = nodesWith(item?.content, 'operationType', 'http');
    expect(codeSample?.security).toEqual([
      {
        schemes: [
          expect.objectContaining({ id: 'api', type: 'apiKey', name: 'X-Key', in: 'header' }),
        ],
        scopes: ['read'],
      },
    ]);
    expect(store.buildErrors).toBeUndefined();
  });

  it('builds no security for an empty list, and keeps an optional requirement', async () => {
    const none = await load(specWithSecurity([]));
    const optional = await load(specWithSecurity([{}, { api: [] }]));

    expect(nodesWith(navItems(none.items, 'First')[0]?.content, 'nodeType', 'security')).toEqual(
      [],
    );
    const [codeSample] = nodesWith(
      navItems(optional.items, 'First')[0]?.content,
      'operationType',
      'http',
    );
    expect(codeSample?.security).toEqual([
      { schemes: [expect.objectContaining({ id: 'api' })], scopes: [] },
    ]);
  });
});

describe('withErrorHandling', () => {
  const content: ApiItemContent = { contentType: 'item', children: [] };

  it('returns what the builder returns, called with the same arguments', () => {
    const build = vi.fn((_id: string, _count: number) => content);

    expect(withErrorHandling((id) => id, build)('a', 1)).toBe(content);
    expect(build).toHaveBeenCalledWith('a', 1);
  });

  it('reports the throw with the item named by labelOf and returns empty content', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const cause = new TypeError('n is not iterable');
    const build = withErrorHandling(
      (id: string) => `Item ${id}`,
      (_id: string): ApiItemContent => {
        throw cause;
      },
      'overview',
    );

    expect(build('a')).toEqual({ contentType: 'overview', children: [] });
    expect(console.error).toHaveBeenCalledWith(
      '[api-docs] %s:',
      'Could not build "Item a" from the API description',
      cause,
    );
  });

  it('still reports and returns empty content when labelOf throws too', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const cause = new TypeError('n is not iterable');
    const build = withErrorHandling(
      (): string => {
        throw new TypeError("Cannot read properties of null (reading 'title')");
      },
      (): ApiItemContent => {
        throw cause;
      },
    );

    expect(build()).toEqual({ contentType: 'item', children: [] });
    expect(console.error).toHaveBeenCalledWith(
      '[api-docs] %s:',
      'Could not build "item" from the API description',
      cause,
    );
  });
});
