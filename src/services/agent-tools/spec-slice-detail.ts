import { buildSpecSlice, resolveSpecSliceScope } from '../spec-slice/index.js';

import type { ApiSpecType } from '../../types/common.js';
import type { ApiDocsAgentToolsParams } from './types.js';

type SpecSliceDetailParams = {
  specType: ApiSpecType;
  /** The bundled definition, or GraphQL SDL. */
  definition: Record<string, unknown> | string;
};

/** Operation detail for hosts that hold the definition: the slice the page actions copy. */
export function createSpecSliceOperationDetail({
  specType,
  definition,
}: SpecSliceDetailParams): NonNullable<ApiDocsAgentToolsParams['getOperationDetail']> {
  return async (_operation, { item }) => {
    const scope = resolveSpecSliceScope(specType, item.content, item.label);

    return scope ? await buildSpecSlice(specType, definition, scope) : undefined;
  };
}
