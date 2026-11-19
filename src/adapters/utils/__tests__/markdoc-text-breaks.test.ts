import { describe, it, expect } from 'vitest';

import { extractSummaryText, extractFullText } from '../markdoc.js';
import { parseMarkdown } from '../parseMarkdown.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';

const options = { markdownParser: markdocParser };
const parse = (source: string) => parseMarkdown(source, options) ?? '';

describe('plain text keeps word boundaries at line breaks', () => {
  it('summary and meta description keep the space at a line break', () => {
    const wrapped = 'Days since\nthe start.\n\nSecond paragraph.';
    expect(extractSummaryText(wrapped, options)).toBe('Days since the start.');
    expect(extractSummaryText('a\nb', options)).toBe('a b');
  });

  it('full text separates wrapped lines, list items and blocks', () => {
    const source = 'Runs at midnight\nUTC.\n\n- Daily\n- Weekly\n\nEnd.';
    expect(extractFullText(parse(source))).toBe('Runs at midnight UTC. Daily Weekly End.');
  });

  it('an HTML line break or block element separates words', () => {
    const source = 'Block a single contact.<br>**Note:** archived.<br/>More<p>details</p>here.';
    const expected = 'Block a single contact. Note: archived. More details here.';
    expect(extractFullText(parse(source))).toBe(expected);
    expect(extractFullText(source)).toBe(expected);
  });

  it('inline HTML and inline tags do not add spaces', () => {
    expect(extractFullText(parse('foo<b>bar</b>baz'))).toBe('foobarbaz');
    expect(extractFullText(parse('a{% badge %}x{% /badge %}b'))).toBe('axb');
  });
});
