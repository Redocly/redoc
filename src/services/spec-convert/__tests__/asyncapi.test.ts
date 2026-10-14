import { describe, it, expect } from 'vitest';

import { normalizeAsyncApiDefinition } from '../asyncapi.js';

function normalize(document: Record<string, unknown>): Record<string, any> {
  return normalizeAsyncApiDefinition(structuredClone(document));
}

const V2 = {
  asyncapi: '2.6.0',
  info: { title: 'Streetlights', version: '1.0.0' },
  tags: [{ name: 'lights' }],
  externalDocs: { url: 'https://example.com/docs' },
  servers: {
    production: { url: 'kafka://{env}.example.org:9092/v1', protocol: 'kafka' },
  },
  channels: {
    'light/measured': {
      servers: ['production'],
      parameters: {
        lightId: {
          description: 'Light id',
          schema: { type: 'string', enum: ['1', '2'], default: '1' },
        },
        zone: { $ref: '#/components/parameters/zone' },
      },
      subscribe: {
        operationId: 'onLightMeasured',
        summary: 'Light measured',
        traits: [{ $ref: '#/components/operationTraits/kafka' }],
        message: { $ref: '#/components/messages/lightMeasured' },
      },
      publish: {
        message: {
          oneOf: [
            { $ref: '#/components/messages/lightMeasured' },
            {
              messageId: 'avroCommand',
              schemaFormat: 'application/vnd.apache.avro;version=1.9.0',
              payload: { type: 'record', name: 'C', fields: [] },
            },
            { payload: { type: 'string' } },
          ],
        },
      },
    },
    firmware: { $ref: '#/components/channels/firmware' },
  },
  components: {
    channels: {
      firmware: {
        subscribe: { operationId: 'onFirmware', message: { payload: { type: 'object' } } },
      },
    },
    messages: {
      lightMeasured: {
        traits: [{ $ref: '#/components/messageTraits/commonHeaders' }],
        payload: { type: 'object', properties: { lumens: { type: 'integer' } } },
      },
    },
    parameters: {
      zone: { schema: { $ref: '#/components/schemas/zone' } },
    },
    schemas: {
      zone: { type: 'string', const: 'north', description: 'Zone' },
    },
    messageTraits: {
      commonHeaders: { headers: { type: 'object' }, contentType: 'application/json' },
    },
    securitySchemes: {
      certs: { type: 'X509' },
      oauth: {
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'https://t', scopes: { read: 'Read' } } },
      },
    },
    operationTraits: {
      kafka: { bindings: { kafka: { clientId: { type: 'string' } } } },
    },
  },
};

describe('normalizeAsyncApiDefinition — AsyncAPI 2.x', () => {
  const doc = normalize(V2);

  it('converts to 3.0.0 and moves root tags and externalDocs into info', () => {
    expect(doc.asyncapi).toBe('3.0.0');
    expect(doc.tags).toBeUndefined();
    expect(doc.info.tags).toEqual([{ name: 'lights' }]);
    expect(doc.info.externalDocs).toEqual({ url: 'https://example.com/docs' });
  });

  it('splits the server url into host and pathname', () => {
    expect(doc.servers.production).toEqual({
      host: '{env}.example.org:9092',
      pathname: '/v1',
      protocol: 'kafka',
    });
  });

  it.each([
    ['{scheme}://broker.example.com:1883', { host: 'broker.example.com:1883' }],
    ['mqtt://broker.example.com/', { host: 'broker.example.com' }],
    ['broker.example.com/v2', { host: 'broker.example.com', pathname: '/v2' }],
  ])('splits the server url %s', (url, expected) => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 'T', version: '1' },
      servers: { s: { url, protocol: 'mqtt' } },
      channels: {},
    });
    expect(converted.servers.s).toEqual({ ...expected, protocol: 'mqtt' });
  });

  it('turns publish/subscribe into operations from the application point of view', () => {
    expect(doc.operations.onLightMeasured).toMatchObject({
      action: 'send',
      channel: { $ref: '#/channels/light~1measured' },
      summary: 'Light measured',
      messages: [{ $ref: '#/channels/light~1measured/messages/lightMeasured' }],
    });
    expect(doc.operations['light/measured.publish']).toMatchObject({
      action: 'receive',
      messages: [
        { $ref: '#/channels/light~1measured/messages/lightMeasured' },
        { $ref: '#/channels/light~1measured/messages/avroCommand' },
        { $ref: '#/channels/light~1measured/messages/light~1measured.publish.message.2' },
      ],
    });
    expect(doc.channels['light/measured'].publish).toBeUndefined();
  });

  it('keys channel messages by component name, messageId, or operation position', () => {
    const { messages, address, servers } = doc.channels['light/measured'];
    expect(address).toBe('light/measured');
    expect(servers).toEqual([{ $ref: '#/servers/production' }]);
    expect(Object.keys(messages)).toEqual([
      'lightMeasured',
      'avroCommand',
      'light/measured.publish.message.2',
    ]);
    expect(messages.lightMeasured).toEqual({ $ref: '#/components/messages/lightMeasured' });
    expect(messages.avroCommand.payload).toEqual({
      schemaFormat: 'application/vnd.apache.avro;version=1.9.0',
      schema: { type: 'record', name: 'C', fields: [] },
    });
  });

  it('flattens parameter schemas, resolving schema refs', () => {
    expect(doc.channels['light/measured'].parameters).toEqual({
      lightId: { description: 'Light id', enum: ['1', '2'], default: '1' },
      zone: { $ref: '#/components/parameters/zone' },
    });
    expect(doc.components.parameters.zone).toEqual({ enum: ['north'], description: 'Zone' });
  });

  it('inlines root channels that reference components.channels', () => {
    expect(doc.channels.firmware.address).toBe('firmware');
    expect(doc.operations.onFirmware).toMatchObject({
      action: 'send',
      channel: { $ref: '#/channels/firmware' },
      messages: [{ $ref: '#/channels/firmware/messages/onFirmware.message' }],
    });
  });

  it('keeps security requirement objects and renames flow scopes', () => {
    expect(doc.components.securitySchemes.oauth).toEqual({
      type: 'oauth2',
      flows: { clientCredentials: { tokenUrl: 'https://t', availableScopes: { read: 'Read' } } },
    });
    const security = [{ basic: [] }, { certs: [], oauth: ['read'] }];
    const converted = normalize({
      ...V2,
      servers: { s: { url: 'h', protocol: 'kafka', security } },
      channels: { c: { publish: { operationId: 'op', security } } },
    });
    expect(converted.servers.s.security).toEqual(security);
    expect(converted.operations.op.security).toEqual(security);
  });

  it('merges operation and message traits', () => {
    expect(doc.operations.onLightMeasured.traits).toBeUndefined();
    expect(doc.operations.onLightMeasured.bindings).toEqual({
      kafka: { clientId: { type: 'string' } },
    });
    expect(doc.components.messages.lightMeasured).toEqual({
      headers: { type: 'object' },
      contentType: 'application/json',
      payload: { type: 'object', properties: { lumens: { type: 'integer' } } },
    });
  });

  it('converts components.channels into components.operations', () => {
    expect(doc.components.channels.firmware).toMatchObject({
      address: 'firmware',
      messages: { 'onFirmware.message': { payload: { type: 'object' } } },
    });
    expect(doc.components.channels.firmware.subscribe).toBeUndefined();
    expect(doc.components.operations.onFirmware).toMatchObject({
      action: 'send',
      channel: { $ref: '#/components/channels/firmware' },
      messages: [{ $ref: '#/components/channels/firmware/messages/onFirmware.message' }],
    });
  });

  it('points refs into moved objects at their new location', () => {
    const moved = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      tags: [{ name: 'a' }],
      channels: {
        a: {
          publish: {
            operationId: 'pubA',
            tags: [{ $ref: '#/tags/0' }],
            message: { oneOf: [{ payload: { type: 'string' } }, { payload: { type: 'integer' } }] },
          },
        },
        b: {
          subscribe: {
            operationId: 'subB',
            message: { $ref: '#/channels/a/publish/message/oneOf/1' },
          },
        },
      },
    });

    expect(moved.operations.pubA.tags).toEqual([{ $ref: '#/info/tags/0' }]);
    expect(moved.channels.b.messages['subB.message']).toEqual({
      $ref: '#/channels/a/messages/pubA.message.1',
    });
  });

  it('keys messages by messageId and drops messageId and schemaFormat from 3.0 messages', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        a: { subscribe: { operationId: 'op', message: { $ref: '#/components/messages/Named' } } },
      },
      components: {
        messages: {
          Named: { messageId: 'namedId', schemaFormat: 'application/schema+json;version=draft-07' },
        },
      },
    });

    expect(Object.keys(converted.channels.a.messages)).toEqual(['namedId']);
    expect(converted.components.messages.Named).toEqual({});
  });

  it('applies 2.x traits with trait values overriding the object', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        a: {
          publish: {
            operationId: 'op',
            summary: 'own',
            traits: [{ summary: 'first' }, { summary: 'second', description: 'trait' }],
          },
        },
      },
    });

    expect(converted.operations.op).toMatchObject({ summary: 'second', description: 'trait' });
    expect(converted.operations.op.traits).toBeUndefined();
  });

  it('ignores a __proto__ key in a trait', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        a: {
          publish: {
            operationId: 'op',
            traits: [JSON.parse('{"summary": "trait", "__proto__": {"polluted": true}}')],
          },
        },
      },
    });

    expect(converted.operations.op.summary).toBe('trait');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('splits a message that references a component with oneOf', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        orders: {
          subscribe: { operationId: 'onOrder', message: { $ref: '#/components/messages/Union' } },
        },
      },
      components: {
        messages: {
          Union: {
            oneOf: [
              { $ref: '#/components/messages/Placed' },
              { name: 'Cancelled', traits: [{ summary: 'from trait' }] },
            ],
          },
          Placed: { payload: { type: 'string' } },
        },
      },
    });

    expect(Object.keys(converted.channels.orders.messages)).toEqual([
      'Placed',
      'onOrder.message.1',
    ]);
    expect(converted.channels.orders.messages['onOrder.message.1']).toEqual({
      name: 'Cancelled',
      summary: 'from trait',
    });
    expect(converted.operations.onOrder.messages).toEqual([
      { $ref: '#/channels/orders/messages/Placed' },
      { $ref: '#/channels/orders/messages/onOrder.message.1' },
    ]);
  });

  it('copies a root channel that references another root channel', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        a: { subscribe: { message: { payload: { type: 'string' } } } },
        b: { $ref: '#/channels/a' },
      },
    });

    expect(converted.channels.b).not.toBe(converted.channels.a);
    expect(Object.keys(converted.operations)).toEqual(['a.subscribe', 'b.subscribe']);
    expect(converted.operations['b.subscribe'].channel).toEqual({ $ref: '#/channels/b' });
  });

  it('gives each channel in a chain of root refs its own copy', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        a: { subscribe: { message: { payload: { type: 'string' } } } },
        b: { $ref: '#/channels/a' },
        c: { $ref: '#/channels/b' },
      },
    });

    expect(converted.channels.c).not.toBe(converted.channels.b);
    expect(Object.keys(converted.operations)).toEqual([
      'a.subscribe',
      'b.subscribe',
      'c.subscribe',
    ]);
  });

  it('keeps the operationId on the original channel and ids its copies by channel', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        a: { subscribe: { operationId: 'onA', message: { payload: { type: 'string' } } } },
        b: { $ref: '#/channels/a' },
      },
    });

    expect(converted.operations.onA.channel).toEqual({ $ref: '#/channels/a' });
    expect(converted.operations['b.subscribe'].channel).toEqual({ $ref: '#/channels/b' });
  });

  it('follows trait and schema refs that point at other refs', () => {
    const converted = normalize({
      asyncapi: '2.6.0',
      info: { title: 't', version: '1' },
      channels: {
        a: {
          publish: {
            operationId: 'op',
            traits: [{ $ref: '#/components/operationTraits/alias' }],
            message: { traits: [{ $ref: '#/components/messageTraits/alias' }], name: 'Own' },
          },
          parameters: { id: { schema: { $ref: '#/components/schemas/alias' } } },
        },
      },
      components: {
        operationTraits: {
          alias: { $ref: '#/components/operationTraits/base' },
          base: { summary: 'from trait' },
        },
        messageTraits: {
          alias: { $ref: '#/components/messageTraits/base' },
          base: { contentType: 'application/json' },
        },
        schemas: {
          alias: { $ref: '#/components/schemas/base' },
          base: { type: 'string', enum: ['x'] },
        },
      },
    });

    expect(converted.operations.op.$ref).toBeUndefined();
    expect(converted.operations.op.summary).toBe('from trait');
    expect(converted.channels.a.messages['op.message']).toEqual({
      name: 'Own',
      contentType: 'application/json',
    });
    expect(converted.channels.a.parameters.id).toEqual({ enum: ['x'] });
  });

  it('converts in place, keeping the objects that hold descriptions', () => {
    const input = structuredClone(V2);
    const parameter = input.channels['light/measured'].parameters.lightId;
    const operation = input.channels['light/measured'].subscribe;
    const message = input.components.messages.lightMeasured;

    const converted = normalizeAsyncApiDefinition(input) as unknown as Record<string, any>;

    expect(converted).toBe(input);
    expect(converted.channels['light/measured'].parameters.lightId).toBe(parameter);
    expect(converted.operations.onLightMeasured).toBe(operation);
    expect(converted.components.messages.lightMeasured).toBe(message);
  });
});

describe('normalizeAsyncApiDefinition — AsyncAPI 3.x', () => {
  it('only merges traits, letting the object override trait values', () => {
    const doc = normalize({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      channels: {
        lights: {
          address: 'lights',
          messages: {
            inline: {
              traits: [{ headers: { type: 'object' }, summary: 'from trait' }],
              summary: 'own',
            },
          },
        },
      },
      operations: {
        send: { action: 'send', channel: { $ref: '#/channels/lights' } },
      },
    });

    expect(doc.channels.lights.messages.inline).toEqual({
      headers: { type: 'object' },
      summary: 'own',
    });
    expect(doc.operations.send).toEqual({ action: 'send', channel: { $ref: '#/channels/lights' } });
  });

  it('merges a shared trait into each object without changing the trait', () => {
    const trait = { headers: { type: 'object', properties: { id: { type: 'string' } } } };
    const doc = normalize({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      components: {
        messageTraits: { common: trait },
        messages: {
          a: {
            headers: { properties: { a: { type: 'integer' } } },
            traits: [{ $ref: '#/components/messageTraits/common' }],
          },
          b: { traits: [{ $ref: '#/components/messageTraits/common' }] },
        },
      },
    });

    expect(doc.components.messages.a.headers.properties).toEqual({
      a: { type: 'integer' },
      id: { type: 'string' },
    });
    expect(doc.components.messages.b.headers.properties).toEqual({ id: { type: 'string' } });
    expect(doc.components.messageTraits.common).toEqual(trait);
  });

  it('inlines root channels and operations that reference components', () => {
    const channel = { address: 'events/created', description: 'Events', messages: {} };
    const operation = {
      action: 'receive',
      summary: 'Receive events',
      channel: { $ref: '#/channels/events' },
    };
    const input = {
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      channels: {
        events: { $ref: '#/components/channels/events' },
        again: { $ref: '#/components/channels/events' },
      },
      operations: { receiveEvents: { $ref: '#/components/operations/receiveEvents' } },
      components: { channels: { events: channel }, operations: { receiveEvents: operation } },
    };

    normalizeAsyncApiDefinition(input);

    expect(input.channels.events).toBe(channel);
    expect(input.channels.again).toEqual(channel);
    expect(input.channels.again).not.toBe(channel);
    expect(input.operations.receiveEvents).toBe(operation);
    expect(input.components.channels.events).toEqual(channel);
    expect(input.components.channels.events).not.toBe(channel);
    expect(input.components.operations.receiveEvents).not.toBe(operation);
  });

  it('keeps keys set next to a root ref on the inlined object only', () => {
    const doc = normalize({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      channels: { secret: { $ref: '#/components/channels/secret', 'x-access': 'admins' } },
      operations: { op: { $ref: '#/components/operations/op', 'x-access': 'admins' } },
      components: {
        channels: { secret: { address: 'secret' } },
        operations: { op: { action: 'send', channel: { $ref: '#/channels/secret' } } },
      },
    });

    expect(doc.channels.secret).toEqual({ address: 'secret', 'x-access': 'admins' });
    expect(doc.operations.op['x-access']).toBe('admins');
    expect(doc.components.channels.secret).toEqual({ address: 'secret' });
    expect(doc.components.operations.op['x-access']).toBeUndefined();
  });

  it('leaves a root ref that does not resolve as it is', () => {
    const doc = normalize({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      channels: { ghost: { $ref: '#/components/channels/missing' } },
    });

    expect(doc.channels.ghost).toEqual({ $ref: '#/components/channels/missing' });
  });

  it('keeps a ref value whole when merging a trait', () => {
    const doc = normalize({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      components: {
        messages: {
          own: {
            headers: { $ref: '#/components/schemas/H' },
            traits: [{ headers: { type: 'object', properties: { fromTrait: {} } } }],
          },
          inline: {
            headers: { type: 'object', properties: { own: {} } },
            traits: [{ headers: { $ref: '#/components/schemas/H' } }],
          },
        },
      },
    });

    expect(doc.components.messages.own.headers).toEqual({ $ref: '#/components/schemas/H' });
    expect(doc.components.messages.inline.headers).toEqual({
      type: 'object',
      properties: { own: {} },
    });
  });

  it('keeps the identity of objects with traits', () => {
    const message = { traits: [{ summary: 'from trait' }], description: 'Own' };
    const input = {
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      channels: { lights: { address: 'lights', messages: { inline: message } } },
    };

    normalizeAsyncApiDefinition(input);

    expect(input.channels.lights.messages.inline).toBe(message);
    expect(message).toEqual({ summary: 'from trait', description: 'Own' });
  });
});
