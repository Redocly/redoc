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

  expect(() => render(<Markdown source={{}} />)).toThrow('No markdown adapter found');

  spy.mockRestore();
});

it.each([
  [42, '42'],
  [true, 'true'],
])('hands the adapter a %j source as text', (source, expected) => {
  const adapter: MarkdownAdapter = { parse: vi.fn((value) => value), render: vi.fn(() => null) };

  render(
    <MarkdownAdapterProvider value={adapter}>
      <Markdown source={source} />
    </MarkdownAdapterProvider>,
  );

  expect(adapter.parse).toHaveBeenCalledWith(expected);
});

it.each([
  ['an object', { not: 'an AST' }],
  ['a list of plain values', ['first', 2]],
  ['a list mixing a Markdoc node with a plain value', [{ $$mdtype: 'Node' }, 'text']],
  ['an empty list', []],
])('renders nothing for %s that is not a Markdoc tree', (_, source) => {
  const adapter: MarkdownAdapter = { parse: vi.fn(), render: vi.fn(() => null) };

  const { container } = render(
    <MarkdownAdapterProvider value={adapter}>
      <Markdown source={source} />
    </MarkdownAdapterProvider>,
  );

  expect(adapter.parse).not.toHaveBeenCalled();
  expect(adapter.render).not.toHaveBeenCalled();
  expect(container).toBeEmptyDOMElement();
});

it('passes a parsed Markdoc tree through unchanged', () => {
  const ast = { $$mdtype: 'Node', type: 'document', children: [] };
  const adapter: MarkdownAdapter = { parse: vi.fn((value) => value), render: vi.fn(() => null) };

  render(
    <MarkdownAdapterProvider value={adapter}>
      <Markdown source={ast} />
    </MarkdownAdapterProvider>,
  );

  expect(adapter.parse).toHaveBeenCalledWith(ast);
});
