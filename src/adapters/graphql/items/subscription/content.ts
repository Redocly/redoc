import type { GraphQLField } from 'graphql';
import type { ApiItemContent } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { itemVariant } from '../../../../types/common.js';
import { buildOperationContent } from '../operation/content.js';

export function buildSubscriptionContent(
  subscription: GraphQLField<unknown, unknown>,
  subscriptionName: string,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  return buildOperationContent(
    subscription,
    subscriptionName,
    'subscription',
    itemVariant.SUBSCRIPTION,
    markdownOptions,
  );
}
