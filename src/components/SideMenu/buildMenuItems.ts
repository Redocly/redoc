import type { ItemBadge } from '@redocly/config';
import type { ApiItem } from '../../types/store.js';
import type { TFunction } from '../../hooks/useTranslate.js';

import { resolveText } from '../../utils/resolveText.js';

export type MenuItemState = {
  type?: string;
  label?: string;
  link?: string;
  httpVerb?: string;
  isAdditionalOperation?: boolean;
  badges?: ItemBadge[];
  active: boolean;
  hasActiveSubItem: boolean;
  deprecated?: boolean;
  items: MenuItemState[];
  modified?: boolean;
  variant?: 'primary' | 'secondary';
  separatorLine?: boolean;
  linePosition?: 'top' | 'bottom';
  expanded?: string;
  icon?: string;
  srcSet?: string;
};

/** Stable shared empty array so leaf items share a ref-stable `items=[]`. */
const EMPTY_CHILDREN: MenuItemState[] = [];

/**
 * Converts API items into menu item states. The per-item `cache` returns the
 * previous `MenuItemState` reference when nothing changed for that row, so
 * the memoized `MenuItem` in `@redocly/theme` only re-renders rows whose
 * state actually flipped.
 */
export function buildMenuItems(
  items: ApiItem[],
  activePath: string,
  translate: TFunction,
  cache: WeakMap<ApiItem, MenuItemState>,
): MenuItemState[] {
  return items.map((item) => buildState(item, activePath, translate, cache));
}

function buildState(
  item: ApiItem,
  activePath: string,
  translate: TFunction,
  cache: WeakMap<ApiItem, MenuItemState>,
): MenuItemState {
  const prev = cache.get(item);

  const children = (item.items as ApiItem[] | undefined) ?? [];
  const childrenStates = children.length
    ? buildMenuItems(children, activePath, translate, cache)
    : EMPTY_CHILDREN;

  const link = normalizeSlashes(item.link ?? item.routeSlug);
  const decodedLink = link && decodeURIComponent(link);
  const active = !!decodedLink && (activePath === decodedLink || activePath === decodedLink + '/');
  const hasActiveSubItem = childrenStates.some((c) => c.active || c.hasActiveSubItem);
  const label = resolveText(translate, item.labelTranslationKey, item.label);

  // Every other field below derives solely from `item` (the cache key), so a
  // cached entry can only differ in the four values compared here.
  if (
    prev &&
    prev.active === active &&
    prev.hasActiveSubItem === hasActiveSubItem &&
    prev.label === label &&
    arrayRefEqual(prev.items, childrenStates)
  ) {
    return prev;
  }

  const state: MenuItemState = {
    type: item.type,
    label,
    link,
    httpVerb: 'httpVerb' in item ? (item.httpVerb as string | undefined) : undefined,
    isAdditionalOperation:
      'isAdditionalOperation' in item
        ? (item.isAdditionalOperation as boolean | undefined)
        : undefined,
    badges: 'badges' in item ? (item.badges as ItemBadge[] | undefined) : undefined,
    deprecated: 'deprecated' in item ? (item.deprecated as boolean | undefined) : undefined,
    separatorLine:
      'separatorLine' in item ? (item.separatorLine as boolean | undefined) : undefined,
    linePosition:
      'linePosition' in item ? (item.linePosition as MenuItemState['linePosition']) : undefined,
    expanded: 'expanded' in item ? (item.expanded as string | undefined) : undefined,
    icon: 'icon' in item ? (item.icon as string | undefined) : undefined,
    srcSet: 'srcSet' in item ? (item.srcSet as string | undefined) : undefined,
    variant: 'variant' in item ? (item.variant as MenuItemState['variant']) : undefined,
    active,
    hasActiveSubItem,
    modified: true,
    items: childrenStates,
  };

  cache.set(item, state);
  return state;
}

function arrayRefEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  return a === b || (a.length === b.length && a.every((value, i) => value === b[i]));
}

function normalizeSlashes(path: string | undefined): string | undefined {
  if (!path) return path;
  return path.replace(/\/{2,}/g, '/');
}
