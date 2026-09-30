import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';

export function buildQueryItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const queryType = schema.getQueryType();

  if (!queryType) return [];

  const queries = queryType.getFields();
  const items: ApiItem[] = [];

  for (const [queryName, query] of Object.entries(queries)) {
    const item = createApiItem({
      name: queryName,
      variant: itemVariant.QUERY,
      processedItems,
      filter,
      menuCommonFilter,
      deprecated: !!query.deprecationReason,
      source: query,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
