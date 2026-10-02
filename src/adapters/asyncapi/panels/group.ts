import type { GroupItemNode } from '../../../types/content.js';
import type { AsyncApiBuildContext } from '../../../types/asyncapi.js';
import type { ApiItem } from '../../../types/store.js';

import { panelKind } from '../../../types/common.js';
import { normalizePath, toRelativePath } from '../../../utils/url.js';
import { componentLabelsByProtocol } from '../utils/get-protocol-labels.js';

export function buildGroupItemsPanel({
  group,
  protocol,
  channelByLink,
  context,
}: {
  group: ApiItem[];
  protocol: AsyncApiBuildContext['protocol'];
  channelByLink: Map<string, { bindings?: Record<string, unknown> } | undefined>;
  context: AsyncApiBuildContext;
}): GroupItemNode['children'][0] {
  const { channelSummaries, basePath } = context;
  const visibleItems = group.filter(isVisibleGroupItem);
  const itemLabels = visibleItems.map((item) => {
    const channel = channelByLink.get(item.link);
    return componentLabelsByProtocol({
      protocol,
      channelBindings: channel?.bindings,
    });
  });
  const uniqueTitles = new Set(itemLabels.map((labels) => labels.channels));
  const fallbackLabels = componentLabelsByProtocol({ protocol });
  const panelTitle =
    uniqueTitles.size === 1
      ? (itemLabels[0]?.channels ?? fallbackLabels.channels)
      : fallbackLabels.channels;

  return {
    kind: panelKind.GROUP_ITEMS,
    title: panelTitle,
    items: visibleItems.map((item, index) => {
      const channelLabel = itemLabels[index]?.channel ?? fallbackLabels.channel;
      return {
        title: item.label ?? item.link,
        summary: channelSummaries.get(item.link),
        link: normalizePath(toRelativePath(item.link, basePath)).toLowerCase(),
        prefix: {
          name: channelLabel,
          color: channelLabel.toLowerCase(),
        },
        deprecated: false,
      };
    }),
  };
}

type VisibleGroupItem = ApiItem & { link: string };

export function isVisibleGroupItem(item: ApiItem): item is VisibleGroupItem {
  const { link } = item;
  return typeof link === 'string' && !link.includes('section');
}
