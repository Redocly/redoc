import { isRecord } from './is-record.js';

export function encodeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

export function refPointerToStoreId(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  // Accept `#/x`, `/x`, and `x` — store ids carry neither the `#` nor a leading slash.
  const bare = ref.startsWith('#') ? ref.slice(1) : ref;
  return bare.startsWith('/') ? bare.slice(1) : bare;
}

/** The node a `$ref` into a stored schema points at (longest matching store id), or undefined. */
export function resolveStorePointer(
  ref: string,
  lookup: (id: string) => unknown,
): Record<string, unknown> | undefined {
  const segments = (refPointerToStoreId(ref) ?? '').split('/');
  for (let split = segments.length; split > 0; split--) {
    const root = lookup(segments.slice(0, split).join('/'));
    if (!isRecord(root)) continue;
    let node: Record<string, unknown> | unknown[] = root;
    for (const segment of segments.slice(split)) {
      const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
      const next: unknown = Array.isArray(node) ? node[Number(key)] : node[key];
      if (!isRecord(next) && !Array.isArray(next)) return undefined;
      node = next;
    }
    return isRecord(node) ? node : undefined;
  }
  return undefined;
}
