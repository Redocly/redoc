import type { GraphqlFieldData, ItemContentNode } from '../../../../types/content.js';
import type { ExtractContext, Extractor } from './context.js';

import { buildGraphqlSuffix, makeDeepLink } from '../../../../utils/deep-link.js';
import { makeParam } from '../param.js';
import { GRAPHQL_ARGUMENTS_PLACE, fieldsPlaceOf, scopedPlace } from '../places.js';
import { addRow, describe } from './context.js';

function resolveGraphqlPathRoot(node: ItemContentNode): string | undefined {
  if (node.variant !== 'graphql-args') return node.graphqlTypeName;
  if (node.graphqlFieldName) return node.graphqlFieldName;
  return node.graphqlTypeName ? `@${node.graphqlTypeName}` : undefined;
}

export const graphqlExtractor: Extractor = {
  matches: (node) => !!node.graphqlSchema,
  extract(node, ctx) {
    const fields = Array.isArray(node.graphqlSchema)
      ? node.graphqlSchema
      : node.graphqlSchema?.fields;
    if (!fields?.length) return;
    extractGraphqlFields(
      fields,
      scopedPlace(fieldsPlaceOf(node.variant), ctx.scope.callbackId),
      node,
      ctx,
    );
  },
};

function extractGraphqlFields(
  fields: GraphqlFieldData[],
  place: string,
  node: ItemContentNode,
  ctx: ExtractContext,
): void {
  const listsArguments = node.variant === 'graphql-args';
  const pathRoot = resolveGraphqlPathRoot(node);
  const deepLinkFor = (suffix: string): string | undefined =>
    ctx.slug && pathRoot ? makeDeepLink(ctx.slug, suffix) : undefined;

  for (const field of fields) {
    const fieldPath = `${pathRoot}.${field.name}`;

    addRow(
      ctx,
      makeParam({
        name: field.name,
        description: describe(ctx, field.description),
        place,
        path: [],
        type: field.type ?? 'unknown',
        deepLink: deepLinkFor(
          listsArguments
            ? buildGraphqlSuffix({ t: 'argument', path: fieldPath, arg: field.name })
            : buildGraphqlSuffix({ t: 'field', path: fieldPath }),
        ),
      }),
    );

    for (const arg of field.args ?? []) {
      addRow(
        ctx,
        makeParam({
          name: arg.name,
          description: describe(ctx, arg.description),
          place: GRAPHQL_ARGUMENTS_PLACE,
          path: [field.name],
          type: arg.type ?? 'unknown',
          deepLink: deepLinkFor(
            buildGraphqlSuffix({
              t: 'argument',
              path: `${fieldPath}.${arg.name}`,
              arg: arg.name,
            }),
          ),
        }),
      );
    }
  }
}
