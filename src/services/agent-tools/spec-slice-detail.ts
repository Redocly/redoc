import { buildSpecSlice, resolveSpecSliceScope } from '../spec-slice/index.js';

import type { ApiSpecType } from '../../types/common.js';
import type { ApiItem } from '../../types/store.js';
import type { ApiOperationSummary } from './types.js';

type SpecSliceDetailParams = {
  items: ApiItem[];
  specType: ApiSpecType;
  /** The bundled definition, or GraphQL SDL. */
  definition: Record<string, unknown> | string;
};

/** Operation detail for hosts that hold the definition: the slice the page actions copy. */
export function createSpecSliceOperationDetail({
  items,
  specType,
  definition,
}: SpecSliceDetailParams): (operation: ApiOperationSummary) => Promise<string | undefined> {
  return async (operation) => {
    const item = findItemByLink(items, operation.url);
    const scope = resolveSpecSliceScope(specType, item?.content, item?.label);

    return scope ? await buildSpecSlice(specType, definition, scope) : undefined;
  };
}

function findItemByLink(items: ApiItem[], link: string): ApiItem | undefined {
  for (const item of items) {
    if (item.link === link) return item;

    const found = item.items ? findItemByLink(item.items as ApiItem[], link) : undefined;
    if (found) return found;
  }

  return undefined;
}
