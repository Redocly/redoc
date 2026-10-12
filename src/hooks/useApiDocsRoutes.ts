import {
  useSetAtom,
} from 'jotai';
import { useEffect, useMemo } from 'react';

import type { ApiItem } from '../types/store.js';
import type { RouteItem, RouteIndex, TagWithItems } from '../utils/routing.js';

import { routeIndexAtom } from '../jotai/routes.js';
import { buildRouteIndex, collectRoutesRecursively } from '../utils/routing.js';

type UseApiDocsRoutesResult = {
  routes: RouteItem[];
  routeIndex: RouteIndex;
};

export function useApiDocsRoutes(
  apiItems: ApiItem[],
  basePath: string = '/',
): UseApiDocsRoutesResult {
  const setRouteIndex = useSetAtom(routeIndexAtom);

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
    return {
      routes: allRoutes,
      routeIndex: {
        ...index,
      },
    };
  }, [
    apiItems,
    basePath,
  ]);

  // Publish to the atom for outside consumers (scroll-spy, sidebar).
  useEffect(() => {
    setRouteIndex(routeIndex);
  }, [routeIndex, setRouteIndex]);

  return { routes, routeIndex };
}
