const PLAIN_CHARS_RE = /^[a-zA-Z0-9\s\-,.!?:;'"()/]+$/;

/**
 * True when a description string contains no markdown/markdoc/HTML syntax, so parsing it would
 * only wrap it in a paragraph. Such strings can stay plain in the items/store JSON (an AST is
 * ~10x the raw size) and render as-is on the client.
 */
export function isPlainText(value: string): boolean {
  return PLAIN_CHARS_RE.test(value);
}
