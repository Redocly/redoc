import type { Node } from '@markdoc/markdoc';
import type { ItemContentNode } from '../../../../types/content.js';
import type { ExtractContext, Extractor } from './context.js';

import { makeDeepLink } from '../../../../utils/deep-link.js';
import { makeParam } from '../param.js';
import { fieldsPlaceOf, scopedPlace } from '../places.js';
import { addRow, describe } from './context.js';

export type NamedRow = { name: string; description?: string | Node | Node[]; type?: string };

const toRows = (names: string[] | undefined): NamedRow[] => (names ?? []).map((name) => ({ name }));

const NAMED_ROWS: Partial<
  Record<ItemContentNode['variant'], (node: ItemContentNode) => NamedRow[]>
> = {
  values: (node) => node.values ?? [],
  'possible-types': (node) => toRows(node.graphqlTypeNames),
  implements: (node) => toRows(node.graphqlInterfaceNames),
  'implemented-by': (node) => toRows(node.graphqlTypeNames),
};

export const namedRowsExtractor: Extractor = {
  matches: (node) => node.variant in NAMED_ROWS,
  extract(node, ctx) {
    const rows = NAMED_ROWS[node.variant]?.(node) ?? [];
    addNamedRows(
      rows,
      scopedPlace(fieldsPlaceOf(node.variant), ctx.scope.callbackId),
      node.variant,
      ctx,
    );
  },
};

export function addNamedRows(
  rows: NamedRow[],
  place: string,
  suffix: string,
  ctx: ExtractContext,
): void {
  for (const row of rows) {
    addRow(
      ctx,
      makeParam({
        name: row.name,
        description: describe(ctx, row.description),
        place,
        type: row.type ?? '',
        deepLink: ctx.slug ? makeDeepLink(ctx.slug, suffix) : undefined,
      }),
    );
  }
}
