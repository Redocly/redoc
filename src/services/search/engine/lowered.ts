import type { SearchDocument } from '../types.js';
import type { ParsedQuery } from './types.js';

import { MIN_INFIX_MATCH_LENGTH, MIN_QUERY_WORD_LENGTH, isWordChar } from '../text-match.js';
import { lowerText } from './text.js';

/**
 * Lowercased copy of a document for substring matching. `parameters` holds every parameter's
 * fields (name, description, path, example, enum, place) joined by newlines; `bounds` holds
 * `PARAMETER_STRIDE` offsets per parameter — the start of each field, then the end of the last.
 */
export type LowerDocument = {
  title: string;
  text: string;
  httpMethod: string;
  httpPath: string;
  path: string;
  parameters: string;
  bounds: Uint32Array;
};

const PARAMETER_FIELDS = 6;
const PARAMETER_STRIDE = PARAMETER_FIELDS + 1;

export enum ParameterField {
  Name,
  Description,
  Path,
  Example,
  Enum,
  Place,
}

/** Matching is substring-based, so every value is lowered once here rather than per query. */
export function lowerDocument(document: SearchDocument): LowerDocument {
  const parameters = document.parameters ?? [];
  const segments: string[] = [];
  const bounds = new Uint32Array(parameters.length * PARAMETER_STRIDE);
  let at = 0;
  parameters.forEach((parameter, index) => {
    const fields = [
      lowerText(parameter.name),
      lowerText(parameter.description),
      lowerText(parameter.path),
      lowerText(parameter.example),
      lowerText(parameter.enum),
      lowerText(parameter.place),
    ];
    fields.forEach((field, kind) => {
      bounds[index * PARAMETER_STRIDE + kind] = at;
      at += field.length + 1;
    });
    bounds[index * PARAMETER_STRIDE + PARAMETER_FIELDS] = at - 1;
    segments.push(fields.join('\n'));
  });
  return {
    title: lowerText(document.title),
    text: lowerText(document.text),
    httpMethod: lowerText(document.httpMethod),
    httpPath: lowerText(document.httpPath),
    path: lowerText(document.path),
    parameters: segments.join('\n'),
    bounds,
  };
}

/** One lowered field of parameter `index`, as a slice of the document blob. */
export function field(page: LowerDocument, index: number, kind: ParameterField): string {
  const start = page.bounds[index * PARAMETER_STRIDE + kind];
  const end =
    page.bounds[index * PARAMETER_STRIDE + kind + 1] - (kind < ParameterField.Place ? 1 : 0);
  return page.parameters.slice(start, end);
}

/**
 * Parameters whose text holds at least one query word, in definition order. Found by
 * scanning the joined blob once per word, so parameters that cannot score are never
 * visited — on large operations that is most of them.
 */
export function parametersMentioning(
  page: LowerDocument,
  count: number,
  query: ParsedQuery,
): number[] {
  if (!count) return [];
  const { parameters: blob, bounds } = page;
  const hits = new Set<number>();
  for (const word of query.words) {
    const infix = word.length >= MIN_INFIX_MATCH_LENGTH;
    const exact = word.length < MIN_QUERY_WORD_LENGTH;
    let at = blob.indexOf(word);
    while (at !== -1) {
      // A rejected occurrence stays in this parameter; the next may sit at a boundary.
      if ((!infix && isWordChar(blob[at - 1])) || (exact && isWordChar(blob[at + word.length]))) {
        at = blob.indexOf(word, at + 1);
        continue;
      }
      const index = parameterIndexAt(bounds, count, at);
      hits.add(index);
      if (index + 1 >= count) break;
      at = blob.indexOf(word, bounds[(index + 1) * PARAMETER_STRIDE]);
    }
  }
  return [...hits].sort((a, b) => a - b);
}

/** Index of the parameter whose blob segment contains `position` (binary search on starts). */
function parameterIndexAt(bounds: Uint32Array, count: number, position: number): number {
  let low = 0;
  let high = count - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (bounds[mid * PARAMETER_STRIDE] <= position) low = mid;
    else high = mid - 1;
  }
  return low;
}
