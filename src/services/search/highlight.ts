// The portal keeps a twin of this module and text-match.ts under
// packages/portal/src/server/utils/search/; its highlight-parity test fails when they drift.
import {
  MIN_INFIX_MATCH_LENGTH,
  MIN_QUERY_WORD_LENGTH,
  isWordChar,
  matchableQueryWords,
} from './text-match.js';

export const HIGHLIGHTED_TEXT_MAX_LENGTH = 150;

type Span = { start: number; end: number };
type Hit = Span & { word: string };

export function highlightTextForSearch(query: string, text: string): string {
  if (!text) return '';
  const words = queryWords(query);
  if (!words.length) return text;
  const width = HIGHLIGHTED_TEXT_MAX_LENGTH + query.length;
  if (text.length <= width) return markRuns(words, text);

  const anchor = densestCluster(findHits(words, text), width) ?? { start: 0, end: 0 };
  const { start, end } = snippetWindow(text, anchor, width);
  const snippet = markRuns(words, text.slice(start, end));
  return `${start > 0 ? '...' : ''}${snippet}${end < text.length ? '...' : ''}`;
}

export function markMatchedValue(query: string, value: string): string | undefined {
  if (!value) return undefined;
  const marked = highlightTextForSearch(query, value);
  return marked.includes('<mark>') ? marked : undefined;
}

function queryWords(query: string): string[] {
  return matchableQueryWords(query).sort((a, b) => b.length - a.length);
}

/** A word-start hit marks to the end of the word; an infix hit marks the found part alone. */
function findHits(words: string[], text: string): Hit[] {
  const lowered = text.toLowerCase();
  const hits: Hit[] = [];
  for (const word of words) {
    for (let at = lowered.indexOf(word); at !== -1; at = lowered.indexOf(word, at + 1)) {
      const atWordStart = !isWordChar(lowered[at - 1]);
      if (!atWordStart && word.length < MIN_INFIX_MATCH_LENGTH) continue;
      if (word.length < MIN_QUERY_WORD_LENGTH && isWordChar(lowered[at + word.length])) continue;
      let end = at + word.length;
      if (atWordStart) {
        while (isWordChar(lowered[end])) end++;
      }
      hits.push({ start: at, end, word });
    }
  }
  return hits.sort((a, b) => a.start - b.start || a.end - b.end);
}

function densestCluster(hits: Hit[], reach: number): Span | undefined {
  let best: (Span & { count: number }) | undefined;
  for (let i = 0; i < hits.length; i++) {
    const seen = new Set<string>();
    let end = hits[i].end;
    for (let j = i; j < hits.length && hits[j].end - hits[i].start <= reach; j++) {
      if (seen.has(hits[j].word)) continue;
      seen.add(hits[j].word);
      end = hits[j].end;
    }
    const span = end - hits[i].start;
    if (
      !best ||
      seen.size > best.count ||
      (seen.size === best.count && span < best.end - best.start)
    ) {
      best = { start: hits[i].start, end, count: seen.size };
    }
  }
  return best && { start: best.start, end: best.end };
}

function snippetWindow(text: string, anchor: Span, width: number): Span {
  const total = Math.max(width, anchor.end - anchor.start);
  const context = total - (anchor.end - anchor.start);
  const end = Math.min(text.length, Math.max(0, Math.floor(anchor.start - context / 2)) + total);
  const start = Math.max(0, end - total);
  return { start: wordStart(text, start, anchor.start), end: wordEnd(text, end, anchor.end) };
}

function wordStart(text: string, index: number, limit: number): number {
  let start = index;
  if (start > 0 && !isSpace(text[start - 1])) {
    while (start < limit && !isSpace(text[start])) start++;
  }
  while (start < limit && isSpace(text[start])) start++;
  return start;
}

function wordEnd(text: string, index: number, limit: number): number {
  let end = index;
  if (end < text.length && !isSpace(text[end])) {
    while (end > limit && !isSpace(text[end])) end--;
  }
  while (end > limit && isSpace(text[end - 1])) end--;
  return end;
}

function isSpace(char: string | undefined): boolean {
  return char !== undefined && /\s/.test(char);
}

function markRuns(words: string[], text: string): string {
  const hits = findHits(words, text);
  if (!hits.length) return text;

  const runs: Span[] = [];
  for (const hit of hits) {
    const last = runs[runs.length - 1];
    if (last && (hit.start <= last.end || !text.slice(last.end, hit.start).trim())) {
      last.end = Math.max(last.end, hit.end);
    } else {
      runs.push({ start: hit.start, end: hit.end });
    }
  }

  let marked = '';
  let cursor = 0;
  for (const run of runs) {
    marked += `${text.slice(cursor, run.start)}<mark>${text.slice(run.start, run.end)}</mark>`;
    cursor = run.end;
  }
  return marked + text.slice(cursor);
}
