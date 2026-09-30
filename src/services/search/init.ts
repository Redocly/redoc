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
  const indexer = new ApiDocsSearchIndexer(basePath, store.schemaStore, document, {
    exampleStore: store.exampleStore,
  });
  let deadline = Date.now() + FRAME_BUDGET_MS;

  const checkBudget = async (): Promise<void> => {
    if (Date.now() < deadline) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
    deadline = Date.now() + FRAME_BUDGET_MS;
  };

  const addAll = async (list: ApiItem[], ancestors: string[]): Promise<void> => {
    for (const item of list) {
      indexer.addItem(item, ancestors);
      await checkBudget();
      if (item.items?.length) {
        // Nav children are typed as plain nav items; the indexer skips
        // anything without `content`, so the widened cast is safe.
        await addAll(item.items as ApiItem[], item.label ? [...ancestors, item.label] : ancestors);
      }
    }
  };
  await addAll(items, []);

  const searchDocuments = indexer.getResult();

  const engine = new SearchEngine();
  for (const searchDocument of searchDocuments) {
    engine.addDocument(searchDocument);
    await checkBudget();
  }

  return {
    search: (query: string) => engine.search(query),
  };
}
