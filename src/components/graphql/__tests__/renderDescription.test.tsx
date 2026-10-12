import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../markdoc/markdocAdapter.js';
import { markdocParser } from '../../markdoc/markdocParser.js';
import { renderDescription } from '../renderDescription.js';

function renderInAdapter(description: unknown) {
  return render(
    <MarkdownAdapterProvider value={createMarkdocAdapter()}>
      <div data-testid="host">{renderDescription(description)}</div>
    </MarkdownAdapterProvider>,
  );
}

afterEach(() => {
  cleanup();
});

describe('renderDescription', () => {
  it('renders markdown in a raw string description', () => {
    const { getByTestId } = renderInAdapter(
      'Filter by **status**, see `limit` and [docs](https://example.com).',
    );
    const host = getByTestId('host');

    expect(host.querySelector('strong')).toHaveTextContent('status');
    expect(host.querySelector('code')).toHaveTextContent('limit');
    expect(host.querySelector('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('keeps a plain-text string as a text node without a paragraph', () => {
    const { getByTestId } = renderInAdapter('The user id.');
    const host = getByTestId('host');

    expect(host.querySelector('p')).toBeNull();
    expect(host.childNodes).toHaveLength(1);
    expect(host.firstChild?.nodeType).toBe(Node.TEXT_NODE);
    expect(host).toHaveTextContent('The user id.');
  });

  it('renders a pre-parsed AST', () => {
    const { getByTestId } = renderInAdapter(markdocParser('Pre-parsed **bold**'));

    expect(getByTestId('host').querySelector('strong')).toHaveTextContent('bold');
  });

  it.each([[''], [undefined], [null]])('returns null for %j', (description) => {
    expect(renderDescription(description)).toBeNull();
  });
});
