export const SEARCH_LIMIT = 100;
export const SHARED_FIELD_COPIES = 3;
// FlexSearch keeps 100 hits per field by default. Four fields give a smaller pool than
// the eight fields before, so the engine asks for more and then cuts at SEARCH_LIMIT.
export const SEARCH_CANDIDATE_LIMIT = 500;
export { HIGHLIGHTED_TEXT_MAX_LENGTH } from '../highlight.js';
// `all` joins every searchable value of a document, so a multi-word query matches
// across the title, the description and the parameters. `paramNames` and `title`
// stay separate to keep an exact match on them ahead of a match in the blob.
export const SEARCH_INDEX_FIELDS = ['title', 'httpPath', 'paramNames', 'all'];
// Ranking weights. The exact-title bonus exceeds every other bonus combined, so a page
// whose title is the query is always first.
export const SEARCH_SCORE = {
  titleExact: 2000,
  titlePrefix: 800,
  titleAllWords: 400,
  titlePartial: 150,
  paramNameExact: 250,
  paramNamePartial: 120,
  // Markdown-heading sub-results (place ends with "description"): above prose
  // and param-value hits, below a parameter-name hit.
  sectionTitleExact: 180,
  sectionTitlePartial: 90,
  paramValue: 40,
  paramPlace: 5,
  titleCoverage: 100,
  httpPath: 60,
  httpMethod: 50,
  text: 10,
  deprecated: -40,
} as const;
