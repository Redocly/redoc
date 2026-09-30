import { useCallback, useEffect, useRef, useState } from 'react';

import type { ApiItem, ApiStore } from '../types/store.js';
import type { SearchItemData } from '../services/search/types.js';

import { initializeSearch } from '../services/search/init.js';

function whenIdle(task: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.requestIdleCallback !== 'function') {
    return () => {};
  }
  const handle = window.requestIdleCallback(task);
  return () => window.cancelIdleCallback(handle);
}

export function useSearchEngine(
  items: ApiItem[],
  store: ApiStore,
  basePath: string,
  document?: Record<string, unknown>,
): {
  search: (query: string) => Promise<SearchItemData[]>;
  isReady: boolean;
  ensureIndex: () => void;
} {
  const [engine, setEngine] = useState<{
    search: (query: string) => Promise<SearchItemData[]>;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const startRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    let started = false;
    setIsReady(false);
    setEngine(null);

    const start = (): void => {
      if (started || cancelled) return;
      started = true;

      initializeSearch(items, store, basePath, document)
        .then((searchApi) => {
          if (cancelled) return;
          setEngine(searchApi);
          setIsReady(true);
        })
        .catch((error: Error) => {
          console.error('Failed to initialize search:', error);
          if (cancelled) return;
          // Ready with an empty engine — the trigger stops showing "Loading".
          setIsReady(true);
        });
    };

    startRef.current = start;
    const cancelIdle = whenIdle(start);

    return () => {
      cancelled = true;
      startRef.current = null;
      cancelIdle();
    };
  }, [items, store, basePath, document]);

  const ensureIndex = useCallback(() => {
    startRef.current?.();
  }, []);

  const search = useCallback(
    (query: string): Promise<SearchItemData[]> => {
      if (!engine) return Promise.resolve([]);
      return engine.search(query);
    },
    [engine],
  );

  return { search, isReady, ensureIndex };
}
