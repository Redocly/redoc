import { dump } from 'js-yaml';

import { isRecord } from '../../adapters/helpers.js';
import { apiSpecType } from '../../types/common.js';
import { extractOpenApiSlice } from './openapi-slice.js';
import { asyncApiSliceTarget, extractAsyncApiSlice } from './asyncapi-slice.js';

import type { ApiSpecType } from '../../types/common.js';
import type { SpecSliceScope } from './types.js';
import type { OpenApiSliceOptions } from './openapi-slice.js';

export { resolveSpecSliceScope } from './resolve-scope.js';
export {
  ASSISTANT_LINK_BASES,
  buildInlinePromptLink,
  buildFetchSpecPromptLink,
  wrapSliceForCopy,
} from './assistant-links.js';
export type { SliceContentKind, SpecSliceScope } from './types.js';

/** One-line name of the page target, such as `GET /pets`; `undefined` for tags, schemas and GraphQL types. */
export function describeSliceTarget(scope: SpecSliceScope, document: unknown): string | undefined {
  switch (scope.kind) {
    case 'operation':
      return `${scope.httpVerb.toUpperCase()} ${scope.pathName}`;
    case 'graphql-operation':
      return `${scope.operationType} ${scope.name}`;
    case 'channel':
    case 'async-operation':
      return asyncApiSliceTarget(document, scope);
    default:
      return undefined;
  }
}

export async function buildSpecSlice(
  specType: ApiSpecType,
  document: unknown,
  scope: SpecSliceScope,
  options?: OpenApiSliceOptions,
): Promise<string | undefined> {
  switch (specType) {
    case apiSpecType.GRAPHQL: {
      if (typeof document !== 'string') return undefined;

      if (scope.kind === 'document') return document;

      const { extractGraphqlSlice } = await import('./graphql-slice.js');

      return extractGraphqlSlice(document, scope, options?.maxRefDepth);
    }
    case apiSpecType.OPENAPI: {
      if (isRecord(document)) {
        const slice = extractOpenApiSlice(document, scope, options);

        if (slice) {
          return dump(slice.document, { noRefs: true, lineWidth: -1 });
        }
      }

      return undefined;
    }
    case apiSpecType.ASYNCAPI: {
      if (isRecord(document)) {
        const slice = extractAsyncApiSlice(document, scope, options?.maxRefDepth);

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
