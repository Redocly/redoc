import type { Node } from '@markdoc/markdoc';
import type { GraphQLSchema } from 'graphql';
import type { GraphqlItemVariant } from '../../../types/graphql.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';

import { itemVariant } from '../../../types/common.js';
import { extractSummaryText } from '../../utils/markdoc.js';

export function getSummary(
  schema: GraphQLSchema,
  item: string,
  markdownOptions: ParseMarkdownOptions,
  typeGroup?: GraphqlItemVariant,
): string | undefined {
  if (!typeGroup) {
    return;
  }

  const rawDescription = getItemDescription(schema, item, typeGroup);
  return extractSummaryText(rawDescription, markdownOptions);
}

function getItemDescription(
  schema: GraphQLSchema,
  item: string,
  typeGroup: GraphqlItemVariant,
): string | Node | Node[] | undefined | null {
  switch (typeGroup) {
    case itemVariant.DIRECTIVE: {
      const name = item.startsWith('@') ? item.slice(1) : item;
      return schema.getDirectives().find((d) => d.name === name)?.description;
    }
    case itemVariant.QUERY:
      return schema.getQueryType()?.getFields()[item]?.description;
    case itemVariant.MUTATION:
      return schema.getMutationType()?.getFields()[item]?.description;
    case itemVariant.SUBSCRIPTION:
      return schema.getSubscriptionType()?.getFields()[item]?.description;
    case itemVariant.OBJECT:
    case itemVariant.INTERFACE:
    case itemVariant.UNION:
    case itemVariant.ENUM:
    case itemVariant.INPUT:
    case itemVariant.SCALAR:
      return schema.getType(item)?.description;
    default:
      return;
  }
}
