import { isOpenAPIRef, resolveJsonPointer } from '../../helpers.js';
import { isRecord } from '../../../utils/is-record.js';

/** Follows a `$ref` chain; `undefined` for a non-object, a dangling pointer or a cycle. */
export function resolveInDoc<T>(document: Record<string, unknown>, value: unknown): T | undefined {
  const seen = new Set<string>();
  let current: unknown = value;
  while (isOpenAPIRef(current)) {
    if (seen.has(current.$ref)) return undefined;
    seen.add(current.$ref);
    current = resolveJsonPointer(document, current.$ref);
  }
  return isRecord(current) ? (current as T) : undefined;
}
