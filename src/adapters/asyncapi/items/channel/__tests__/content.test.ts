import { describe, it, expect } from 'vitest';

import type { ApiDocsOptions } from '../../../../../types/options.js';
import type { ContainerNode, ItemContentNode } from '../../../../../types/content.js';
import type {
  AsyncApiBuildContext,
  AsyncApiChannel,
  AsyncApiDefinition,
} from '../../../../../types/asyncapi.js';

import { nodeTypes, panelKind } from '../../../../../types/common.js';
import { createStoreContext } from '../../../../helpers.js';
import { asyncApiContext } from '../../../buildContext.js';
import { buildChannelContent, buildMessageReferencesGroups } from '../content.js';
import type { MarkdownSanitizeOptions } from '../../../../utils/markdoc.js';

const baseDoc: AsyncApiDefinition = {
  asyncapi: '3.0.0',
  info: { title: 'Test', version: '1.0' },
  channels: {},
} as AsyncApiDefinition;

function doc(channels: NonNullable<AsyncApiDefinition['channels']>): AsyncApiDefinition {
  return { ...baseDoc, channels } as AsyncApiDefinition;
}

describe('buildMessageReferencesGroups (AsyncAPI channel references)', () => {
  it('classifies amqp channels: routingKey → exchanges, anything else → queues, in source order', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        firstQueue: {
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
        firstExchange: {
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'routingKey' } },
        },
        secondQueue: {
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
      }),
      'msg',
      'amqp',
    );

    expect(groups.exchanges.map((r) => r.key)).toEqual(['firstExchange']);
    expect(groups.queues.map((r) => r.key)).toEqual(['firstQueue', 'secondQueue']);
  });

  it('builds the link with a lowercased, slugified tag segment + protocol slug + channel key', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        rideQueue: {
          messages: { requestRide: { name: 'requestRide' } },
          bindings: { amqp: { is: 'queue' } },
          tags: [{ name: 'Ride Sharing' }],
        },
      }),
      'requestRide',
      'amqp',
    );

    expect(groups.queues[0].link).toBe('/ride-sharing/queues/ridequeue');
  });

  it('omits the tag segment when the channel has no tags', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        rideQueue: {
          messages: { requestRide: { name: 'requestRide' } },
          bindings: { amqp: { is: 'queue' } },
        },
      }),
      'requestRide',
      'amqp',
    );

    expect(groups.queues[0].link).toBe('/queues/ridequeue');
  });

  it('resolves the reference label through the title → summary → address → key fallback chain', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        titled: {
          title: 'Friendly Queue',
          summary: 'Summary',
          address: '/addr',
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
        summarized: {
          summary: 'Summary only',
          address: '/addr',
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
        addressed: {
          address: '/addressed-only',
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
        bare: {
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
      }),
      'msg',
      'amqp',
    );

    expect(groups.queues.map((r) => r.label)).toEqual([
      'Friendly Queue',
      'Summary only',
      '/addressed-only',
      'bare',
    ]);
  });

  it('uses the first valid tag name, the same one navigation puts in the route', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        rideQueue: {
          messages: { requestRide: { name: 'requestRide' } },
          bindings: { amqp: { is: 'queue' } },
          tags: [{ name: { en: 'Broken' } }, { name: 'Ride Sharing' }],
        },
      } as unknown as NonNullable<AsyncApiDefinition['channels']>),
      'requestRide',
      'amqp',
    );

    expect(groups.queues[0].link).toBe('/ride-sharing/queues/ridequeue');
  });

  it('omits the tag segment when no tag name is a string', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        rideQueue: {
          messages: { requestRide: { name: 'requestRide' } },
          bindings: { amqp: { is: 'queue' } },
          tags: [{ name: { en: 'Ride Sharing' } }],
        },
      } as unknown as NonNullable<AsyncApiDefinition['channels']>),
      'requestRide',
      'amqp',
    );

    expect(groups.queues[0].link).toBe('/queues/ridequeue');
  });

  it('keeps the key as the label when title, summary and address are all undefined or non-strings', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        undefinedFields: {
          title: undefined,
          summary: undefined,
          address: undefined,
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
        nonStringFields: {
          title: { en: 'Title' },
          summary: { en: 'Summary' },
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
      } as unknown as NonNullable<AsyncApiDefinition['channels']>),
      'msg',
      'amqp',
    );

    expect(groups.queues.map((r) => r.label)).toEqual(['undefinedFields', 'nonStringFields']);
  });

  it('skips channels that are missing or have no messages instead of throwing', () => {
    const groups = buildMessageReferencesGroups(
      doc({
        broken: undefined,
        empty: {},
        real: {
          summary: 'Real queue',
          messages: { msg: { name: 'msg' } },
          bindings: { amqp: { is: 'queue' } },
        },
      } as unknown as NonNullable<AsyncApiDefinition['channels']>),
      'msg',
      'amqp',
    );

    expect(groups.queues.map((r) => r.label)).toEqual(['Real queue']);
  });
});

function withBuildContext<T>(
  document: AsyncApiDefinition,
  fn: () => T,
  storeCtx = createStoreContext(document as unknown as Record<string, unknown>),
): T {
  const ctx = {
    document,
    options: {} as ApiDocsOptions,
    basePath: '/asyncapi',
    storeCtx,
    protocol: 'kafka' as const,
    channelToOperations: {},
    groups: {},
    items: [],
    descriptionItems: [],
    channelSummaries: new Map(),
  } as unknown as AsyncApiBuildContext;
  return asyncApiContext.run(ctx, fn);
}


describe('buildChannelContent — parameter location', () => {
  it('renders the parameter location expression as the schema type, falling back to "string"', () => {
    const channel = {
      address: 'orders/{userId}/{region}',
      parameters: {
        userId: { location: '$message.payload#/user/id', description: 'User identifier' },
        region: { enum: ['na', 'eu'] },
      },
    } as unknown as AsyncApiChannel;

    const { content, storeCtx } = withBuildContext(doc({ orders: channel }), () => {
      const storeCtx = asyncApiContext.get().storeCtx;
      const content = buildChannelContent(
        'orders',
        channel,
        doc({ orders: channel }),
        {} as MarkdownSanitizeOptions,
      );
      return { content, storeCtx };
    });

    const container = content.children.find(
      (n): n is ContainerNode => n.nodeType === nodeTypes.CONTAINER,
    );
    const item = container?.children.find(
      (n): n is ItemContentNode => n.nodeType === nodeTypes.ITEM && n.variant === 'parameters',
    );
    const userId = item?.parameters?.find((p) => p.name === 'userId');
    const region = item?.parameters?.find((p) => p.name === 'region');

    expect(storeCtx.schemaStore[userId?.schemaId as string].data.type).toBe(
      '$message.payload#/user/id',
    );
    expect(storeCtx.schemaStore[region?.schemaId as string].data.type).toBe('string');
  });
});


function findPanelChild<T>(
  content: ReturnType<typeof buildChannelContent>,
  kind: string,
): T | undefined {
  for (const node of content.children) {
    if (node.nodeType !== nodeTypes.CONTAINER) continue;
    for (const panel of (node as ContainerNode).panels ?? []) {
      for (const child of panel.children ?? []) {
        if ((child as { kind?: string }).kind === kind) return child as T;
      }
    }
  }
  return undefined;
}


type MessageBindingPanel = {
  bindingsByMessageKey?: Record<string, { keySchemaId?: string }>;
};


describe('buildChannelContent — Kafka message-binding schema resolution', () => {
  it('converts message-binding key schema to JSON Schema', () => {
    const channel = {
      address: 'kafkakey-events',
      messages: {
        evt: {
          name: 'evt',
          payload: { type: 'object' },
          bindings: {
            kafka: {
              key: {
                schemaFormat: 'application/vnd.apache.avro',
                schema: {
                  type: 'record',
                  name: 'Key',
                  fields: [{ name: 'id', type: 'string' }],
                },
              },
            },
          },
        },
      },
    } as unknown as AsyncApiChannel;

    const { content, storeCtx } = withBuildContext(doc({ orders: channel }), () => {
      const storeCtx = asyncApiContext.get().storeCtx;
      const content = buildChannelContent(
        'orders',
        channel,
        doc({ orders: channel }),
        {} as MarkdownSanitizeOptions,
      );
      return { content, storeCtx };
    });

    const binding = findPanelChild<MessageBindingPanel>(content, panelKind.MESSAGE_BINDING);
    const keySchemaId = binding?.bindingsByMessageKey?.evt?.keySchemaId as string;
    expect(storeCtx.schemaStore[keySchemaId].data).toEqual({
      type: 'object',
      properties: {
        key: {
          type: 'object',
          title: 'Key',
          properties: { id: { type: 'string' } },
          required: ['id'],
          additionalProperties: false,
        },
      },
    });
  });
});

describe('buildChannelContent — message examples', () => {
  it('registers header values and examples without a payload', () => {
    const channel = {
      address: 'kitchen/orders',
      messages: {
        orderPlaced: {
          name: 'OrderPlaced',
          payload: { type: 'object' },
          examples: [
            {
              name: 'latte',
              summary: 'Latte',
              headers: { correlation: 'c-7' },
              payload: { id: 42 },
            },
            { name: 'headersOnly', headers: { correlation: 'c-8' } },
            { name: 'empty' },
          ],
        },
      },
    } as unknown as AsyncApiChannel;
    const document = doc({ orders: channel });
    const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);

    withBuildContext(
      document,
      () => buildChannelContent('orders', channel, document, {} as MarkdownSanitizeOptions),
      storeCtx,
    );

    expect(Object.values(storeCtx.exampleStore)).toEqual([
      expect.objectContaining({
        value: { id: 42 },
        summary: 'Latte',
        headers: { correlation: 'c-7' },
      }),
      expect.objectContaining({
        value: undefined,
        summary: 'headersOnly',
        headers: { correlation: 'c-8' },
      }),
    ]);
  });
});

describe('buildChannelContent — message correlationId', () => {
  function messagesItem(document: AsyncApiDefinition, channel: AsyncApiChannel) {
    const content = withBuildContext(document, () =>
      buildChannelContent('orders', channel, document, {} as MarkdownSanitizeOptions),
    );
    return content.children
      .filter((n): n is ContainerNode => n.nodeType === nodeTypes.CONTAINER)
      .flatMap((c) => c.children)
      .find((n): n is ItemContentNode => n.nodeType === nodeTypes.ITEM && n.variant === 'messages');
  }

  it('emits an inline correlationId with its location and description', () => {
    const channel = {
      address: 'orders/events',
      messages: {
        orderCreated: {
          name: 'OrderCreated',
          correlationId: {
            location: '$message.header#/correlationId',
            description: 'Correlates all events belonging to one order.',
          },
        },
      },
    } as unknown as AsyncApiChannel;

    const item = messagesItem(doc({ orders: channel }), channel);

    expect(item?.messages?.[0].correlationId).toEqual({
      location: '$message.header#/correlationId',
      description: 'Correlates all events belonging to one order.',
    });
  });

  it('resolves a $ref correlationId from components', () => {
    const channel = {
      address: 'orders/events',
      messages: {
        orderCreated: {
          name: 'OrderCreated',
          correlationId: { $ref: '#/components/correlationIds/orderCorrelation' },
        },
      },
    } as unknown as AsyncApiChannel;
    const document = {
      ...doc({ orders: channel }),
      components: {
        correlationIds: { orderCorrelation: { location: '$message.header#/correlationId' } },
      },
    } as unknown as AsyncApiDefinition;

    const item = messagesItem(document, channel);

    expect(item?.messages?.[0].correlationId).toEqual({
      location: '$message.header#/correlationId',
      description: undefined,
    });
  });

  it('omits correlationId when the message has none', () => {
    const channel = {
      address: 'orders/events',
      messages: { orderCreated: { name: 'OrderCreated' } },
    } as unknown as AsyncApiChannel;

    const item = messagesItem(doc({ orders: channel }), channel);

    expect(item?.messages?.[0].correlationId).toBeUndefined();
  });
});

describe('buildChannelContent — server security', () => {
  it('maps each channel server security entry to a scheme detail from the store', () => {
    const channel = {
      address: 'orders/events',
      servers: [{ $ref: '#/servers/production' }],
      messages: { evt: { name: 'evt' } },
    } as unknown as AsyncApiChannel;
    const document = {
      asyncapi: '3.0.0',
      info: { title: 'Test', version: '1.0' },
      servers: {
        production: {
          host: 'broker.cafe.test:8883',
          protocol: 'mqtt',
          security: [{ $ref: '#/components/securitySchemes/userPass' }],
        },
      },
      channels: { orders: channel },
    } as unknown as AsyncApiDefinition;

    const content = withBuildContext(document, () => {
      asyncApiContext.get().storeCtx.securitySchemeStore.userPass = {
        id: 'userPass',
        type: 'userPassword',
      };
      return buildChannelContent('orders', channel, document, {} as MarkdownSanitizeOptions);
    });
    const brokers = findPanelChild<{ brokers?: Array<{ security?: unknown }> }>(
      content,
      panelKind.BROKERS,
    );

    expect(brokers?.brokers?.[0]?.security).toEqual([
      { schemes: [{ name: 'userPass', type: 'userPassword' }] },
    ]);
  });
});

describe('buildChannelContent — channel servers', () => {
  it('lists only the referenced servers when several share a host', () => {
    const channel = {
      address: 'orders/events',
      servers: [{ $ref: '#/servers/v1' }],
      messages: { evt: { name: 'evt' } },
    } as unknown as AsyncApiChannel;
    const document = {
      asyncapi: '3.0.0',
      info: { title: 'Test', version: '1.0' },
      servers: {
        v1: { host: 'broker.test', pathname: '/v1', protocol: 'ws' },
        v2: { host: 'broker.test', pathname: '/v2', protocol: 'ws' },
        shared: { $ref: '#/components/servers/shared' },
      },
      components: { servers: { shared: { host: 'broker.test', protocol: 'wss' } } },
      channels: { orders: channel },
    } as unknown as AsyncApiDefinition;

    const listed = (servers: unknown[]) => {
      const content = withBuildContext(document, () =>
        buildChannelContent(
          'orders',
          { ...channel, servers } as AsyncApiChannel,
          document,
          {} as MarkdownSanitizeOptions,
        ),
      );
      return findPanelChild<{ brokers?: Array<{ name: string }> }>(
        content,
        panelKind.BROKERS,
      )?.brokers?.map((b) => b.name);
    };

    expect(listed([{ $ref: '#/servers/v1' }])).toEqual(['v1']);
    expect(listed([{ $ref: '#/servers/shared' }])).toEqual(['shared']);
  });

  it('shows the host and protocol of a root server given as a ref', () => {
    const channel = {
      address: 'orders/events',
      servers: [{ $ref: '#/servers/main' }, { $ref: '#/servers/missing' }],
      messages: { evt: { name: 'evt' } },
    } as unknown as AsyncApiChannel;
    const document = {
      asyncapi: '3.0.0',
      info: { title: 'Test', version: '1.0' },
      servers: {
        main: { $ref: '#/components/servers/broker' },
        ghost: { $ref: '#/components/servers/missing' },
      },
      components: { servers: { broker: { host: 'broker.test:1883', protocol: 'mqtt' } } },
      channels: { orders: channel },
    } as unknown as AsyncApiDefinition;

    const content = withBuildContext(document, () =>
      buildChannelContent('orders', channel, document, {} as MarkdownSanitizeOptions),
    );

    expect(
      findPanelChild<{ brokers?: Array<{ name: string; url?: string; protocol?: string }> }>(
        content,
        panelKind.BROKERS,
      )?.brokers?.map(({ name, url, protocol }) => ({ name, url, protocol })),
    ).toEqual([{ name: 'main', url: 'broker.test:1883', protocol: 'mqtt' }]);
  });
});
