import type { ContentNode, ItemContentNode } from '../../../../types/content.js';
import type { ExtractContext } from './context.js';

import {
  buildOpenApiSectionSuffix,
  makeDeepLink,
  CALLBACKS_SECTION,
} from '../../../../utils/deep-link.js';
import { makeParam } from '../param.js';
import { CALLBACK_PLACE } from '../places.js';
import { addRow, describe, withScope } from './context.js';
import { extractHeadingSections } from './heading-sections.js';

export type VisitNodes = (nodes: ContentNode[], ctx: ExtractContext) => void;

export function extractCallback(
  callback: NonNullable<ItemContentNode['callback']>,
  ctx: ExtractContext,
  visit: VisitNodes,
): void {
  const description = [callback.summary ?? '', describe(ctx, callback.description)]
    .filter(Boolean)
    .join(' ')
    .trim();

  addRow(
    ctx,
    makeParam({
      name: callback.callbackName,
      description,
      place: CALLBACK_PLACE,
      type: 'unknown',
      deepLink: ctx.slug
        ? makeDeepLink(ctx.slug, buildOpenApiSectionSuffix(CALLBACKS_SECTION, callback.callbackId))
        : undefined,
    }),
  );

  const inner = withScope(ctx, { callbackId: callback.callbackId });
  if (callback.description && typeof callback.description !== 'string') {
    extractHeadingSections(callback.description, inner);
  }
  if (callback.contentChildren?.length) {
    visit(callback.contentChildren, inner);
  }
}
