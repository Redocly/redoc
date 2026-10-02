export function toText(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value.join(' ') : (value ?? '');
}

/** Lowercased text; array items are joined by newlines so a query word never spans two. */
export function lowerText(value: unknown): string {
  if (value == null) return '';
  const text = Array.isArray(value)
    ? value
        .filter((item) => item != null)
        .map(String)
        .join('\n')
    : String(value);
  return text.toLowerCase();
}
