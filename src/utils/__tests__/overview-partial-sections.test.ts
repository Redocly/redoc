import { describe, expect, it } from 'vitest';
import markdoc from '@markdoc/markdoc';

import { markdocParser } from '../../components/markdoc/markdocParser.js';
import { extractMarkdownSections, resolveMarkdocHeadingIds } from '../../adapters/utils/markdoc.js';
import { collectOverviewPartialSectionIds } from '../overview-partial-sections.js';

// Keyed the way hosts hand partials to the renderer: by the resolved `file` attribute.
const PARTIALS = {
  'general-notes.md': markdoc.parse(
    '# General Notes\n\n{% partial file="pagination/seek.md" /%}\n',
  ),
  'pagination/seek.md': markdoc.parse('## Seek pagination & sort\n\n## Custom {% #My-Anchor %}\n'),
  'loop.md': markdoc.parse('## Loop\n\n{% partial file="loop.md" /%}\n'),
  'operation.md': markdoc.parse('## Only in an operation\n'),
};

// An overview description run through the build walk that scopes its partial tags.
function overview(source: string) {
  const ast = markdocParser(source);
  extractMarkdownSections(ast, undefined, '');
  return ast;
}

describe('collectOverviewPartialSectionIds', () => {
  it('collects the ids of headings in overview partials, nested partials included', () => {
    const content = overview('{% partial file="general-notes.md" /%}\n');

    expect(collectOverviewPartialSectionIds(content, PARTIALS)).toEqual(
      new Set(['section/general-notes', 'section/seek-pagination-and-sort', 'my-anchor']),
    );
  });

  it('skips a partial scoped to an operation', () => {
    const content = markdocParser('{% partial file="operation.md" /%}\n');
    resolveMarkdocHeadingIds(content ?? [], 'pets/getpet', 'request');

    expect(collectOverviewPartialSectionIds(content, PARTIALS)).toEqual(new Set());
  });

  it('reads a partial that includes itself once', () => {
    const content = overview('{% partial file="loop.md" /%}\n');

    expect(collectOverviewPartialSectionIds(content, PARTIALS)).toEqual(new Set(['section/loop']));
  });

  it('collects nothing when the host passes no partials', () => {
    const content = overview('{% partial file="general-notes.md" /%}\n');

    expect(collectOverviewPartialSectionIds(content, undefined)).toEqual(new Set());
  });
});
