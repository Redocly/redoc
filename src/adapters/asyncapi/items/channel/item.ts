import type { ApiItem } from '../../../../types/store.js';
import type { AsyncApiChannel } from '../../../../types/asyncapi.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

import { combineUrls } from '@redocly/theme/core/openapi';

import { asString, safeSlugify } from '../../../../utils/string.js';
import {
  componentLabelsByProtocol,
  itemLabelsByProtocol,
} from '../../utils/get-protocol-labels.js';
import { buildChannelContent } from './content.js';
import { buildOperationItem } from '../operation/item.js';
import { asyncApiContext } from '../../buildContext.js';
import { readRbacScope, rbacProp } from '../../../rbac.js';
import { resolveItemSeo } from '../../../utils/seo.js';
import { extractSeoDescriptionText } from '../../../utils/markdoc.js';
import { getChannelLabel } from '../../utils/get-channel-label.js';

function resolveChannelLabelAndSeo(
  channel: AsyncApiChannel,
  channelId: string,
  options: ApiDocsOptions,
): { label: string; seo: ReturnType<typeof resolveItemSeo> } {
  const label = getChannelLabel(channel, channelId);
  // Same as the operation item: the description is markdown (or an already-parsed AST), so it has
  // to be reduced to plain text before it can serve as a meta description.
  const description =
    extractSeoDescriptionText(channel.description, options) ?? asString(channel.summary);
  return { label, seo: resolveItemSeo(channel, { title: label, description }) };
}

function buildSortedOperationsWithGroupHeaders(
  operationIds: string[],
  operations: Record<string, { action?: string }>,
  groupLabels: { send: string; receive: string },
): Array<{ operationId: string; groupHeaderLabel?: string }> {
  const sendIds = operationIds.filter((id) => operations[id]?.action === 'send');
  const receiveIds = operationIds.filter((id) => operations[id]?.action === 'receive');
  const ordered = [...sendIds, ...receiveIds];

  return ordered.map((operationId) => {
    if (sendIds[0] === operationId) {
      return { operationId, groupHeaderLabel: groupLabels.send };
    }
    if (receiveIds[0] === operationId) {
      return { operationId, groupHeaderLabel: groupLabels.receive };
    }
    return { operationId };
  });
}

export function buildTaggedChannelItem({
  channelId,
  channel,
  operationIds,
  tagName,
}: {
  channelId: string;
  channel: AsyncApiChannel;
  operationIds: string[];
  tagName: string;
}): ApiItem {
  const { document, basePath, options, protocol, processContent } = asyncApiContext.get();
  const operations = document.operations || {};
  const channelHasOperations = operationIds.length > 0;
  const labels = itemLabelsByProtocol(protocol ?? null, channel.bindings);
  const componentLabels = componentLabelsByProtocol({
    protocol: protocol ?? null,
    channelBindings: channel.bindings,
  });
  const protocolSlug = `${labels.channel}s`;
  const tagSlug = safeSlugify(tagName).toLowerCase();
  const channelLink = combineUrls(basePath, tagSlug, protocolSlug, channelId).toLowerCase();
  const sortedOperations = buildSortedOperationsWithGroupHeaders(operationIds, operations, {
    send: componentLabels.sendLabel,
    receive: componentLabels.receiveLabel,
  });
  const { label, seo } = resolveChannelLabelAndSeo(channel, channelId, options);

  return {
    label,
    type: 'group',
    link: channelLink,
    routeSlug: channelLink,
    badges: channel?.['x-badges'] || [],
    httpVerb: labels.channel,
    metadata: { seo },
    content: processContent
      ? buildChannelContent(channelId, channel, document, options, protocol)
      : null,
    ...rbacProp(readRbacScope(channel)),
    ...(channelHasOperations
      ? {
          items: sortedOperations.map(({ operationId, groupHeaderLabel }, index) =>
            buildOperationItem({
              operationId,
              operation: operations[operationId],
              linkParts: [basePath, tagSlug, protocolSlug, channelId, 'operations', operationId],
              channelBindings: channel.bindings as Record<string, unknown> | undefined,
              document,
              options,
              protocol,
              groupHeaderLabel,
              processContent,
              showDivider: index !== sortedOperations.length - 1,
            }),
          ),
        }
      : {}),
  };
}

export function buildUntaggedChannelItem({
  channelId,
  channel,
  operationIds,
}: {
  channelId: string;
  channel: AsyncApiChannel;
  operationIds: string[];
}): ApiItem {
  const { document, basePath, options, protocol, processContent } = asyncApiContext.get();
  const operations = document.operations || {};
  const channelHasOperations = operationIds.length > 0;
  const labels = itemLabelsByProtocol(protocol ?? null, channel.bindings);
  const componentLabels = componentLabelsByProtocol({
    protocol: protocol ?? null,
    channelBindings: channel.bindings,
  });
  const protocolSlug = `${labels.channel}s`;
  const channelLink = combineUrls(basePath, protocolSlug, channelId).toLowerCase();
  const sortedOperations = buildSortedOperationsWithGroupHeaders(operationIds, operations, {
    send: componentLabels.sendLabel,
    receive: componentLabels.receiveLabel,
  });
  const { label, seo } = resolveChannelLabelAndSeo(channel, channelId, options);

  return {
    label,
    type: 'group',
    link: channelLink,
    routeSlug: channelLink,
    httpVerb: labels.channel,
    badges: channel?.['x-badges'] || [],
    metadata: { seo },
    ...rbacProp(readRbacScope(channel)),
    content: processContent
      ? buildChannelContent(channelId, channel, document, options, protocol)
      : null,
    ...(channelHasOperations
      ? {
          items: sortedOperations.map(({ operationId, groupHeaderLabel }, index) =>
            buildOperationItem({
              operationId,
              operation: operations[operationId],
              linkParts: [basePath, protocolSlug, channelId, 'operations', operationId],
              channelBindings: channel.bindings as Record<string, unknown> | undefined,
              document,
              options,
              protocol,
              groupHeaderLabel,
              processContent,
              showDivider: index !== sortedOperations.length - 1,
            }),
          ),
        }
      : {}),
  };
}
