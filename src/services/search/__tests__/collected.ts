import type { ApiItem } from '../../../types/store.js';
import type { SearchDocument } from '../types.js';
import type { ApiDocsSearchIndexer } from '../indexer/index.js';

/** Collects the items a test adds, then indexes them in one `documents(items)` walk. */
export function collected(indexer: ApiDocsSearchIndexer): {
  addItem: (item: ApiItem) => void;
  getResult: () => SearchDocument[];
} {
  const items: ApiItem[] = [];
  return {
    addItem: (item) => {
      items.push(item);
    },
    getResult: () => [...indexer.documents(items)],
  };
}
