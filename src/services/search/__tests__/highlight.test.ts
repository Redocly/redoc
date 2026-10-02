import { describe, expect, it } from 'vitest';

import { highlightTextForSearch } from '../highlight.js';

describe('highlightTextForSearch', () => {
  it('wraps a single matching word', () => {
    expect(highlightTextForSearch('foo', 'hello foo world')).toBe('hello <mark>foo</mark> world');
  });

  it('marks separate words as separate runs', () => {
    expect(highlightTextForSearch('foo bar', 'foo and bar')).toBe(
      '<mark>foo</mark> and <mark>bar</mark>',
    );
  });

  it('merges adjacent query words into one run', () => {
    expect(
      highlightTextForSearch('order status', 'Order status is set when the order is paid.'),
    ).toBe('<mark>Order status</mark> is set when the <mark>order</mark> is paid.');
  });

  it('matches case-insensitively and never double-wraps duplicates', () => {
    const result = highlightTextForSearch('FOO foo', 'hello Foo world');
    expect(result).toBe('hello <mark>Foo</mark> world');
  });

  it('marks a word directly after punctuation', () => {
    expect(highlightTextForSearch('No sugar', 'Optional comment (e.g., "No sugar").')).toBe(
      'Optional comment (e.g., "<mark>No sugar</mark>").',
    );
  });

  it('marks only the found part of a mid-word match', () => {
    expect(highlightTextForSearch('post', 'Names can contain apostrophes.')).toBe(
      'Names can contain a<mark>post</mark>rophes.',
    );
  });

  it('marks a word-start match to the end of the word', () => {
    expect(highlightTextForSearch('the', 'Skip it if they need it.')).toBe(
      'Skip it if <mark>they</mark> need it.',
    );
  });

  it('ignores a query of only one-letter words', () => {
    expect(highlightTextForSearch('t', 'Check the health of it.')).toBe('Check the health of it.');
  });

  it('keeps a short word significant inside a multi-word query', () => {
    expect(highlightTextForSearch('Doc 1', 'Doc 1 and Doc 2.')).toBe(
      '<mark>Doc 1</mark> and <mark>Doc</mark> 2.',
    );
  });

  it('does not mark a two-letter word inside another word', () => {
    expect(highlightTextForSearch('No sugar', 'Order items cannot be changed ("No sugar").')).toBe(
      'Order items cannot be changed ("<mark>No sugar</mark>").',
    );
  });

  it('returns the text unchanged for an empty or whitespace query', () => {
    expect(highlightTextForSearch('', 'hello world')).toBe('hello world');
    expect(highlightTextForSearch('   ', 'hello world')).toBe('hello world');
    expect(highlightTextForSearch('foo', '')).toBe('');
  });

  it('keeps mark pairs balanced when the window truncates a heavily marked text', () => {
    const text =
      'Problem type in the form of a URI reference. It identifies the specific occurrence of ' +
      'the problem and provides additional details about it in a human-readable form for the ' +
      'consumers of the API reference documentation.';
    const result = highlightTextForSearch('Problem type in the form of a URI reference', text);

    const opens = (result.match(/<mark>/g) ?? []).length;
    const closes = (result.match(/<\/mark>/g) ?? []).length;
    expect(opens).toBe(closes);
    expect(opens).toBeGreaterThan(0);
    expect(result).not.toMatch(/<\/?m[^>]*$/);
  });
});
