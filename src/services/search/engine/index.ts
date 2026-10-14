import type { Id } from 'flexsearch';

import type { SearchDocument, SearchItemData } from '../types.js';
import type { LowerDocument } from './lowered.js';
import type { Candidate, ParsedQuery } from './types.js';

import { SEARCH_LIMIT } from './constants.js';
import { candidateIds, createSearchIndex, toIndexedDocument } from './flexsearch.js';
import { lowerDocument } from './lowered.js';
import { parseQuery } from './query.js';
import { coversInOneValue, otherMessageMatches, resolveMatch } from './match.js';
import { scoreMatch } from './score.js';
import { collapseSharedFields } from './collapse.js';
import { prepareHighlight, resolveDeepLink } from './present.js';

export class SearchEngine {
  private _index = createSearchIndex();
  private _documents = new Map<string, SearchDocument>();
  private _lowerDocuments = new Map<string, LowerDocument>();

  addDocument(document: SearchDocument): void {
    this._documents.set(document.id, document);
    this._lowerDocuments.set(document.id, lowerDocument(document));
    this._index.add(document.id, toIndexedDocument(document));
  }

  async search(query: string): Promise<SearchItemData[]> {
    const parsed = parseQuery(query);
    if (!parsed.words.length) return [];

    const ids = await candidateIds(this._index, query);
    const ranked = this.rankCandidates(ids, parsed);

    return collapseSharedFields(ranked, parsed, this.lowered)
      .slice(0, SEARCH_LIMIT)
      .map(({ document, match }) => ({
        document: resolveDeepLink(this.lowered(document), document, match, parsed),
        highlight: prepareHighlight(document, query, match),
      }));
  }

  private rankCandidates(ids: Set<Id>, query: ParsedQuery): Candidate[] {
    const confirmed: Candidate[] = [];
    const foldedOnly: Candidate[] = [];

    for (const id of ids) {
      const document = this._documents.get(id as string);
      if (!document) continue;
      this.appendCandidates(document, query, confirmed, foldedOnly);
    }

    if (!confirmed.length) {
      for (const [id, document] of this._documents) {
        if (ids.has(id)) continue;
        if (!coversInOneValue(this.lowered(document), document, query)) continue;
        this.appendCandidates(document, query, confirmed, []);
      }
    }

    const ranked = confirmed.length ? confirmed : foldedOnly;

    ranked.sort((a, b) => b.score - a.score);
    return ranked;
  }

  private appendCandidates(
    document: SearchDocument,
    query: ParsedQuery,
    confirmed: Candidate[],
    foldedOnly: Candidate[],
  ): void {
    const page = this.lowered(document);
    const match = resolveMatch(page, document, query);
    const candidate = { document, match, score: scoreMatch(page, document, match, query) };
    // The index folds repeated letters (`sso` -> `so`), so it also returns documents that
    // never contain the query. They are only worth showing when nothing else matched.
    (match.fields.length ? confirmed : foldedOnly).push(candidate);
    if (!match.fields.length) return;
    // A channel page carries every message's fields; when other messages also match,
    // each gets its own result so the reader can pick the variant they meant.
    for (const hit of otherMessageMatches(page, document, match, query)) {
      const extraMatch = {
        fields: ['parameters'],
        parameter: hit.parameter,
        parameterScore: hit.score,
      };
      confirmed.push({
        document,
        match: extraMatch,
        score: scoreMatch(page, document, extraMatch, query),
      });
    }
  }

  private lowered = (document: SearchDocument): LowerDocument =>
    this._lowerDocuments.get(document.id) ?? lowerDocument(document);
}
