import FlexSearch, {
  type DocumentOptions,
  type Document,
  type Id,
  type DocumentData,
} from 'flexsearch';
import flexsearchGlobalSource from 'flexsearch-global?raw';

import type { SearchDocument } from '../types.js';

import { SEARCH_CANDIDATE_LIMIT, SEARCH_INDEX_FIELDS } from './constants.js';
import { toText } from './text.js';

const indexSchema = {
  document: {
    id: 'id',
    index: SEARCH_INDEX_FIELDS,
  },
  tokenize: 'forward',
  context: {
    depth: 2,
    resolution: 9,
  },
} as DocumentOptions;

/** The document plus the two joined fields that only the index reads. */
type IndexedDocument = SearchDocument & { paramNames: string; all: string };

/**
 * FlexSearch boots each field worker from a page-global `_factory`: a function whose source is
 * evaluated inside the worker and must leave `self.FlexSearch` defined. The global (non-module)
 * build does exactly that, so its source becomes the factory body. Needs `Worker` and eval
 * (CSP `unsafe-eval`); otherwise the index stays on this thread.
 */
function installWorkerFactory(): boolean {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return false;
  const host = globalThis as { _factory?: unknown };
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    host._factory ??= new Function(flexsearchGlobalSource);
    return true;
  } catch {
    return false;
  }
}

/** Worker mode spawns one worker per indexed field; a worker that cannot start falls back to in-thread. */
function createIndex(worker: boolean): Document {
  if (worker) {
    try {
      return new FlexSearch.Document({ ...indexSchema, worker: true });
    } catch {
      /* fall through */
    }
  }
  return new FlexSearch.Document({ ...indexSchema, worker: false });
}

export function createSearchIndex(): Document {
  return createIndex(installWorkerFactory());
}

/** Joins the values the index needs. The copy is temporary — the engine keeps the original. */
export function toIndexedDocument(document: SearchDocument): DocumentData {
  const parameters = document.parameters ?? [];
  const parts: (string | string[] | undefined)[] = [
    document.title,
    document.text,
    document.httpMethod,
    document.httpPath,
  ];

  for (const parameter of parameters) {
    parts.push(
      parameter.name,
      parameter.description,
      parameter.place,
      parameter.type,
      parameter.example,
      parameter.enum,
    );
  }

  const indexed: IndexedDocument = {
    ...document,
    paramNames: parameters.map((parameter) => toText(parameter.name)).join(' '),
    all: parts.map(toText).filter(Boolean).join(' '),
  };
  return indexed as DocumentData;
}

export async function candidateIds(index: Document, query: string): Promise<Set<Id>> {
  const ids = new Set<Id>();
  const hits = await index.search(query, { limit: SEARCH_CANDIDATE_LIMIT });
  for (const searchResult of hits) {
    for (const id of searchResult.result) ids.add(id);
  }
  return ids;
}
