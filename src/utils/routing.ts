import type { ApiItem, ApiItemContent } from '../types/store.js';
import type { BadgeData } from '../types/common.js';

import { contentType } from '../types/common.js';
import { tryDecodeURIComponent } from './string.js';

export type RouteItem = {
  path: string;
  label: string;
  content: ApiItemContent;
  badges?: BadgeData[];
  deprecated?: boolean;
  eager?: boolean;
};

export type TagWithItems = {
  tag: RouteItem;
  items: RouteItem[];
};

export type RouteIndex = {
  allRoutes: RouteItem[];
  tagByPath: Map<string, TagWithItems>;
  itemToParentTag: Map<string, TagWithItems>;
  routeIndexByPath: Map<string, number>;
  rootPage: RouteItem | undefined;
  tags: RouteItem[];
  /** Ids of overview headings rendered from partials; they have no route of their own. */
  overviewPartialSectionIds?: ReadonlySet<string>;
};

type CollectRoutesParams = {
  apiItems: ApiItem[];
  allRoutes: RouteItem[];
  tagsWithItems: TagWithItems[];
  parentTag: TagWithItems | null;
  allTagsWithItems?: TagWithItems[];
};

export function buildRouteIndex(
  allRoutes: RouteItem[],
  tagsWithItems: TagWithItems[],
  _basePath: string,
  allTagsWithItems?: TagWithItems[],
): RouteIndex {
  const tagByPath = new Map<string, TagWithItems>();
  const itemToParentTag = new Map<string, TagWithItems>();
  const routeIndexByPath = new Map<string, number>();

  const allTags = allTagsWithItems ?? tagsWithItems;
  for (const tagData of allTags) {
    tagByPath.set(tagData.tag.path, tagData);
    for (const item of tagData.items) {
      itemToParentTag.set(item.path, tagData);
    }
  }

  for (let i = 0; i < allRoutes.length; i++) {
    const route = allRoutes[i];

    routeIndexByPath.set(route.path, i);
    const decoded = tryDecodeURIComponent(route.path);
    if (decoded !== route.path) {
      routeIndexByPath.set(decoded, i);
    }
  }

  return {
    allRoutes,
    tagByPath,
    itemToParentTag,
    routeIndexByPath,
    rootPage: allRoutes[0],
    tags: tagsWithItems.map((t) => t.tag),
  };
}

const INDEX_DOCUMENT_RE = /\/index(\.(ya?ml|json|graphql|gql))?$/;

export function resolveRouteByPathname(
  routeIndex: RouteIndex,
  pathname: string,
): RouteItem | undefined {
  const normalized = tryDecodeURIComponent(pathname || '/').toLowerCase();

  const index = routeIndex.routeIndexByPath.get(normalized);
  if (index !== undefined) return routeIndex.allRoutes[index];

  const withoutIndex = normalized.replace(INDEX_DOCUMENT_RE, '');
  if (withoutIndex !== normalized) {
    const indexFallback = routeIndex.routeIndexByPath.get(withoutIndex || '/');
    if (indexFallback !== undefined) return routeIndex.allRoutes[indexFallback];
  }

  if (normalized === '/') return routeIndex.allRoutes[0];
  return undefined;
}

export function collectRoutesRecursively({
  apiItems,
  allRoutes,
  tagsWithItems,
  parentTag,
  allTagsWithItems,
}: CollectRoutesParams): void {
  for (const item of apiItems) {
    if (item.type === 'link' && item.link) {
      const routeItem = toRouteItem(item);
      allRoutes.push(routeItem);
      if (parentTag) {
        parentTag.items.push(routeItem);
      }
      continue;
    }

    if (item.type === 'group') {
      if (item.link) {
        const tagRoute = toRouteItem(item);
        allRoutes.push(tagRoute);
        const tagData: TagWithItems = { tag: tagRoute, items: [] };

        if (parentTag) {
          parentTag.items.push(tagRoute);
        } else if (tagData.tag.content !== null) {
          tagsWithItems.push(tagData);
        }

        // Register in allTagsWithItems so nested sub-group items are mapped
        if (allTagsWithItems) {
          allTagsWithItems.push(tagData);
        }

        if (item.items) {
          collectRoutesRecursively({
            apiItems: item.items as ApiItem[],
            allRoutes,
            tagsWithItems,
            parentTag: tagData,
            allTagsWithItems,
          });
        }
      } else if (item.items) {
        collectRoutesRecursively({
          apiItems: item.items as ApiItem[],
          allRoutes,
          tagsWithItems,
          parentTag,
          allTagsWithItems,
        });
      }
      continue;
    }

    if (item.type === 'separator' && item.items) {
      collectRoutesRecursively({
        apiItems: item.items as ApiItem[],
        allRoutes,
        tagsWithItems,
        parentTag,
        allTagsWithItems,
      });
    }
  }
}

function toRouteItem(item: ApiItem): RouteItem {
  const path = tryDecodeURIComponent(item.routeSlug ?? item.link ?? '').toLowerCase();
  const badges = 'badges' in item ? (item.badges as BadgeData[] | undefined) : undefined;
  const deprecated = 'deprecated' in item ? (item.deprecated as boolean | undefined) : undefined;
  return {
    path,
    label: item.label ?? '',
    content: item.content as ApiItemContent,
    badges,
    deprecated,
  };
}

export type FlatDescendant = RouteItem & {
  /** Path of the hub whose open state gates this descendant's render. For
   *  items under a GROUP sub-tag this is the sub-tag itself; items under a
   *  non-GROUP sub-tag (an AsyncAPI channel) inherit the channel's own gate,
   *  so a channel's operations render whenever the channel does. */
  gatePath: string;
};

export type TopLevelEntry = {
  sectionId: string;
  content: NonNullable<RouteItem['content']>;
  path: string;
  /** Descendants flattened (tag's direct items + any nested sub-tags + their items, in source order). */
  children: FlatDescendant[];
};

export function buildTopLevelEntries(routeIndex: RouteIndex): TopLevelEntry[] {
  const entries: TopLevelEntry[] = [];
  for (const route of routeIndex.allRoutes) {
    // Section pointers live inside the root page's overview, not as their own section.
    if (route.content === null) continue;
    // Children of tags get rendered inside their owning top-level tag's LazySection.
    if (routeIndex.itemToParentTag.has(route.path)) continue;

    const tagData = routeIndex.tagByPath.get(route.path);
    const children = tagData ? flattenTagDescendants(tagData, routeIndex.tagByPath) : [];

    entries.push({
      sectionId: route.path,
      content: route.content,
      path: route.path,
      children,
    });
  }
  return entries;
}

function flattenTagDescendants(
  tag: TagWithItems,
  tagByPath: Map<string, TagWithItems>,
  gatePath: string = tag.tag.path,
): FlatDescendant[] {
  const result: FlatDescendant[] = [];
  for (const item of tag.items) {
    result.push({ ...item, gatePath });
    const subTag = tagByPath.get(item.path);
    if (subTag) {
      const subGatePath =
        subTag.tag.content?.contentType === contentType.ITEM ? gatePath : subTag.tag.path;
      result.push(...flattenTagDescendants(subTag, tagByPath, subGatePath));
    }
  }
  return result;
}

export function buildEagerSlugs(
  activeRoute: RouteItem | undefined,
  routeIndex: RouteIndex,
): Set<string> {
  const set = new Set<string>();
  if (!activeRoute) return set;

  // Section pointer routes (no body of their own) live inside the root
  // page's overview — eager-mount the root page.
  if (activeRoute.content === null && routeIndex.rootPage) {
    set.add(routeIndex.rootPage.path);
    return set;
  }

  // Eager-mount the active route so `useApiDocsScroll` finds real content
  // (not a placeholder) when it `scrollIntoView`s.
  set.add(activeRoute.path);

  // When the active route IS a tag, also mount its first renderable child
  // so the user sees content inside the tag instead of just a header.
  const activeTagData = routeIndex.tagByPath.get(activeRoute.path);
  if (activeTagData) {
    const firstChild = activeTagData.items.find((item) => item.content !== null);
    if (firstChild) {
      set.add(firstChild.path);
    }
  }

  return set;
}
