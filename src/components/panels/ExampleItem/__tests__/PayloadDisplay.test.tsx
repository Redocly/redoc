import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

import type { MarkdownAdapter } from '../../../../contexts/markdownAdapter.js';

import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { ExampleDescription, PayloadDisplay } from '../selectors.js';
import { MAX_DISPLAYED_STRING_LENGTH } from '../../../../constants/rendering.js';

vi.mock('@redocly/theme/components/JsonViewer/JsonViewer', () => ({
  JsonViewer: vi.fn(({ data, maxStringLength }) => (
    <div data-testid="json-viewer" data-max-string-length={maxStringLength}>
      <pre data-testid="json-viewer-data">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )),
}));

vi.mock('@redocly/theme/components/CodeBlock/CodeBlock', () => ({
  CodeBlock: vi.fn(({ source, lang, maxDisplayLength }) => (
    <div data-testid="code-block" data-lang={lang} data-max-display-length={maxDisplayLength}>
      <pre data-testid="code-block-source">{source}</pre>
    </div>
  )),
}));

describe('PayloadDisplay', () => {
  it('parses a serializedValue JSON string into structured data for the JSON viewer', () => {
    const { getByTestId } = render(
      <PayloadDisplay payload='{"name":"Alice","count":5}' mediaType="application/json" />,
    );

    expect(JSON.parse(getByTestId('json-viewer-data').textContent ?? 'null')).toEqual({
      name: 'Alice',
      count: 5,
    });
  });

  it('falls back to the raw string when a JSON payload cannot be parsed', () => {
    const { getByTestId } = render(
      <PayloadDisplay payload="not-valid-json" mediaType="application/json" />,
    );

    expect(getByTestId('json-viewer-data').textContent).toBe(
      JSON.stringify('not-valid-json', null, 2),
    );
  });

  it('renders an object payload as URL-encoded text for application/x-www-form-urlencoded', () => {
    const { getByTestId } = render(
      <PayloadDisplay
        payload={{ name: 'Museum Visitor', count: 5 }}
        mediaType="application/x-www-form-urlencoded"
      />,
    );

    expect(getByTestId('code-block').getAttribute('data-lang')).toBe('text');
    expect(getByTestId('code-block-source').textContent).toBe('name=Museum%20Visitor&count=5');
  });

  it('serializes an object payload as XML for application/xml', () => {
    const { getByTestId } = render(
      <PayloadDisplay payload={{ name: 'Alice' }} mediaType="application/xml" />,
    );

    expect(getByTestId('code-block').getAttribute('data-lang')).toBe('xml');
    expect(getByTestId('code-block-source').textContent).toBe(
      '<root>\n  <name>Alice</name>\n</root>',
    );
  });

  it('renders the empty message when the payload is null', () => {
    const { getByTestId } = render(
      <PayloadDisplay payload={null} emptyMessage="// nothing here" />,
    );

    expect(getByTestId('code-block-source').textContent).toBe('// nothing here');
  });

  it('passes maxStringLength to the JSON viewer so huge strings truncate at render', () => {
    const { getByTestId } = render(
      <PayloadDisplay payload={{ data: 'short' }} mediaType="application/json" />,
    );

    expect(getByTestId('json-viewer').getAttribute('data-max-string-length')).toBe(
      String(MAX_DISPLAYED_STRING_LENGTH),
    );
  });

  it('passes the full primitive payload and maxDisplayLength to the code block (truncation happens inside CodeBlock, copy keeps the full value)', () => {
    const huge = 'A'.repeat(MAX_DISPLAYED_STRING_LENGTH + 500);
    const { getByTestId } = render(<PayloadDisplay payload={huge} mediaType="text/plain" />);

    expect(getByTestId('code-block-source').textContent).toBe(huge);
    expect(getByTestId('code-block').getAttribute('data-max-display-length')).toBe(
      String(MAX_DISPLAYED_STRING_LENGTH),
    );
  });

  it('ExampleDescription renders through the markdown adapter, not as raw HTML', () => {
    const source = 'This is a **fictional** win.';
    const adapter: MarkdownAdapter = {
      parse: vi.fn((s) => s),
      render: vi.fn((parsed) => <span data-testid="markdown">{String(parsed)}</span>),
    };
    const { getByTestId } = render(
      <MarkdownAdapterProvider value={adapter}>
        <ExampleDescription description={source} />
      </MarkdownAdapterProvider>,
    );

    expect(adapter.parse).toHaveBeenCalledWith(source);
    expect(getByTestId('markdown').textContent).toBe(source);
  });
});

describe('ExampleDescription with the real markdoc adapter', () => {
  async function renderWithMarkdocAdapter(description: string | object) {
    const { createMarkdocAdapter } = await import('../../../markdoc/markdocAdapter.js');
    return render(
      <MarkdownAdapterProvider value={createMarkdocAdapter()}>
        <ExampleDescription description={description as never} />
      </MarkdownAdapterProvider>,
    );
  }

  it('renders markdown emphasis as elements', async () => {
    const { container } = await renderWithMarkdocAdapter('This is a **fictional** win.');
    expect(container.querySelector('strong')?.textContent).toBe('fictional');
  });

  it('renders inline HTML (sanitize: false default) without attaching string event handlers', async () => {
    const { container } = await renderWithMarkdocAdapter(
      'Has <b>raw html</b> and <img src=x onerror="alert(1)"> injection attempt',
    );
    expect(container.querySelector('b')?.textContent).toBe('raw html');
    const img = container.querySelector('img');
    expect(img?.getAttribute('onerror')).toBeNull();
    expect((img as HTMLImageElement | null)?.onerror ?? null).toBeNull();
  });

  it('keeps special symbols and template placeholders as text', async () => {
    const special = `Symbols: < > & € 100% #tag @user {{API_URL}} {$request.body#/id}`;
    const { container } = await renderWithMarkdocAdapter(special);
    expect(container.textContent).toContain('< > & € 100%');
    expect(container.textContent).toContain('{{API_URL}}');
  });

  it('renders a long multi-line description without truncation', async () => {
    const long = `word ${'filler '.repeat(120)}end-marker`;
    const { container } = await renderWithMarkdocAdapter(long);
    expect(container.textContent).toContain('end-marker');
  });

  it('renders a pre-parsed AST (portal-shaped) description', async () => {
    const ast = {
      $$mdtype: 'Node',
      type: 'paragraph',
      attributes: {},
      children: [
        {
          $$mdtype: 'Node',
          type: 'inline',
          attributes: {},
          children: [
            {
              $$mdtype: 'Node',
              type: 'text',
              attributes: { content: 'parsed ast text' },
              children: [],
            },
          ],
        },
      ],
    };
    const { container } = await renderWithMarkdocAdapter(ast);
    expect(container.textContent).toContain('parsed ast text');
  });
});
