import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { BUILT_IN_DIRECTIVES } from '../../utils/constants.js';
import { createApiItem } from '../../utils/createApiItem.js';
import { ignoreInternalItems } from '../../utils/ignoreInternalItems.js';

export function buildDirectiveItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema, options } = graphqlContext.get();
  const showBuiltInDirectives = options.showBuiltInDirectives === true;
  const directives = ignoreInternalItems(Array.from(schema.getDirectives()));

  const items: ApiItem[] = [];

  for (const directive of directives) {
    if (!showBuiltInDirectives && BUILT_IN_DIRECTIVES.has(directive.name)) {
      continue;
    }

    const item = createApiItem({
      name: directive.name,
      variant: itemVariant.DIRECTIVE,
      processedItems,
      filter,
      menuCommonFilter,
      label: `@${directive.name}`,
      source: directive,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
