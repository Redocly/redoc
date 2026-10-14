import type { OperationParameter, SearchDocument } from '../types.js';
import type { LowerDocument } from './lowered.js';
import type { DocumentMatch, ParameterHit, ParsedQuery } from './types.js';

import { extractDeepLinkParamFromHash } from '../../../utils/deep-link.js';
import { MIN_QUERY_WORD_LENGTH } from '../text-match.js';
import { ParameterField, field, parametersMentioning } from './lowered.js';
import { coversQuery, matchesWords } from './query.js';
import { scoreParameter } from './score.js';

/**
 * FlexSearch reports the index field, but the UI reads `title`, `text`, `httpPath`,
 * `path` and `parameters`. So the hit fields come from the document, not from the index.
 */
export function resolveMatch(
  page: LowerDocument,
  document: SearchDocument,
  query: ParsedQuery,
): DocumentMatch {
  const fields: string[] = [];

  if (matchesWords(query, page.title)) fields.push('title');
  if (
    page.httpMethod &&
    query.words.some(
      (word) => word.length >= MIN_QUERY_WORD_LENGTH && page.httpMethod.startsWith(word),
    )
  ) {
    fields.push('httpMethod');
  }
  if (matchesWords(query, page.httpPath)) fields.push('httpPath');
  if (matchesWords(query, page.text)) fields.push('text');
  if (matchesWords(query, page.path)) fields.push('path');

  const hit = findMatchingParameter(page, document, query);
  if (hit) fields.push('parameters');

  return { fields, parameter: hit?.parameter, parameterScore: hit?.score ?? 0 };
}

/** One value holds every query word, like the index intersects its terms per field. */
export function coversInOneValue(
  page: LowerDocument,
  document: SearchDocument,
  query: ParsedQuery,
): boolean {
  if (
    coversQuery(query, page.title) ||
    coversQuery(query, page.text) ||
    coversQuery(query, page.httpPath) ||
    coversQuery(query, page.path)
  ) {
    return true;
  }
  const parameters = document.parameters ?? [];
  const kinds = [
    ParameterField.Name,
    ParameterField.Description,
    ParameterField.Path,
    ParameterField.Example,
    ParameterField.Enum,
  ];
  for (const index of parametersMentioning(page, parameters.length, query)) {
    if (kinds.some((kind) => coversQuery(query, field(page, index, kind)))) return true;
  }
  return false;
}

/** Message key a row belongs to (`m=` in its anchor); undefined outside messages. */
function messageScopeOf(parameter: OperationParameter | undefined): string | undefined {
  return parameter?.deepLink ? extractDeepLinkParamFromHash(parameter.deepLink, 'm') : undefined;
}

/** Best matching parameter of every message other than the primary match's. */
export function otherMessageMatches(
  page: LowerDocument,
  document: SearchDocument,
  match: DocumentMatch,
  query: ParsedQuery,
): ParameterHit[] {
  if (!match.parameter) return [];
  const primaryScope = messageScopeOf(match.parameter);
  if (primaryScope === undefined) return [];

  const bestByScope = new Map<string, ParameterHit>();
  const parameters = document.parameters ?? [];
  for (const index of parametersMentioning(page, parameters.length, query)) {
    const parameter = parameters[index];
    const scope = messageScopeOf(parameter);
    if (scope === undefined || scope === primaryScope) continue;
    const score = scoreParameter(page, document, index, query);
    if (!score) continue;
    const best = bestByScope.get(scope);
    const shallower =
      best !== undefined &&
      score === best.score &&
      (parameter.path?.length ?? 0) < (best.parameter.path?.length ?? 0);
    if (!best || score > best.score || shallower) bestByScope.set(scope, { parameter, score });
  }
  return [...bestByScope.values()];
}

/** Picks the best-matching parameter, so both the deep link and the score point at it. */
function findMatchingParameter(
  page: LowerDocument,
  document: SearchDocument,
  query: ParsedQuery,
): ParameterHit | undefined {
  let best: (ParameterHit & { index: number }) | undefined;
  const parameters = document.parameters ?? [];

  for (const index of parametersMentioning(page, parameters.length, query)) {
    const score = scoreParameter(page, document, index, query);
    if (!score) continue;
    const wins =
      !best ||
      score > best.score ||
      (score === best.score && outranksOnTie(page, document, index, best.index, query));
    if (wins) best = { parameter: parameters[index], score, index };
  }

  return best && { parameter: best.parameter, score: best.score };
}

/**
 * Equal scores: the description holding more of the query in word order wins (two
 * messages can share every query word), then the shallowest field — a channel with
 * several messages must not shadow a top-level field behind an earlier nested copy.
 */
function outranksOnTie(
  page: LowerDocument,
  document: SearchDocument,
  index: number,
  currentIndex: number,
  query: ParsedQuery,
): boolean {
  const pairs = phrasePairs(query, field(page, index, ParameterField.Description));
  const currentPairs = phrasePairs(query, field(page, currentIndex, ParameterField.Description));
  if (pairs !== currentPairs) return pairs > currentPairs;
  const parameters = document.parameters ?? [];
  return (parameters[index].path?.length ?? 0) < (parameters[currentIndex].path?.length ?? 0);
}

/** Adjacent query-word pairs that appear in the value in the same order. */
function phrasePairs(query: ParsedQuery, lowered: string): number {
  const text = lowered.replace(/\s+/g, ' ');
  let pairs = 0;
  for (let i = 1; i < query.words.length; i++) {
    if (text.includes(`${query.words[i - 1]} ${query.words[i]}`)) pairs++;
  }
  return pairs;
}
