import { describe, it, expect } from 'vitest';

import type { ApiDocsOptions } from '../../../../../types/options.js';
import type {
  AsyncApiBuildContext,
  AsyncApiChannel,
  AsyncApiDefinition,
} from '../../../../../types/asyncapi.js';

import type { ApiItem } from '../../../../../types/store.js';
import type { SeoData } from '../../../../../types/common.js';

import { createStoreContext } from '../../../../helpers.js';
import { asyncApiContext } from '../../../buildContext.js';
import { buildTaggedChannelItem, buildUntaggedChannelItem } from '../item.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

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

function seoOf(item: ApiItem): SeoData | undefined {
  return (item.metadata as { seo?: SeoData } | undefined)?.seo;
}

describe('buildUntaggedChannelItem — label/seo fallback', () => {
  it('falls back the label and seo.title to summary, not the raw channelId, when there is no title', () => {
    const channel: AsyncApiChannel = { summary: 'Ride requests channel' };
    const item = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({ channelId: 'rideRequests', channel, operationIds: [] }),
    );

    expect(item.label).toBe('Ride requests channel');
    expect(seoOf(item)?.title).toBe('Ride requests channel');
  });

  it('falls back seo.description to summary when there is no description', () => {
    const channel: AsyncApiChannel = { summary: 'Ride requests channel' };
    const item = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({ channelId: 'rideRequests', channel, operationIds: [] }),
    );

    expect(seoOf(item)?.description).toBe('Ride requests channel');
  });

  it('reduces an already-parsed description AST to the first paragraph of plain text', () => {
    const channel = {
      summary: 'Ride requests channel',
      description: markdocParser(
        'Primary topic for **ride requests**.\n\nSecond paragraph is not part of the meta description.',
      ),
    } as unknown as AsyncApiChannel;
    const item = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({ channelId: 'rideRequests', channel, operationIds: [] }),
    );

    expect(seoOf(item)?.description).toBe('Primary topic for ride requests.');
  });

  it('prefers title over summary/address, and description over summary, when both are present', () => {
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
    expect(seoOf(item)).toEqual({
      title: 'Ride Requests',
      description: 'A longer explanation of the channel.',
    });
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

  it('omits seo.description when both description and summary are undefined', () => {
    const channel: AsyncApiChannel = { title: 'Ride Requests' };
    const item = withBuildContext(baseDoc, () =>
      buildUntaggedChannelItem({ channelId: 'rideRequests', channel, operationIds: [] }),
    );

    expect(item.label).toBe('Ride Requests');
    expect(seoOf(item)?.description).toBeUndefined();
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
    expect(seoOf(item)?.title).toBe('rideRequests');
    expect(seoOf(item)?.description).toBeUndefined();
  });
});

describe('buildTaggedChannelItem — label/seo fallback', () => {
  it('falls back the label and seo to summary, matching buildUntaggedChannelItem', () => {
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
    expect(seoOf(item)).toEqual({
      title: 'Ride requests channel',
      description: 'Ride requests channel',
    });
  });
});
