import { allLanguages, createHighlighter, escapeHtml, renderTokens } from '@tanstack/highlight';

import type { HighlightRenderNode } from '@tanstack/highlight';

import { extraLanguages } from './code-highlight-languages.js';
import { normalizeLanguageForHighlight } from '../utils/media-type.js';

const highlighter = createHighlighter({ languages: [...allLanguages, ...extraLanguages] });

/** Names that reach the hook (media types, sample labels, legacy grammar names) → grammar. */
const LANGUAGE_ALIASES: Record<string, string> = {
  'application/json-seq': 'json',
  clike: 'plaintext',
  curl: 'shell',
  'json-seq': 'json',
  jsonl: 'json',
  'multipart-mixed': 'http',
  'multipart/mixed': 'http',
  ndjson: 'json',
  'node.js': 'js',
  sse: 'yaml',
  viml: 'plaintext',
};

const TOKEN_COLOR_VARIABLES: Record<string, string> = {
  attr: '--code-block-tokens-attr-name-color',
  'code-inline': '--code-block-tokens-default-color',
  command: '--code-block-tokens-function-color',
  comment: '--code-block-tokens-comment-color',
  deleted: '--code-block-tokens-deleted-color',
  function: '--code-block-tokens-function-color',
  heading: '--code-block-tokens-keyword-color',
  inserted: '--code-block-tokens-inserted-color',
  keyword: '--code-block-tokens-keyword-color',
  link: '--code-block-tokens-link-color',
  literal: '--code-block-tokens-boolean-color',
  meta: '--code-block-tokens-comment-color',
  number: '--code-block-tokens-number-color',
  operator: '--code-block-tokens-operator-color',
  property: '--code-block-tokens-property-string-color',
  selector: '--code-block-tokens-selector-color',
  string: '--code-block-tokens-string-color',
  tag: '--code-block-tokens-tag-color',
  type: '--code-block-tokens-class-name-color',
  variable: '--code-block-tokens-variable-color',
};

// YAML keys read as tags (the default text color), not as JSON-style properties.
const LANGUAGE_TOKEN_COLOR_VARIABLES: Record<string, Record<string, string>> = {
  yaml: { property: '--code-block-tokens-tag-color' },
};

export type CodeHighlightOptions = {
  startLineNumber?: number;
  withLineNumbers?: boolean;
};

function mapLanguage(language: string | undefined): string {
  const name = normalizeLanguageForHighlight(language?.trim());
  return LANGUAGE_ALIASES[name] ?? name;
}

function tokenColorVariable(classNames: Array<string>, language: string): string | undefined {
  for (const className of classNames) {
    const token = className.slice(3);
    const variable =
      LANGUAGE_TOKEN_COLOR_VARIABLES[language]?.[token] ?? TOKEN_COLOR_VARIABLES[token];
    if (variable) {
      return variable;
    }
  }
  return undefined;
}

function renderNodes(
  nodes: ReadonlyArray<HighlightRenderNode>,
  options: { language: string; lineNumberOffset?: number },
): string {
  let html = '';
  for (const node of nodes) {
    if (node.type === 'text') {
      html += escapeHtml(node.value);
      continue;
    }
    const isLine = node.classNames.includes('th-line');
    const colorVariable = tokenColorVariable(node.classNames, options.language);
    const style = colorVariable ? ` style="color: var(${colorVariable})"` : '';
    let attributes = '';
    for (const [key, value] of Object.entries(node.data ?? {})) {
      attributes += ` data-${key}="${escapeHtml(value)}"`;
    }
    if (options.lineNumberOffset !== undefined && node.data?.line) {
      attributes += ` data-line-number="${options.lineNumberOffset + Number(node.data.line)}"`;
    }
    const classNames = isLine ? [...node.classNames, 'line'] : node.classNames;
    const className = classNames.map(escapeHtml).join(' ');
    html += `<span class="${className}"${style}${attributes}>${renderNodes(node.children, options)}</span>`;
  }
  return html;
}

/**
 * Highlights `source` as HTML for the code block: `<code class="th-code th-code--<lang>">` with
 * `th-token th-<class>` spans colored through the theme's `--code-block-tokens-*` variables.
 * Unknown languages render as escaped plain text.
 */
export function highlight(
  source: string,
  language?: string,
  options?: CodeHighlightOptions,
): string {
  const { startLineNumber = 1, withLineNumbers } = options ?? {};
  const result = highlighter.tokenize(source, { lang: mapLanguage(language) });
  // Every line gets a `.line` span; the number shows only with `lineNumberOffset`.
  const nodes = renderTokens(result.tokens, { lineNumbers: true });
  const rendered = renderNodes(nodes, {
    language: result.lang,
    lineNumberOffset: withLineNumbers ? startLineNumber - 1 : undefined,
  });
  const languageClass = escapeHtml(result.lang);
  return `<code class="th-code th-code--${languageClass}" data-language="${languageClass}">${rendered}</code>`;
}

const codeHighlight = { highlight };

export function useCodeHighlight(): typeof codeHighlight {
  return codeHighlight;
}
