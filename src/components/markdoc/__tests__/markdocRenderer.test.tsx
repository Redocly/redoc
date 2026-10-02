import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { createStore, Provider as JotaiProvider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import { createMarkdocAdapter } from '../markdocAdapter.js';
import { markdocParser } from '../markdocParser.js';
import markdoc from '@markdoc/markdoc';
import {
  extractMarkdownSections,
  resolveMarkdocHeadingIds,
} from '../../../adapters/utils/markdoc.js';
import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';

// The Markdown component runs `adapter.render(adapter.parse(source))`; these tests mirror that
// flow to cover lazy parsing of raw description strings through the adapter seam.
const renderThroughAdapter = (source: unknown) => {
  const adapter = createMarkdocAdapter();
  return render(<MemoryRouter>{adapter.render(adapter.parse(source))}</MemoryRouter>);
};

describe('markdoc adapter lazy parsing of string sources', () => {
  it('parses a raw markdown string (schema/parameter descriptions) instead of rendering it literally', () => {
    const source =
      'Accounting fields accepted on create/update requests.\n\n' +
      '**Conditional requirement rules**\n' +
      '- If **Allow blank Accounting Codes** = **Yes** → Accounting fields are **optional**.\n' +
      '- Only `recognized_revenue_account` is required, see [the guide](https://example.com).\n';

    const { container } = renderThroughAdapter(source);

    expect(container.querySelectorAll('strong').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelector('code')).toHaveTextContent('recognized_revenue_account');
    expect(container.querySelector('a[href="https://example.com"]')).not.toBeNull();
    expect(container.textContent).not.toContain('**');
  });

  it('renders a plain string with the same DOM as its build-time-parsed AST', () => {
    const source = 'A plain description.';

    const { container: fromString } = renderThroughAdapter(source);
    const { container: fromAst } = renderThroughAdapter(markdocParser(source));

    expect(fromString.innerHTML).toBe(fromAst.innerHTML);
    expect(fromString.querySelector('p')).toHaveTextContent('A plain description.');
  });

  it('restores paragraphs of multi-line plain strings kept by the plain-text gate', () => {
    const { container } = renderThroughAdapter('First paragraph.\n\nSecond paragraph.');

    expect(container.querySelectorAll('p')).toHaveLength(2);
  });

  it('passes an already-parsed AST through parse unchanged (portal flow)', () => {
    const adapter = createMarkdocAdapter();
    const ast = markdocParser('Some **bold** text.');

    expect(adapter.parse(ast)).toBe(ast);
  });

  it('slugs an id for a heading whose text is wrapped in inline markup', () => {
    const { container } = renderThroughAdapter('#### **Bold heading**\n');

    const heading = container.querySelector('h4');
    expect(heading).toHaveAttribute('id', 'section/bold-heading');
    expect(heading?.querySelector('a')).not.toBeNull();
    expect(heading?.querySelector('strong')).toHaveTextContent('Bold heading');
  });

  it('slugs an id from all inline children, not just the first', () => {
    const { container } = renderThroughAdapter('## Mixed `code` and **bold**\n');

    expect(container.querySelector('h2')).toHaveAttribute('id', 'section/mixed-code-and-bold');
  });

  it.each([
    ['no text at all', '##\n'],
    ['only an image', '## ![logo](https://example.com/logo.png)\n'],
  ])('renders a heading with %s without an anchor instead of failing', (_case, source) => {
    const { container } = renderThroughAdapter(source);

    const heading = container.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading).not.toHaveAttribute('id');
    expect(heading?.querySelector('a')).toBeNull();
  });

  it('renders markdown tables with the theme markdown class and a scroll wrapper', () => {
    const source =
      '| Col A | Col B |\n' + '| ----- |:----- |\n' + '| a1    | b1    |\n' + '| a2    | b2    |\n';

    const { container } = renderThroughAdapter(source);

    const wrapper = container.querySelector('.md-table-wrapper');
    expect(wrapper).not.toBeNull();
    const table = wrapper?.querySelector('table');
    expect(table?.classList.contains('md')).toBe(true);
    expect(table?.querySelectorAll('th')).toHaveLength(2);
    expect(table?.querySelector('th')).toHaveAttribute('data-label', 'Col A');
    expect(table?.querySelectorAll('td')).toHaveLength(4);
  });
});

describe('headings inside partials', () => {
  // Hosts hand partials to the renderer as revived document nodes (portal: `parsePartials`).
  const revive = (source: string) => markdoc.Ast.fromJSON(JSON.stringify(markdoc.parse(source)));

  it('scopes a partial heading to the enclosing operation instead of a bare section route', () => {
    const adapter = createMarkdocAdapter({
      partials: { '/_partials/p.md': revive('## Locale parameter\n\nBody.') },
    });
    const ast = markdocParser('Intro.\n\n{% partial file="/_partials/p.md" /%}\n');
    resolveMarkdocHeadingIds(ast, 'offers/listoffers', 'request');

    const { container } = render(<MemoryRouter>{adapter.render(adapter.parse(ast))}</MemoryRouter>);

    const heading = container.querySelector('h2');
    expect(heading).toHaveAttribute('id', 'offers/listoffers/request/locale-parameter');
    expect(heading?.querySelector('a')).toHaveAttribute(
      'href',
      '/offers/listoffers#offers/listoffers/request/locale-parameter',
    );
  });

  // An overview description that is only a partial, rendered under the `/pet` base path.
  const renderOverviewPartial = (partialSource: string) => {
    const adapter = createMarkdocAdapter({
      partials: { '/_partials/p.md': revive(partialSource) },
    });
    const ast = markdocParser('{% partial file="/_partials/p.md" /%}\n');
    extractMarkdownSections(ast, undefined, '');
    const jotaiStore = createStore();
    jotaiStore.set(globalStoreAtom, {
      items: [],
      store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
      options: normalizeOptions({
        specType: 'openapi',
        markdownParser: markdocParser,
        metadata: {},
        basePath: '/pet',
      }),
      replayDefinition: null,
    });

    return render(
      <MemoryRouter>
        <JotaiProvider store={jotaiStore}>{adapter.render(adapter.parse(ast))}</JotaiProvider>
      </MemoryRouter>,
    );
  };

  it('anchors a partial heading in the overview to the overview page', () => {
    const { container } = renderOverviewPartial('## Learning Resources');

    const heading = container.querySelector('h2');
    expect(heading).toHaveAttribute('id', 'section/learning-resources');
    expect(heading?.querySelector('a')).toHaveAttribute('href', '/pet#section/learning-resources');
  });

  it('gives overview partial headings the ids legacy `#section/<Heading>` links target', () => {
    const { container } = renderOverviewPartial(
      '# General Notes\n\n## Seek pagination & sort\n\n## Legacy authentication (deprecated)\n\n' +
        '## Authentication with OAuth 2.0\n\n#### Error Codes\n',
    );

    const ids = [...container.querySelectorAll('h2, h4')].map((heading) => heading.id);
    expect(ids).toEqual(
      [
        'section/General-Notes',
        'section/Seek-pagination-and-sort',
        'section/Legacy-authentication-(deprecated)',
        'section/Authentication-with-OAuth-2.0',
        'section/Error-Codes',
      ].map((id) => id.toLowerCase()),
    );
  });

  it('keeps the bare section id for a partial heading rendered without build-time scope', () => {
    const adapter = createMarkdocAdapter({
      partials: { '/_partials/p.md': revive('## Locale parameter') },
    });
    const ast = markdocParser('{% partial file="/_partials/p.md" /%}\n');

    const { container } = render(<MemoryRouter>{adapter.render(adapter.parse(ast))}</MemoryRouter>);

    expect(container.querySelector('h2')).toHaveAttribute('id', 'section/locale-parameter');
  });
});
