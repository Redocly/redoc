import type { ApiItem, ApiItemContent } from '../../types/store.js';
import type { RouteItem, TagWithItems } from '../routing.js';

import { collectRoutesRecursively } from '../routing.js';

export const makeContent = (): ApiItemContent => ({
  contentType: 'item',
  children: [],
});

export const makeGroupContent = (): ApiItemContent => ({
  contentType: 'group',
  children: [],
});

export function makeLinkItem(
  link: string,
  label: string,
  content: ApiItemContent | null = makeContent(),
): ApiItem {
  return { type: 'link', link, label, routeSlug: link, content };
}

export function makeGroupItem(
  link: string,
  label: string,
  items: ApiItem[] = [],
  content: ApiItemContent | null = makeGroupContent(),
): ApiItem {
  return { type: 'group', link, label, routeSlug: link, items, content };
}

export function makeGroupWithoutLink(label: string, items: ApiItem[] = []): ApiItem {
  return { type: 'group', label, items, content: makeGroupContent() };
}

export function makeSeparatorItem(items: ApiItem[] = []): ApiItem {
  return { type: 'separator', label: 'Section', items, content: null };
}

export function makeRouteItem(path: string, label: string = path): RouteItem {
  return {
    path,
    label,
    content: makeContent(),
  };
}

export function makeTagWithItems(path: string, items: RouteItem[] = []): TagWithItems {
  return { tag: makeRouteItem(path), items };
}

export function runCollect(items: ApiItem[]): {
  allRoutes: RouteItem[];
  tagsWithItems: TagWithItems[];
  allTagsWithItems: TagWithItems[];
} {
  const allRoutes: RouteItem[] = [];
  const tagsWithItems: TagWithItems[] = [];
  const allTagsWithItems: TagWithItems[] = [];
  collectRoutesRecursively({
    apiItems: items,
    allRoutes,
    tagsWithItems,
    parentTag: null,
    allTagsWithItems,
  });
  return { allRoutes, tagsWithItems, allTagsWithItems };
}
