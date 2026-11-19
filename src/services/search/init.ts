import type { ApiItem, ApiStore } from '../../types/store.js';
import type { SearchItemData } from './types.js';

import { ApiDocsSearchIndexer } from './indexer/index.js';
import { SearchEngine } from './engine/index.js';

export type SearchApi = {
  search: (query: string) => Promise<SearchItemData[]>;
};

const FRAME_BUDGET_MS = 8;

/** Builds the client-side search index from the item model, yielding to the event loop so large APIs don't block rendering. */
export async function initializeSearch(
  items: ApiItem[],
  store: ApiStore,
  basePath: string,
  document?: Record<string, unknown>,
): Promise<SearchApi> {
  const indexer = new ApiDocsSearchIndexer({ basePath, store, document });
  let deadline = Date.now() + FRAME_BUDGET_MS;

  const checkBudget = async (): Promise<void> => {
    if (Date.now() < deadline) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
    deadline = Date.now() + FRAME_BUDGET_MS;
  };

  const engine = new SearchEngine();
  for (const searchDocument of indexer.documents(items)) {
    engine.addDocument(searchDocument);
    await checkBudget();
  }

  return {
    search: (query: string) => engine.search(query),
  };
}
