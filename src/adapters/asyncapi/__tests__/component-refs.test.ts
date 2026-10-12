import { describe, expect, it } from 'vitest';

import type { ApiItem } from '../../../types/store.js';

import { buildItems } from '../../build.js';
import { normalizeAsyncApiDefinition } from '../../../services/spec-convert/index.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';

const document = {
  asyncapi: '3.0.0',
  info: { title: 'Cafe events', version: '1.0.0' },
  servers: { main: { $ref: '#/components/servers/broker' } },
  channels: { orders: { $ref: '#/components/channels/orders' } },
  operations: { receiveOrder: { $ref: '#/components/operations/receiveOrder' } },
  components: {
    servers: { broker: { host: 'broker.cafe.test:1883', protocol: 'mqtt' } },
    channels: {
      orders: {
        address: 'kitchen/orders',
        description: 'Channel from components',
        messages: { orderPlaced: { payload: { type: 'object' } } },
      },
    },
    operations: {
      receiveOrder: {
        action: 'receive',
        title: 'Receive order',
        summary: 'Operation from components',
        channel: { $ref: '#/channels/orders' },
      },
    },
  },
};

async function build(): Promise<{ items: ApiItem[]; json: string }> {
  const { items, store } = await buildItems({
    type: 'asyncapi',
    document: normalizeAsyncApiDefinition(structuredClone(document)),
    basePath: '/',
    options: { specType: 'asyncapi', metadata: {}, downloadUrls: [] },
    markdownParser: markdocParser,
  } as Parameters<typeof buildItems>[0]);
  return { items, json: JSON.stringify({ items, store }) };
}

describe('AsyncAPI 3.0 root entries that reference components', () => {
  it('lists the referenced operation under the referenced channel', async () => {
    const { items } = await build();
    const channel = items.find((item) => item.label === 'kitchen/orders');

    expect(channel?.items?.map((item) => item.label)).toEqual(['Receive order']);
  });

  it('renders the server, channel and operation details from components', async () => {
    const { json } = await build();

    for (const text of [
      'broker.cafe.test:1883',
      'Channel from components',
      'Operation from components',
    ]) {
      expect(json).toContain(text);
    }
  });
});
