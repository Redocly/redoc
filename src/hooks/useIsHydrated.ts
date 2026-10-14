import { useEffect, useState } from 'react';

/** Returns `false` on the server and on the first client render (so React's
 *  hydration matches the SSR output), then flips to `true` after the first
 *  effect commits. */
export function useIsHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
