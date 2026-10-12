import { createContext, useContext, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { DeepLinkSectionData } from '../jotai/itemStore.js';

import { routingBasePathAtom } from '../jotai/store.js';
import {
  buildDeepLinkUrl,
  buildOpenApiSectionSuffix,
  CALLBACKS_SECTION,
} from '../utils/deep-link.js';
import { joinWithSeparator, toElementId, toRelativePath } from '../utils/url.js';
import { useNavigationUrlNormalizer } from './useNormalizeUrl.js';

export const ItemIdContext = createContext<string | undefined>(undefined);

/** Callback id of the enclosing callback panel, if any. */
export const CallbackScopeContext = createContext<string | undefined>(undefined);

export function useCallbackScope(): string | undefined {
  return useContext(CallbackScopeContext);
}

export function useHashItemId(): string {
  const itemId = useContext(ItemIdContext);
  const routingBasePath = useAtomValue(routingBasePathAtom);
  return useMemo(
    () => (itemId ? (toElementId(itemId, routingBasePath) ?? '').toLowerCase() : ''),
    [itemId, routingBasePath],
  );
}


/** Section data carried via context to the schema subtree. `id` is omitted —
 *  it comes from `ItemIdContext` separately. `null` means "no section". */
export type DeepLinkSectionValue = Omit<DeepLinkSectionData, 'id'>;

export const DeepLinkSectionContext = createContext<DeepLinkSectionValue | null>(null);

function useItemDeepLinkUrl(suffix: string, applyCallbackPrefix: boolean): string {
  const itemId = useContext(ItemIdContext);
  const callbackScope = useCallbackScope();
  const routingBasePath = useAtomValue(routingBasePathAtom);
  const normalizeUrl = useNavigationUrlNormalizer();
  return useMemo(() => {
    if (!itemId) return '';
    // `itemId` is a full URL path (it equals `route.path`, which includes
    // basePath)
    const slug = routingBasePath ? toRelativePath(itemId, routingBasePath) : itemId;
    const scopedSuffix =
      applyCallbackPrefix && callbackScope
        ? joinWithSeparator(buildOpenApiSectionSuffix(CALLBACKS_SECTION, callbackScope), suffix)
        : suffix;
    return normalizeUrl(buildDeepLinkUrl(routingBasePath, slug, scopedSuffix));
  }, [itemId, callbackScope, applyCallbackPrefix, routingBasePath, suffix, normalizeUrl]);
}

/** Build a normalized deep-link URL for a *section* of the current item, using its
 *  `ItemIdContext` and the given suffix. Inside a callback the suffix is prefixed with
 *  `callbacks/<callbackId>` so the section cannot collide with the parent operation's.
 *  Returns `''` when no item is in scope (e.g. rendered outside a page wrapper). */
export function useDeepLinkUrl(suffix: string): string {
  return useItemDeepLinkUrl(suffix, true);
}

export function useFieldDeepLinkUrl(suffix: string): string {
  return useItemDeepLinkUrl(suffix, false);
}
