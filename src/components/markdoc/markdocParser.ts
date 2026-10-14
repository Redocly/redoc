import markdoc from '@markdoc/markdoc';

import type { MarkdownParser } from '../../adapters/utils/parseMarkdown.js';

import { sanitizeMarkdownSource } from '../../adapters/utils/markdoc.js';
import { simplifyAstStructure } from '../../adapters/utils/simplifyAstStructure.js';
import { processHtmlTokens } from './html/process-html-tokens.js';

const tokenizer = new markdoc.Tokenizer({
  html: true,
  allowIndentation: true,
  allowComments: true,
});
// A temporary workaround for a markdown-it performance issue: https://github.com/markdown-it/markdown-it/issues/996
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(tokenizer as any).parser.block.ruler.getRules('reference').length = 0;

/**
 * The default Markdoc-based {@link MarkdownParser}, supplied by the standalone build. api-docs core
 * stays free of a markdown engine; callers of `buildItems` pass this in (or their own parser).
 * Raw HTML in the source is tokenized and converted into `{% html %}` tag nodes, so it renders as
 * elements and never leaks markup into extracted text.
 */
export const markdocParser: MarkdownParser = (markdown, sanitizeOptions) => {
  const tokens = tokenizer.tokenize(sanitizeMarkdownSource(markdown, sanitizeOptions));
  return simplifyAstStructure(markdoc.parse(processHtmlTokens(tokens)));
};
