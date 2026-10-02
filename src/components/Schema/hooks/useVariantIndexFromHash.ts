import { useMemo } from 'react';

import { tryDecodeURIComponent } from '../../../utils/string.js';
import { useUrlHash } from '../../../hooks/useUrlHash.js';

export function useVariantIndexFromHash(segment: string, count: number, level: number): number {
  const hash = useUrlHash();
  return useMemo(() => {
    if (!hash) return -1;
    const decoded = tryDecodeURIComponent(hash.slice(1));
    const regex = new RegExp(`(?=${segment}=)`, 'g');
    const parts = decoded.split(regex);
    const part = parts[level];
    if (!part) return -1;

    for (let i = 0; i < count; i++) {
      if (part.includes(`${segment}=${i}`)) return i;
    }
    return -1;
  }, [hash, segment, count, level]);
}
