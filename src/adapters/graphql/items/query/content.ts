import type { GraphQLField } from 'graphql';
import type { ApiItemContent } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { itemVariant } from '../../../../types/common.js';
import { buildOperationContent } from '../operation/content.js';

export function buildQueryContent(
  query: GraphQLField<unknown, unknown>,
  queryName: string,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  return buildOperationContent(query, queryName, 'query', itemVariant.QUERY, markdownOptions);
}
