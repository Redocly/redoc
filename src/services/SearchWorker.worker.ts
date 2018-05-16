import * as lunr from 'lunr';

/* just for better typings */
export default class Worker {
  add = add;
  done = done;
  search = search;
  toJS = toJS;
  load = load;
}

export interface SearchDocument {
  title: string;
  description: string;
  id: string;
}

export interface SearchResult extends SearchDocument {
  score: number;
}

let store: { [id: string]: SearchDocument } = {};

let resolveIndex: (v: lunr.Index) => void = () => {
  throw new Error('Should not be called');
};

const index: Promise<lunr.Index> = new Promise(resolve => {
  resolveIndex = resolve;
});

const builder = new lunr.Builder();
builder.field('title');
builder.field('description');
builder.ref('id');

builder.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);

const expandTerm = term => '*' + lunr.stemmer(new lunr.Token(term, {})) + '*';

export function add(title: string, description: string, id: string) {
  const item = { title, description, id };
  builder.add(item);
  store[id] = item;
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

export async function search(q: string): Promise<Array<SearchDocument & SearchResult>> {
  if (q.trim().length === 0) {
    return [];
  }

  return (await index)
    .query(t => {
      q
        .trim()
        .split(/\s+/)
        .forEach(term => {
          const exp = expandTerm(term);
          t.term(exp, {});
        });
    })
    .map(res => ({ ...store[res.ref], score: res.score }));
}
