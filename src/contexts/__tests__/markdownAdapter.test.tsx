import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createPortal } from 'react-dom';
import '@testing-library/jest-dom/vitest';

import type { MarkdownAdapter } from '../markdownAdapter.js';

import { MarkdownAdapterProvider } from '../markdownAdapter.js';
import { Markdown } from '../../components/common/Markdown.js';

function renderWith(adapter: unknown): void {
  render(
    <MarkdownAdapterProvider value={adapter as MarkdownAdapter}>
      <Markdown source="Some **markdown**" />
    </MarkdownAdapterProvider>,
  );
}

describe('markdownAdapter checks', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['parse', { render: () => null }],
    ['render', { parse: (source: unknown) => source }],
  ])('names `%s` when it is not a function', (method, adapter) => {
    expect(() => renderWith(adapter)).toThrow(`\`markdownAdapter.${method}\` is not a function`);
  });

  it('explains that a Markdoc tree must be rendered to React elements', () => {
    const markdocTree = { $$mdtype: 'Tag', name: 'p', attributes: {}, children: ['Some'] };

    expect(() => renderWith({ parse: () => markdocTree, render: (tree: unknown) => tree })).toThrow(
      /returned a Markdoc tree instead of React elements/,
    );
  });

  it('rejects any other object that React cannot render, also inside an array', () => {
    expect(() =>
      renderWith({ parse: (source: unknown) => source, render: () => ['text', { kind: 'node' }] }),
    ).toThrow(/returned an object that React cannot render/);
  });

  it.each([
    ['an element', () => <span data-testid="rendered">rendered</span>],
    [
      'a createPortal result',
      () => createPortal(<span data-testid="rendered">rendered</span>, document.body),
    ],
    [
      'a list of elements',
      () => [
        <span key="a" data-testid="rendered">
          rendered
        </span>,
      ],
    ],
  ])('renders what a valid adapter returns: %s', (_, renderMarkdown) => {
    renderWith({ parse: (source: unknown) => source, render: renderMarkdown });

    expect(screen.getByTestId('rendered')).toBeInTheDocument();
  });

  it('calls the adapter methods on the adapter object', () => {
    const adapter = {
      prefix: 'parsed: ',
      parse(this: { prefix: string }, source: unknown) {
        return `${this.prefix}${String(source)}`;
      },
      render: (parsed: unknown) => <span data-testid="rendered">{String(parsed)}</span>,
    };

    renderWith(adapter);

    expect(screen.getByTestId('rendered')).toHaveTextContent('parsed: Some **markdown**');
  });
});
