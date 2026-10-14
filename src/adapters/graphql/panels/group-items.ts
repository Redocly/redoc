import type { ResolvedNavLinkItem } from '@redocly/config';
import type { GroupItemNode } from '../../../types/content.js';
import type { GraphqlBuildContext, GraphqlItemVariant } from '../../../types/graphql.js';

import { panelKind } from '../../../types/common.js';
import { normalizePath, toRelativePath } from '../../../utils/url.js';
import { getSummary } from '../utils/summary.js';
import { getBadges } from '../utils/getBadges.js';

export function buildGroupItemsPanelContent(
  items: ResolvedNavLinkItem[],
  context: GraphqlBuildContext,
  typeGroup?: GraphqlItemVariant,
): GroupItemNode {
  const { schema, options, basePath } = context;
  return {
    children: [
      {
        kind: panelKind.GROUP_ITEMS,
        title: 'Overview',
        titleTranslationKey: 'info.title',
        items: items.map((item) => ({
          title: item.label ?? item.link,
          summary: getSummary(schema, item.label ?? item.link, options, typeGroup),
          link: normalizePath(toRelativePath(item.link, basePath)),
          deprecated: item.deprecated ?? false,
          badges: getBadges(schema, item.label ?? item.link, typeGroup),
        })),
      },
    ],
  };
}
