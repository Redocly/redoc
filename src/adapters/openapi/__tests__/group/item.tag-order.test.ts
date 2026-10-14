import { describe, it, expect } from 'vitest';

import type { ApiItem } from '../../../../types/store.js';
import type { OpenAPIDefinition } from '../../../../types/openapi.js';

import { processOpenApiDocument } from '../../index.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../../components/markdoc/markdocParser.js';

async function buildItems(
  document: unknown,
  schemaDefinitionsTagName?: string,
): Promise<ApiItem[]> {
  const options = {
    ...normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      ...(schemaDefinitionsTagName ? { schemaDefinitionsTagName } : {}),
    }),
    markdownParser: markdocParser,
  };

  const { items } = await processOpenApiDocument({
    type: 'openapi',
    document: document as OpenAPIDefinition,
    basePath: '/api',
    options,
  });

  return items;
}

const groupLabels = (items: ApiItem[]): string[] =>
  items.filter((item) => item.type === 'group').map((item) => item.label as string);

const childLabels = (items: ApiItem[], groupLabel: string): string[] => {
  const group = items.find((item) => item.type === 'group' && item.label === groupLabel);
  return ((group?.items ?? []) as ApiItem[]).map((item) => item.label as string);
};

const operation = (tag: string, summary: string) => ({
  get: { tags: [tag], summary, responses: { '200': { description: 'ok' } } },
});

describe('order of the items inside a tag', () => {
  const document = {
    openapi: '3.1.0',
    info: { title: 'T', version: '1' },
    tags: [
      { name: 'Users', description: 'Intro.\n\n## Guides\n\nGuide body.\n' },
      { name: 'Child', parent: 'Users' },
    ],
    paths: {
      '/a': operation('Users', 'Op A'),
      '/b': operation('Users', 'Op B'),
      '/c': operation('Child', 'Child op'),
    },
    webhooks: {
      ping: {
        post: {
          tags: ['Users'],
          summary: 'Webhook op',
          responses: { '200': { description: 'ok' } },
        },
      },
    },
    'x-mcp': {
      tools: [{ name: 'search_users', title: 'Search users', tags: ['Users'], description: 'd' }],
    },
    components: {
      schemas: {
        ZuluSchema: { type: 'object', title: 'Account', 'x-tags': ['Users'] },
        AlphaSchema: { type: 'object', title: 'Zebra', 'x-tags': ['Users'] },
      },
    },
  };

  it('lists schemas, MCP tools, description sections, operations, then child tags', async () => {
    const items = await buildItems(document);

    expect(childLabels(items, 'Users')).toEqual([
      'Account',
      'Zebra',
      'Search users',
      'Guides',
      'Op A',
      'Op B',
      'Webhooks',
      'Webhook op',
      'Child',
    ]);
  });

  it('keeps the schemas in the order of components.schemas', async () => {
    const items = await buildItems(document);
    const schemas = childLabels(items, 'Users').slice(0, 2);

    expect(schemas).toEqual(['Account', 'Zebra']);
  });
});

describe('order of the top-level groups', () => {
  const pets = { '/pets': operation('Pets', 'List pets') };
  const schemas = { schemas: { Zulu: { type: 'object', title: 'Zulu' } } };
  const untaggedWebhook = {
    ping: { post: { summary: 'hook', responses: { '200': { description: 'ok' } } } },
  };

  const cases: Array<{ name: string; document: unknown; schemaTag?: string; expected: string[] }> =
    [
      {
        name: 'no tags declaration: the generated groups come first',
        document: {
          openapi: '3.1.0',
          info: { title: 'A', version: '1' },
          paths: pets,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Schemas', 'Pets'],
      },
      {
        name: 'a declared tag keeps the first position',
        document: {
          openapi: '3.1.0',
          info: { title: 'B', version: '1' },
          tags: [{ name: 'Pets' }],
          paths: pets,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'Schemas'],
      },
      {
        name: 'an undeclared tag comes after the generated groups',
        document: {
          openapi: '3.1.0',
          info: { title: 'C', version: '1' },
          tags: [{ name: 'Pets' }],
          paths: { ...pets, '/extra': operation('Extra', 'Extra op') },
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'Schemas', 'Extra'],
      },
      {
        name: 'the webhooks group sits between the declared tags and the schemas group',
        document: {
          openapi: '3.1.0',
          info: { title: 'D', version: '1' },
          tags: [{ name: 'Pets' }],
          paths: pets,
          webhooks: untaggedWebhook,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'webhooks', 'Schemas'],
      },
      {
        name: 'a declared tag with no operation still comes first',
        document: {
          openapi: '3.1.0',
          info: { title: 'E', version: '1' },
          tags: [{ name: 'Unused' }],
          paths: pets,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Unused', 'Schemas', 'Pets'],
      },
      {
        name: 'a declared schemas tag keeps the position the author chose',
        document: {
          openapi: '3.1.0',
          info: { title: 'F', version: '1' },
          tags: [{ name: 'Schemas' }, { name: 'Pets' }],
          paths: pets,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Schemas', 'Pets'],
      },
      {
        name: 'no tags declaration with webhooks: webhooks first, then schemas',
        document: {
          openapi: '3.1.0',
          info: { title: 'G', version: '1' },
          paths: pets,
          webhooks: untaggedWebhook,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['webhooks', 'Schemas', 'Pets'],
      },
      {
        name: 'an untagged MCP tool makes its own group, after the generated groups',
        document: {
          openapi: '3.1.0',
          info: { title: 'H', version: '1' },
          tags: [{ name: 'Pets' }],
          paths: pets,
          'x-mcp': { tools: [{ name: 'echo', description: 'd' }] },
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'Schemas', 'Tools'],
      },
      {
        name: 'without the schemaDefinitionsTagName option the webhooks group still comes first',
        document: {
          openapi: '3.1.0',
          info: { title: 'J', version: '1' },
          paths: pets,
          webhooks: untaggedWebhook,
        },
        expected: ['webhooks', 'Pets'],
      },
      {
        name: 'a child tag is nested, not a top-level group',
        document: {
          openapi: '3.1.0',
          info: { title: 'L', version: '1' },
          tags: [{ name: 'Pets' }, { name: 'Kitten', parent: 'Pets' }],
          paths: { ...pets, '/kitten': operation('Kitten', 'Kitten op') },
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'Schemas'],
      },
      {
        name: 'no webhooks: no webhooks group',
        document: {
          openapi: '3.1.0',
          info: { title: 'W1', version: '1' },
          tags: [{ name: 'Pets' }],
          paths: pets,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'Schemas'],
      },
      {
        name: 'a webhook that carries a tag stays inside that tag',
        document: {
          openapi: '3.1.0',
          info: { title: 'W3', version: '1' },
          tags: [{ name: 'Pets' }],
          paths: pets,
          webhooks: {
            ping: {
              post: {
                tags: ['Pets'],
                summary: 'hook',
                responses: { '200': { description: 'ok' } },
              },
            },
          },
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'Schemas'],
      },
      {
        name: 'a declared webhooks tag with no webhooks is dropped',
        document: {
          openapi: '3.1.0',
          info: { title: 'W4', version: '1' },
          tags: [{ name: 'webhooks', description: 'My hooks' }, { name: 'Pets' }],
          paths: pets,
          components: schemas,
        },
        schemaTag: 'Schemas',
        expected: ['Pets', 'Schemas'],
      },
    ];

  for (const { name, document, schemaTag, expected } of cases) {
    it(name, async () => {
      expect(groupLabels(await buildItems(document, schemaTag))).toEqual(expected);
    });
  }
});
