import type { MarkdownAdapter } from '../../contexts/markdownAdapter.js';
import type { MarkdocOptions } from '../../types/options.js';

import { buildMarkdocOptions } from './buildMarkdocOptions.js';
import { markdocParser } from './markdocParser.js';
import { createMarkdocRenderer } from './markdocRenderer.js';

/**
 * The default Markdoc-backed {@link MarkdownAdapter}, used by the standalone build.
 * - `parse`: a raw markdown string (a lazily-rendered schema description) is parsed with Markdoc;
 *   an already-parsed AST (item descriptions parsed at build) passes straight through to `render`,
 *   which revives it.
 * - `render`: merges the host's `markdocOptions` with api-docs' built-in tags/nodes/components, then
 *   transforms + renders the AST (see `buildMarkdocOptions` / `createMarkdocRenderer`).
 */
export function createMarkdocAdapter(markdocOptions?: Partial<MarkdocOptions>): MarkdownAdapter {
  const options = buildMarkdocOptions(markdocOptions);
  return {
    parse: (source) => (typeof source === 'string' ? markdocParser(source) : source),
    render: createMarkdocRenderer(options),
  };
}
