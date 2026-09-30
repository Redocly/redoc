import { useEffect } from 'react';
import { useAtomValue } from 'jotai';

import type { ApiItem } from '../types/store.js';

import { definitionAtom, specTypeAtom, storeAtom } from '../jotai/store.js';
import {
  buildApiDocsAgentTools,
  createSpecSliceOperationDetail,
  registerAgentTools,
} from '../services/agent-tools/index.js';

/**
 * Publishes the API reference tools to a browser AI agent through WebMCP, for hosts that render
 * the docs on their own. Operation detail is sliced out of the definition the host loaded.
 */
export function useAgentTools(items: ApiItem[]): void {
  const store = useAtomValue(storeAtom);
  const specType = useAtomValue(specTypeAtom);
  const definition = useAtomValue(definitionAtom);

  useEffect(() => {
    const controller = new AbortController();

    void registerAgentTools(
      buildApiDocsAgentTools({
        items,
        store,
        getOperationDetail: definition
          ? createSpecSliceOperationDetail({ items, specType, definition })
          : undefined,
      }),
      controller.signal,
    );

    return () => controller.abort();
  }, [items, store, specType, definition]);
}
