import { encodeBackSlashes, safeSlugify } from './string.js';
import { joinWithSeparator } from './url.js';

export type UniqueSlugger = ((name: string, parentSlug?: string, key?: string) => string) & {
  moved: ReadonlyMap<string, string>;
};

type RoutedItem = { link?: string; previousRouteSlug?: string; items?: readonly RoutedItem[] };

export function createUniqueSlugger(): UniqueSlugger {
  const slugByKey = new Map<string, string>();
  const takenSlugs = new Set<string>();
  const moved = new Map<string, string>();

  const slugger = (name: string, parentSlug = '', key = name): string => {
    const slugKey = `${parentSlug}\0${key}`;
    const assigned = slugByKey.get(slugKey);
    if (assigned !== undefined) return assigned;

    const baseSlug = joinWithSeparator(
      parentSlug,
      encodeBackSlashes(safeSlugify(name).toLowerCase()),
    );
    let slug = baseSlug;
    for (let duplicate = 1; takenSlugs.has(slug); duplicate++) {
      slug = `${baseSlug}-${duplicate}`;
    }
    if (slug !== baseSlug) moved.set(slug, baseSlug);
    takenSlugs.add(slug);
    slugByKey.set(slugKey, slug);
    return slug;
  };

  return Object.assign(slugger, { moved });
}

export function keepPreviousRoutes(
  items: readonly RoutedItem[],
  moved: ReadonlyMap<string, string>,
): void {
  if (moved.size === 0) return;
  const longestFirst = [...moved].sort(([a], [b]) => b.length - a.length);

  const visit = (list: readonly RoutedItem[]): void => {
    for (const item of list) {
      const current = item.previousRouteSlug ?? item.link;
      let route = current;
      for (const [slug, plainSlug] of longestFirst) {
        if (route?.startsWith(`${slug}/`)) route = plainSlug + route.slice(slug.length);
      }
      if (route !== current) item.previousRouteSlug = route;
      if (item.items) visit(item.items);
    }
  };
  visit(items);
}
