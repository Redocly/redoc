import type {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
} from 'graphql';
import type { GraphqlItemVariant, TypeGroupFilter } from '../../../types/graphql.js';
import type { ApiItem, ItemMeta } from '../../../types/store.js';
import type { ApiItemContent } from '../../../types/content.js';
import { type ItemVariant, itemVariant } from '../../../types/common.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';

import { safeSlugify } from '../../../utils/string.js';
import { joinWithSeparator } from '../../../utils/url.js';
import { shouldIncludeItem } from '../utils/shouldIncludeItem.js';
import { buildDirectiveContent } from '../items/directive/content.js';
import { buildQueryContent } from '../items/query/content.js';
import { buildMutationContent } from '../items/mutation/content.js';
import { buildSubscriptionContent } from '../items/subscription/content.js';
import { buildUnionContent } from '../items/union/content.js';
import { buildEnumContent } from '../items/enum/content.js';
import { buildScalarContent } from '../items/scalar/content.js';
import { buildInputContent } from '../items/input/content.js';
import { buildObjectContent } from '../items/object/content.js';
import { buildInterfaceContent } from '../items/interface/content.js';
import { graphqlContext } from '../buildContext.js';

const DEFAULT_PARENT_PATH_SEGMENTS: Record<GraphqlItemVariant, string> = {
  [itemVariant.QUERY]: 'queries',
  [itemVariant.MUTATION]: 'mutations',
  [itemVariant.SUBSCRIPTION]: 'subscriptions',
  [itemVariant.DIRECTIVE]: 'directives',
  [itemVariant.OBJECT]: 'objects',
  [itemVariant.INTERFACE]: 'interfaces',
  [itemVariant.UNION]: 'unions',
  [itemVariant.ENUM]: 'enums',
  [itemVariant.INPUT]: 'inputs',
  [itemVariant.SCALAR]: 'scalars',
};

type CreateApiItemParams<T> = {
  name: string;
  variant: GraphqlItemVariant;
  processedItems?: Set<string>;
  filter?: TypeGroupFilter;
  menuCommonFilter?: TypeGroupFilter;
  label?: string;
  deprecated?: boolean;
  source: T;
  parentPath?: string;
};

export function createApiItem<T>(params: CreateApiItemParams<T>): ApiItem | null {
  const context = graphqlContext.get();
  const itemKey = `${params.variant}:${params.name}`;

  if (params.processedItems?.has(itemKey)) {
    return null;
  }

  if (
    (params.filter || params.menuCommonFilter) &&
    !shouldIncludeItem(params.name, params.filter, params.menuCommonFilter)
  ) {
    return null;
  }

  const parentPath = params.parentPath
    ? params.parentPath
    : joinWithSeparator(context.basePath, DEFAULT_PARENT_PATH_SEGMENTS[params.variant]);

  const slug = joinWithSeparator(parentPath, safeSlugify(params.name.toLowerCase()));

  const label = params.label ?? params.name;

  params.processedItems?.add(itemKey);

  if (!context.processContent) {
    return {
      type: 'link',
      label,
      link: slug,
      routeSlug: slug,
      ...(params.deprecated && { deprecated: true }),
      content: null,
    };
  }

  let content = buildContent({
    variant: params.variant,
    source: params.source,
    name: params.name,
    markdownOptions: context.options,
  }) as ApiItemContent;


  // GraphQL SDL can't be addressed by a JSON pointer, so capture the source
  // line/column from the graphql-js AST for WYSIWYG cursor sync.
  const position = getGraphqlNodePosition(params.source);
  if (position && content?.meta) {
    content.meta.position = position;
  }

  return {
    type: 'link',
    label,
    link: slug,
    routeSlug: slug,
    ...(params.deprecated && { deprecated: true }),
    content,
  };
}

function buildContent({
  variant,
  source,
  name,
  markdownOptions,
}: {
  variant: ItemVariant;
  source: unknown;
  name: string;
  markdownOptions: ParseMarkdownOptions;
}): ApiItemContent | undefined {
  switch (variant) {
    case itemVariant.DIRECTIVE:
      return buildDirectiveContent(source as GraphQLDirective, markdownOptions);
    case itemVariant.QUERY:
      return buildQueryContent(source as GraphQLField<unknown, unknown>, name, markdownOptions);
    case itemVariant.MUTATION:
      return buildMutationContent(source as GraphQLField<unknown, unknown>, name, markdownOptions);
    case itemVariant.SUBSCRIPTION:
      return buildSubscriptionContent(
        source as GraphQLField<unknown, unknown>,
        name,
        markdownOptions,
      );
    case itemVariant.UNION:
      return buildUnionContent(source as GraphQLUnionType, markdownOptions);
    case itemVariant.ENUM:
      return buildEnumContent(source as GraphQLEnumType, markdownOptions);
    case itemVariant.SCALAR:
      return buildScalarContent(source as GraphQLScalarType, markdownOptions);
    case itemVariant.INPUT:
      return buildInputContent(source as GraphQLInputObjectType, markdownOptions);
    case itemVariant.OBJECT:
      return buildObjectContent(source as GraphQLObjectType, markdownOptions);
    case itemVariant.INTERFACE:
      return buildInterfaceContent(source as GraphQLInterfaceType, markdownOptions);
    default:
      return undefined;
  }
}

/**
 * Extracts the 1-based source position from a graphql-js type/field node.
 * Returns undefined for nodes without AST location (e.g. built-in scalars).
 */
function getGraphqlNodePosition(source: unknown): ItemMeta['position'] | undefined {
  const loc = (
    source as {
      astNode?: {
        loc?: {
          startToken?: { line: number; column: number };
          endToken?: { line: number; column: number };
        };
      };
    }
  )?.astNode?.loc;

  if (!loc?.startToken) {
    return undefined;
  }

  return {
    start: { lineNumber: loc.startToken.line, column: loc.startToken.column },
    end: loc.endToken ? { lineNumber: loc.endToken.line, column: loc.endToken.column } : undefined,
  };
}
