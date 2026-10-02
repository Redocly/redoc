import { describe, it, expect } from 'vitest';

import { isPlainText } from '../isPlainText.js';

describe('isPlainText', () => {
  describe('plain strings (kept as-is, not parsed)', () => {
    it.each([
      ['simple sentence', 'A short description of the resource.'],
      ['whitelist punctuation', "It's fine: read, write; ask (or not)! Really? See a/b."],
      ['hyphenated words', 'A re-usable, built-in helper'],
      ['single soft line break', 'first line\nsecond line'],
      ['multi-paragraph text', 'first paragraph\n\nsecond paragraph'],
      ['list-like dash lines', 'intro\n- item one\n- item two'],
      ['digits and slashes', 'Supports 3 formats: a/b, c/d and e/f'],
    ])('accepts %s', (_name, value) => {
      expect(isPlainText(value)).toBe(true);
    });
  });

  describe('markdown / markdoc / html syntax (parsed)', () => {
    it.each([
      ['atx heading', '# Heading'],
      ['emphasis', 'some *emphasis* here'],
      ['underscore emphasis', 'some _emphasis_ here'],
      ['inline code', 'use `code` here'],
      ['html tag', 'text with <b>bold</b>'],
      ['html entity', 'a &amp; b'],
      ['link', '[link](https://example.com)'],
      ['markdoc tag', 'before {% tag %} after'],
      // Non-ASCII text is conservatively parsed (matches the portal's simpleNonMdRegex).
      ['cyrillic', 'Опис ресурсу для документації'],
      ['cjk', '説明テキストです'],
      ['accented latin', 'Détails de la requête'],
    ])('rejects %s', (_name, value) => {
      expect(isPlainText(value)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('rejects the empty string (nothing to keep plain)', () => {
      expect(isPlainText('')).toBe(false);
    });

    it('accepts a dash-prefixed word at line start (no space after dash, so not a list)', () => {
      expect(isPlainText('-dash prefixed but not a list')).toBe(true);
      expect(isPlainText('re-usable at start')).toBe(true);
    });
  });
});
