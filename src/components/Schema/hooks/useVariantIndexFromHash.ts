import { useContext, useMemo } from 'react';

import { tryDecodeURIComponent } from '../../../utils/string.js';
import { hashIsForItem, hashToElementId, stripArrayMarkers } from '../../../utils/deep-link.js';
import { useUrlHash } from '../../../hooks/useUrlHash.js';
import {
  DeepLinkSectionContext,
  ItemIdContext,
  useHashItemId,
} from '../../../hooks/useDeepLinkSection.js';
import { buildSchemaFieldSuffix } from './useSchemaFieldDeepLink.js';

export function useVariantIndexFromHash(
  segment: string,
  count: number,
  fieldParentsName: string[] = [],
): number {
  const hash = useUrlHash();
  const itemId = useContext(ItemIdContext);
  const hashItemId = useHashItemId();
  const sectionCtx = useContext(DeepLinkSectionContext);
  const fieldPath = fieldParentsName.join('/');
  const fieldSuffix = buildSchemaFieldSuffix(sectionCtx, fieldPath) || `path=${fieldPath}`;
  const prefix = stripArrayMarkers(`${fieldSuffix}&${segment}=`.toLowerCase());
  return useMemo(() => {
    if (!hash) return -1;
    if (itemId) {
      const hashId = hashToElementId(hash);
      const forItem = hashItemId ? hashIsForItem(hashId, hashItemId) : hashId.startsWith('path=');
      if (!forItem) return -1;
    }
    const decoded = stripArrayMarkers(tryDecodeURIComponent(hash.slice(1)).toLowerCase());
    const at = decoded.indexOf(prefix);
    const match = at === -1 ? null : decoded.slice(at + prefix.length).match(/^\d+/);
    if (!match) return -1;
    const index = Number(match[0]);
    return index < count ? index : -1;
  }, [hash, itemId, hashItemId, prefix, count]);
}
