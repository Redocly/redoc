import type { IMenuItem } from '../../services/types.js';
import type { ContentItemModel } from '../../models/index.js';

import { normalizePath } from '../../utils/index.js';
import { isRenderableMenuItem } from '../../utils/menu.js';

export function isRootItem(item: ContentItemModel | IMenuItem) {
  return item.type === 'section' && item.id === '';
}

export function getItemsByType(items: ContentItemModel[]) {
  const groupItems: ContentItemModel[] = [];
  const tagItems: ContentItemModel[] = [];
  const operationItems: ContentItemModel[] = [];
  let rootItem: ContentItemModel | undefined = undefined;
  for (const item of items) {
    switch (item.type) {
      case 'group':
        groupItems.push(item);
        break;
      case 'tag':
        tagItems.push(item);
        break;
      case 'operation':
        operationItems.push(item);
        break;
      case 'section':
        if (isRootItem(item)) {
          rootItem = item;
        }
        break;
    }
  }
  return { groupItems, tagItems, operationItems, rootItem };
}

export function getFirstPageLink(items: ContentItemModel[], defaultRootLink: string): string {
  for (const item of items) {
    if (item.type === 'group') {
      return getFirstPageLink(item.items, defaultRootLink);
    } else if (item.type === 'tag') {
      if (!item.description) {
        return normalizePath(getFirstPageLink(item.items, defaultRootLink));
      }
      if (item.href) {
        return normalizePath(item.href);
      }
    } else if (isRenderableMenuItem(item)) {
      return normalizePath(item.href);
    }
  }
  return defaultRootLink;
}
