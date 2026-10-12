import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import type { Node } from '@markdoc/markdoc';
import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { createMarkdocAdapter } from '../markdocAdapter.js';
import { markdocParser } from '../markdocParser.js';
import { extractFullText } from '../../../adapters/utils/markdoc.js';
import { processOpenApiDocument } from '../../../adapters/openapi/index.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { nodeTypes } from '../../../types/common.js';

// A description decorated the way customer plugins do it: raw HTML badges above the markdown.
const HTML_DECORATED_DESCRIPTION = `<div style="margin-top: 16px; margin-bottom: 24px; font-family: sans-serif; display: block; clear: both;">
  <span class="lifecycle-badge beta" style="cursor: pointer; background: rgb(255, 198, 28); color: white; font-weight: bold;">Beta</span>
</div>

Get upcoming museum operating hours.
`;

function collectTagNames(ast: Node | Node[] | undefined): string[] {
  const tags: string[] = [];
  const walk = (node: { tag?: string; children?: unknown[] }): void => {
    if (node.tag) tags.push(node.tag);
    for (const child of (node.children as { tag?: string }[]) ?? []) walk(child);
  };
  const nodes = Array.isArray(ast) ? ast : ast ? [ast] : [];
  nodes.forEach((node) => walk(node));
  return tags;
}

describe('markdocParser raw HTML handling', () => {
  it('converts raw HTML into html tag nodes instead of literal text', () => {
    const ast = markdocParser(HTML_DECORATED_DESCRIPTION);
    expect(collectTagNames(ast)).toContain('html');
  });

  it('keeps markup out of the extracted search text', () => {
    const ast = markdocParser(HTML_DECORATED_DESCRIPTION);
    const text = extractFullText(ast ?? '');

    expect(text).toBe('Beta Get upcoming museum operating hours.');
  });

  it('renders the HTML as real elements', () => {
    const adapter = createMarkdocAdapter();
    const { container } = render(
      <MemoryRouter>{adapter.render(adapter.parse(HTML_DECORATED_DESCRIPTION))}</MemoryRouter>,
    );

    const badge = container.querySelector('span.lifecycle-badge');
    expect(badge).toHaveTextContent('Beta');
    expect(container.textContent).not.toContain('<div');
    expect(container.textContent).toContain('Get upcoming museum operating hours.');
  });

  it('keeps colon-containing style values like url() intact', () => {
    const adapter = createMarkdocAdapter();
    const { container } = render(
      <MemoryRouter>
        {adapter.render(
          adapter.parse(
            '<span class="bg-badge" style="background-image: url(https://example.com/badge.png); color: red">x</span>',
          ),
        )}
      </MemoryRouter>,
    );

    const badge = container.querySelector<HTMLElement>('span.bg-badge');
    expect(badge?.style.backgroundImage.replace(/["']/g, '')).toBe(
      'url(https://example.com/badge.png)',
    );
    expect(badge?.style.color).toBe('red');
  });

  it('keeps a tag whose name is no element name as text, so the description renders', () => {
    // Inside an HTML block, the escaped generic `\<T\>` parses as a tag named `t\`.
    const adapter = createMarkdocAdapter();
    const html = renderToStaticMarkup(
      <MemoryRouter>
        {adapter.render(
          adapter.parse('<p align="center">\n  <br>Figure 1 GridItem\\<T\\> mapping<br>\n</p>\n'),
        )}
      </MemoryRouter>,
    );

    expect(html).toContain('<br/>Figure 1 GridItem\\&lt;T\\&gt; mapping<br/>');
  });

  it('leaves regular markdown unaffected', () => {
    const ast = markdocParser(
      'Some **bold** text with a [link](https://example.com).\n\n- one\n- two',
    );
    const adapter = createMarkdocAdapter();
    const { container } = render(<MemoryRouter>{adapter.render(adapter.parse(ast))}</MemoryRouter>);

    expect(container.querySelector('strong')).toHaveTextContent('bold');
    expect(container.querySelector('a[href="https://example.com"]')).not.toBeNull();
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('keeps operation search documents free of markup end to end', async () => {
    const doc = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      paths: {
        '/museum-hours': {
          get: {
            operationId: 'getMuseumHours',
            summary: 'Get museum hours',
            description: HTML_DECORATED_DESCRIPTION,
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    } as unknown as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({ specType: 'openapi', downloadUrls: [], metadata: {} }),
      markdownParser: markdocParser,
    };
    const { items, store } = await processOpenApiDocument({
      type: 'openapi',
      document: doc,
      basePath: '/api',
      options,
    });

    void store;
    const flat: (typeof items)[number][] = [];
    const walk = (list: typeof items): void => {
      for (const item of list) {
        flat.push(item);
        if (item.items?.length) walk(item.items as typeof items);
      }
    };
    walk(items);
    const operation = flat.find((item) => item.label === 'Get museum hours');

    // Mirrors the search indexers' text extraction over the operation's markdoc content nodes.
    const parts: string[] = [];
    const visitContent = (
      nodes: { nodeType: string; content?: unknown; children?: unknown[] }[],
    ): void => {
      for (const node of nodes ?? []) {
        if (node.nodeType === nodeTypes.MARKDOC) {
          parts.push(extractFullText(node.content as Node | Node[]));
        } else if (node.children) {
          visitContent(node.children as typeof nodes);
        }
      }
    };
    visitContent(operation?.content?.children ?? []);

    expect(parts.join(' ').trim()).toBe('Beta Get upcoming museum operating hours.');
  });
});

describe('raw script and style elements', () => {
  const SOURCE = 'Before <script>window.__x=1</script> after';

  it('drops a raw script element from the page and the search text', () => {
    const adapter = createMarkdocAdapter();
    const { container } = render(
      <MemoryRouter>{adapter.render(adapter.parse(SOURCE))}</MemoryRouter>,
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toMatch(/^Before\s+after$/);
    expect(extractFullText(markdocParser(SOURCE) ?? '')).toMatch(/^Before\s+after$/);
  });

  it('keeps style source out of the search text', () => {
    expect(extractFullText(markdocParser('a <style>.x{color:red}</style> b') ?? '')).toMatch(
      /^a\s+b$/,
    );
  });

  it('passes raw script elements to a host HtmlScript component', () => {
    const HtmlScript = ({ children }: { children?: ReactNode }) => <output>{children}</output>;
    const adapter = createMarkdocAdapter({ components: { HtmlScript } });
    const { container } = render(
      <MemoryRouter>{adapter.render(adapter.parse(SOURCE))}</MemoryRouter>,
    );

    expect(container.querySelector('output')).toHaveTextContent('window.__x=1');
  });
});

describe('sanitize', () => {
  it('strips unsafe HTML from descriptions parsed by the adapter', () => {
    const adapter = createMarkdocAdapter(undefined, { sanitize: true });
    const { container } = render(
      <MemoryRouter>
        {adapter.render(adapter.parse('Text <iframe srcdoc="<script>alert(1)</script>"></iframe>'))}
      </MemoryRouter>,
    );

    expect(container.querySelector('iframe')).toBeNull();
    expect(container).toHaveTextContent('Text');
  });
});
