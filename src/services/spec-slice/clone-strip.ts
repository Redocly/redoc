import { isRecord } from '../../adapters/helpers.js';
import { localRefPath } from '../../utils/refPointer.js';

const STRIPPED_KEYS: ReadonlySet<string> = new Set([
  'x-circular-ref',
  'x-allof-cycle',
  'x-original-ref',
  'x-serverValues',
]);

function isStrippedKey(key: string): boolean {
  return STRIPPED_KEYS.has(key) || key.startsWith('x-default');
}

/** A stripped copy of `document`, with every `$ref` target copied once at its own `$ref` address. */
export function cloneStrip(
  document: Record<string, unknown>,
  refTargets: ReadonlyMap<string, Record<string, unknown>>,
): Record<string, unknown> {
  const ancestors = new WeakSet<object>();

  const enter = (node: object): void => {
    if (ancestors.has(node)) {
      throw new Error('spec-slice: circular object graph in the source document');
    }
    ancestors.add(node);
  };

  const copyValue = (node: unknown): unknown => {
    if (isRecord(node)) return copyRecord(node);
    if (!Array.isArray(node)) return node;
    enter(node);
    const result = node.map(copyValue);
    ancestors.delete(node);
    return result;
  };

  const copyRecord = (node: Record<string, unknown>): Record<string, unknown> => {
    enter(node);
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(node)) {
      if (!isStrippedKey(key) && entry !== undefined) result[key] = copyValue(entry);
    }
    ancestors.delete(node);
    return result;
  };

  const result = copyRecord(document);
  for (const [ref, target] of refTargets) {
    const path = localRefPath(ref);
    // `__proto__` would write into Object.prototype; a stripped key would put removed content back.
    // The `x-default*` credential keys hold strings, so they are never on a target's path.
    if (!path || path.some((key) => key === '__proto__' || STRIPPED_KEYS.has(key))) continue;
    let parent = result;
    for (const key of path.slice(0, -1)) parent = childRecord(parent, key);
    parent[path[path.length - 1]] = copyRecord(target);
  }
  return result;
}

function childRecord(parent: Record<string, unknown>, key: string): Record<string, unknown> {
  const child = parent[key];
  if (isRecord(child)) return child;
  const created: Record<string, unknown> = {};
  parent[key] = created;
  return created;
}
