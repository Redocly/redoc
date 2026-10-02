import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

import type { ApiItem } from '../types/store.js';
import type { RouteItem, RouteIndex, TagWithItems } from '../utils/routing.js';

import { routeIndexAtom } from '../jotai/routes.js';
import { globalOptionsAtom } from '../jotai/store.js';
import { buildRouteIndex, collectRoutesRecursively } from '../utils/routing.js';
import { collectOverviewPartialSectionIds } from '../utils/overview-partial-sections.js';

type UseApiDocsRoutesResult = {
  routes: RouteItem[];
  routeIndex: RouteIndex;
};

export function useApiDocsRoutes(
  apiItems: ApiItem[],
  basePath: string = '/',
): UseApiDocsRoutesResult {
  const setRouteIndex = useSetAtom(routeIndexAtom);
  const partials = useAtomValue(globalOptionsAtom).markdocOptions?.partials;

  const { routes, routeIndex } = useMemo(() => {
    const allRoutes: RouteItem[] = [];
    const tagsWithItems: TagWithItems[] = [];
    const allTagsWithItems: TagWithItems[] = [];
    collectRoutesRecursively({
      apiItems,
      allRoutes,
      tagsWithItems,
      parentTag: null,
      allTagsWithItems,
    });

    const index = buildRouteIndex(allRoutes, tagsWithItems, basePath, allTagsWithItems);
    const overviewPartialSectionIds = collectOverviewPartialSectionIds(
      index.rootPage?.content,
      partials,
    );
    return { routes: allRoutes, routeIndex: { ...index, overviewPartialSectionIds } };
  }, [apiItems, basePath, partials]);

  // Publish to the atom for outside consumers (scroll-spy, sidebar).
  useEffect(() => {
    setRouteIndex(routeIndex);
  }, [routeIndex, setRouteIndex]);

  return { routes, routeIndex };
}
