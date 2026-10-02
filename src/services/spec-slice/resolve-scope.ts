import { apiSpecType, contentType, itemVariant } from '../../types/common.js';
import { BUILT_IN_DIRECTIVES, BUILT_IN_SCALARS } from '../../adapters/graphql/utils/constants.js';
import { operationScopeFromPointer } from './openapi-slice.js';
import { scopeFromAsyncApiPointer } from './asyncapi-slice.js';

import type { ApiItemContent } from '../../types/store.js';
import type { ApiSpecType, ItemVariant } from '../../types/common.js';
import type { GraphqlItemScope, GraphqlOperationType, SpecSliceScope } from './types.js';

export function resolveSpecSliceScope(
  specType: ApiSpecType,
  content: ApiItemContent | null | undefined,
  label: string | undefined,
  groupMemberContents?: Array<ApiItemContent | null | undefined>,
): SpecSliceScope | undefined {
  if (!content) return undefined;
  if (content.contentType === contentType.OVERVIEW) return { kind: 'document' };

  switch (specType) {
    case apiSpecType.OPENAPI:
      return resolveOpenApiScope(content);
    case apiSpecType.ASYNCAPI:
      return resolveAsyncApiScope(content, label);
    case apiSpecType.GRAPHQL:
      return content.contentType === contentType.GROUP
        ? resolveGraphqlGroupScope(label, groupMemberContents)
        : resolveGraphqlScope(content);
    default:
      return undefined;
  }
}

function resolveOpenApiScope(content: ApiItemContent): SpecSliceScope | undefined {
  if (content.contentType === contentType.GROUP) {
    const tagName = content.meta?.name;
    return typeof tagName === 'string' ? { kind: 'tag', tagName } : undefined;
  }
  if (content.contentType !== contentType.ITEM) return undefined;

  if (content.itemVariant === itemVariant.HTTP_ITEM && content.meta?.pointer) {
    return operationScopeFromPointer(content.meta.pointer, content.meta.isWebhook);
  }
  if (content.itemVariant === itemVariant.SCHEMA && content.meta?.name) {
    return { kind: 'schema', name: content.meta.name };
  }
  return undefined;
}

const GRAPHQL_OPERATION_VARIANTS: Partial<Record<ItemVariant, GraphqlOperationType>> = {
  [itemVariant.QUERY]: 'query',
  [itemVariant.MUTATION]: 'mutation',
  [itemVariant.SUBSCRIPTION]: 'subscription',
};

const GRAPHQL_TYPE_VARIANTS: ReadonlySet<ItemVariant> = new Set([
  itemVariant.OBJECT,
  itemVariant.INTERFACE,
  itemVariant.INPUT,
  itemVariant.UNION,
  itemVariant.ENUM,
  itemVariant.SCALAR,
]);

function resolveGraphqlScope(content: ApiItemContent): GraphqlItemScope | undefined {
  if (content.contentType !== contentType.ITEM || !content.itemVariant) return undefined;
  const name = content.meta?.name;
  if (typeof name !== 'string' || !name) return undefined;

  const operationType = GRAPHQL_OPERATION_VARIANTS[content.itemVariant];
  if (operationType) {
    return { kind: 'graphql-operation', operationType, name };
  }
  if (GRAPHQL_TYPE_VARIANTS.has(content.itemVariant)) {
    return BUILT_IN_SCALARS.has(name) ? undefined : { kind: 'graphql-type', name };
  }
  if (content.itemVariant === itemVariant.DIRECTIVE) {
    return BUILT_IN_DIRECTIVES.has(name) ? undefined : { kind: 'graphql-directive', name };
  }
  return undefined;
}

function resolveGraphqlGroupScope(
  label: string | undefined,
  memberContents: Array<ApiItemContent | null | undefined> | undefined,
): SpecSliceScope | undefined {
  if (!memberContents?.length) return undefined;

  const members: GraphqlItemScope[] = [];
  const seen = new Set<string>();
  for (const memberContent of memberContents) {
    const member = memberContent ? resolveGraphqlScope(memberContent) : undefined;
    if (!member) continue;
    const key = `${member.kind}/${'operationType' in member ? member.operationType : ''}/${member.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    members.push(member);
  }

  return members.length ? { kind: 'graphql-group', label, members } : undefined;
}

function resolveAsyncApiScope(
  content: ApiItemContent,
  label: string | undefined,
): SpecSliceScope | undefined {
  if (content.contentType === contentType.GROUP) {
    return label ? { kind: 'tag', tagName: label } : undefined;
  }
  if (
    content.contentType === contentType.ITEM &&
    (content.itemVariant === itemVariant.CHANNEL ||
      content.itemVariant === itemVariant.CHANNEL_OPERATION) &&
    content.meta?.pointer
  ) {
    return scopeFromAsyncApiPointer(content.meta.pointer);
  }
  return undefined;
}
