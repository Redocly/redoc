import { useEffect, useState } from 'react';

/** Returns `false` on the server and on the first client render (so React's
 *  hydration matches the SSR output), then flips to `true` once the browser has
 *  painted that first render. A hidden document paints nothing, so it flips at once. */
export function useIsHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // A background tab runs no frame callbacks until it is shown.
    if (document.visibilityState === 'hidden') {
      setHydrated(true);
      return;
    }
    // A frame callback runs just before the paint; a task queued from it runs after.
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      timeout = setTimeout(() => setHydrated(true));
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, []);
  return hydrated;
}
