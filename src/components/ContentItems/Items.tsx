import { memo, useCallback } from 'react';

import type { ReactElement } from 'react';
import type { ContentItemModel } from '../../models';

import { ContentItem } from '../ContentItem/index.js';
import { VirtualList } from './VirtualList.js';
import { isRenderableMenuItem } from '../../utils/menu.js';
interface ContentItemsProps {
  items: ContentItemModel[];
  routingBasePath: string;
}

function ItemsComponent({ items, routingBasePath }: ContentItemsProps): ReactElement | null {
  const renderItem = useCallback(
    (item: ContentItemModel) => (
      <ContentItem key={item.id} item={item} routingBasePath={routingBasePath}>
        {item.items.length > 0 && (
          <VirtualList
            items={item.items as never[]}
            renderItem={renderItem}
            routingBasePath={routingBasePath}
          />
        )}
      </ContentItem>
    ),
    [routingBasePath],
  );

  if (!items.length) return null;

  const shouldUseVirtualList =
    items.length > 15 && items.every((item) => isRenderableMenuItem(item));

  return (
    <>
      {shouldUseVirtualList ? (
        <VirtualList
          items={items as never[]}
          renderItem={renderItem}
          routingBasePath={routingBasePath}
        />
      ) : (
        <>{items.map(renderItem)}</>
      )}
    </>
  );
}

export const Items = memo<ContentItemsProps>(ItemsComponent);
