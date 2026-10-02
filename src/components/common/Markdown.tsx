import { memo, useMemo } from 'react';

import type { ReactElement } from 'react';

import { useMarkdownAdapter } from '../../contexts/markdownAdapter.js';

export type MarkdownProps = {
  // A raw markdown string (lazily-rendered schema/parameter descriptions or plain strings the
  // build kept unparsed) or an already-parsed AST (item descriptions parsed at build). The host
  // adapter's `parse` normalizes both before `render` turns the result into React.
  source: unknown;
};

function MarkdownComponent({ source }: MarkdownProps): ReactElement {
  const adapter = useMarkdownAdapter();
  const parsed = useMemo(() => adapter.parse(source), [adapter, source]);
  return <>{adapter.render(parsed)}</>;
}

export const Markdown = memo(MarkdownComponent);
