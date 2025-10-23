import { useMemo } from 'react';

import type { Location } from 'react-router-dom';
import type { IMenuItem } from '../../../services/index.js';
import type { ExtendedMenuItem } from '../types.js';

import { useActiveSectionId } from '@redocly/theme/core/openapi';

import { pathMatchedLink } from '../../../utils/index.js';
import { DEFAULT_WEBHOOKS_TAG_NAME } from '../../../constants.js';
import { joinWithSeparator } from '../../../services/history/helpers.js';
import { useLocation } from '../../../hooks/useLocation.js';

type UseMenuItemsInput = {
  items: IMenuItem[];
  routingBasePath?: string;
};

export function useMenuItems({ items, routingBasePath }: UseMenuItemsInput): ExtendedMenuItem[] {
  const location = useLocation();
  const activeItemId = useActiveSectionId(location, false, false);

  return useMemo(
    () => mapAndSetActiveItems(items, activeItemId, location, routingBasePath),
    [activeItemId, items, location, routingBasePath],
  );
}

function mapAndSetActiveItems(
  items: any[],
  activeItemId: string = '',
  location: Location,
  routingBasePath?: string,
): any[] {
  const newItems = [];

  convertOpenAPIDocs2Sidebar({
    contentItems: items,
    sidebarItems: newItems,
    activeItemId,
    location,
    routingBasePath,
  });

  return newItems;
}

function isItemActive(
  item: IMenuItem,
  activeItemId: string = '',
  location: Location,
  routingBasePath?: string,
): boolean {
  if (!item.href) return false;
  if (activeItemId && routingBasePath) {
    return joinWithSeparator(routingBasePath, item.id) === activeItemId;
  }

  if (activeItemId !== undefined && !routingBasePath) {
    return item.id === activeItemId;
  }

  return pathMatchedLink(location, item.href);
}

function isSubItemActive(
  item: IMenuItem,
  activeItemId: string = '',
  location: Location,
  routingBasePath?: string,
): boolean {
  const items = item.items || [];

  return items.some((i: IMenuItem) => {
    return (
      isItemActive(i, activeItemId, location, routingBasePath) ||
      isSubItemActive(i, activeItemId, location, routingBasePath)
    );
  });
}

function convertOpenAPIDocs2Sidebar(data: {
  contentItems: any[];
  sidebarItems: any[];
  activeItemId: string;
  location: Location;
  routingBasePath?: string;
}) {
  const { contentItems, sidebarItems, activeItemId, location, routingBasePath } = data;
  let addWebhookSeparator = true;
  for (const item of contentItems) {
    const active = isItemActive(item, activeItemId, location, routingBasePath);
    const hasActiveSubItem = isSubItemActive(item, activeItemId, location, routingBasePath);

    switch (item.type) {
      case 'group':
        sidebarItems.push({ type: 'separator', label: item.name, active, hasActiveSubItem });
        convertOpenAPIDocs2Sidebar({ ...data, contentItems: item.items, sidebarItems });
        break;
      case 'tag':
        const tagGroup: any = {
          type: 'group',
          label: item.name,
          items: [],
          link: item.href,
          active,
          hasActiveSubItem,
          modified: true,
        };
        sidebarItems.push(tagGroup);
        convertOpenAPIDocs2Sidebar({
          contentItems: item.items,
          sidebarItems: tagGroup.items || [],
          activeItemId,
          location,
          routingBasePath,
        });
        break;
      case 'operation':
      case 'schema':
      case 'mcp':
        if (
          item.isWebhook &&
          addWebhookSeparator &&
          item.parent.name !== DEFAULT_WEBHOOKS_TAG_NAME
        ) {
          sidebarItems.push({ type: 'separator', label: 'Webhooks', variant: 'secondary' });
          addWebhookSeparator = false;
        }
        sidebarItems.push({
          type: 'link',
          label: item.name,
          httpVerb: item.type == 'operation' ? item.httpVerb : item.type,
          link: item.href,
          badges: item.badges,
          active,
          hasActiveSubItem,
          modified: true,
          deprecated: item.deprecated,
        });
        break;
      case 'section':
        if (item.depth === -1) {
          continue;
        }
        const sectionItem = {
          type: item.items.length ? ('group' as const) : ('link' as const),
          label: item.name,
          link: item.href,
          items: [],
          active,
          hasActiveSubItem,
          modified: true,
        };
        sidebarItems.push(sectionItem);

        if (item.items.length) {
          convertOpenAPIDocs2Sidebar({
            contentItems: item.items,
            sidebarItems: sectionItem.items,
            activeItemId,
            location,
            routingBasePath,
          });
        }

        break;
    }
  }
}
