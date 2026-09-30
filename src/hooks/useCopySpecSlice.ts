import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { RouteIndex, RouteItem } from '../utils/routing.js';
import type { SliceContentKind, SpecSliceScope } from '../services/spec-slice/index.js';

import { apiSpecType } from '../types/common.js';
import {
  definitionAtom,
  definitionUrlAtom,
  globalOptionsAtom,
  routingBasePathAtom,
  specTypeAtom,
} from '../jotai/store.js';
import { routeIndexAtom } from '../jotai/routes.js';
import { buildSpecSlice, resolveSpecSliceScope } from '../services/spec-slice/index.js';

type CopySpecSlice = {
  getText: () => Promise<string>;
  contentKind: SliceContentKind;
  scope: SpecSliceScope;
  specUrl?: string;
};

function findRouteBySlug(
  routeIndex: RouteIndex,
  pageSlug: string,
  basePath: string,
): RouteItem | undefined {
  const normalizedSlug = pageSlug.toLowerCase();
  const index =
    routeIndex.routeIndexByPath.get(pageSlug) ?? routeIndex.routeIndexByPath.get(normalizedSlug);

  if (index !== undefined) return routeIndex.allRoutes[index];

  return normalizedSlug === basePath.toLowerCase() ? routeIndex.rootPage : undefined;
}

export function useCopySpecSlice(pageSlug: string): CopySpecSlice | null {
  const definition = useAtomValue(definitionAtom);
  const definitionUrl = useAtomValue(definitionUrlAtom);
  const { downloadUrls } = useAtomValue(globalOptionsAtom);
  const routeIndex = useAtomValue(routeIndexAtom);
  const specType = useAtomValue(specTypeAtom);
  const basePath = useAtomValue(routingBasePathAtom);

  return useMemo(() => {
    if (!definition || !routeIndex) return null;

    const route = findRouteBySlug(routeIndex, pageSlug, basePath ?? '');
    const groupMemberContents = route
      ? routeIndex.tagByPath.get(route.path)?.items.map((item) => item.content)
      : undefined;
    const scope = resolveSpecSliceScope(
      specType,
      route?.content,
      route?.label,
      groupMemberContents,
    );

    if (!scope) return null;

    const contentKind: SliceContentKind = specType === apiSpecType.GRAPHQL ? 'graphql' : 'yaml';

    const getText = async () => {
      const text = await buildSpecSlice(specType, definition, scope);
      if (text === undefined) {
        throw new Error(`Copy for LLM: no content produced for "${pageSlug}"`);
      }
      return text;
    };

    return { getText, contentKind, scope, specUrl: definitionUrl ?? downloadUrls?.[0]?.url };
  }, [definition, definitionUrl, downloadUrls, routeIndex, specType, basePath, pageSlug]);
}
