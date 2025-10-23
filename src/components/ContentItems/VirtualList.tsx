import { useCallback, memo, useEffect, useState, useMemo } from 'react';

import type { ReactElement } from 'react';
import type { ContentItemModel } from '../../models/index.js';

import { removeLeadingSlash } from '@redocly/theme/core/openapi';

import { useLocation } from '../../hooks/useLocation.js';

const INITIAL_VISIBLE_ITEMS = 3;
const BUFFER_ITEMS = 1;
const FULL_LIST_DELAY = 1000;

const VirtualListComponent = ({
  items = [],
  renderItem,
  routingBasePath,
}: {
  items: ContentItemModel[];
  renderItem: (item: ContentItemModel) => ReactElement;
  routingBasePath: string;
}) => {
  const basePath = routingBasePath || '/';
  const location = useLocation();
  const pathname = removeLeadingSlash(location.pathname.replace(basePath, ''));

  const findActiveItemIndex = useMemo(() => {
    const itemMap = new Map(items.map((item, index) => [removeLeadingSlash(item.href), index]));
    return (pathname?: string) => (pathname ? itemMap.get(pathname) : undefined);
  }, [items]);

  const getVisibleRange = useCallback(
    (pathname: string) => {
      const currentIndex = findActiveItemIndex(pathname);

      const start = Math.max(0, currentIndex ? currentIndex - BUFFER_ITEMS : 0);
      const end = Math.min(
        items.length,
        currentIndex ? currentIndex + BUFFER_ITEMS + 1 : INITIAL_VISIBLE_ITEMS,
      );

      return { start, end };
    },
    [findActiveItemIndex, items.length],
  );

  const [visibleItems, setVisibleItems] = useState<ContentItemModel[]>(() => {
    const { start, end } = getVisibleRange(pathname);
    return items.slice(start, end);
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisibleItems(items);
    }, FULL_LIST_DELAY);

    return () => clearTimeout(timeoutId);
  }, [items]);

  return <>{visibleItems.map(renderItem)}</>;
};

export const VirtualList = memo(VirtualListComponent);
