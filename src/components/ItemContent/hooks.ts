import { useContext, useEffect, useMemo, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type { ExampleEntry } from '../../types/store.js';

import {
  exampleStoreAtom,
  generatedExampleAtom,
  buildExampleAtomKey,
} from '../../jotai/examples.js';
import { convertSampleToString } from '../../services/code-samples/index.js';
import { isSequentialMediaType } from '../../utils/media-type.js';
import { schemaStoreAtom } from '../../jotai/schema.js';
import { mediaTypeOverrideAtom } from '../../jotai/app.js';
import { itemStoreAtom } from '../../jotai/itemStore.js';
import {
  buildOpenApiSectionSuffix,
  extractDeepLinkParamFromHash,
  hashIsForItem,
  hashIsInsideCallback,
  hashIsOutsideCallbacks,
  hashToElementId,
} from '../../utils/deep-link.js';
import { ItemIdContext, useCallbackScope, useDeepLinkUrl } from '../../hooks/useDeepLinkSection.js';
import { useUrlHash } from '../../hooks/useUrlHash.js';
import { useUrlHashReassert } from '../../hooks/useUrlHashReassert.js';
import { routingBasePathAtom } from '../../jotai/store.js';
import { toElementId } from '../../utils/url.js';

export function useExampleEntries(exampleIds: string[] | undefined): ExampleEntry[] {
  const store = useAtomValue(exampleStoreAtom);
  if (!exampleIds || exampleIds.length === 0) return [];
  return exampleIds.map((id) => store[id]).filter(Boolean);
}

export function useResolvedExamples(
  schemaId: string | undefined,
  exampleIds: string[] | undefined,
  context?: 'request' | 'response',
  mediaType?: string,
): unknown[] {
  const explicit = useExampleEntries(exampleIds);
  const itemId = useContext(ItemIdContext) ?? '';
  const normalizedMediaType = mediaType?.toLowerCase();
  const paramKey = schemaId ? buildExampleAtomKey(schemaId, context, mediaType, itemId) : '';
  const generated = useAtomValue(generatedExampleAtom(paramKey));
  const schemaStore = useAtomValue(schemaStoreAtom);

  if (explicit.length > 0) {
    if (normalizedMediaType && isSequentialMediaType(normalizedMediaType)) {
      const schemaData = schemaId ? schemaStore[schemaId]?.data : undefined;
      return explicit.map((e) =>
        typeof e.value === 'string'
          ? e.value
          : convertSampleToString(e.value, normalizedMediaType, schemaData),
      );
    }
    return explicit.map((e) => e.value);
  }

  if (generated !== undefined) {
    return [generated];
  }

  return [];
}

export function useResponseSectionDeepLink(
  activeCode: string,
  subSection: 'body' | 'headers',
): string {
  const suffix = useMemo(
    () => (activeCode ? buildOpenApiSectionSuffix('response', subSection, activeCode) : ''),
    [activeCode, subSection],
  );
  return useDeepLinkUrl(suffix);
}

export function useKeyFromHash(
  itemId: string | undefined,
  keys: string[] | undefined,
  key: 'c' | 'm' | 'ct' | 'ex',
): string | undefined {
  const hash = useUrlHash();
  const routingBasePath = useAtomValue(routingBasePathAtom);
  const callbackScope = useCallbackScope();

  return useMemo(() => {
    if (!itemId) return undefined;
    const hashId = hashToElementId(hash);
    const normalizedItemId = (toElementId(itemId, routingBasePath) ?? '').toLowerCase();
    if (!hashIsForItem(hashId, normalizedItemId)) return undefined;
    const inScope = callbackScope
      ? hashIsInsideCallback(hashId, normalizedItemId, callbackScope)
      : hashIsOutsideCallbacks(hashId, normalizedItemId);
    if (!inScope) return undefined;
    const extracted = extractDeepLinkParamFromHash(hash, key);
    if (!extracted) return undefined;

    // Hash values are lowercased; resolve back to the canonical key (e.g. "2XX") so strict equality holds downstream.
    return keys?.find((k) => k.toLowerCase() === extracted);
  }, [hash, itemId, keys, key, routingBasePath, callbackScope]);
}

/**
 * A `ct=` deep link selects the media type it targets; a later genuine user
 * pick clears the override (see `activeMediaTypeAtom`'s write). Leaving the
 * item clears it too, so the next page shows the reader's own preference.
 */
export function useMediaTypeFromHash(
  itemId: string | undefined,
  mediaTypes: string[] | undefined,
): void {
  const setMediaTypeOverride = useSetAtom(mediaTypeOverrideAtom);
  const ctFromUrl = useKeyFromHash(itemId, mediaTypes, 'ct');
  const reassert = useUrlHashReassert();
  const appliedRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (ctFromUrl) {
      setMediaTypeOverride(ctFromUrl);
      appliedRef.current = ctFromUrl;
    }
  }, [ctFromUrl, reassert, setMediaTypeOverride]);

  useEffect(
    () => () => {
      const applied = appliedRef.current;
      if (!applied) return;
      // Only undo this hook's own write; an authored embed override stays.
      setMediaTypeOverride((current) => (current === applied ? undefined : current));
    },
    [setMediaTypeOverride],
  );
}

/**
 * An `ex=` deep link selects the example it names in every panel of the item (they share
 * `activeExampleKey`); a later genuine pick replaces it. Keys are the spec's example map keys.
 */
export function useExampleKeyFromHash(
  itemId: string | undefined,
  exampleIds: string[] | undefined,
): void {
  const exampleStore = useAtomValue(exampleStoreAtom);
  const setItemState = useSetAtom(itemStoreAtom(itemId ?? ''));
  const keys = useMemo(
    () => (exampleIds ?? []).map((id) => exampleStore[id]?.key).filter((k): k is string => !!k),
    [exampleIds, exampleStore],
  );
  const keyFromUrl = useKeyFromHash(itemId, keys, 'ex');
  const reassert = useUrlHashReassert();

  useEffect(() => {
    if (keyFromUrl) {
      setItemState({ activeExampleKey: keyFromUrl });
    }
  }, [keyFromUrl, reassert, setItemState]);
}
