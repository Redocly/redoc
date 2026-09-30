import { hasRbacScope } from '../../../../adapters/rbac.js';

import type { Node } from '@markdoc/markdoc';
import type { Extractor } from './context.js';

import { buildFieldDeepLink } from '../deep-links.js';
import { makeParam } from '../param.js';
import { parameterPlaceOf, scopedPlace } from '../places.js';
import { addRow, describe } from './context.js';

const PARAMETER_IN_VARIANTS = new Set([
  'query',
  'path',
  'headers',
  'cookies',
  'querystring',
  'parameters',
]);

function resolveParameterIn(variant: string | undefined): string | undefined {
  return PARAMETER_IN_VARIANTS.has(variant ?? '') ? variant : undefined;
}

export const parametersExtractor: Extractor = {
  matches: (node) => !!node.parameters?.length,
  extract(node, ctx) {
    for (const p of node.parameters ?? []) {
      if (hasRbacScope(p)) continue;
      addRow(
        ctx,
        makeParam({
          name: p.name,
          description: describe(ctx, p.description as string | Node | Node[] | undefined),
          place: scopedPlace(parameterPlaceOf(node.variant), ctx.scope.callbackId),
          type: ctx.walker.resolveParameterType(p.schemaId),
          required: p.required ?? false,
          deepLink: buildFieldDeepLink({
            slug: ctx.slug,
            type: 'request',
            in: resolveParameterIn(node.variant),
            fieldPath: [p.name],
            scope: ctx.scope,
          }),
        }),
      );
    }
  },
};
