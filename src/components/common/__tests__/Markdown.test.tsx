import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { ReactNode } from 'react';
import type { MarkdownAdapter } from '../../../contexts/markdownAdapter.js';

import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { Markdown } from '../Markdown.js';

it('parses the source through the adapter, then renders the parsed value', () => {
  const source = 'A raw **markdown** string';
  const parsed = { type: 'document', children: [] };
  const adapter: MarkdownAdapter = {
    parse: vi.fn(() => parsed),
    render: vi.fn(() => (<span data-testid="rendered">rendered</span>) as ReactNode),
  };

  render(
    <MarkdownAdapterProvider value={adapter}>
      <Markdown source={source} />
    </MarkdownAdapterProvider>,
  );

  expect(adapter.parse).toHaveBeenCalledWith(source);
  expect(adapter.render).toHaveBeenCalledWith(parsed);
  expect(screen.getByTestId('rendered')).toBeInTheDocument();
});

it('throws when no adapter is provided', () => {
  // Suppress expected React error boundary console output.
  const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

  expect(() => render(<Markdown source={{} as never} />)).toThrow('No markdown adapter found');

  spy.mockRestore();
});
