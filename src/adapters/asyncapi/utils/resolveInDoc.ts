import type { AsyncApiDefinition } from '../../../types/asyncapi.js';

import { resolveRef } from '../../helpers.js';

export function resolveInDoc<T>(document: AsyncApiDefinition, value: unknown): T | undefined {
  const resolved = resolveRef(document as unknown as Record<string, unknown>, value);
  return resolved as T | undefined;
}
