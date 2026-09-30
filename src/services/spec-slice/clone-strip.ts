import { isRecord } from '../../adapters/helpers.js';

const STRIPPED_KEYS: ReadonlySet<string> = new Set([
  'x-circular-ref',
  'x-allof-cycle',
  'x-original-ref',
]);

export function cloneStrip(value: unknown, inlineTargets: ReadonlyMap<string, unknown>): unknown {
  const ancestors = new WeakSet<object>();
  const inlineStack = new Set<string>();

  const visit = (node: unknown): unknown => {
    if (Array.isArray(node)) {
      if (ancestors.has(node)) {
        throw new Error('spec-slice: circular object graph in the source document');
      }
      ancestors.add(node);
      const result = node.map(visit);
      ancestors.delete(node);
      return result;
    }
    if (!isRecord(node)) return node;
    if (ancestors.has(node)) {
      throw new Error('spec-slice: circular object graph in the source document');
    }

    const ref = typeof node.$ref === 'string' ? node.$ref : undefined;
    if (ref && inlineTargets.has(ref)) {
      if (inlineStack.has(ref)) {
        return {};
      }
      inlineStack.add(ref);
      ancestors.add(node);
      const inlined = visit(inlineTargets.get(ref));
      inlineStack.delete(ref);
      const siblings: Record<string, unknown> = {};
      for (const [key, entryValue] of Object.entries(node)) {
        if (key === '$ref' || STRIPPED_KEYS.has(key) || entryValue === undefined) continue;
        siblings[key] = visit(entryValue);
      }
      ancestors.delete(node);
      return isRecord(inlined) ? { ...inlined, ...siblings } : inlined;
    }

    ancestors.add(node);
    const result: Record<string, unknown> = {};
    for (const [key, entryValue] of Object.entries(node)) {
      if (STRIPPED_KEYS.has(key) || entryValue === undefined) continue;
      result[key] = visit(entryValue);
    }
    ancestors.delete(node);
    return result;
  };

  return visit(value);
}
