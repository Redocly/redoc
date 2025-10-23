import { useMemo } from 'react';

import type { ContentItemModel } from '../../models/index.js';

import { removeLeadingSlash } from '@redocly/theme/core/openapi';

import { tryDecodeURIComponent, normalizePath } from '../../utils/index.js';
import { getLegacyHash } from '../Content/useAutoScroll.js';
import { useLocation } from '../../hooks/useLocation.js';

export function useIsExpanded({
  item,
  routingBasePath,
}: {
  item: ContentItemModel;
  routingBasePath: string;
}): boolean {
  const location = useLocation();

  const decodedPathname = useMemo(
    () => tryDecodeURIComponent(normalizePath(location.pathname.replace(routingBasePath, ''))),
    [location.pathname, routingBasePath],
  );

  const flatItems = useMemo(() => {
    const flat: ContentItemModel[] = [];
    const traverse = (items: ContentItemModel[]) => {
      items.forEach((item) => {
        flat.push(item);
        if (item.items?.length) {
          traverse(item.items);
        }
      });
    };
    traverse([item]);
    return flat;
  }, [item]);

  if (item.type !== 'tag') {
    return false;
  }

  const itemHrefs = flatItems.map((item) => item.href);
  return itemHrefs.some((href) => {
    const legacyHash = getLegacyHash(location.hash);
    return (
      [href, tryDecodeURIComponent(href)].includes(decodedPathname) ||
      // handle expand tag by legacy hash route
      (legacyHash && (href.endsWith(legacyHash) || href === removeLeadingSlash(legacyHash)))
    );
  });
}
