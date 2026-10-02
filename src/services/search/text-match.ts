export const MIN_QUERY_WORD_LENGTH = 2;
export const MIN_INFIX_MATCH_LENGTH = 3;

const WORD_CHAR = /[\p{L}\p{N}_-]/u;

export function isWordChar(char: string | undefined): boolean {
  return char !== undefined && WORD_CHAR.test(char);
}

// A short word is kept when a longer one anchors the query (`Doc 1`); a query of only
// short words matches nothing.
export function matchableQueryWords(query: string): string[] {
  const words = [...new Set(query.toLowerCase().split(/\s+/g).filter(Boolean))];
  return words.some((word) => word.length >= MIN_QUERY_WORD_LENGTH) ? words : [];
}

export function containsQueryWord(lowered: string, word: string): boolean {
  if (word.length >= MIN_INFIX_MATCH_LENGTH) return lowered.includes(word);
  for (let at = lowered.indexOf(word); at !== -1; at = lowered.indexOf(word, at + 1)) {
    if (isWordChar(lowered[at - 1])) continue;
    // A one-character word counts only as a standalone word (`1` in `Doc 1`).
    if (word.length >= MIN_QUERY_WORD_LENGTH || !isWordChar(lowered[at + word.length])) {
      return true;
    }
  }
  return false;
}
