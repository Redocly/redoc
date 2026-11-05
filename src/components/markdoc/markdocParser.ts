import markdoc from '@redocly/markdoc';
import { htmlTags } from '@redocly/markdoc/html';

import type { ParserArgs } from '@redocly/markdoc';
import type { MarkdownParser } from '../../adapters/utils/parseMarkdown.js';

import { sanitizeMarkdownSource } from '../../adapters/utils/markdoc.js';

// Compact nodes carry no location or `inline` wrappers.
const PARSE_OPTIONS: ParserArgs = {
  html: htmlTags(),
  allowIndentation: true,
  allowComments: true,
  compact: true,
};

/**
 * The default Markdoc-based {@link MarkdownParser}, supplied by the standalone build. api-docs core
 * stays free of a markdown engine; callers of `buildItems` pass this in (or their own parser).
 * Raw HTML in the source becomes `{% html %}` tag nodes, so it renders as elements and never
 * leaks markup into extracted text.
 */
export const markdocParser: MarkdownParser = (markdown, sanitizeOptions) => {
  const ast = markdoc.parse(sanitizeMarkdownSource(markdown, sanitizeOptions), PARSE_OPTIONS);
  // Compact parsing unwraps a single-child document, and callers expect the top-level blocks.
  return ast.type === 'document' ? ast.children : [ast];
};
