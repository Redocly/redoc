import type { GraphQLField } from 'graphql';
import type { ApiItemContent } from '../../../../types/content.js';
import type { ParseMarkdownOptions } from '../../../utils/parseMarkdown.js';

import { itemVariant } from '../../../../types/common.js';
import { buildOperationContent } from '../operation/content.js';

export function buildMutationContent(
  mutation: GraphQLField<unknown, unknown>,
  mutationName: string,
  markdownOptions: ParseMarkdownOptions,
): ApiItemContent {
  return buildOperationContent(
    mutation,
    mutationName,
    'mutation',
    itemVariant.MUTATION,
    markdownOptions,
  );
}
