import { memo, useMemo } from 'react';

import type { ReactElement } from 'react';

import { isMarkdocAst } from '../../adapters/utils/markdoc.js';
import { useMarkdownAdapter } from '../../contexts/markdownAdapter.js';

export type MarkdownProps = {
  // A raw markdown string (lazily-rendered schema/parameter descriptions or plain strings the
  // build kept unparsed) or an already-parsed AST (item descriptions parsed at build). The host
  // adapter's `parse` normalizes both before `render` turns the result into React.
  source: unknown;
};

const UNRENDERABLE = Symbol('unrenderable');

function MarkdownComponent({ source }: MarkdownProps): ReactElement {
  const adapter = useMarkdownAdapter();
  const parsed = useMemo(() => {
    const markdown = toMarkdownSource(source);
    return markdown === UNRENDERABLE ? UNRENDERABLE : adapter.parse(markdown);
  }, [adapter, source]);
  return <>{parsed === UNRENDERABLE ? null : adapter.render(parsed)}</>;
}

function toMarkdownSource(source: unknown): unknown {
  if (typeof source === 'number' || typeof source === 'boolean') return String(source);
  if (typeof source !== 'object' || source === null) return source;
  return isMarkdocAst(source) ? source : UNRENDERABLE;
}

export const Markdown = memo(MarkdownComponent);
