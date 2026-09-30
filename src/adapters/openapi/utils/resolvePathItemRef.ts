import type { OpenAPIPath } from '../../../types/openapi.js';

import { resolveJsonPointer } from '../../helpers.js';

function openapiAllowsPathItemRefSiblings(openapi: string | undefined): boolean {
  return String(openapi ?? '').startsWith('3.1');
}

export function resolvePathItemRef(
  document: Record<string, unknown>,
  pathItem: OpenAPIPath | undefined | null,
  openapi?: string,
): OpenAPIPath | undefined {
  if (!pathItem || typeof pathItem !== 'object') {
    return undefined;
  }

  if (typeof pathItem.$ref !== 'string') {
    return pathItem;
  }

  const mergeSiblings = openapiAllowsPathItemRefSiblings(openapi);
  return derefPathItem(document, pathItem as Record<string, unknown>, mergeSiblings, []) as
    | OpenAPIPath
    | undefined;
}

function derefPathItem(
  document: Record<string, unknown>,
  refObject: Record<string, unknown>,
  mergeSiblings: boolean,
  refStack: readonly string[],
): Record<string, unknown> {
  const ref = refObject.$ref;
  if (typeof ref !== 'string') {
    return refObject;
  }

  if (refStack.includes(ref)) {
    const target = resolveJsonPointer(document, ref);
    const base = target ? { ...target } : {};
    return { ...base, 'x-circular-ref': true };
  }

  const target = resolveJsonPointer(document, ref);
  if (!target) {
    throw new Error(`Failed to resolve $ref "${ref}" for path item`);
  }

  let resolved: Record<string, unknown>;
  if (typeof target.$ref === 'string') {
    resolved = derefPathItem(document, target, mergeSiblings, [...refStack, ref]);
  } else {
    resolved = { ...target };
  }

  if (mergeSiblings) {
    const { $ref: _drop, ...rest } = refObject;
    if (Object.keys(rest).length > 0) {
      resolved = { ...resolved, ...rest };
    }
  }

  return resolved;
}
