import { memo, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import type { ReactElement } from 'react';
import type { ContentItemModel } from '../../models/index.js';

import { getFirstPageLink, getItemsByType } from './helpers.js';
import { SectionContent } from '../SectionContent/index.js';

interface ContentItemsProps {
  root?: boolean;
  items: ContentItemModel[];
  routingBasePath: string;
}

function ContentItemsComponent({ items, root = false }: ContentItemsProps): ReactElement | null {
  const defaultRootLink = '/';
  const { rootItem } = getItemsByType(items);
  const firstPageLink =
    !root || rootItem ? defaultRootLink : getFirstPageLink(items, defaultRootLink);

  const renderRoutes = useMemo(
    () => (
      <Routes>
        {rootItem && (
          <Route
            path={`${rootItem.href || defaultRootLink}*`}
            element={<SectionContent items={items} />}
          />
        )}
        <Route path="*" element={<Navigate to={firstPageLink} replace />} />
      </Routes>
    ),
    [rootItem, defaultRootLink, items, firstPageLink],
  );

  if (root && !items.length) {
    return (
      <Routes>
        <Route path="*" element={<SectionContent items={items} />} />
      </Routes>
    );
  }

  if (!items.length) return null;

  return <>{renderRoutes}</>;
}

export const ContentItems = memo<ContentItemsProps>(ContentItemsComponent);
