import { dump } from 'js-yaml';

import { isRecord } from '../../adapters/helpers.js';
import { apiSpecType } from '../../types/common.js';
import { extractOpenApiSlice } from './openapi-slice.js';
import { extractAsyncApiSlice } from './asyncapi-slice.js';

import type { ApiSpecType } from '../../types/common.js';
import type { SpecSliceScope } from './types.js';

export { resolveSpecSliceScope } from './resolve-scope.js';
export {
  ASSISTANT_LINK_BASES,
  buildInlinePromptLink,
  buildFetchSpecPromptLink,
} from './assistant-links.js';
export type { SliceContentKind, SpecSliceScope } from './types.js';

export async function buildSpecSlice(
  specType: ApiSpecType,
  document: unknown,
  scope: SpecSliceScope,
): Promise<string | undefined> {
  switch (specType) {
    case apiSpecType.GRAPHQL: {
      if (typeof document !== 'string') return undefined;

      if (scope.kind === 'document') return document;

      const { extractGraphqlSlice } = await import('./graphql-slice.js');

      return extractGraphqlSlice(document, scope);
    }
    case apiSpecType.OPENAPI: {
      if (isRecord(document)) {
        const slice = extractOpenApiSlice(document, scope);

        if (slice) {
          return dump(slice.document, { noRefs: true, lineWidth: -1 });
        }
      }

      return undefined;
    }
    case apiSpecType.ASYNCAPI: {
      if (isRecord(document)) {
        const slice = extractAsyncApiSlice(document, scope);

        if (slice) {
          return dump(slice.document, { noRefs: true, lineWidth: -1 });
        }
      }

      return undefined;
    }
    default:
      return undefined;
  }
}
