export function encodeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, '~0').replace(/\//g, '~1');
}

export function refPointerToStoreId(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  // Accept `#/x`, `/x`, and `x` — store ids carry neither the `#` nor a leading slash.
  const bare = ref.startsWith('#') ? ref.slice(1) : ref;
  return bare.startsWith('/') ? bare.slice(1) : bare;
}
