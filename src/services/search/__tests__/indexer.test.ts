import { describe, it, expect } from 'vitest';

import type { Node } from '@markdoc/markdoc';
import type { ApiItem, ApiItemContent, SchemaEntry } from '../../../types/store.js';
import type {
  MarkdocNode,
  ContainerNode,
  OverviewSectionWrapperNode,
  ItemContentNode,
} from '../../../types/content.js';

import { nodeTypes, contentType } from '../../../types/common.js';
import { ApiDocsSearchIndexer } from '../indexer/index.js';

function textNode(text: string): Node {
  return {
    $$mdtype: 'Node',
    type: 'text',
    attributes: { content: text },
    children: [],
  } as unknown as Node;
}

function codeNode(text: string): Node {
  return {
    $$mdtype: 'Node',
    type: 'code',
    attributes: { content: text },
    children: [],
  } as unknown as Node;
}

function makeMarkdocNode(text: string): MarkdocNode {
  return { nodeType: nodeTypes.MARKDOC, content: textNode(text) };
}

function makeInlineCodeMarkdocNode(text: string): MarkdocNode {
  return {
    nodeType: nodeTypes.MARKDOC,
    content: {
      type: 'paragraph',
      children: [codeNode(text)],
      attributes: {},
    } as unknown as Node,
  };
}

function makeContainerNode(children: MarkdocNode[]): ContainerNode {
  return { nodeType: nodeTypes.CONTAINER, children };
}

function makeOverviewSectionWrapperNode(children: MarkdocNode[]): OverviewSectionWrapperNode {
  return { nodeType: nodeTypes.OVERVIEW_SECTION_WRAPPER, children, sectionId: 'section-1' };
}

function makeItemContentNode(
  params: ItemContentNode['parameters'],
  overrides?: Partial<ItemContentNode>,
): ItemContentNode {
  return { nodeType: nodeTypes.ITEM, variant: 'query', parameters: params, ...overrides };
}

function makeSchemaEntry(data: Record<string, unknown>): SchemaEntry {
  return { id: 'test-schema', kind: 'json-schema', data };
}

function makeContent(
  ct: ApiItemContent['contentType'],
  children: ApiItemContent['children'] = [],
  meta?: ApiItemContent['meta'],
): ApiItemContent {
  return { contentType: ct, children, meta };
}

function makeItem(overrides: Partial<ApiItem> & { content: ApiItemContent | null }): ApiItem {
  return {
    type: 'link',
    label: 'Test Item',
    link: '/api/test',
    ...overrides,
  } as ApiItem;
}

const EMPTY_DOC = {};

describe('ApiDocsSearchIndexer', () => {
  const BASE_PATH = '/api/base';

  describe('addItem', () => {
    it('uses basePath as URL for OVERVIEW content type', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          link: '/api/overview',
          label: 'Overview',
          content: makeContent(contentType.OVERVIEW),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.url).toBe(BASE_PATH);
      expect(doc.id).toBe(BASE_PATH);
    });

    it('uses item.link as URL for GROUP content type', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          link: '/api/pets',
          label: 'Pets',
          content: makeContent(contentType.GROUP),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.url).toBe('/api/pets');
    });

    it('uses item.link as URL for ITEM content type', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          link: '/api/pets/list',
          label: 'List Pets',
          content: makeContent(contentType.ITEM),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.url).toBe('/api/pets/list');
    });

    it('skips items with no link', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          link: undefined as unknown as string,
          content: makeContent(contentType.ITEM),
        }),
      );

      expect(indexer.getResult()).toHaveLength(0);
    });

    it('skips items with null content', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(makeItem({ link: '/api/test', content: null }));

      expect(indexer.getResult()).toHaveLength(0);
    });

    it('uses item.label as the document title', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          label: 'List Pets',
          content: makeContent(contentType.ITEM),
        }),
      );

      expect(indexer.getResult()[0].title).toBe('List Pets');
    });

    it('falls back to empty string when label is missing', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          label: undefined,
          content: makeContent(contentType.ITEM),
        }),
      );

      expect(indexer.getResult()[0].title).toBe('');
    });

    it('propagates the deprecated flag from item meta', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [], { deprecated: true }),
        }),
      );

      expect(indexer.getResult()[0].deprecated).toBe(true);
    });

    it('sets path to empty array on every document', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(makeItem({ content: makeContent(contentType.ITEM) }));

      expect(indexer.getResult()[0].path).toEqual([]);
    });

    it('maps httpVerb to httpMethod on the document', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      const item = makeItem({ content: makeContent(contentType.ITEM) });
      (item as Record<string, unknown>).httpVerb = 'get';

      indexer.addItem(item);

      expect(indexer.getResult()[0].httpMethod).toBe('get');
    });

    it('omits httpMethod when httpVerb is not present', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(makeItem({ content: makeContent(contentType.ITEM) }));

      expect(indexer.getResult()[0].httpMethod).toBeUndefined();
    });

    it('maps httpPath from the item to the document', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      const item = makeItem({ content: makeContent(contentType.ITEM) });
      (item as Record<string, unknown>).httpPath = '/transactions';

      indexer.addItem(item);

      expect(indexer.getResult()[0].httpPath).toBe('/transactions');
    });

    it('omits httpPath when not present on the item', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(makeItem({ content: makeContent(contentType.ITEM) }));

      expect(indexer.getResult()[0].httpPath).toBeUndefined();
    });

    it('maps the AsyncAPI channel address to httpPath', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      const item = makeItem({
        content: makeContent(contentType.ITEM, [
          {
            nodeType: nodeTypes.CONTAINER,
            children: [
              { nodeType: nodeTypes.CHANNEL_ADDRESS, address: 'orders.{region}.lifecycle' },
              makeMarkdocNode('Every state transition of an order'),
            ],
          },
        ]),
      });
      (item as Record<string, unknown>).httpVerb = 'topic';

      indexer.addItem(item);

      expect(indexer.getResult()[0]).toMatchObject({
        httpMethod: 'topic',
        httpPath: 'orders.{region}.lifecycle',
        text: 'Every state transition of an order',
      });
    });

    it('propagates badges from the item', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      const badges = [{ name: 'Experimental', color: 'orange' }];
      const item = makeItem({ content: makeContent(contentType.ITEM) });
      (item as Record<string, unknown>).badges = badges;

      indexer.addItem(item);

      expect(indexer.getResult()[0].badges).toEqual(badges);
    });

    it('omits badges when not present on the item', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(makeItem({ content: makeContent(contentType.ITEM) }));

      expect(indexer.getResult()[0].badges).toBeUndefined();
    });

    it('propagates isAdditionalOperation from the item', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      const item = makeItem({ content: makeContent(contentType.ITEM) });
      (item as Record<string, unknown>).isAdditionalOperation = true;

      indexer.addItem(item);

      expect(indexer.getResult()[0].isAdditionalOperation).toBe(true);
    });

    it('omits isAdditionalOperation when not set on the item', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(makeItem({ content: makeContent(contentType.ITEM) }));

      expect(indexer.getResult()[0].isAdditionalOperation).toBeUndefined();
    });


    it('accumulates multiple items', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(makeItem({ link: '/api/a', content: makeContent(contentType.ITEM) }));
      indexer.addItem(makeItem({ link: '/api/b', content: makeContent(contentType.ITEM) }));

      expect(indexer.getResult()).toHaveLength(2);
    });
  });

  describe('text extraction', () => {
    it('extracts text from a MarkdocNode', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [makeMarkdocNode('Hello world')]),
        }),
      );

      expect(indexer.getResult()[0].text).toBe('Hello world');
    });

    it('extracts text from nested MarkdocNodes inside a ContainerNode', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeContainerNode([makeMarkdocNode('Container text')]),
          ]),
        }),
      );

      expect(indexer.getResult()[0].text).toBe('Container text');
    });

    it('extracts text from nested MarkdocNodes inside an OverviewSectionWrapperNode', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeOverviewSectionWrapperNode([makeMarkdocNode('Overview text')]),
          ]),
        }),
      );

      expect(indexer.getResult()[0].text).toBe('Overview text');
    });

    it('joins text from multiple MarkdocNodes with a space', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeMarkdocNode('First'),
            makeMarkdocNode('Second'),
          ]),
        }),
      );

      expect(indexer.getResult()[0].text).toBe('First Second');
    });

    it('returns empty string when no MarkdocNodes are present', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [makeItemContentNode([])]),
        }),
      );

      expect(indexer.getResult()[0].text).toBe('');
    });

    it('excludes MarkdocNodes that contain only inline code from text', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeContainerNode([
              makeInlineCodeMarkdocNode('ride-requests-{region}'),
              makeMarkdocNode('Primary topic for all ride requests'),
            ] as MarkdocNode[]),
          ]),
        }),
      );

      expect(indexer.getResult()[0].text).toBe('Primary topic for all ride requests');
    });

    it('keeps MarkdocNodes that mix inline code with text', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      const mixedNode: MarkdocNode = {
        nodeType: nodeTypes.MARKDOC,
        content: {
          type: 'paragraph',
          children: [textNode('The '), codeNode('id'), textNode(' field is required')],
          attributes: {},
        } as unknown as Node,
      };
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [mixedNode]),
        }),
      );

      expect(indexer.getResult()[0].text).toBe('The id field is required');
    });
  });

  describe('parameter extraction', () => {
    it('extracts parameters with a string description from an ItemContentNode', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([
              {
                name: 'limit',
                schemaId: 'limit',
                description: 'Max items to return',
                required: true,
              },
            ]),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'limit',
        description: 'Max items to return',
        place: 'query parameters',
        required: true,
      });
    });

    it('extracts parameters with an AST description', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([
              {
                name: 'offset',
                schemaId: 'offset',
                description: textNode('Items to skip') as unknown as Node,
                required: false,
              },
            ]),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0].description).toBe('Items to skip');
    });

    it('indexes a formatted AST description as plain text, without markdown syntax', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([
              {
                name: 'cursor',
                schemaId: 'cursor',
                description: {
                  type: 'paragraph',
                  children: [
                    textNode('Use '),
                    codeNode('nextCursor'),
                    textNode(' when '),
                    { ...textNode('paging'), type: 'strong' },
                  ],
                  attributes: {},
                } as unknown as Node,
                required: false,
              },
            ]),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0].description).toBe('Use nextCursor when paging');
    });

    it('handles missing description gracefully', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([{ name: 'token', schemaId: 'token' }]),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0].description).toBe('');
    });

    it('omits parameters key when the node has no parameters', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [makeItemContentNode([])]),
        }),
      );

      expect(indexer.getResult()[0].parameters).toBeUndefined();
    });

    it('collects parameters from ItemContentNodes inside a ContainerNode', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      const container: ContainerNode = {
        nodeType: nodeTypes.CONTAINER,
        children: [
          makeItemContentNode([{ name: 'page', schemaId: 'page', description: 'Page number' }]),
        ],
      };
      indexer.addItem(makeItem({ content: makeContent(contentType.ITEM, [container]) }));

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0].name).toBe('page');
    });
  });

  describe('schema field extraction', () => {
    it('extracts fields from a schema referenced by schemaId', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'pet-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Pet name' },
            age: { type: 'integer', description: 'Pet age' },
          },
          required: ['name'],
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'pet-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'name',
        description: 'Pet name',
        place: 'request fields',
        required: true,
      });
      expect((doc.parameters ?? [])[1]).toMatchObject({
        name: 'age',
        description: 'Pet age',
        required: false,
      });
    });

    it('extracts nested object properties with path', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'order-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            address: {
              type: 'object',
              properties: {
                city: { type: 'string', description: 'City name' },
                zip: { type: 'string' },
              },
              required: ['city'],
            },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'order-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(3);
      expect((doc.parameters ?? [])[0]).toMatchObject({ name: 'address', path: [] });
      expect((doc.parameters ?? [])[1]).toMatchObject({
        name: 'city',
        path: ['address'],
        required: true,
      });
      expect((doc.parameters ?? [])[2]).toMatchObject({
        name: 'zip',
        path: ['address'],
        required: false,
      });
    });

    it('extracts fields from response schemas', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'resp-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Resource ID' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [{ code: '200', schemaId: 'resp-schema' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'id',
        place: 'response 200 fields',
      });
    });

    it('indexes the response description with a deep link to the response section', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, {}, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [{ code: '500', description: 'Internal server error.' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: '500',
        description: 'Internal server error.',
        place: 'response 500',
        deepLink: '/api/test#api/test/response&c=500',
      });
    });

    it('keeps the full item slug when the docs are served at the root', () => {
      const indexer = new ApiDocsSearchIndexer('/');
      indexer.addItem(
        makeItem({
          link: '/rides/topics/ride-matches',
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [{ code: '500', description: 'Internal server error.' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0]).toMatchObject({
        deepLink: '/rides/topics/ride-matches#rides/topics/ride-matches/response&c=500',
      });
    });

    it('indexes the response description even without a schema store and document', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [{ code: '500', description: 'Internal server error.' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: '500',
        description: 'Internal server error.',
        place: 'response 500',
      });
    });

    it('indexes response summary and Markdoc description together', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, {}, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [
                {
                  code: '404',
                  summary: 'Not found',
                  description: textNode('The requested resource does not exist.'),
                },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: '404',
        description: 'Not found The requested resource does not exist.',
        place: 'response 404',
      });
    });

    it('indexes both the response description and its schema fields', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'resp-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            type: { type: 'string', description: 'URI reference of the problem type' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [
                { code: '500', description: 'Internal server error.', schemaId: 'resp-schema' },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: '500',
        place: 'response 500',
      });
      expect((doc.parameters ?? [])[1]).toMatchObject({
        name: 'type',
        place: 'response 500 fields',
      });
    });

    it('extracts fields from mediaTypeSchemas', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'json-body': makeSchemaEntry({
          type: 'object',
          properties: {
            title: { type: 'string' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'body',
              mediaTypeSchemas: { 'application/json': { schemaId: 'json-body' } },
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'title',
        mediaType: 'application/json',
        place: 'request fields',
      });
    });

    it('indexes a free-form map field without walking into its value schema', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'json-body': makeSchemaEntry({
          type: 'object',
          properties: {
            details: {
              type: 'object',
              description: 'Additional error details.',
              additionalProperties: true,
            },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'body',
              mediaTypeSchemas: { 'application/json': { schemaId: 'json-body' } },
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'details',
        description: 'Additional error details.',
        place: 'request fields',
      });
    });

    it('includes enum values and example from schema fields', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'enum-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'enum-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'status',
        enum: ['active', 'inactive'],
        example: 'active',
      });
    });

    it('truncates huge string examples in indexed parameters', () => {
      const huge = 'A'.repeat(5000);
      const schemaStore: Record<string, SchemaEntry> = {
        'blob-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            blob: { type: 'string', example: huge },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'blob-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0].example).toBe(`${'A'.repeat(200)}…`);
    });

    it('truncates huge stringified non-string examples in indexed parameters', () => {
      const hugeObject = { data: 'B'.repeat(5000) };
      const schemaStore: Record<string, SchemaEntry> = {
        'blob-object-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            payload: { type: 'object', example: hugeObject },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'blob-object-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const example = (doc.parameters ?? [])[0].example ?? '';
      expect(example).toBe(`${JSON.stringify(hugeObject).slice(0, 200)}…`);
    });

    it('handles array items by walking into the items schema', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'list-schema': makeSchemaEntry({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
            },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'list-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({ name: 'id' });
    });

    it('handles oneOf variants by extracting fields from each', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'union-schema': makeSchemaEntry({
          oneOf: [
            { type: 'object', properties: { dog: { type: 'string' } } },
            { type: 'object', properties: { cat: { type: 'string' } } },
          ],
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'union-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? []).map((p) => p.name)).toEqual(['dog', 'cat']);
    });

    it('links oneOf fields to the variant that renders them', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'union-schema': makeSchemaEntry({
          type: 'object',
          properties: { shared: { type: 'string' } },
          oneOf: [
            { type: 'object', properties: { dog: { type: 'string' } } },
            {
              type: 'object',
              properties: { cats: { type: 'array', items: { properties: { cat: {} } } } },
            },
          ],
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'union-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const deepLinkOf = (name: string): string | undefined =>
        (doc.parameters ?? []).find((p) => p.name === name)?.deepLink;

      expect(deepLinkOf('shared')).toBe('/api/test#api/test/t=request&path=&oneof=0/shared');
      expect(deepLinkOf('dog')).toBe('/api/test#api/test/t=request&path=&oneof=0/dog');
      expect(deepLinkOf('cats')).toBe('/api/test#api/test/t=request&path=&oneof=1/cats');
      expect(deepLinkOf('cat')).toBe('/api/test#api/test/t=request&path=&oneof=1/cats[]/cat');
    });

    it('skips schema extraction when no schemaStore is provided', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'missing' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toBeUndefined();
    });

    it('does not loop on circular schema references', () => {
      const document = {
        components: {
          schemas: {
            TreeNode: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                children: { type: 'array', items: { $ref: '#/components/schemas/TreeNode' } },
              },
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        'components/schemas/TreeNode': makeSchemaEntry(document.components.schemas.TreeNode),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'components/schemas/TreeNode' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? []).length).toBeGreaterThan(0);
      expect((doc.parameters ?? [])[0]).toMatchObject({ name: 'name' });
    });

    it('combines top-level parameters with schema fields', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'body-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            location: { type: 'string', description: 'Event location' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      const itemNode = makeItemContentNode(
        [{ name: 'eventId', schemaId: 'id', description: 'Event ID', required: true }],
        { variant: 'body', schemaId: 'body-schema' },
      );
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [itemNode]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? [])[0].name).toBe('eventId');
      expect((doc.parameters ?? [])[1]).toMatchObject({
        name: 'location',
        description: 'Event location',
        place: 'request fields',
      });
    });

    it('resolves $ref properties using the document', () => {
      const document = {
        components: {
          schemas: {
            EventPrice: {
              type: 'number',
              format: 'float',
              description: 'Price of a ticket for the special event.',
              example: 25,
            },
            EventName: {
              type: 'string',
              description: 'Name of the special event.',
              example: 'Pirate Coding Workshop',
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        'body-schema': makeSchemaEntry({
          type: 'object',
          required: ['price'],
          properties: {
            price: { $ref: '#/components/schemas/EventPrice' },
            name: { $ref: '#/components/schemas/EventName' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'body-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'price',
        description: 'Price of a ticket for the special event.',
        required: true,
        example: '25',
      });
      expect((doc.parameters ?? [])[1]).toMatchObject({
        name: 'name',
        description: 'Name of the special event.',
        required: false,
      });
    });

    it('extracts GraphQL fields from graphqlSchema', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'graphql-fields',
              graphqlSchema: [
                { name: 'title', type: 'String!', description: textNode('Book title') },
                { name: 'pageCount', type: 'Int', description: textNode('Number of pages') },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'title',
        description: 'Book title',
        place: 'fields',
        type: 'String!',
      });
      expect((doc.parameters ?? [])[1]).toMatchObject({
        name: 'pageCount',
        description: 'Number of pages',
        type: 'Int',
      });
    });

    it('extracts GraphQL arguments from graphqlSchema', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'graphql-args',
              graphqlSchema: [
                { name: 'id', type: 'ID!', description: textNode('Book identifier') },
                { name: 'limit', type: 'Int', description: textNode('Max results') },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'id',
        place: 'arguments',
        type: 'ID!',
      });
    });

    it('extracts nested args within GraphQL fields', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'graphql-fields',
              graphqlSchema: [
                {
                  name: 'avatarUrl',
                  type: 'URI!',
                  description: textNode('Avatar URL'),
                  args: [
                    { name: 'size', type: 'Int', description: textNode('Image size in pixels') },
                  ],
                },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(2);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'avatarUrl',
        place: 'fields',
        path: [],
      });
      expect((doc.parameters ?? [])[1]).toMatchObject({
        name: 'size',
        description: 'Image size in pixels',
        place: 'arguments',
        path: ['avatarUrl'],
        type: 'Int',
      });
    });

    it('handles GraphQL fields with AST descriptions', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'graphql-fields',
              graphqlSchema: [
                {
                  name: 'name',
                  type: 'String',
                  description: textNode('The name field') as unknown as Node[],
                },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0].description).toBe('The name field');
    });

    it('handles GraphQL fields with no description', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'graphql-fields',
              graphqlSchema: [{ name: 'id', type: 'ID!' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect((doc.parameters ?? [])[0].description).toBe('');
    });

    it('does not require schemaStore for GraphQL field extraction', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'graphql-fields',
              graphqlSchema: [{ name: 'status', type: 'Boolean!' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({ name: 'status', type: 'Boolean!' });
    });

    it('skips readOnly fields in request bodies', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'req-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Writable name' },
            id: { type: 'string', description: 'Auto-generated ID', readOnly: true },
            createdAt: { type: 'string', readOnly: true },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'req-schema' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const names = (doc.parameters ?? []).map((p) => p.name);
      expect(names).toContain('name');
      expect(names).not.toContain('id');
      expect(names).not.toContain('createdAt');
    });

    it('includes readOnly fields in response bodies', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'resp-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            name: { type: 'string' },
            id: { type: 'string', readOnly: true },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [{ code: '200', schemaId: 'resp-schema' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const names = (doc.parameters ?? []).map((p) => p.name);
      expect(names).toContain('name');
      expect(names).toContain('id');
    });

    it('skips writeOnly fields in response bodies', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'resp-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            name: { type: 'string' },
            password: { type: 'string', writeOnly: true },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [{ code: '200', schemaId: 'resp-schema' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const names = (doc.parameters ?? []).map((p) => p.name);
      expect(names).toContain('name');
      expect(names).not.toContain('password');
    });

    it('deduplicates parameters with same name+place+path+description', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'dup-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            name: { type: 'string', description: 'A name' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'body',
              schemaId: 'dup-schema',
              mediaTypeSchemas: { 'application/json': { schemaId: 'dup-schema' } },
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
    });

    it('preserves all properties during allOf merge', () => {
      const document = {
        components: {
          schemas: {
            ErrorBase: {
              type: 'object',
              properties: {
                status: { type: 'integer', description: 'HTTP status code.' },
                type: { type: 'string' },
              },
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        'error-schema': makeSchemaEntry({
          allOf: [
            { $ref: '#/components/schemas/ErrorBase' },
            {
              type: 'object',
              properties: {
                detail: { type: 'string', description: 'Error detail message' },
              },
            },
          ],
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'responses',
              responses: [{ code: '401', schemaId: 'error-schema' }],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const names = (doc.parameters ?? []).map((p) => p.name);
      expect(names).toContain('status');
      expect(names).toContain('type');
      expect(names).toContain('detail');
    });

    it('maps parameter place names correctly', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([{ name: 'q', schemaId: 'q', description: '' }], {
              variant: 'query',
            }),
            makeItemContentNode([{ name: 'id', schemaId: 'id', description: '' }], {
              variant: 'path',
            }),
            makeItemContentNode([{ name: 'auth', schemaId: 'auth', description: '' }], {
              variant: 'headers',
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const places = (doc.parameters ?? []).map((p) => p.place);
      expect(places).toContain('query parameters');
      expect(places).toContain('path parameters');
      expect(places).toContain('header parameters');
    });

    it('prefers mediaTypeSchemas over schemaId to avoid duplicates', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'the-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            title: { type: 'string' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'body',
              schemaId: 'the-schema',
              mediaTypeSchemas: { 'application/json': { schemaId: 'the-schema' } },
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0].mediaType).toBe('application/json');
    });

    it('extracts fields from AsyncAPI message payload schemas', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'ride-payload': makeSchemaEntry({
          type: 'object',
          properties: {
            passengerId: { type: 'string', description: 'Unique passenger identifier' },
            speed: { type: 'number', description: 'Current speed in km/h' },
          },
          required: ['passengerId'],
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'messages',
              messages: [
                {
                  name: 'UserRatings',
                  summary: 'Ride feedback',
                  schemaId: 'ride-payload',
                  contentType: 'application/json',
                },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const params = doc.parameters ?? [];
      expect(params).toHaveLength(3);
      expect(params[0]).toMatchObject({
        name: 'UserRatings',
        place: 'message',
        description: 'Ride feedback',
      });
      expect(params[1]).toMatchObject({
        name: 'passengerId',
        description: 'Unique passenger identifier',
        place: 'message payload',
        mediaType: 'application/json',
        required: true,
        deepLink: '/api/test#api/test/messages&m=userratings&t=payload&path=passengerid',
      });
      expect(params[2]).toMatchObject({
        name: 'speed',
        description: 'Current speed in km/h',
        place: 'message payload',
        type: 'number',
        deepLink: '/api/test#api/test/messages&m=userratings&t=payload&path=speed',
      });
    });

    it('keeps identical fields from different messages as separate rows', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'snapshot-payload': makeSchemaEntry({
          type: 'object',
          properties: { type: { type: 'string' } },
        }),
        'update-payload': makeSchemaEntry({
          type: 'object',
          properties: { type: { type: 'string' } },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'messages',
              messages: [
                { name: 'boardSnapshot', schemaId: 'snapshot-payload' },
                { name: 'orderUpdate', schemaId: 'update-payload' },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const typeRows = (doc.parameters ?? []).filter((p) => p.name === 'type');
      expect(typeRows.map((p) => p.deepLink)).toEqual([
        '/api/test#api/test/messages&m=boardsnapshot&t=payload&path=type',
        '/api/test#api/test/messages&m=orderupdate&t=payload&path=type',
      ]);
    });

    it('indexes MCP tool descriptions and input/output schema fields from x-mcp', () => {
      const document = {
        'x-mcp': {
          tools: [
            {
              name: 'echo',
              description: 'Echoes back the **input**.',
              inputSchema: {
                type: 'object',
                properties: { message: { type: 'string', description: 'Message to echo' } },
                required: ['message'],
              },
              outputSchema: {
                type: 'object',
                properties: { echoed: { type: 'string', description: 'The echoed text' } },
              },
            },
          ],
          resources: [
            {
              name: 'Resource 1',
              uri: 'test://static/resource/1',
              mimeType: 'text/plain',
              description: 'A plaintext resource.',
            },
          ],
          prompts: [
            {
              name: 'complex_prompt',
              description: 'A prompt with arguments',
              arguments: [
                { name: 'temperature', description: 'Temperature setting', required: true },
                { name: 'style', description: 'Output style' },
              ],
            },
          ],
        },
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, {}, document);
      const mcpItem = (label: string, link: string, httpVerb: string, name: string) =>
        ({
          type: 'link',
          label,
          link,
          httpVerb,
          content: {
            contentType: contentType.ITEM,
            meta: { name },
            children: [{ nodeType: nodeTypes.MARKDOC, content: [] }],
          },
        }) as unknown as ApiItem;
      indexer.addItem(mcpItem('echo', '/api/base/tools/echo', 'tool', 'echo'));
      indexer.addItem(
        mcpItem('Resource 1', '/api/base/resources/resource-1', 'rsrc', 'Resource 1'),
      );
      indexer.addItem(
        mcpItem('complex_prompt', '/api/base/prompts/complex_prompt', 'prompt', 'complex_prompt'),
      );

      const [tool, resource, prompt] = indexer.getResult();

      expect(tool.text).toBe('Echoes back the input.');
      expect(tool.parameters).toEqual([
        expect.objectContaining({
          name: 'message',
          description: 'Message to echo',
          place: 'input schema',
          required: true,
          deepLink: '/tools/echo#tools/echo/t=input-schema&path=message',
        }),
        expect.objectContaining({
          name: 'echoed',
          place: 'output schema',
          deepLink: '/tools/echo#tools/echo/t=output-schema&path=echoed',
        }),
      ]);

      expect(resource.text).toBe('A plaintext resource. test://static/resource/1 text/plain');
      expect(resource.parameters).toBeUndefined();

      expect(prompt.text).toBe('A prompt with arguments');
      expect(prompt.parameters?.map((p) => [p.name, p.place, p.required, p.deepLink])).toEqual([
        [
          'temperature',
          'arguments',
          true,
          '/prompts/complex_prompt#prompts/complex_prompt/t=arguments&path=temperature',
        ],
        [
          'style',
          'arguments',
          false,
          '/prompts/complex_prompt#prompts/complex_prompt/t=arguments&path=style',
        ],
      ]);
    });

    it('extracts fields from AsyncAPI message header schemas', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'msg-headers': makeSchemaEntry({
          type: 'object',
          properties: {
            correlationId: { type: 'string', description: 'Correlation ID for tracing' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'messages',
              messages: [
                {
                  name: 'EventMessage',
                  headerSchemaId: 'msg-headers',
                },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const params = doc.parameters ?? [];
      expect(params).toHaveLength(2);
      expect(params[0]).toMatchObject({
        name: 'EventMessage',
        place: 'message',
      });
      expect(params[1]).toMatchObject({
        name: 'correlationId',
        place: 'message headers',
        deepLink: '/api/test#api/test/messages&m=eventmessage&t=headers&path=correlationid',
      });
    });

    it('extracts both payload and header fields from AsyncAPI messages', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'payload-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            eventType: { type: 'string' },
          },
        }),
        'header-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            traceId: { type: 'string' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'messages',
              messages: [
                {
                  name: 'Notification',
                  schemaId: 'payload-schema',
                  headerSchemaId: 'header-schema',
                },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const params = doc.parameters ?? [];
      expect(params).toHaveLength(3);
      const places = params.map((p) => p.place);
      expect(places).toContain('message');
      expect(places).toContain('message payload');
      expect(places).toContain('message headers');
    });

    it('creates separate message-level entries and keeps each message copy of a shared payload field', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'shared-payload': makeSchemaEntry({
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'messages',
              messages: [
                { name: 'MessageA', schemaId: 'shared-payload' },
                { name: 'MessageB', schemaId: 'shared-payload' },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const params = doc.parameters ?? [];
      const msgEntries = params.filter((p) => p.place === 'message');
      const payloadEntries = params.filter((p) => p.place === 'message payload');
      expect(msgEntries).toHaveLength(2);
      expect(msgEntries.map((m) => m.name)).toEqual(['MessageA', 'MessageB']);
      // One row per message: each deep-links into its own message panel.
      expect(payloadEntries.map((p) => p.deepLink)).toEqual([
        '/api/test#api/test/messages&m=messagea&t=payload&path=userid',
        '/api/test#api/test/messages&m=messageb&t=payload&path=userid',
      ]);
    });

    it('resolves readOnly through allOf in property schemas', () => {
      const document = {
        components: {
          schemas: {
            Id: { type: 'integer', readOnly: true },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        pet: makeSchemaEntry({
          type: 'object',
          properties: {
            id: {
              description: 'Pet ID',
              allOf: [{ $ref: '#/components/schemas/Id' }],
            },
            name: { type: 'string', description: 'Pet name' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'pet' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const params = doc.parameters ?? [];
      expect(params).toHaveLength(1);
      expect(params[0]).toMatchObject({ name: 'name', description: 'Pet name' });
    });

    it('indexes discriminator variants under the branch that renders them', () => {
      const document = {
        components: {
          schemas: {
            Cat: {
              allOf: [
                { $ref: '#/components/schemas/Pet' },
                { type: 'object', properties: { huntingSkill: { type: 'string' } } },
              ],
            },
            Dog: {
              allOf: [
                { $ref: '#/components/schemas/Pet' },
                { type: 'object', properties: { packSize: { type: 'integer' } } },
              ],
            },
            Pet: {
              type: 'object',
              discriminator: { propertyName: 'petType' },
              properties: {
                name: { type: 'string', description: 'Pet name' },
                petType: { type: 'string', description: 'Type of pet' },
              },
              oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        pet: makeSchemaEntry({
          $ref: '#/components/schemas/Pet',
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'pet' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const params = doc.parameters ?? [];
      const deepLinkOf = (name: string): string | undefined =>
        params.find((p) => p.name === name)?.deepLink;

      expect(deepLinkOf('name')).toBe('/api/test#api/test/t=request&path=&d=0/name');
      expect(deepLinkOf('petType')).toBe('/api/test#api/test/t=request&path=pettype');
      expect(deepLinkOf('huntingSkill')).toBe(
        '/api/test#api/test/t=request&path=&d=0/huntingskill',
      );
      expect(deepLinkOf('packSize')).toBe('/api/test#api/test/t=request&path=&d=1/packsize');
    });

    it('merges const discriminator values from every variant into one row', () => {
      const document = {
        components: {
          schemas: {
            Beverage: {
              type: 'object',
              properties: {
                category: { type: 'string', description: 'Menu item category.', const: 'beverage' },
              },
            },
            Dessert: {
              type: 'object',
              properties: {
                category: { type: 'string', description: 'Menu item category.', const: 'dessert' },
              },
            },
            MenuItem: {
              discriminator: {
                propertyName: 'category',
                mapping: {
                  beverage: '#/components/schemas/Beverage',
                  dessert: '#/components/schemas/Dessert',
                },
              },
              oneOf: [
                { $ref: '#/components/schemas/Beverage' },
                { $ref: '#/components/schemas/Dessert' },
              ],
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        menuItem: makeSchemaEntry({ $ref: '#/components/schemas/MenuItem' }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'menuItem' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const categories = (doc.parameters ?? []).filter((param) => param.name === 'category');
      expect(categories.map((param) => param.enum)).toEqual([['beverage', 'dessert']]);
    });

    it('keeps a row per variant when same-named fields differ only by their enum', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        job: makeSchemaEntry({
          oneOf: [
            {
              type: 'object',
              properties: {
                status: { type: 'string', description: 'Job status.', enum: ['queued'] },
              },
            },
            {
              type: 'object',
              properties: {
                status: { type: 'string', description: 'Job status.', enum: ['archived'] },
              },
            },
          ],
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'job' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const statuses = (doc.parameters ?? []).filter((param) => param.name === 'status');
      expect(statuses.map((param) => param.enum)).toEqual([['queued'], ['archived']]);
      expect(statuses.map((param) => param.deepLink)).toEqual([
        '/api/test#api/test/t=request&path=&oneof=0/status',
        '/api/test#api/test/t=request&path=&oneof=1/status',
      ]);
    });

    it('falls back to the mapping key when a discriminator property has no const or enum', () => {
      const document = {
        components: {
          schemas: {
            Cat: {
              type: 'object',
              properties: {
                petType: { type: 'string', description: 'Kind of pet' },
              },
            },
            Pet: {
              discriminator: {
                propertyName: 'petType',
                mapping: { cat: '#/components/schemas/Cat' },
              },
              oneOf: [{ $ref: '#/components/schemas/Cat' }],
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        pet: makeSchemaEntry({ $ref: '#/components/schemas/Pet' }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'pet' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const petType = (doc.parameters ?? []).find((param) => param.name === 'petType');
      expect(petType?.enum).toEqual(['cat']);
    });

    it('indexes every mapping key on a discriminator property declared by the base schema', () => {
      const document = {
        components: {
          schemas: {
            Cat: {
              allOf: [
                { $ref: '#/components/schemas/Pet' },
                { type: 'object', properties: { huntingSkill: { type: 'string' } } },
              ],
            },
            Dog: {
              allOf: [
                { $ref: '#/components/schemas/Pet' },
                { type: 'object', properties: { packSize: { type: 'integer' } } },
              ],
            },
            Pet: {
              type: 'object',
              discriminator: {
                propertyName: 'petType',
                mapping: {
                  cat: '#/components/schemas/Cat',
                  dog: '#/components/schemas/Dog',
                },
              },
              properties: {
                petType: { type: 'string', description: 'Kind of pet' },
              },
              oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        pet: makeSchemaEntry({ $ref: '#/components/schemas/Pet' }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'pet' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const petType = (doc.parameters ?? []).find((param) => param.name === 'petType');
      expect(petType?.enum).toEqual(['cat', 'dog']);
    });

    it('generates deepLink for schema fields and parameters', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        pet: makeSchemaEntry({
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Pet name' },
          },
        }),
        resp: makeSchemaEntry({
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Pet ID' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer('/docs/openapi/petstore', schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          link: '/docs/openapi/petstore/pet/addpet',
          content: makeContent(contentType.ITEM, [
            makeItemContentNode(
              [{ name: 'petId', schemaId: 'petId', description: 'ID of pet', required: true }],
              { variant: 'path' },
            ),
            makeItemContentNode([], {
              variant: 'body',
              mediaTypeSchemas: {
                'application/json': { schemaId: 'pet' },
              },
            }),
            makeItemContentNode([], {
              variant: 'responses',
              responses: [
                {
                  code: '200',
                  mediaTypeContent: { 'application/json': { schemaId: 'resp' } },
                },
              ],
            }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      const params = doc.parameters ?? [];

      const pathParam = params.find((p) => p.place === 'path parameters');
      expect(pathParam?.deepLink).toBe('/pet/addpet#pet/addpet/t=request&in=path&path=petid');

      const bodyParam = params.find((p) => p.name === 'name');
      expect(bodyParam?.deepLink).toBe('/pet/addpet#pet/addpet/t=request&path=name');
      expect(bodyParam?.mediaType).toBe('application/json');

      const respParam = params.find((p) => p.name === 'id');
      expect(respParam?.deepLink).toBe('/pet/addpet#pet/addpet/t=response&c=200&path=id');
      expect(respParam?.mediaType).toBe('application/json');
    });

    it('resolves $ref at the schema root level', () => {
      const document = {
        components: {
          schemas: {
            ActualSchema: {
              type: 'object',
              properties: {
                id: { type: 'integer', description: 'The ID' },
              },
            },
          },
        },
      };
      const schemaStore: Record<string, SchemaEntry> = {
        'top-ref': makeSchemaEntry({
          $ref: '#/components/schemas/ActualSchema',
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, document);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'body', schemaId: 'top-ref' }),
          ]),
        }),
      );

      const [doc] = indexer.getResult();
      expect(doc.parameters).toHaveLength(1);
      expect((doc.parameters ?? [])[0]).toMatchObject({
        name: 'id',
        description: 'The ID',
      });
    });
  });


  describe('markdown heading sub-results', () => {
    function headingNode(text: string, id?: string): Node {
      return {
        $$mdtype: 'Node',
        type: 'heading',
        attributes: { level: 2, ...(id ? { id } : {}) },
        children: [textNode(text)],
      } as unknown as Node;
    }

    it('indexes each heading with the text under it and a deep link to its anchor', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, undefined, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          link: '/api/base/pets/get',
          content: makeContent(contentType.ITEM, [
            {
              nodeType: nodeTypes.MARKDOC,
              content: [
                textNode('Preamble text.'),
                headingNode('Rate limits', 'pets/get/rate-limits'),
                textNode('Requests are limited per minute.'),
                textNode('Bursting is not allowed.'),
                headingNode('Pagination', 'pets/get/pagination'),
                textNode('Use the cursor parameter.'),
              ],
            } as MarkdocNode,
          ]),
        }),
      );

      const params = indexer.getResult()[0].parameters ?? [];
      const sections = params.filter((p) => p.place === 'description');
      expect(sections).toHaveLength(2);
      expect(sections[0]).toMatchObject({
        name: 'Rate limits',
        description: 'Requests are limited per minute. Bursting is not allowed.',
        deepLink: '/pets/get#pets/get/rate-limits',
      });
      expect(sections[1]).toMatchObject({
        name: 'Pagination',
        deepLink: '/pets/get#pets/get/pagination',
      });
    });

    it('falls back to the render-time section/<slug> anchor when a heading has no resolved id', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, undefined, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          link: '/api/base/pets/get',
          content: makeContent(contentType.ITEM, [
            {
              nodeType: nodeTypes.MARKDOC,
              content: [headingNode('Usage Notes'), textNode('Some notes.')],
            } as MarkdocNode,
          ]),
        }),
      );

      const sections = (indexer.getResult()[0].parameters ?? []).filter(
        (p) => p.place === 'description',
      );
      expect(sections[0]?.deepLink).toBe('/pets/get#section/usage-notes');
    });

    it('skips headings with no text', () => {
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, undefined, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          content: makeContent(contentType.ITEM, [
            {
              nodeType: nodeTypes.MARKDOC,
              content: [
                {
                  $$mdtype: 'Node',
                  type: 'heading',
                  attributes: { level: 2 },
                  children: [],
                } as unknown as Node,
                textNode('Orphan text.'),
              ],
            } as MarkdocNode,
          ]),
        }),
      );

      const sections = (indexer.getResult()[0].parameters ?? []).filter(
        (p) => p.place === 'description',
      );
      expect(sections).toHaveLength(0);
    });
  });

  describe('response headers', () => {
    it('indexes response header fields with the response-shaped deep link', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'headers-schema': makeSchemaEntry({
          type: 'object',
          properties: {
            'X-Rate-Limit': { type: 'integer', description: 'Calls left in the window' },
          },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      const responses = [
        { code: '2XX', headerSchemaId: 'headers-schema' },
      ] as unknown as ItemContentNode['responses'];
      indexer.addItem(
        makeItem({
          link: '/api/base/pets/get',
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], { variant: 'responses', responses }),
          ]),
        }),
      );

      const params = indexer.getResult()[0].parameters ?? [];
      const header = params.find((p) => p.name === 'X-Rate-Limit');
      expect(header).toMatchObject({
        place: 'response 2XX headers',
        deepLink: '/pets/get#pets/get/t=response&c=2xx&path=x-rate-limit',
      });
    });
  });

  describe('multiple media types', () => {
    it('indexes fields from every media type and dedupes shared ones to the first deep link', () => {
      const schemaStore: Record<string, SchemaEntry> = {
        'json-schema': makeSchemaEntry({
          type: 'object',
          properties: { shared: { type: 'string' }, jsonOnly: { type: 'string' } },
        }),
        'xml-schema': makeSchemaEntry({
          type: 'object',
          properties: { shared: { type: 'string' }, xmlOnly: { type: 'string' } },
        }),
      };
      const indexer = new ApiDocsSearchIndexer(BASE_PATH, schemaStore, EMPTY_DOC);
      indexer.addItem(
        makeItem({
          link: '/api/base/pets/post',
          content: makeContent(contentType.ITEM, [
            makeItemContentNode([], {
              variant: 'body',
              mediaTypeSchemas: {
                'application/json': { schemaId: 'json-schema' },
                'application/xml': { schemaId: 'xml-schema' },
              },
            }),
          ]),
        }),
      );

      const params = indexer.getResult()[0].parameters ?? [];
      const names = params.map((p) => p.name);
      expect(names).toEqual(expect.arrayContaining(['shared', 'jsonOnly', 'xmlOnly']));
      expect(params.filter((p) => p.name === 'shared')).toHaveLength(1);
      expect(params.find((p) => p.name === 'shared')?.deepLink).toContain('ct=application/json');
      expect(params.find((p) => p.name === 'xmlOnly')?.deepLink).toContain('ct=application/xml');
    });
  });
});
