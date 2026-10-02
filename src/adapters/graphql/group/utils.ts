import type { ResolvedNavLinkItem } from '@redocly/config';
import type { ApiItem } from '../../../types/store.js';
import type { GraphqlItemVariant } from '../../../types/graphql.js';

import { contentType, nodeTypes, itemVariant } from '../../../types/common.js';
import { safeSlugify } from '../../../utils/string.js';
import { joinWithSeparator } from '../../../utils/url.js';
import { DEFAULT_GROUP_LABELS } from '../utils/constants.js';

import { buildGroupItemsPanelContent } from '../panels/group-items.js';
import { graphqlContext } from '../buildContext.js';

const GROUP_LABEL_TRANSLATION_KEYS: Record<GraphqlItemVariant, string> = {
  [itemVariant.QUERY]: 'queries',
  [itemVariant.MUTATION]: 'mutations',
  [itemVariant.SUBSCRIPTION]: 'subscriptions',
  [itemVariant.DIRECTIVE]: 'directives',
  [itemVariant.OBJECT]: 'objects',
  [itemVariant.INTERFACE]: 'interfaces',
  [itemVariant.INPUT]: 'inputs',
  [itemVariant.UNION]: 'unions',
  [itemVariant.ENUM]: 'enums',
  [itemVariant.SCALAR]: 'scalars',
};

export function createGroup({
  typeGroup,
  items,
  label,
  parentPath,
}: {
  items: ApiItem[];
  typeGroup?: GraphqlItemVariant;
  label?: string;
  parentPath?: string;
}): ApiItem {
  const context = graphqlContext.get();
  const groupLabel = label ?? (typeGroup ? DEFAULT_GROUP_LABELS[typeGroup] : 'Overview');
  const labelTranslationKey = label
    ? undefined
    : typeGroup
      ? GROUP_LABEL_TRANSLATION_KEYS[typeGroup]
      : 'info.title';
  const groupSlug = joinWithSeparator(
    parentPath ?? context.basePath,
    safeSlugify(groupLabel?.toLowerCase()),
  );
  return {
    type: 'group',
    label: groupLabel,
    labelTranslationKey,
    link: groupSlug,
    routeSlug: groupSlug,
    items,
    content: context.processContent
      ? {
          contentType: contentType.GROUP,
          children: [
            {
              nodeType: nodeTypes.CONTAINER,
              children: [
                {
                  nodeType: nodeTypes.HEADER,
                  level: 2,
                  label: groupLabel,
                  labelTranslationKey,
                  showPageActions: true,
                },
              ],
              panels: [
                buildGroupItemsPanelContent(items as ResolvedNavLinkItem[], context, typeGroup),
              ],
            },
          ],
        }
      : null,
  };
}
