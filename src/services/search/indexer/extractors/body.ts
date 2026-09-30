import { hasRbacScope } from '../../../../adapters/rbac.js';

import type { ExtractContext, Extractor } from './context.js';

import {
  buildOpenApiSectionSuffix,
  CALLBACKS_SECTION,
  makeDeepLink,
} from '../../../../utils/deep-link.js';
import { makeParam } from '../param.js';
import { fieldsPlaceOf, REQUEST_BODY_PLACE, scopedPlace } from '../places.js';
import { addRow, describe } from './context.js';

export const bodyExtractor: Extractor = {
  matches: (node) =>
    !!node.mediaTypeSchemas || !!node.schemaId || (node.variant === 'body' && !!node.description),
  extract(node, ctx) {
    if (node.variant === 'body') extractBodyDescription(node, ctx);
    if (!ctx.hasSchemas) return;
    const place = scopedPlace(fieldsPlaceOf(node.variant), ctx.scope.callbackId);
    const isResponse = node.variant === 'responses';

    if (node.mediaTypeSchemas) {
      const entries = Object.entries(node.mediaTypeSchemas).filter(
        ([, content]) => !hasRbacScope(content) && content.schemaId,
      );
      for (const [mediaType, content] of entries) {
        ctx.walker.extractSchemaFields(
          {
            schemaId: content.schemaId as string,
            place,
            paramsMap: ctx.paramsMap,
            slug: ctx.slug,
            mediaType,
            hasMultipleMediaTypes: entries.length > 1,
            isResponse,
          },
          ctx.scope,
        );
      }
    } else if (node.schemaId) {
      ctx.walker.extractSchemaFields(
        {
          schemaId: node.schemaId,
          place,
          paramsMap: ctx.paramsMap,
          slug: ctx.slug,
          isResponse,
          visited: ctx.visited,
        },
        ctx.scope,
      );
    }
  },
};

/** The request body's own description, as one row on the body section (responses have the same). */
function extractBodyDescription(
  node: Parameters<Extractor['extract']>[0],
  ctx: ExtractContext,
): void {
  const text = describe(ctx, node.description);
  if (!text) return;
  const suffix = buildOpenApiSectionSuffix('request', 'body');
  const scoped = ctx.scope.callbackId
    ? `${buildOpenApiSectionSuffix(CALLBACKS_SECTION, ctx.scope.callbackId)}/${suffix}`
    : suffix;
  addRow(
    ctx,
    makeParam({
      name: node.mediaTypes?.join(', ') || 'body',
      description: text,
      place: scopedPlace(REQUEST_BODY_PLACE, ctx.scope.callbackId),
      type: 'unknown',
      deepLink: ctx.slug ? makeDeepLink(ctx.slug, scoped) : undefined,
    }),
  );
}
