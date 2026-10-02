import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

export type { MarkdownParser } from '../adapters/utils/parseMarkdown.js';

/**
 * Host-provided markdown handling. api-docs core does not bundle a markdown engine — embedders
 * supply an adapter so they own how descriptions become React:
 * - `parse` normalizes a source — a raw markdown string, or an already-parsed AST — into whatever
 *   `render` consumes. It is opaque to api-docs. Item descriptions are parsed at build, so they
 *   reach `parse` as ASTs; the lazily-rendered schema descriptions reach it as raw strings.
 * - `render` turns the parsed value into React.
 *
 * The standalone build supplies a Markdoc-based adapter (`createMarkdocAdapter`). Embedders that
 * pre-parse upstream (e.g. realm) supply a `parse` no-op plus their own `render`, so the Markdoc
 * parser never enters their client bundle.
 */
export type MarkdownRenderer = (parsed: unknown) => ReactNode;

export type MarkdownAdapter = {
  parse: (source: unknown) => unknown;
  render: MarkdownRenderer;
};

const MarkdownAdapterContext = createContext<MarkdownAdapter | null>(null);

export const MarkdownAdapterProvider = MarkdownAdapterContext.Provider;

export function useMarkdownAdapter(): MarkdownAdapter {
  const adapter = useContext(MarkdownAdapterContext);
  if (!adapter) {
    throw new Error(
      'No markdown adapter found — pass `markdownAdapter` to <RedoclyApiDocs> (the standalone build supplies one automatically).',
    );
  }
  return adapter;
}
