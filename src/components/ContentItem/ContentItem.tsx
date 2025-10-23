import { memo } from 'react';
import { useAtomValue } from 'jotai';

import type { LayoutVariant } from '@redocly/config';
import type { FC, ReactElement, ReactNode } from 'react';
import type { ContentItemModel, GroupModel, OperationMenuItem } from '../../models/index.js';

import { joinWithSeparator, type MenuItemType } from '../../services/index.js';
import { TagItem } from '../TagItem/index.js';
import { OperationItem } from '../OperationItem/index.js';
import { Section } from '../common/index.js';
import { useIsExpanded } from './useIsExpanded.js';
import { SectionItem } from '../SectionItem/index.js';
import useScrollOnRender from '../ContentItems/useScrollOnRender.js';
import { isRootItem } from '../ContentItems/helpers.js';
import { ApiInfo } from '../ApiInfo/index.js';
import { layoutAtom } from '../../jotai/app.js';
import { isRenderableMenuItem } from '../../utils/menu.js';

interface ContentItemProps {
  item: ContentItemModel;
  routingBasePath: string;
  children?: ReactNode;
  layout?: LayoutVariant;
}

const ContentComponentMap: Record<
  MenuItemType | 'root',
  FC<{
    item: GroupModel | OperationMenuItem;
    routingBasePath?: string;
    isExpanded?: boolean;
    layout?: LayoutVariant;
  }> | null
> = {
  group: null,
  tag: TagItem,
  section: SectionItem,
  schema: (props) => <TagItem {...props} item={props.item as GroupModel} isExpanded={true} />,
  operation: OperationItem,
  mcp: (props) => <TagItem {...props} item={props.item as GroupModel} isExpanded={true} />,
  root: ApiInfo,
};

function ContentItemComponent({
  item,
  routingBasePath,
  children,
  layout: contentLayout,
}: ContentItemProps): ReactElement {
  const isRoot = isRootItem(item);
  const ContentComponent = ContentComponentMap[isRoot ? 'root' : item.type];
  const expandable = item.type === 'tag' && item.items.length > 0;

  const isExpanded = useIsExpanded({ item, routingBasePath });
  let ref = useScrollOnRender(item, routingBasePath);
  const layout = useAtomValue(layoutAtom);

  return (
    <>
      {ContentComponent && (
        <Section
          id={item.id}
          ref={ref}
          sectionId={joinWithSeparator(routingBasePath, item.id)}
          underlined={isRenderableMenuItem(item)}
          expanded={expandable && !isExpanded}
        >
          <ContentComponent
            item={item}
            routingBasePath={routingBasePath}
            isExpanded={isExpanded}
            layout={contentLayout || layout}
          />
        </Section>
      )}
      {(isExpanded || item.type !== 'tag') && Boolean(item.items?.length) && <>{children}</>}
    </>
  );
}

export const ContentItem = memo<ContentItemProps>(ContentItemComponent);
