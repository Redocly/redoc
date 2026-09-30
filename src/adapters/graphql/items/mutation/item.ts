import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';

export function buildMutationItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const mutationType = schema.getMutationType();

  if (!mutationType) return [];

  const mutations = mutationType.getFields();
  const items: ApiItem[] = [];

  for (const [mutationName, mutation] of Object.entries(mutations)) {
    const item = createApiItem({
      name: mutationName,
      variant: itemVariant.MUTATION,
      processedItems,
      filter,
      menuCommonFilter,
      deprecated: !!mutation.deprecationReason,
      source: mutation,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
