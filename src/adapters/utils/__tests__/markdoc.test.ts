import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Node } from '@markdoc/markdoc';

import {
  isMarkdocAst,
  extractSummaryText,
  extractSeoDescriptionText,
  extractContentUntilFirstHeading,
  extractDescriptionSegments,
  extractFirstParagraphText,
  extractFullText,
  extractMarkdownSections,
  collectMarkdownPlainText,
  sanitizeMarkdownSource,
  resolveMarkdocHeadingDeepSuffix,
  resolveMarkdocHeadingIds,
} from '../markdoc.js';
import { parseMarkdown } from '../parseMarkdown.js';
import { buildDeepLinkUrl, makeDeepLink } from '../../../utils/deep-link.js';

vi.mock('../parseMarkdown.js', () => ({ parseMarkdown: vi.fn() }));

afterEach(() => vi.mocked(parseMarkdown).mockReset());

const makeTextNode = (text: string): Node =>
  ({ type: 'inline', attributes: { content: text }, children: [] }) as unknown as Node;

const makeParagraphNode = (text: string): Node =>
  ({ type: 'paragraph', attributes: {}, children: [makeTextNode(text)] }) as unknown as Node;

// Markdoc puts `content` on text nodes only — a parsed heading carries just `level`.
const makeHeadingNode = (text: string, level: number): Node =>
  ({
    type: 'heading',
    attributes: { level },
    children: [makeTextNode(text)],
  }) as unknown as Node;

const makeSchemaDefinitionNode = (
  attributes: Record<string, unknown> = {},
  children: Node[] = [],
): Node =>
  ({
    type: 'tag',
    tag: 'schemaDefinition',
    attributes,
    children,
  }) as unknown as Node;

const makeDocNode = (...children: Node[]): Node =>
  ({ type: 'document', attributes: {}, children }) as unknown as Node;

describe('extractSummaryText', () => {
  it('should have ellipsis when text is 50 chars', () => {
    const longText = 'A'.repeat(50);
    vi.mocked(parseMarkdown).mockReturnValue(makeDocNode(makeParagraphNode(longText)));
    expect(extractSummaryText(longText)).toBe(longText + '…');

    vi.mocked(parseMarkdown).mockReturnValue(makeDocNode(makeParagraphNode('Short text')));
    expect(extractSummaryText('short')).toBe('Short text');
  });

  it('extracts the summary from a plain string without an AST walk', () => {
    vi.mocked(parseMarkdown).mockReturnValue('A plain description.');
    expect(extractSummaryText('A plain description.')).toBe('A plain description.');

    const longText = 'B'.repeat(60);
    vi.mocked(parseMarkdown).mockReturnValue(longText);
    expect(extractSummaryText(longText)).toBe('B'.repeat(50) + '…');
  });
});

describe('extractSeoDescriptionText', () => {
  it('returns the full first-paragraph text with no 50-char cap or ellipsis, unlike extractSummaryText', () => {
    const longText = 'A'.repeat(80);
    vi.mocked(parseMarkdown).mockReturnValue(makeDocNode(makeParagraphNode(longText)));
    expect(extractSeoDescriptionText(longText)).toBe(longText);
  });

  it('extracts from an already-parsed AST (Node[]) without needing a markdownParser option', () => {
    const ast = [makeParagraphNode('Returns a single menu item by its ID.')];
    vi.mocked(parseMarkdown).mockReturnValue(ast);
    expect(extractSeoDescriptionText(ast)).toBe('Returns a single menu item by its ID.');
  });

  it('returns undefined when there is no description', () => {
    expect(extractSeoDescriptionText(undefined)).toBeUndefined();
    expect(extractSeoDescriptionText(null)).toBeUndefined();
  });
});

describe('extractFullText / collectMarkdownPlainText with string input', () => {
  it('returns the trimmed string as-is', () => {
    expect(extractFullText('  plain description  ')).toBe('plain description');
    expect(collectMarkdownPlainText('  plain description  ')).toBe('plain description');
  });

  it('strips the markup a raw description carries', () => {
    expect(
      extractFullText('Filters using `field:value` pairs.\n\n**Filterable fields:** `name`'),
    ).toBe('Filters using field:value pairs. Filterable fields: name');
    expect(extractFullText('# Title\n\n- see [the docs](https://example.com)')).toBe(
      'Title see the docs',
    );
    expect(collectMarkdownPlainText('<p>Wrapped <b>bold</b></p>')).toBe('Wrapped bold');
  });

  it('leaves snake_case identifiers and angle-bracket placeholders alone', () => {
    expect(extractFullText('Use `redirect_uris` instead of `grant_types` for `id:<value>`')).toBe(
      'Use redirect_uris instead of grant_types for id:<value>',
    );
  });
});

describe('extractContentUntilFirstHeading', () => {
  it('returns only the nodes before the first heading when given an array', () => {
    const intro = makeParagraphNode('Intro');
    const heading = makeHeadingNode('Heading', 1);
    const body = makeParagraphNode('Body');
    vi.mocked(parseMarkdown).mockReturnValue([intro, heading, body]);

    const result = extractContentUntilFirstHeading('**bold** intro\n\n# Heading\nBody');
    expect(result).toEqual([intro]);
  });

  it('returns a fully plain string as-is without parsing', () => {
    const result = extractContentUntilFirstHeading('A plain description.');

    expect(result).toBe('A plain description.');
    expect(parseMarkdown).not.toHaveBeenCalled();
  });

  it('keeps a plain intro before the first heading as a string without parsing', () => {
    const result = extractContentUntilFirstHeading('plain intro\n\n# Heading\nBody');

    expect(result).toBe('plain intro');
    expect(parseMarkdown).not.toHaveBeenCalled();
  });

  it('falls back to parsing when the intro before the first heading is not plain', () => {
    const intro = makeParagraphNode('bold intro');
    const heading = makeHeadingNode('Heading', 1);
    vi.mocked(parseMarkdown).mockReturnValue([intro, heading]);

    const result = extractContentUntilFirstHeading('**bold** intro\n\n# Heading');

    expect(result).toEqual([intro]);
    expect(parseMarkdown).toHaveBeenCalledTimes(1);
  });

  it('keeps a multi-paragraph plain intro as a string (matches the portal regex behavior)', () => {
    const result = extractContentUntilFirstHeading('first\n\nsecond\n\n# Heading');

    expect(result).toBe('first\n\nsecond');
    expect(parseMarkdown).not.toHaveBeenCalled();
  });

  // A pre-parsed or parser-cached document is shared: section extraction reads it next.
  it('slices a document node without mutating it', () => {
    const intro = makeParagraphNode('Intro');
    const heading = makeHeadingNode('Heading', 2);
    const body = makeParagraphNode('Body');
    const doc = makeDocNode(intro, heading, body);
    vi.mocked(parseMarkdown).mockReturnValue(doc);

    const result = extractContentUntilFirstHeading(doc);

    expect(result).toEqual([intro]);
    expect(doc.children).toEqual([intro, heading, body]);
  });
});

describe('extractDescriptionSegments', () => {
  it('preserves the original order of inline nodes and schemaDefinition tags', () => {
    const intro = makeParagraphNode('Intro');
    const schema = makeSchemaDefinitionNode({ id: 'Pet' });
    const outro = makeParagraphNode('Outro');
    const list = makeParagraphNode('- item 1');
    vi.mocked(parseMarkdown).mockReturnValue([intro, schema, outro, list]);

    expect(extractDescriptionSegments('...')).toEqual([
      { kind: 'markdoc', node: { nodeType: 'markdoc', content: [intro] } },
      { kind: 'schemaDefinition', node: { nodeType: 'markdoc', content: [schema] } },
      { kind: 'markdoc', node: { nodeType: 'markdoc', content: [outro, list] } },
    ]);
  });

  it('returns a single markdoc segment when there is no schemaDefinition tag', () => {
    const intro = makeParagraphNode('Intro');
    const heading = makeHeadingNode('Heading', 2);
    vi.mocked(parseMarkdown).mockReturnValue([intro, heading]);

    expect(extractDescriptionSegments('...')).toEqual([
      { kind: 'markdoc', node: { nodeType: 'markdoc', content: [intro, heading] } },
    ]);
  });

  it('with sliceAtFirstHeading: drops content from the first heading onward', () => {
    const intro = makeParagraphNode('Intro');
    const schemaBefore = makeSchemaDefinitionNode({ id: 'Pet' });
    const heading = makeHeadingNode('Sub-section', 2);
    const schemaAfter = makeSchemaDefinitionNode({ id: 'Error' });
    const body = makeParagraphNode('Body');
    vi.mocked(parseMarkdown).mockReturnValue([intro, schemaBefore, heading, schemaAfter, body]);

    expect(
      extractDescriptionSegments('{% schemaDefinition /%} intro\n\n## Sub-section', undefined, {
        sliceAtFirstHeading: true,
      }),
    ).toEqual([
      { kind: 'markdoc', node: { nodeType: 'markdoc', content: [intro] } },
      { kind: 'schemaDefinition', node: { nodeType: 'markdoc', content: [schemaBefore] } },
    ]);
  });

  it('returns a plain string as a single markdoc segment with string content', () => {
    vi.mocked(parseMarkdown).mockReturnValue('A plain description.');

    expect(extractDescriptionSegments('A plain description.')).toEqual([
      { kind: 'markdoc', node: { nodeType: 'markdoc', content: 'A plain description.' } },
    ]);
  });

  it('with sliceAtFirstHeading: keeps a plain intro as a string segment without parsing', () => {
    const result = extractDescriptionSegments('plain intro\n\n# Section One\ntext', undefined, {
      sliceAtFirstHeading: true,
    });

    expect(result).toEqual([
      { kind: 'markdoc', node: { nodeType: 'markdoc', content: 'plain intro' } },
    ]);
    expect(parseMarkdown).not.toHaveBeenCalled();
  });

  it('with sliceAtFirstHeading: parses when the intro before the heading is not plain', () => {
    const intro = makeParagraphNode('Intro');
    const heading = makeHeadingNode('Section', 1);
    vi.mocked(parseMarkdown).mockReturnValue([intro, heading]);

    const result = extractDescriptionSegments('*emphasized* intro\n\n# Section', undefined, {
      sliceAtFirstHeading: true,
    });

    expect(result).toEqual([{ kind: 'markdoc', node: { nodeType: 'markdoc', content: [intro] } }]);
    expect(parseMarkdown).toHaveBeenCalledTimes(1);
  });
});

describe('extractFirstParagraphText', () => {
  it('extracts text from the first paragraph, ignoring subsequent nodes', () => {
    const nodes = [makeParagraphNode('Hello world'), makeHeadingNode('Heading', 1)];
    expect(extractFirstParagraphText(nodes)).toBe('Hello world');
  });

  it('respects maxLength and truncates accordingly', () => {
    const nodes = [makeParagraphNode('Hello world this is a long text')];
    expect(extractFirstParagraphText(nodes, 5)).toBe('Hello');
  });
});

describe('extractMarkdownSections', () => {
  it('extracts top-level headings as sections', () => {
    vi.mocked(parseMarkdown).mockReturnValue([
      makeHeadingNode('Section One', 1),
      makeHeadingNode('Section Two', 1),
    ]);
    const result = extractMarkdownSections('...');
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Section One');
    expect(result[1].name).toBe('Section Two');
  });

  it('nests sub-headings under their parent heading', () => {
    vi.mocked(parseMarkdown).mockReturnValue([
      makeHeadingNode('Main', 1),
      makeHeadingNode('Sub', 2),
    ]);
    const result = extractMarkdownSections('...');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Main');
    expect(result[0].items[0].name).toBe('Sub');
  });

  it('uses operationId as prefix in section ids', () => {
    vi.mocked(parseMarkdown).mockReturnValue([makeHeadingNode('Section', 1)]);
    const result = extractMarkdownSections('...', undefined, 'parent-id');
    expect(result[0].id).toContain('parent-id');
  });

  it('prefixes nested heading id with the parent heading id', () => {
    vi.mocked(parseMarkdown).mockReturnValue([
      makeHeadingNode('OpenAPI Specification', 1),
      makeHeadingNode('Subheader 1', 2),
    ]);

    const result = extractMarkdownSections('...');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('section/openapi-specification');
    expect(result[0].items[0].id).toBe('section/openapi-specification/subheader-1');
  });

  it('prefixes deeper nested headings (level 3 and 4) with the top-level parent id', () => {
    vi.mocked(parseMarkdown).mockReturnValue([
      makeHeadingNode('OpenAPI Specification', 1),
      makeHeadingNode('Subheader 1', 2),
      makeHeadingNode('Subheader 2', 2),
      makeHeadingNode('Subheader 3', 3),
      makeHeadingNode('Subheader 4', 4),
    ]);

    const result = extractMarkdownSections('...');

    expect(result).toHaveLength(1);
    expect(result[0].items.map((item) => item.id)).toEqual([
      'section/openapi-specification/subheader-1',
      'section/openapi-specification/subheader-2',
      'section/openapi-specification/subheader-3',
      'section/openapi-specification/subheader-4',
    ]);
  });

  it('updates the AST node id of nested headings to the full hierarchical id', () => {
    const top = makeHeadingNode('OpenAPI Specification', 1);
    const nested = makeHeadingNode('Subheader 1', 2);
    vi.mocked(parseMarkdown).mockReturnValue([top, nested]);

    extractMarkdownSections('...');

    expect(top.attributes?.id).toBe('section/openapi-specification');
    expect(nested.attributes?.id).toBe('section/openapi-specification/subheader-1');
  });

  it('combines operationId, top-level section, and nested heading slug into the nested id', () => {
    vi.mocked(parseMarkdown).mockReturnValue([
      makeHeadingNode('OpenAPI Specification', 1),
      makeHeadingNode('Subheader 1', 2),
    ]);

    const result = extractMarkdownSections('...', undefined, 'overview');

    expect(result[0].id).toBe('overview/section/openapi-specification');
    expect(result[0].items[0].id).toBe('overview/section/openapi-specification/subheader-1');
  });

  it('omits the section/ prefix in tag context but still nests by parent id', () => {
    vi.mocked(parseMarkdown).mockReturnValue([
      makeHeadingNode('Custom section 1', 1),
      makeHeadingNode('Subheader', 2),
    ]);

    const result = extractMarkdownSections('...', undefined, 'customer', true);

    expect(result[0].id).toBe('customer/custom-section-1');
    expect(result[0].items[0].id).toBe('customer/custom-section-1/subheader');
  });

  it('falls back to the operationId base when a sub-heading appears before any top-level heading', () => {
    vi.mocked(parseMarkdown).mockReturnValue([makeHeadingNode('Header2', 2)]);

    const result = extractMarkdownSections('...', undefined, 'notifications');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('notifications/section/header2');
  });

  it('returns no sections for a plain string (it cannot contain headings)', () => {
    vi.mocked(parseMarkdown).mockReturnValue('A plain description.');

    expect(extractMarkdownSections('A plain description.')).toEqual([]);
  });
});

describe('resolveMarkdocHeadingDeepSuffix', () => {
  it('strips section/ for operation descriptions', () => {
    expect(resolveMarkdocHeadingDeepSuffix('section/Main-data', 'issueinvoice', undefined)).toBe(
      'main-data',
    );
  });

  it('uses empty suffix when heading path equals page operationId ', () => {
    const pageId = 'playground-markdoc/3.-request-schema-+-matching';
    expect(
      resolveMarkdocHeadingDeepSuffix(
        'Playground-markdoc/3.-Request-schema-+-matching',
        pageId,
        undefined,
      ),
    ).toBe('');
  });

  it('deduplicates when page route id differs only by case from resolved heading path', () => {
    expect(resolveMarkdocHeadingDeepSuffix('myop/section', 'MYOP/section', undefined)).toBe('');
  });

  it('prepends deepLinkSuffix when set', () => {
    expect(resolveMarkdocHeadingDeepSuffix('section/body', 'getpet', 'request')).toBe(
      'request/body',
    );
  });

  it('keeps non-section ids as suffix when they differ from operationId', () => {
    expect(resolveMarkdocHeadingDeepSuffix('nested/subheading', 'opid', undefined)).toBe(
      'nested/subheading',
    );
  });
});

describe('buildDeepLinkUrl with resolved suffix', () => {
  it('produces single hash tail for tag subsection page when suffix is empty', () => {
    const op = 'playground-markdoc/3.-request-schema-+-matching';
    const url = buildDeepLinkUrl(
      '/docs',
      op,
      resolveMarkdocHeadingDeepSuffix(`${op}`, op, undefined),
    );
    expect(url).toBe(`/docs${makeDeepLink(op, '')}`);
  });

  it('produces op/suffix hash for operation + section heading', () => {
    const op = 'issueinvoice';
    const suffix = resolveMarkdocHeadingDeepSuffix('section/Main-data', op, undefined);
    const url = buildDeepLinkUrl('/docs', op, suffix);
    expect(url).toBe(`/docs${makeDeepLink(op, 'main-data')}`);
  });
});

describe('resolveMarkdocHeadingIds', () => {
  it('sets id and deepLinkHash from resolved deep suffix', () => {
    const heading = {
      type: 'heading',
      attributes: { level: 2, id: 'section/my-heading' },
      children: [],
    } as unknown as Node;

    resolveMarkdocHeadingIds([heading], 'get-pet', 'request');

    expect(heading.attributes.id).toBe('get-pet/request/my-heading');
    expect(heading.attributes.deepLinkHash).toBe('/get-pet#get-pet/request/my-heading');
  });

  it('generates section slug when heading has no id', () => {
    const heading = makeHeadingNode('My Heading', 2);

    resolveMarkdocHeadingIds([heading], 'get-pet');

    expect(heading.attributes.id).toBe('get-pet/my-heading');
    expect(heading.attributes.deepLinkHash).toBe('/get-pet#get-pet/my-heading');
  });

  it('walks nested children', () => {
    const heading = makeHeadingNode('Details', 3);
    const doc = makeDocNode(heading);

    resolveMarkdocHeadingIds(doc, 'get-pet', 'request');

    expect(heading.attributes.id).toBe('get-pet/request/details');
    expect(heading.attributes.deepLinkHash).toBe('/get-pet#get-pet/request/details');
  });

  it('skips non-heading nodes', () => {
    const paragraph = makeParagraphNode('Just text');

    resolveMarkdocHeadingIds([paragraph], 'get-pet', 'request');

    expect(paragraph.attributes?.deepLinkHash).toBeUndefined();
  });

  it('is a no-op for a plain string description', () => {
    expect(() => resolveMarkdocHeadingIds('A plain description.', 'get-pet')).not.toThrow();
  });
});

describe('re-stamping an already-stamped AST', () => {
  it('resolves to the same ids on a repeated run over the same nodes', () => {
    const tagHeading = makeHeadingNode('Guides', 2);
    vi.mocked(parseMarkdown).mockReturnValue([tagHeading]);

    extractMarkdownSections('...', undefined, 'users', true);
    const second = extractMarkdownSections('...', undefined, 'users', true);

    expect(second[0].id).toBe('users/guides');
    expect(tagHeading.attributes.id).toBe('users/guides');

    const opHeading = makeHeadingNode('Details', 3);

    resolveMarkdocHeadingIds([opHeading], 'get-pet', 'request');
    resolveMarkdocHeadingIds([opHeading], 'get-pet', 'request');

    expect(opHeading.attributes.id).toBe('get-pet/request/details');
    expect(opHeading.attributes.deepLinkHash).toBe('/get-pet#get-pet/request/details');
  });

  it('does not repeat the section suffix when the heading slug is the operation id', () => {
    const heading = makeHeadingNode('Details', 2);

    resolveMarkdocHeadingIds([heading], 'details', 'request');
    resolveMarkdocHeadingIds([heading], 'details', 'request');

    expect(heading.attributes.id).toBe('details/request');
    expect(heading.attributes.deepLinkHash).toBe('/details#details/request');
  });
});

describe('sanitizeMarkdownSource', () => {
  it('sanitizes markup when sanitize is true and no hook', () => {
    const out = sanitizeMarkdownSource('<img src=x onerror=alert(1)>', {
      sanitize: true,
    });
    expect(out).not.toContain('onerror');
  });

  it('strips javascript: href from anchor when sanitize is true', () => {
    const raw = "123<a href='\u2028javascript:alert(1)'>I am a dolphin too!</a>";
    const out = sanitizeMarkdownSource(raw, { sanitize: true });
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toContain('I am a dolphin too!');
  });
});

describe('isMarkdocAst', () => {
  const node = { $$mdtype: 'Node', type: 'text', attributes: { content: 'hi' }, children: [] };

  it('accepts a single node and a list of nodes', () => {
    expect(isMarkdocAst(node)).toBe(true);
    expect(isMarkdocAst([node, node])).toBe(true);
  });

  it('rejects a schema object stored under a property named description', () => {
    expect(isMarkdocAst({ type: 'string', description: 'What the item is.' })).toBe(false);
  });

  it('rejects strings, empty arrays and nullish values', () => {
    expect(isMarkdocAst('plain text')).toBe(false);
    expect(isMarkdocAst([])).toBe(false);
    expect(isMarkdocAst(undefined)).toBe(false);
    expect(isMarkdocAst(null)).toBe(false);
  });

  it('rejects an array that only partly looks like an AST', () => {
    expect(isMarkdocAst([node, { type: 'string' }])).toBe(false);
  });
});

describe('partial heading scope', () => {
  const makePartialNode = (variables?: Record<string, unknown>): Node =>
    ({
      type: 'tag',
      tag: 'partial',
      attributes: { file: '/_partials/p.md', ...(variables ? { variables } : {}) },
      children: [],
    }) as unknown as Node;

  it('resolveMarkdocHeadingIds scopes a partial tag so its headings resolve at render', () => {
    const partial = makePartialNode({ tone: 'formal' });

    resolveMarkdocHeadingIds([makeParagraphNode('intro'), partial], 'offers/listoffers', 'request');

    expect(partial.attributes.variables).toEqual({
      tone: 'formal',
      $$apiDocsHeadingScope: { operationId: 'offers/listoffers', deepLinkSuffix: 'request' },
    });
  });

  it('resolveMarkdocHeadingIds scopes a partial nested below the top level', () => {
    const partial = makePartialNode();
    const list = {
      type: 'list',
      attributes: {},
      children: [{ type: 'item', attributes: {}, children: [partial] }],
    } as unknown as Node;

    resolveMarkdocHeadingIds([list], 'pets/getpet', undefined);

    expect(partial.attributes.variables?.$$apiDocsHeadingScope).toEqual({
      operationId: 'pets/getpet',
      deepLinkSuffix: undefined,
    });
  });

  it('extractMarkdownSections scopes a partial in an overview description to the page itself', () => {
    const partial = makePartialNode();
    vi.mocked(parseMarkdown).mockReturnValue([makeParagraphNode('intro'), partial]);

    extractMarkdownSections('ignored', undefined, '');

    expect(partial.attributes.variables?.$$apiDocsHeadingScope).toEqual({
      operationId: '',
      deepLinkSuffix: 'section',
    });
  });

  it('extractMarkdownSections scopes a partial nested inside a list item to the enclosing section', () => {
    const partial = makePartialNode();
    const heading = {
      type: 'heading',
      attributes: { level: 1 },
      children: [makeTextNode('Intro')],
    } as unknown as Node;
    const list = {
      type: 'list',
      attributes: {},
      children: [{ type: 'item', attributes: {}, children: [partial] }],
    } as unknown as Node;
    vi.mocked(parseMarkdown).mockReturnValue([heading, list]);

    extractMarkdownSections('ignored', undefined, '');

    expect(partial.attributes.variables?.$$apiDocsHeadingScope).toEqual({
      operationId: 'section/intro',
      deepLinkSuffix: undefined,
    });
  });

  it('extractMarkdownSections scopes a partial under a top-level heading to that section', () => {
    const partial = makePartialNode();
    const heading = {
      type: 'heading',
      attributes: { level: 1 },
      children: [makeTextNode('Intro')],
    } as unknown as Node;
    vi.mocked(parseMarkdown).mockReturnValue([heading, partial]);

    extractMarkdownSections('ignored', undefined, 'offers', true);

    expect(partial.attributes.variables?.$$apiDocsHeadingScope).toEqual({
      operationId: 'offers/intro',
      deepLinkSuffix: undefined,
    });
  });
});
