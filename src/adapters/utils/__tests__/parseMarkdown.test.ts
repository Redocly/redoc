import { describe, it, expect, vi } from 'vitest';

import type { Node } from '@redocly/markdoc';
import type { MarkdownParser } from '../parseMarkdown.js';

import { parseMarkdown } from '../parseMarkdown.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';

const documentNode = { type: 'document', children: [] } as unknown as Node;

describe('parseMarkdown', () => {
  it('delegates string parsing to the provided markdownParser', () => {
    const markdownParser: MarkdownParser = vi.fn(() => documentNode);

    const result = parseMarkdown('# Hello', { markdownParser });

    expect(markdownParser).toHaveBeenCalledTimes(1);
    expect(markdownParser).toHaveBeenCalledWith('# Hello', { markdownParser });
    expect(result).toEqual(documentNode);
  });

  it('throws when given a string but no markdownParser', () => {
    expect(() => parseMarkdown('# Hello')).toThrow('a `markdownParser` is required');
  });

  it('returns plain-text strings as-is without calling the parser', () => {
    const markdownParser: MarkdownParser = vi.fn(() => documentNode);

    const result = parseMarkdown('A plain description.', { markdownParser });

    expect(result).toBe('A plain description.');
    expect(markdownParser).not.toHaveBeenCalled();
  });

  it('does not require a markdownParser for plain-text strings', () => {
    expect(parseMarkdown('A plain description.')).toBe('A plain description.');
  });

  it('passes a pre-parsed AST through unchanged', () => {
    const markdownParser: MarkdownParser = vi.fn(() => documentNode);

    expect(parseMarkdown(documentNode, { markdownParser })).toBe(documentNode);
    expect(markdownParser).not.toHaveBeenCalled();
  });
});

describe('markdocParser', () => {
  it('returns the top-level blocks without source locations or inline wrappers', () => {
    const blocks = markdocParser('# Hello\n\nSome **bold** text');

    expect(blocks).toMatchObject([
      { type: 'heading', children: [{ type: 'text', attributes: { content: 'Hello' } }] },
      { type: 'paragraph', children: [{ type: 'text' }, { type: 'strong' }, { type: 'text' }] },
    ]);
    expect(JSON.stringify(blocks)).not.toMatch(/"location"|"type":"inline"/);
    expect(markdocParser('Some **bold** text')).toMatchObject([{ type: 'paragraph' }]);
  });
});
