import type { ApiItem } from '../../../../types/store.js';
import type { AsyncApiBuildContext } from '../../../../types/asyncapi.js';

import { panelKind } from '../../../../types/common.js';
import { buildGroupItemsPanel, isVisibleGroupItem } from '../group';

function createApiItem(link?: string): ApiItem {
  return {
    type: 'link',
    label: 'item',
    link,
    routeSlug: '/asyncapi/item',
    content: null,
  } as ApiItem;
}

describe('isVisibleGroupItem', () => {
  it('returns true for items with non-section links', () => {
    expect(isVisibleGroupItem(createApiItem('/asyncapi/channels/orders'))).toBe(true);
  });

  it('returns false for items without links', () => {
    expect(isVisibleGroupItem(createApiItem())).toBe(false);
  });

  it('returns false for markdown section links', () => {
    expect(isVisibleGroupItem(createApiItem('/asyncapi/channels/orders/section-intro'))).toBe(
      false,
    );
  });
});

const ASYNCAPI_BASE_PATH = '/asyncapi';

function createTestContext(
  channelSummaries: Map<string, string> = new Map(),
): AsyncApiBuildContext {
  return {
    basePath: ASYNCAPI_BASE_PATH,
    channelSummaries,
  } as AsyncApiBuildContext;
}

describe('buildGroupItemsPanel', () => {
  it('builds group items panel with protocol-based labels and summaries', () => {
    const group = [
      createApiItem('/asyncapi/channels/Orders'),
      createApiItem('/asyncapi/channels/Payments'),
    ];
    const panel = buildGroupItemsPanel({
      group,
      protocol: 'kafka',
      channelByLink: new Map([
        ['/asyncapi/channels/Orders', {}],
        ['/asyncapi/channels/Payments', {}],
      ]),
      context: createTestContext(
        new Map([
          ['/asyncapi/channels/Orders', 'Orders summary'],
          ['/asyncapi/channels/Payments', 'Payments summary'],
        ]),
      ),
    });

    expect(panel.kind).toBe(panelKind.GROUP_ITEMS);
    expect(panel.title).toBe('Topics');
    expect(panel.items).toEqual([
      {
        title: 'item',
        summary: 'Orders summary',
        link: '/channels/orders',
        prefix: {
          name: 'Topic',
          color: 'topic',
        },
        deprecated: false,
      },
      {
        title: 'item',
        summary: 'Payments summary',
        link: '/channels/payments',
        prefix: {
          name: 'Topic',
          color: 'topic',
        },
        deprecated: false,
      },
    ]);
  });

  it('uses fallback panel title when visible items have mixed label types', () => {
    const group = [
      createApiItem('/asyncapi/channels/Orders'),
      createApiItem('/asyncapi/channels/Payments'),
    ];
    const panel = buildGroupItemsPanel({
      group,
      protocol: 'amqp',
      channelByLink: new Map([
        ['/asyncapi/channels/Orders', { bindings: { amqp: { is: 'routingKey' } } }],
        ['/asyncapi/channels/Payments', { bindings: { amqp: { is: 'queue' } } }],
      ]),
      context: createTestContext(),
    });

    expect(panel.title).toBe('Queues');
    expect(panel.items[0]?.prefix).toEqual({
      name: 'Exchange',
      color: 'exchange',
    });
    expect(panel.items[1]?.prefix).toEqual({
      name: 'Queue',
      color: 'queue',
    });
  });

  it('filters invisible section links and falls back to default labels without channel metadata', () => {
    const group = [
      createApiItem('/asyncapi/channels/orders'),
      createApiItem('/asyncapi/channels/orders/section-intro'),
      createApiItem(),
    ];
    const panel = buildGroupItemsPanel({
      group,
      protocol: null,
      channelByLink: new Map(),
      context: createTestContext(),
    });

    expect(panel.title).toBe('Channels');
    expect(panel.items).toHaveLength(1);
    expect(panel.items[0]).toEqual({
      title: 'item',
      summary: undefined,
      link: '/channels/orders',
      prefix: {
        name: 'Channel',
        color: 'channel',
      },
      deprecated: false,
    });
  });

  it('returns fallback title and empty items when group has no visible links', () => {
    const panel = buildGroupItemsPanel({
      group: [createApiItem(), createApiItem('/asyncapi/channels/orders/section-overview')],
      protocol: 'kafka',
      channelByLink: new Map(),
      context: createTestContext(),
    });

    expect(panel.title).toBe('Topics');
    expect(panel.items).toEqual([]);
  });
});
