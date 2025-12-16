import { memo } from 'react';

import type { ContentItemModel } from '../../models/index.js';

import { useAutoScroll } from './useAutoScroll.js';
import { ContentItems } from '../ContentItems/index.js';

interface ContentProps {
  items: ContentItemModel[];
  routingBasePath: string;
}

function ContentComponent({ routingBasePath, items }: Omit<ContentProps, 'root'>) {
  useAutoScroll(routingBasePath);

  return <ContentItems root items={items} routingBasePath={routingBasePath} />;
}
export const Content = memo<ContentProps>(ContentComponent);
