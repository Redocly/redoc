import type { ParsedQuery } from './types.js';

import { MIN_QUERY_WORD_LENGTH, containsQueryWord } from '../text-match.js';

// A short word is kept when a longer one anchors the query (`Doc 1`); a query of only
// short words matches nothing.
export function parseQuery(query: string): ParsedQuery {
  const text = query.toLowerCase().trim();
  const all = text.split(/\s+/g).filter(Boolean);
  const words = all.some((word) => word.length >= MIN_QUERY_WORD_LENGTH) ? all : [];
  return { text, words };
}

export function coverage(query: ParsedQuery, lowered: string): number {
  if (!lowered) return 0;
  let matched = 0;
  for (const word of query.words) if (containsQueryWord(lowered, word)) matched++;
  return matched / query.words.length;
}

export function bestCoverage(query: ParsedQuery, values: string[]): number {
  return Math.max(...values.map((value) => coverage(query, value)));
}

export function coversQuery(query: ParsedQuery, lowered: string): boolean {
  return coverage(query, lowered) === 1;
}

export function matchesWords(query: ParsedQuery, lowered: string): boolean {
  return !!lowered && query.words.some((word) => containsQueryWord(lowered, word));
}
