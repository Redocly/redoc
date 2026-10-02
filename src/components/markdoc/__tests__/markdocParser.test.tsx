import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

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
  nodes.forEach((node) => walk(node as { tag?: string }));
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
    visitContent((operation?.content?.children ?? []) as Parameters<typeof visitContent>[0]);

    expect(parts.join(' ').trim()).toBe('Beta Get upcoming museum operating hours.');
  });
});
