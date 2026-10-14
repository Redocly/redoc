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

  it('applies the media type encoding to an application/x-www-form-urlencoded payload', () => {
    const { getByTestId } = render(
      <PayloadDisplay
        payload={{ tags: ['red', 'green'], ids: ['a', 'b'] }}
        mediaType="application/x-www-form-urlencoded"
        encoding={{ tags: { style: 'form', explode: false } }}
      />,
    );

    expect(getByTestId('code-block-source').textContent).toBe('tags=red,green&ids=a&ids=b');
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

  it('serializes an array of flat records as CSV for text/csv', () => {
    const { getByTestId } = render(
      <PayloadDisplay
        payload={[
          { date: '2023-02-02', keyword: 'shoes, red', clicks: 3 },
          { date: '2023-02-03', keyword: 'boots', clicks: 0 },
        ]}
        mediaType="text/csv"
      />,
    );

    expect(getByTestId('code-block').getAttribute('data-lang')).toBe('text');
    expect(getByTestId('code-block-source').textContent).toBe(
      'date,keyword,clicks\n2023-02-02,"shoes, red",3\n2023-02-03,boots,0',
    );
  });

  it('serializes a single flat object as a one-row CSV table', () => {
    const { getByTestId } = render(
      <PayloadDisplay payload={{ id: 1, name: 'Guru' }} mediaType="text/csv; charset=utf-8" />,
    );

    expect(getByTestId('code-block-source').textContent).toBe('id,name\n1,Guru');
  });

  it('shows a long CSV table in full, like the XML and form-urlencoded views', () => {
    const payload = Array.from({ length: 100 }, (_, id) => ({ id, name: `name ${id}` }));
    const { getByTestId } = render(<PayloadDisplay payload={payload} mediaType="text/csv" />);

    const source = getByTestId('code-block-source').textContent ?? '';
    expect(source.length).toBeGreaterThan(MAX_DISPLAYED_STRING_LENGTH);
    expect(source.split('\n')).toHaveLength(101);
    expect(getByTestId('code-block').hasAttribute('data-max-display-length')).toBe(false);
  });

  it('serializes CSV for application/csv and +csv vendor types', () => {
    for (const mediaType of ['application/csv', 'application/vnd.example+csv']) {
      const { getByTestId, unmount } = render(
        <PayloadDisplay payload={[{ id: 1 }]} mediaType={mediaType} />,
      );

      expect(getByTestId('code-block-source').textContent).toBe('id\n1');
      unmount();
    }
  });

  it('falls back to the JSON source for a CSV payload that is not tabular', () => {
    const payload = [{ id: 1, tags: ['a', 'b'] }];
    const { getByTestId } = render(<PayloadDisplay payload={payload} mediaType="text/csv" />);

    expect(getByTestId('code-block-source').textContent).toBe(JSON.stringify(payload, null, 2));
  });

  it('shows a string CSV example as written, as plain text', () => {
    const { getByTestId } = render(
      <PayloadDisplay payload={'id,name\n1,Guru'} mediaType="text/csv" />,
    );

    expect(getByTestId('code-block').getAttribute('data-lang')).toBe('text');
    expect(getByTestId('code-block-source').textContent).toBe('id,name\n1,Guru');
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
    // React warns when it drops the string handler; that refusal is the behaviour under test.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = await renderWithMarkdocAdapter(
      'Has <b>raw html</b> and <img src=x onerror="alert(1)"> injection attempt',
    );
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Invalid event handler property'),
      'onerror',
      'onError',
    );
    consoleError.mockRestore();
    expect(container.querySelector('b')?.textContent).toBe('raw html');
    const img = container.querySelector('img');
    expect(img?.getAttribute('onerror')).toBeNull();
    expect(img?.onerror ?? null).toBeNull();
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

  it('renders a pre-parsed AST (host-shaped) description', async () => {
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
