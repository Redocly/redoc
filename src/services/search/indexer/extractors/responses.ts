import { hasRbacScope } from '../../../../adapters/rbac.js';

import type { ItemContentNode } from '../../../../types/content.js';
import type { ExtractContext, Extractor } from './context.js';

import {
  buildOpenApiSectionSuffix,
  makeDeepLink,
  CALLBACKS_SECTION,
} from '../../../../utils/deep-link.js';
import { makeParam } from '../param.js';
import {
  responseFieldsPlace,
  responseHeadersPlace,
  responseSectionPlace,
  scopedPlace,
} from '../places.js';
import { addRow, describe } from './context.js';
import { extractHeadingSections } from './heading-sections.js';

type Response = NonNullable<ItemContentNode['responses']>[number];

export const responsesExtractor: Extractor = {
  matches: (node) => !!node.responses?.length,
  extract(node, ctx) {
    for (const resp of node.responses ?? []) {
      if (hasRbacScope(resp)) continue;
      addResponseRow(resp, ctx);
      if (ctx.hasSchemas) extractResponseFields(resp, ctx);
    }
  },
};

function addResponseRow(resp: Response, ctx: ExtractContext): void {
  if (resp.description && typeof resp.description !== 'string') {
    extractHeadingSections(resp.description, ctx);
  }

  const respText = [describe(ctx, resp.summary), describe(ctx, resp.description)]
    .filter(Boolean)
    .join(' ')
    .trim();
  if (!respText) return;

  const sectionSuffix = buildOpenApiSectionSuffix('response', undefined, resp.code);
  const scopedSuffix = ctx.scope.callbackId
    ? `${buildOpenApiSectionSuffix(CALLBACKS_SECTION, ctx.scope.callbackId)}/${sectionSuffix}`
    : sectionSuffix;

  addRow(
    ctx,
    makeParam({
      name: resp.code,
      description: respText,
      place: scopedPlace(responseSectionPlace(resp.code), ctx.scope.callbackId),
      type: 'unknown',
      deepLink: ctx.slug ? makeDeepLink(ctx.slug, scopedSuffix) : undefined,
    }),
  );
}

function extractResponseFields(resp: Response, ctx: ExtractContext): void {
  const respPlace = scopedPlace(responseFieldsPlace(resp.code), ctx.scope.callbackId);

  const entries: Array<[string | undefined, string]> = resp.mediaTypeContent
    ? Object.entries(resp.mediaTypeContent)
        .filter(([, content]) => !hasRbacScope(content) && content.schemaId)
        .map(([mediaType, content]) => [mediaType, content.schemaId as string])
    : resp.schemaId
      ? [[resp.mediaType, resp.schemaId]]
      : [];
  const hasMultipleMediaTypes = entries.length > 1;

  for (const [mediaType, schemaId] of entries) {
    ctx.walker.extractSchemaFields(
      {
        schemaId,
        place: respPlace,
        paramsMap: ctx.paramsMap,
        slug: ctx.slug,
        mediaType,
        hasMultipleMediaTypes,
        isResponse: true,
      },
      ctx.scope,
    );
  }

  if (resp.headerSchemaId) {
    const [firstMediaType] = entries[0] ?? [];
    ctx.walker.extractSchemaFields(
      {
        schemaId: resp.headerSchemaId,
        place: scopedPlace(responseHeadersPlace(resp.code), ctx.scope.callbackId),
        paramsMap: ctx.paramsMap,
        slug: ctx.slug,
        mediaType: firstMediaType,
        hasMultipleMediaTypes,
        isResponse: true,
      },
      ctx.scope,
    );
  }
}
