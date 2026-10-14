import type { SearchDocument } from '../types.js';
import type { LowerDocument } from './lowered.js';
import type { DocumentMatch, ParsedQuery } from './types.js';

import { isDescriptionPlace } from '../indexer/places.js';
import { containsQueryWord } from '../text-match.js';
import { SEARCH_SCORE } from './constants.js';
import { ParameterField, field } from './lowered.js';
import { bestCoverage, coverage, matchesWords } from './query.js';

type TierRule = {
  when: (title: string, match: DocumentMatch, query: ParsedQuery) => boolean;
  bonus: number;
};

type BonusRule = {
  when: (document: SearchDocument, match: DocumentMatch) => boolean;
  bonus: number;
};

const TITLE_TIERS: readonly TierRule[] = [
  { when: (title, _, query) => title === query.text, bonus: SEARCH_SCORE.titleExact },
  { when: (title, _, query) => title.startsWith(query.text), bonus: SEARCH_SCORE.titlePrefix },
  {
    when: (title, _, query) => query.words.every((word) => containsQueryWord(title, word)),
    bonus: SEARCH_SCORE.titleAllWords,
  },
  { when: (_, match) => match.fields.includes('title'), bonus: SEARCH_SCORE.titlePartial },
];

const FIELD_BONUSES: readonly BonusRule[] = [
  { when: (_, match) => match.fields.includes('httpMethod'), bonus: SEARCH_SCORE.httpMethod },
  { when: (_, match) => match.fields.includes('httpPath'), bonus: SEARCH_SCORE.httpPath },
  { when: (_, match) => match.fields.includes('text'), bonus: SEARCH_SCORE.text },
  { when: (document) => !!document.deprecated, bonus: SEARCH_SCORE.deprecated },
];

function tierBonus(title: string, match: DocumentMatch, query: ParsedQuery): number {
  return TITLE_TIERS.find((tier) => tier.when(title, match, query))?.bonus ?? 0;
}

function tightnessBonus(title: string, query: ParsedQuery): number {
  return Math.round((SEARCH_SCORE.titleCoverage * query.text.length) / title.length);
}

function fieldBonuses(document: SearchDocument, match: DocumentMatch): number {
  return FIELD_BONUSES.filter((rule) => rule.when(document, match)).reduce(
    (sum, rule) => sum + rule.bonus,
    0,
  );
}

type NameWeights = { exact: number; partial: number };

const PARAMETER_NAME_WEIGHTS: NameWeights = {
  exact: SEARCH_SCORE.paramNameExact,
  partial: SEARCH_SCORE.paramNamePartial,
};

const SECTION_NAME_WEIGHTS: NameWeights = {
  exact: SEARCH_SCORE.sectionTitleExact,
  partial: SEARCH_SCORE.sectionTitlePartial,
};

const PARAMETER_VALUE_FIELDS = [
  ParameterField.Description,
  ParameterField.Path,
  ParameterField.Example,
  ParameterField.Enum,
];

/** A page whose title is the query wins; a page that only mentions it in prose loses. */
export function scoreMatch(
  page: LowerDocument,
  document: SearchDocument,
  match: DocumentMatch,
  query: ParsedQuery,
): number {
  const tier = tierBonus(page.title, match, query);
  const titleScore = tier ? tier + tightnessBonus(page.title, query) : 0;
  return titleScore + fieldBonuses(document, match) + match.parameterScore;
}

/** How well the query matched one parameter; the value is also its ranking bonus. */
export function scoreParameter(
  page: LowerDocument,
  document: SearchDocument,
  index: number,
  query: ParsedQuery,
): number {
  const parameter = (document.parameters ?? [])[index];
  const at = (kind: ParameterField): string => field(page, index, kind);
  const weights = isDescriptionPlace(parameter.place)
    ? SECTION_NAME_WEIGHTS
    : PARAMETER_NAME_WEIGHTS;

  if (at(ParameterField.Name) === query.text) return weights.exact;

  const nameScore = weights.partial * coverage(query, at(ParameterField.Name)) ** 2;
  const valueScore =
    SEARCH_SCORE.paramValue * bestCoverage(query, PARAMETER_VALUE_FIELDS.map(at)) ** 2;
  if (nameScore || valueScore) return nameScore + valueScore;

  return matchesWords(query, at(ParameterField.Place)) ? SEARCH_SCORE.paramPlace : 0;
}
