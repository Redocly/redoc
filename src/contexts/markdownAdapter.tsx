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
 * pre-parse upstream supply a `parse` no-op plus their own `render`, so the Markdoc
 * parser never enters their client bundle.
 */
export type MarkdownRenderer = (parsed: unknown) => ReactNode;

export type MarkdownAdapter = {
  parse: (source: unknown) => unknown;
  render: MarkdownRenderer;
};

const MarkdownAdapterContext = createContext<MarkdownAdapter | null>(null);

export const MarkdownAdapterProvider = MarkdownAdapterContext.Provider;

const ADAPTER_SHAPE =
  'A markdown adapter is an object with `parse(source)` and `render(parsed)`, and `render` returns React elements. `createMarkdocAdapter()` returns the built-in one.';

const checkedAdapters = new WeakMap<object, MarkdownAdapter>();

export function useMarkdownAdapter(): MarkdownAdapter {
  return checkMarkdownAdapter(useContext(MarkdownAdapterContext));
}

export function useProvidedMarkdownAdapterCheck(): void {
  const adapter = useContext(MarkdownAdapterContext);
  if (adapter) checkMarkdownAdapter(adapter);
}

function checkMarkdownAdapter(adapter: MarkdownAdapter | null): MarkdownAdapter {
  if (!adapter) {
    throw new TypeError(
      `No markdown adapter found: pass a \`markdownAdapter\` prop. ${ADAPTER_SHAPE}`,
    );
  }
  const checked = checkedAdapters.get(adapter);
  if (checked) return checked;

  for (const method of ['parse', 'render'] as const) {
    if (typeof adapter[method] !== 'function') {
      throw new TypeError(`\`markdownAdapter.${method}\` is not a function. ${ADAPTER_SHAPE}`);
    }
  }
  const result: MarkdownAdapter = {
    parse: (source) => adapter.parse(source),
    render: (parsed) => checkRendered(adapter.render(parsed)),
  };
  checkedAdapters.set(adapter, result);
  return result;
}

function checkRendered(node: ReactNode): ReactNode {
  for (const item of Array.isArray(node) ? node : [node]) {
    if (!isUnrenderableObject(item)) continue;
    throw new TypeError(
      '$$mdtype' in item
        ? '`markdownAdapter.render` returned a Markdoc tree instead of React elements. Render the tree with `Markdoc.renderers.react(tree, React)`, or use `createMarkdocAdapter()`.'
        : '`markdownAdapter.render` returned an object that React cannot render. It must return React elements, a string, or `null`.',
    );
  }
  return node;
}

function isUnrenderableObject(value: unknown): value is object {
  return (
    typeof value === 'object' &&
    value !== null &&
    !('$$typeof' in value) &&
    !(Symbol.iterator in value) &&
    typeof (value as { then?: unknown }).then !== 'function'
  );
}
