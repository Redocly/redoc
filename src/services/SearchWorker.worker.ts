import * as lunr from 'lunr';

try {
  // tslint:disable-next-line
  require('core-js/es6/promise'); // bundle into worker
} catch (_) {
  // nope
}

/* just for better typings */
export default class Worker {
  add: typeof add = add;
  done = done;
  search: typeof search = search;
  toJS = toJS;
  load = load;
}

export interface SearchDocument {
  title: string;
  description: string;
  id: string;
}

export interface SearchResult<T = string> {
  meta: T;
  score: number;
}

let store: any[] = [];

let resolveIndex: (v: lunr.Index) => void = () => {
  throw new Error('Should not be called');
};

const index: Promise<lunr.Index> = new Promise(resolve => {
  resolveIndex = resolve;
});

lunr.tokenizer.separator = /\s+/;

const builder = new lunr.Builder();
builder.field('title');
builder.field('description');
builder.ref('ref');

builder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);

const expandTerm = term => '*' + lunr.stemmer(new lunr.Token(term, {})) + '*';

export function add<T>(title: string, description: string, meta?: T) {
  const ref = store.push(meta) - 1;
  const item = { title: title.toLowerCase(), description: description.toLowerCase(), ref };
  builder.add(item);
}

export async function done() {
  resolveIndex(builder.build());
}

export async function toJS() {
  return {
    store,
    index: (await index).toJSON(),
  };
}

export async function load(state: any) {
  store = state.store;
  resolveIndex(lunr.Index.load(state.index));
}

export async function search<Meta = string>(
  q: string,
  limit = 0,
): Promise<Array<SearchResult<Meta>>> {
  if (q.trim().length === 0) {
    return [];
  }

  let searchResults = (await index).query(t => {
    q.trim()
      .toLowerCase()
      .split(/\s+/)
      .forEach(term => {
        const exp = expandTerm(term);
        t.term(exp, {});
      });
  });

  if (limit > 0) {
    searchResults = searchResults.slice(0, limit);
  }

  return searchResults.map(res => ({ meta: store[res.ref], score: res.score }));
}
