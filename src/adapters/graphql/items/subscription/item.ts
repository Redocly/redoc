import type { ApiItem } from '../../../../types/store.js';
import type { GraphqlMenuGroupItemsBuildParams } from '../types.js';

import { itemVariant } from '../../../../types/common.js';
import { graphqlContext } from '../../buildContext.js';
import { createApiItem } from '../../utils/createApiItem.js';

export function buildSubscriptionItems({
  filter,
  processedItems,
  menuCommonFilter,
  parentPath,
}: GraphqlMenuGroupItemsBuildParams = {}): ApiItem[] {
  const { schema } = graphqlContext.get();
  const subscriptionType = schema.getSubscriptionType();

  if (!subscriptionType) return [];

  const subscriptions = subscriptionType.getFields();
  const items: ApiItem[] = [];

  for (const [subscriptionName, subscription] of Object.entries(subscriptions)) {
    const item = createApiItem({
      name: subscriptionName,
      variant: itemVariant.SUBSCRIPTION,
      processedItems,
      filter,
      menuCommonFilter,
      deprecated: !!subscription.deprecationReason,
      source: subscription,
      parentPath,
    });

    if (item) items.push(item);
  }

  return items;
}
