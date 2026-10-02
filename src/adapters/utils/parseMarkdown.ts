import type { Node } from '@markdoc/markdoc';
import type { MarkdownParser } from '../../types/options.js';
import type { MarkdownSanitizeOptions } from './markdoc.js';

import { isPlainText } from './isPlainText.js';

export type { MarkdownParser };

export type ParseMarkdownOptions = MarkdownSanitizeOptions & { markdownParser: MarkdownParser };

export function parseMarkdown(
  markdown: string | undefined | null | Node | Node[],
  options?: ParseMarkdownOptions,
): string | Node | Node[] | undefined {
  if (!markdown) {
    return undefined;
  }

  // Already an AST (e.g. an embedder injected a pre-parsed description) — pass through.
  if (typeof markdown !== 'string') {
    return markdown;
  }

  if (isPlainText(markdown)) {
    return markdown;
  }

  if (!options?.markdownParser) {
    throw new Error(
      'parseMarkdown: a `markdownParser` is required to parse string content. The host build ' +
        '(standalone or embedder) must supply one via options / the markdown parser context.',
    );
  }

  return options.markdownParser(markdown, options);
}
