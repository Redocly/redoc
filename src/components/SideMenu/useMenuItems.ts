import { useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router';

import type { ApiItem } from '../../types/store.js';
import type { MenuItemState } from './buildMenuItems.js';

import { activeScrollSectionAtom } from '../../jotai/app.js';
import { routeIndexAtom } from '../../jotai/routes.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { tryDecodeURIComponent } from '../../utils/string.js';
import { resolveRouteByPathname } from '../../utils/routing.js';
import { buildMenuItems } from './buildMenuItems.js';

type UseMenuItemsInput = {
  items: ApiItem[];
};

/**
 * The active path drives both `active` (highlight) and `hasActiveSubItem`
 * (expansion): `activeScrollSection` (scroll-spy) with a fallback to the route
 * `location.pathname` resolves to. Scroll-spy updates the URL via `history.replaceState`, which
 * react-router doesn't observe — so `pathname` alone would freeze the
 * highlight on the last clicked item while the user scrolls.
 */
export function useMenuItems({ items }: UseMenuItemsInput): MenuItemState[] {
  const { pathname } = useLocation();
  const activeScrollSection = useAtomValue(activeScrollSectionAtom);
  const routeIndex = useAtomValue(routeIndexAtom);
  const translate = useSpecTranslate();
  const cacheRef = useRef<WeakMap<ApiItem, MenuItemState>>(new WeakMap());

  return useMemo(() => {
    const routePath = routeIndex && resolveRouteByPathname(routeIndex, pathname)?.path;
    const activePath = tryDecodeURIComponent(
      activeScrollSection ?? routePath ?? pathname,
    ).toLowerCase();
    return buildMenuItems(items, activePath, translate, cacheRef.current);
  }, [items, pathname, activeScrollSection, routeIndex, translate]);
}
