import { describe, expect, it } from 'vitest';

import type {
  ContainerNode,
  ContentNode,
  InfoMetadataNode,
  ItemContentNode,
  SecurityNode,
} from '../../../types/content.js';
import type { ExtractContext } from '../indexer/extractors/index.js';

import { nodeTypes, panelKind } from '../../../types/common.js';
import { extractFullText } from '../../../adapters/utils/markdoc.js';
import { SchemaWalker } from '../indexer/schema-walker.js';
import {
  extractorsFor,
  extractCallback,
  extractInfoMetadataRows,
  extractPanelRows,
  extractSecurityRows,
  extractServerFields,
} from '../indexer/extractors/index.js';
import { examplesExtractor } from '../indexer/extractors/examples.js';
import { bodyExtractor } from '../indexer/extractors/body.js';
import { namedRowsExtractor } from '../indexer/extractors/named-rows.js';

function makeNode(overrides: Partial<ItemContentNode>): ItemContentNode {
  return { nodeType: nodeTypes.ITEM, variant: 'query', ...overrides };
}

function makeContext(overrides: Partial<ExtractContext> = {}): ExtractContext {
  return {
    slug: 'pets/list',
    scope: {},
    paramsMap: {},
    visited: new Set(),
    walker: new SchemaWalker({ formatDescription: extractFullText }),
    formatDescription: extractFullText,
    hasSchemas: false,
    isOverview: false,
    ...overrides,
  };
}

describe('extractorsFor', () => {
  it('matches every extractor whose shape the node carries, in emit order', () => {
    const node = makeNode({
      variant: 'responses',
      parameters: [{ name: 'limit' }],
      responses: [{ code: '200' }],
      messages: [{ name: 'created', label: 'created' }],
    });
    expect(extractorsFor(node).map((e) => e.constructor === Object && Object.keys(e))).toHaveLength(
      3,
    );
  });

  it('routes a graphql node to the graphql extractor only', () => {
    const node = makeNode({ variant: 'graphql-fields', graphqlSchema: [{ name: 'id' }] });
    const [only, ...rest] = extractorsFor(node);
    expect(rest).toEqual([]);
    const ctx = makeContext();
    only.extract(node, ctx);
    expect(Object.values(ctx.paramsMap).map((p) => p.place)).toEqual(['fields']);
  });

  it('returns nothing for a node with no indexable part', () => {
    expect(extractorsFor(makeNode({ variant: 'body' }))).toEqual([]);
  });
});

describe('namedRowsExtractor', () => {
  it('emits one row per value with the section header as anchor', () => {
    const node = makeNode({
      variant: 'values',
      values: [{ name: 'CAT', description: 'A cat' }, { name: 'DOG' }],
    });
    const ctx = makeContext();
    expect(namedRowsExtractor.matches(node)).toBe(true);
    namedRowsExtractor.extract(node, ctx);
    expect(Object.values(ctx.paramsMap)).toEqual([
      expect.objectContaining({ name: 'CAT', description: 'A cat', place: 'values' }),
      expect.objectContaining({ name: 'DOG', place: 'values' }),
    ]);
    expect(Object.values(ctx.paramsMap)[0].deepLink).toMatch(/values$/);
  });

  it('prefixes the place inside a callback scope', () => {
    const node = makeNode({ variant: 'values', values: [{ name: 'CAT' }] });
    const ctx = makeContext({ scope: { callbackId: 'onEvent' } });
    namedRowsExtractor.extract(node, ctx);
    expect(Object.values(ctx.paramsMap)[0].place).toBe('callback values');
  });
});

describe('extractServerFields', () => {
  it('emits a row per broker carrying host, title, summary and description', () => {
    const ctx = makeContext();
    extractServerFields(
      {
        nodeType: nodeTypes.CONTAINER,
        children: [],
        panels: [
          {
            children: [
              {
                kind: panelKind.BROKERS,
                brokers: [
                  {
                    name: 'staging',
                    url: 'staging-kafka.wheelyfast.io:9092',
                    title: 'Staging Kafka Brokers',
                    summary: 'Pre-production messaging brokers',
                    description: 'Mirrors production topics.',
                  },
                ],
              },
            ],
          },
        ],
      } as ContentNode as ContainerNode,
      ctx,
    );

    expect(Object.values(ctx.paramsMap)).toEqual([
      expect.objectContaining({
        name: 'staging',
        place: 'server',
        description:
          'staging-kafka.wheelyfast.io:9092 Staging Kafka Brokers Pre-production messaging brokers Mirrors production topics.',
      }),
    ]);
  });
});

describe('extractPanelRows', () => {
  it('emits rows for servers and the overview info attributes', () => {
    const ctx = makeContext();
    extractPanelRows(
      {
        nodeType: nodeTypes.CONTAINER,
        children: [],
        panels: [
          {
            children: [
              {
                kind: panelKind.EMAIL,
                title: 'Platform team',
                email: 'api@example.com',
                label: 'api@example.com',
              },
              {
                kind: panelKind.EXTERNAL_LINK,
                title: 'License',
                label: 'MIT',
                url: 'https://opensource.org/license/mit',
              },
              {
                kind: panelKind.EXTERNAL_LINK,
                label: 'Terms of Service',
                url: 'https://example.com/terms',
              },
              {
                kind: panelKind.ATTRIBUTE,
                title: 'License',
                label: 'Apache-2.0',
                value: 'Apache-2.0',
              },
            ],
          },
          {
            children: [
              {
                kind: panelKind.SERVERS,
                servers: [
                  {
                    url: 'https://api.example.com/v1',
                    description: 'Production **cluster** behind the [gateway](https://example.com)',
                  },
                  { url: 'https://eu.example.com/v1', name: 'eu' },
                  { url: 'http://localhost:4010', isMockServer: true },
                ],
              },
            ],
          },
        ],
      } as ContentNode as ContainerNode,
      ctx,
    );

    expect(
      Object.values(ctx.paramsMap).map(({ name, description, place }) => ({
        name,
        description,
        place,
      })),
    ).toEqual([
      { name: 'Platform team', description: 'api@example.com', place: 'overview' },
      { name: 'License', description: 'MIT https://opensource.org/license/mit', place: 'overview' },
      { name: 'Terms of Service', description: 'https://example.com/terms', place: 'overview' },
      { name: 'License', description: 'Apache-2.0', place: 'overview' },
      {
        name: 'https://api.example.com/v1',
        description: 'Production cluster behind the gateway',
        place: 'server',
      },
      { name: 'eu', description: 'https://eu.example.com/v1', place: 'server' },
    ]);
  });
});

describe('server variables', () => {
  const variables = {
    region: {
      default: 'us-east-1',
      enum: ['us-east-1', 'eu-central-1'],
      description: 'Geographic region for the broker cluster',
    },
  };

  it('emits a variable row per server on the overview page', () => {
    const ctx = makeContext({ isOverview: true });
    extractPanelRows(
      {
        nodeType: nodeTypes.CONTAINER,
        children: [],
        panels: [
          {
            children: [
              { kind: panelKind.SERVERS, servers: [{ url: 'https://api.example.com', variables }] },
            ],
          },
        ],
      } as ContentNode as ContainerNode,
      ctx,
    );

    expect(
      Object.values(ctx.paramsMap).map(({ name, description, place }) => ({
        name,
        description,
        place,
      })),
    ).toEqual([
      { name: 'https://api.example.com', description: '', place: 'server' },
      {
        name: 'region',
        description:
          'Geographic region for the broker cluster default us-east-1 enum: us-east-1, eu-central-1',
        place: 'server variables',
      },
    ]);
  });

  it('skips variables outside the overview so a variable leads there only', () => {
    const ctx = makeContext();
    extractServerFields(
      {
        nodeType: nodeTypes.CONTAINER,
        children: [],
        panels: [
          {
            children: [
              {
                kind: panelKind.BROKERS,
                brokers: [{ name: 'staging', url: 'kafka:9092', variables }],
              },
            ],
          },
        ],
      } as ContentNode as ContainerNode,
      ctx,
    );

    expect(Object.values(ctx.paramsMap).map(({ place }) => place)).toEqual(['server']);
  });
});

describe('bodyExtractor request body description', () => {
  it('emits the body description as a row on the body section even without schemas', () => {
    const ctx = makeContext();
    const node = makeNode({
      variant: 'body',
      mediaTypes: ['application/json'],
      description: 'Cart snapshot the **ledger** turns into an order',
    });
    expect(extractorsFor(node)).toContain(bodyExtractor);

    for (const extractor of extractorsFor(node)) extractor.extract(node, ctx);

    expect(Object.values(ctx.paramsMap)).toEqual([
      expect.objectContaining({
        name: 'application/json',
        description: 'Cart snapshot the ledger turns into an order',
        place: 'request body',
        deepLink: '/pets/list#pets/list/request/body',
      }),
    ]);
  });

  it('prefixes the place inside a callback', () => {
    const ctx = makeContext({ scope: { callbackId: 'onEvent' } });
    const node = makeNode({ variant: 'body', description: 'Payload the callback receives' });
    for (const extractor of extractorsFor(node)) extractor.extract(node, ctx);

    expect(Object.values(ctx.paramsMap)[0]).toMatchObject({
      name: 'body',
      place: 'callback request body',
      deepLink: '/pets/list#pets/list/callbacks/onevent/request/body',
    });
  });
});

describe('extractSecurityRows', () => {
  it('emits one row per scheme with its type line and scopes, without descriptions or flows', () => {
    const ctx = makeContext();
    extractSecurityRows(
      {
        nodeType: nodeTypes.SECURITY,
        requirements: [
          {
            schemes: [
              {
                name: 'LedgerKey',
                type: 'apiKey',
                in: 'header',
                paramName: 'X-Ledger-Key',
                description: 'Issued per tenant',
              },
              { name: 'OAuth', type: 'oauth2', scopes: ['orders:read', 'orders:write'], flows: {} },
            ],
          },
          { schemes: [{ name: 'Bearer', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }] },
        ],
      } as SecurityNode,
      ctx,
    );

    expect(
      Object.values(ctx.paramsMap).map(({ name, description, place }) => ({
        name,
        description,
        place,
      })),
    ).toEqual([
      { name: 'LedgerKey', description: 'apiKey in header X-Ledger-Key', place: 'security' },
      { name: 'OAuth', description: 'oauth2 scopes: orders:read, orders:write', place: 'security' },
      { name: 'Bearer', description: 'http bearer JWT', place: 'security' },
    ]);
  });
});

describe('extractInfoMetadataRows', () => {
  it('emits one row per metadata key', () => {
    const ctx = makeContext();
    extractInfoMetadataRows(
      {
        nodeType: nodeTypes.INFO_METADATA,
        rows: [
          { key: 'owner', value: 'ledger-team' },
          { key: 'tags', value: 'websocket, realtime' },
        ],
      } as InfoMetadataNode,
      ctx,
    );

    expect(
      Object.values(ctx.paramsMap).map(({ name, description, place }) => ({
        name,
        description,
        place,
      })),
    ).toEqual([
      { name: 'owner', description: 'ledger-team', place: 'metadata' },
      { name: 'tags', description: 'websocket, realtime', place: 'metadata' },
    ]);
  });
});

describe('examplesExtractor', () => {
  const exampleStore = {
    ex_card: {
      id: 'ex_card',
      value: {},
      key: 'corporateCard',
      summary: 'Corporate card checkout',
      description: 'Paid with a **company** card',
    },
    ex_bank: { id: 'ex_bank', value: {}, key: 'bankTransfer' },
    ex_ok: { id: 'ex_ok', value: {}, summary: 'Order accepted' },
    ex_msg: { id: 'ex_msg', value: {}, summary: 'Placed at the kiosk' },
  };

  it('emits a row per example selector label with a section deep link', () => {
    const ctx = makeContext({ exampleStore });
    const node = makeNode({
      variant: 'body',
      exampleIds: ['ex_card'],
      mediaTypeSchemas: { 'application/json': { exampleIds: ['ex_card', 'ex_bank'] } },
      responses: [{ code: '201', exampleIds: ['ex_ok'] }],
      messages: [{ name: 'orderPlaced', label: 'Order placed', exampleIds: ['ex_msg'] }],
    });
    expect(extractorsFor(node)).toContain(examplesExtractor);

    examplesExtractor.extract(node, ctx);

    expect(
      Object.values(ctx.paramsMap).map(({ name, description, place, deepLink }) => ({
        name,
        description,
        place,
        deepLink,
      })),
    ).toEqual([
      {
        name: 'Corporate card checkout',
        description: 'Paid with a company card',
        place: 'request examples',
        deepLink: '/pets/list#pets/list/request/body&ex=corporatecard',
      },
      {
        name: 'bankTransfer',
        description: '',
        place: 'request examples',
        deepLink: '/pets/list#pets/list/request/body&ex=banktransfer',
      },
      {
        name: 'Order accepted',
        description: '',
        place: 'response 201 examples',
        deepLink: '/pets/list#pets/list/response&c=201',
      },
      {
        name: 'Placed at the kiosk',
        description: '',
        place: 'message examples',
        deepLink: '/pets/list#pets/list/messages&m=orderplaced',
      },
    ]);
  });

  it('adds a media-type marker when the body has several media types', () => {
    const ctx = makeContext({ exampleStore });
    const node = makeNode({
      variant: 'body',
      mediaTypeSchemas: {
        'application/json': { exampleIds: ['ex_card'] },
        'application/xml': { exampleIds: ['ex_bank'] },
      },
    });
    examplesExtractor.extract(node, ctx);

    expect(Object.values(ctx.paramsMap).map(({ deepLink }) => deepLink)).toEqual([
      '/pets/list#pets/list/request/body&ct=application/json&ex=corporatecard',
      '/pets/list#pets/list/request/body&ct=application/xml&ex=banktransfer',
    ]);
  });

  it('keeps one plain row for an example that exists under every media type', () => {
    const ctx = makeContext({
      exampleStore: {
        ...exampleStore,
        ex_card_xml: {
          id: 'ex_card_xml',
          value: {},
          key: 'corporateCard',
          summary: 'Corporate card checkout',
        },
      },
    });
    const node = makeNode({
      variant: 'body',
      mediaTypeSchemas: {
        'application/json': { exampleIds: ['ex_card', 'ex_bank'] },
        'application/xml': { exampleIds: ['ex_card_xml'] },
      },
    });
    examplesExtractor.extract(node, ctx);

    expect(Object.values(ctx.paramsMap).map(({ name, deepLink }) => ({ name, deepLink }))).toEqual([
      {
        name: 'Corporate card checkout',
        deepLink: '/pets/list#pets/list/request/body&ex=corporatecard',
      },
      {
        name: 'bankTransfer',
        deepLink: '/pets/list#pets/list/request/body&ct=application/json&ex=banktransfer',
      },
    ]);
  });


  it('emits nothing without an example store', () => {
    const ctx = makeContext();
    examplesExtractor.extract(makeNode({ variant: 'body', exampleIds: ['ex_card'] }), ctx);
    expect(Object.values(ctx.paramsMap)).toEqual([]);
  });
});

describe('extractCallback', () => {
  it('adds the callback row unscoped and re-enters the walk under the callback scope', () => {
    const children: ContentNode[] = [makeNode({ variant: 'query', parameters: [{ name: 'id' }] })];
    const ctx = makeContext();
    const seen: ExtractContext[] = [];

    extractCallback(
      {
        httpVerb: 'post',
        pathName: '/hook',
        callbackName: 'onEvent',
        callbackId: 'onEvent',
        contentChildren: children,
      },
      ctx,
      (nodes, inner) => seen.push(inner),
    );

    expect(Object.values(ctx.paramsMap)).toEqual([
      expect.objectContaining({ name: 'onEvent', place: 'callback' }),
    ]);
    expect(seen).toHaveLength(1);
    expect(seen[0].scope).toEqual({ callbackId: 'onEvent' });
    expect(seen[0].paramsMap).toBe(ctx.paramsMap);
    expect(ctx.scope).toEqual({});
  });
});
