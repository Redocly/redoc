import * as React from 'react';
import { ApiInfo, AppStore, ContentItem, ContentItemModel, MenuStore } from '../..';
import { useVirtualizer } from '@tanstack/react-virtual';
import useSelectedTag from './useSelectedTag';
import useItemReverseIndex from './useItemReverseIndex';

type VirtualizedContentProps = {
  store: AppStore;
  menu: MenuStore;
};

/**
 * VirtualizedContent optimizes the rendering of API documentation in Redoc by virtualizing the content.
 *
 * It ensures that only the API sections currently visible within the user's viewport are rendered,
 * while off-screen sections remain unloaded until they come into view.
 * The data is still in the memory, at least the HTML doesn't have to render it which does frees
 * quite a huge amount of memory.
 *
 * This approach prevents memory issues that can arise when rendering large API documentation
 * by reducing the amount of content loaded into memory at any one time, thereby enhancing
 * performance and preventing potential crashes due to excessive memory usage.
 *
 * @author Audi
 */
const VirtualizedContent = ({ store, menu }: VirtualizedContentProps) => {
  const scrollableRef = React.useRef<HTMLDivElement>(null);

  const renderables = React.useMemo(() => {
    return menu.flatItems;
  }, [menu.flatItems.length]);
  const { reverseIndexToVirtualIndex: reverseIndex } = useItemReverseIndex(renderables);

  const virtualizer = useVirtualizer({
    count: renderables.length,
    getScrollElement: () => scrollableRef.current!,
    estimateSize: () => 1000,
  });

  const selectedTag = useSelectedTag();

  /**
   * The side effect is responsible for moving user based on the
   * selected tag into the API of choice in the virtualized view.
   */
  React.useEffect(() => {
    const idx: number | undefined = reverseIndex[selectedTag];
    if (!idx) {
      return;
    }

    virtualizer.scrollToIndex(idx, {
      align: 'start',
    });
  }, [selectedTag]);

  return (
    <div ref={scrollableRef} style={{ height: '100dvh', width: '100%', overflowY: 'auto' }}>
      <ApiInfo store={store} />
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ContentItem
              key={renderables[virtualItem.index].id}
              item={renderables[virtualItem.index] as ContentItemModel}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedContent;
