import { useSyncExternalStore } from 'react';
import { useAtomValue } from 'jotai';

import { environmentAtom, serverRenderEnvironmentAtom } from '../jotai/app.js';

const subscribeNever = () => () => undefined;

/**
 * The selected environment (`environmentAtom`), except in the server render and while React
 * hydrates it: then `serverRenderEnvironmentAtom`. A render that does not hydrate gets the
 * selection at once.
 */
export function useDisplayedEnvironment(): [Record<string, string>, string] {
  // A server render can come from a shared cache, so it never sees the reader's saved selection.
  const hydrating = useSyncExternalStore(
    subscribeNever,
    () => false,
    () => true,
  );
  return useAtomValue(hydrating ? serverRenderEnvironmentAtom : environmentAtom);
}
