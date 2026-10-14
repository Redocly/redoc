import { useSyncExternalStore } from 'react';

let reassertCount = 0;
const reassertListeners = new Set<() => void>();

export function reassertUrlHash(): void {
  reassertCount += 1;
  for (const listener of reassertListeners) listener();
}

function subscribeReassert(callback: () => void): () => void {
  reassertListeners.add(callback);
  return () => {
    reassertListeners.delete(callback);
  };
}

function getReassertCount(): number {
  return reassertCount;
}

function getReassertServerSnapshot(): number {
  return 0;
}

export function useUrlHashReassert(): number {
  return useSyncExternalStore(subscribeReassert, getReassertCount, getReassertServerSnapshot);
}
