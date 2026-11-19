import { encodeBackSlashes, safeSlugify } from './string.js';
import { joinWithSeparator } from './url.js';

export type UniqueSlugger = ((name: string, parentSlug?: string, key?: string) => string) & {
  moved: ReadonlyMap<string, string>;
};

type RoutedItem = { link?: string; previousRouteSlug?: string; items?: readonly RoutedItem[] };

const toSegment = (name: string): string => encodeBackSlashes(safeSlugify(name).toLowerCase());

export function createUniqueSlugger(knownNames: Iterable<string> = []): UniqueSlugger {
  const slugByKey = new Map<string, string>();
  const takenSlugs = new Set<string>();
  const moved = new Map<string, string>();
  const knownSegments = new Map(Array.from(knownNames, (name) => [name, toSegment(name)]));
  const reservedSegments = new Set(knownSegments.values());
  const nextDuplicate = new Map<string, number>();

  const slugger = (name: string, parentSlug = '', key = name): string => {
    const slugKey = `${parentSlug}\0${key}`;
    const assigned = slugByKey.get(slugKey);
    if (assigned !== undefined) return assigned;

    const segment = knownSegments.get(name) ?? toSegment(name);
    const baseSlug = joinWithSeparator(parentSlug, segment);
    let slug = baseSlug;
    let duplicate = nextDuplicate.get(baseSlug) ?? 1;
    while (takenSlugs.has(slug)) {
      if (!reservedSegments.has(`${segment}-${duplicate}`)) slug = `${baseSlug}-${duplicate}`;
      duplicate++;
    }
    nextDuplicate.set(baseSlug, duplicate);
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
