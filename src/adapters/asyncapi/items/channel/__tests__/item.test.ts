import { describe, it, expect } from 'vitest';

import type { ApiDocsOptions } from '../../../../../types/options.js';
import type {
  AsyncApiBuildContext,
  AsyncApiChannel,
  AsyncApiDefinition,
} from '../../../../../types/asyncapi.js';

import { createStoreContext } from '../../../../helpers.js';
import { asyncApiContext } from '../../../buildContext.js';
import { buildTaggedChannelItem, buildUntaggedChannelItem } from '../item.js';

const baseDoc: AsyncApiDefinition = {
  asyncapi: '3.0.0',
  info: { title: 'Test', version: '1.0' },
  channels: {},
} as AsyncApiDefinition;

function withBuildContext<T>(document: AsyncApiDefinition, fn: () => T): T {
  const storeCtx = createStoreContext(document as unknown as Record<string, unknown>);
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
    processContent: false,
  } as unknown as AsyncApiBuildContext;
  return asyncApiContext.run(ctx, fn);
}

describe('buildUntaggedChannelItem — label fallback', () => {
  it('falls back the label to summary, not the raw channelId, when there is no title', () => {
    const channel: AsyncApiChannel = { summary: 'Ride requests channel' };
    const item = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({ channelId: 'rideRequests', channel, operationIds: [] }),
    );

    expect(item.label).toBe('Ride requests channel');
  });

  it('prefers title over summary and address when both are present', () => {
    const channel: AsyncApiChannel = {
      title: 'Ride Requests',
      summary: 'Ride requests channel',
      address: 'rides/requests',
      description: 'A longer explanation of the channel.',
    };
    const item = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({ channelId: 'rideRequests', channel, operationIds: [] }),
    );

    expect(item.label).toBe('Ride Requests');
  });

  it('falls back to address, then the raw channelId, only when there is no title or summary', () => {
    const channelWithAddress: AsyncApiChannel = { address: 'rides/requests' };
    const itemWithAddress = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({
        channelId: 'rideRequests',
        channel: channelWithAddress,
        operationIds: [],
      }),
    );
    expect(itemWithAddress.label).toBe('rides/requests');

    const bareChannel: AsyncApiChannel = {};
    const bareItem = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({
        channelId: 'rideRequests',
        channel: bareChannel,
        operationIds: [],
      }),
    );
    expect(bareItem.label).toBe('rideRequests');
  });

  it('does not crash on non-string title/summary/description from a malformed spec', () => {
    const channel = {
      title: { en: 'Ride Requests' },
      summary: { en: 'Ride requests channel' },
      description: { en: 'A longer explanation.' },
    } as unknown as AsyncApiChannel;
    const item = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({ channelId: 'rideRequests', channel, operationIds: [] }),
    );

    expect(item.label).toBe('rideRequests');
  });
});

describe('buildTaggedChannelItem — label fallback', () => {
  it('falls back the label to summary, matching buildUntaggedChannelItem', () => {
    const channel: AsyncApiChannel = { summary: 'Ride requests channel' };
    const item = withBuildContext(baseDoc, () =>
      buildTaggedChannelItem({
        channelId: 'rideRequests',
        channel,
        operationIds: [],
        tagName: 'Rides',
      }),
    );

    expect(item.label).toBe('Ride requests channel');
  });
});
