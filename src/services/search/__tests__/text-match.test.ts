import { describe, expect, it } from 'vitest';

import { containsQueryWord, matchableQueryWords } from '../text-match.js';

describe('matchableQueryWords', () => {
  it('keeps a short word when a longer word anchors the query', () => {
    expect(matchableQueryWords('Doc 1')).toEqual(['doc', '1']);
  });

  it('returns no words for a query of only one-character words', () => {
    expect(matchableQueryWords('a b')).toEqual([]);
  });

  it('lowercases and removes duplicate words', () => {
    expect(matchableQueryWords('  Pet pet  STORE ')).toEqual(['pet', 'store']);
  });
});

describe('containsQueryWord', () => {
  it.each([
    { word: 'pet', text: 'carpet', matches: true },
    { word: 'ab', text: 'xab', matches: false },
    { word: 'ab', text: 'x ab', matches: true },
    { word: 'ab', text: 'x abc', matches: true },
    { word: '1', text: 'doc 1', matches: true },
    { word: '1', text: 'doc 12', matches: false },
    { word: '1', text: 'doc1', matches: false },
  ])('finds "$word" in "$text": $matches', ({ word, text, matches }) => {
    expect(containsQueryWord(text, word)).toBe(matches);
  });
});
