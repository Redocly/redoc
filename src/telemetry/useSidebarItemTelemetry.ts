import { useCallback } from 'react';
import { useSetAtom } from 'jotai';

import type { MouseEvent } from 'react';
import type { EventPayload } from '@redocly/redoc-opentelemetry';

import { useTelemetry } from '../hooks/useTelemetry.js';
import { markNavigationCauseAtom } from '../jotai/telemetry.js';
import { RESOURCES } from './events.js';

type SidebarItemType = EventPayload<'com.redocly.sidebarItem.clicked'>[0]['type'];

type SidebarItemClick = { type: SidebarItemType; depth: number; navigates: boolean };

const MENU_ITEM = '[data-component-name="Menu/MenuItem"]';
const MENU_ITEM_LABEL = '[data-testid="menu-item-label"]';

export function sidebarItemFromTarget(target: Element): SidebarItemClick | null {
  const label = target.closest(MENU_ITEM_LABEL);
  const item = label?.closest(MENU_ITEM);
  if (!label || !item) return null;

  let depth = 0;
  for (
    let parent = item.parentElement?.closest(MENU_ITEM);
    parent;
    parent = parent.parentElement?.closest(MENU_ITEM)
  ) {
    depth += 1;
  }

  const type: SidebarItemType = item.classList.contains('menu-item-type-drilldown')
    ? 'drilldown'
    : item.classList.contains('menu-item-type-group')
      ? 'group'
      : 'link';

  return { type, depth, navigates: target.closest('a') !== null };
}

export function useSidebarItemTelemetry(): (event: MouseEvent<HTMLElement>) => void {
  const telemetry = useTelemetry();
  const markNavigationCause = useSetAtom(markNavigationCauseAtom);

  return useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const click = sidebarItemFromTarget(event.target as Element);
      if (!click) return;
      if (click.navigates) markNavigationCause('sidebar');
      telemetry.sendSidebarItemClickedMessage([
        {
          ...RESOURCES.sidebarItem,
          type: click.type,
          depth: click.depth,
        },
      ]);
    },
    [telemetry, markNavigationCause],
  );
}
