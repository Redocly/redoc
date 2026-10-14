import { useCallback, useContext, useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import type {
  CallbackPayloadPanelItem,
  CodeSamplePanelItem,
  PayloadExamplesPanelItem,
} from '../../../types/content.js';
import type { VariantSection } from '../../../jotai/itemStore.js';
import {
  type SchemaVariantAxis,
  findSchemaVariantLeaves,
  resolveActiveVariantLeafIndex,
  declaresVariantAxis,
  samplesVariantThroughHost,
  withVariantPicks,
} from '../../../services/code-samples/discriminator.js';

import { schemaStoreAtom } from '../../../jotai/schema.js';
import { exampleStoreAtom } from '../../../jotai/examples.js';
import {
  activeDiscriminatorSelectAtom,
  activeOneOfSelectAtom,
  buildVariantStoreId,
  itemStoreAtom,
  itemStoreFieldAtom,
} from '../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { activeMediaTypeAtom } from '../../../jotai/app.js';
import { isSequentialMediaType } from '../../../utils/media-type.js';

export type SchemaVariantSelection = {
  options: { key: string; label: string }[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  kind: SchemaVariantAxis['kind'];
  optionMeta: Array<{ isDefaultMapping?: boolean; isDeprecated?: boolean }>;
};

export function useMediaTypeContent(
  node: PayloadExamplesPanelItem | CodeSamplePanelItem | CallbackPayloadPanelItem,
) {
  const [globalMediaType, setGlobalMediaType] = useAtom(activeMediaTypeAtom);
  const itemId = useContext(ItemIdContext) ?? '';
  const activeMessageKey = useAtomValue(
    useMemo(() => itemStoreFieldAtom({ itemId, key: 'activeMessageKey' }), [itemId]),
  );
  const mediaTypeSchemas = node.mediaTypeSchemas;
  // Filtered serializations only (SSR pruned restricted keys from mediaTypeSchemas).
  const mediaTypes = mediaTypeSchemas ? Object.keys(mediaTypeSchemas) : (node.mediaTypes ?? []);

  const activeMediaType =
    globalMediaType && mediaTypes.includes(globalMediaType) ? globalMediaType : mediaTypes[0];

  const activeContent = mediaTypeSchemas?.[activeMediaType ?? ''];
  const messagesByKey = 'messagesByKey' in node ? node.messagesByKey : undefined;
  const resolvedMessageKey =
    activeMessageKey || (messagesByKey ? Object.keys(messagesByKey)[0] : undefined);
  const activeMessageContent =
    messagesByKey && resolvedMessageKey ? messagesByKey[resolvedMessageKey] : undefined;
  const hasResolvedMessage = !!activeMessageContent;

  const effectiveSchemaId =
    activeContent?.schemaId ?? (hasResolvedMessage ? activeMessageContent.schemaId : node.schemaId);
  const exampleStore = useAtomValue(exampleStoreAtom);
  const rawExampleIds =
    activeContent?.exampleIds ??
    (hasResolvedMessage
      ? activeMessageContent?.exampleIds
      : 'exampleIds' in node
        ? node.exampleIds
        : undefined);

  const effectiveExampleIds = useMemo(
    () => rawExampleIds?.filter((id) => exampleStore[id] !== undefined),
    [rawExampleIds, exampleStore],
  );

  const onMediaTypeChange = useCallback(
    (mt: string) => setGlobalMediaType(mt),
    [setGlobalMediaType],
  );

  return {
    mediaTypes,
    activeMediaType,
    effectiveSchemaId,
    effectiveExampleIds,
    encoding: activeContent?.encoding,
    isMessageWithoutPayload:
      hasResolvedMessage && !effectiveSchemaId && !effectiveExampleIds?.length,
    onMediaTypeChange,
  };
}

export function useActiveVariantSchemaId(
  schemaId?: string,
  section?: VariantSection,
): string | undefined {
  const store = useAtomValue(schemaStoreAtom);
  const variantStoreId = buildVariantStoreId(useContext(ItemIdContext) ?? '', section);
  const discState = useAtomValue(
    useMemo(() => activeDiscriminatorSelectAtom(variantStoreId), [variantStoreId]),
  );
  const oneOfState = useAtomValue(
    useMemo(() => activeOneOfSelectAtom(variantStoreId), [variantStoreId]),
  );
  const leaves = useMemo(
    () => (schemaId ? findSchemaVariantLeaves(schemaId, store) : undefined),
    [schemaId, store],
  );

  const active = leaves?.[resolveActiveVariantLeafIndex(leaves, discState, oneOfState)];
  if (!active || !schemaId || !store[active.schemaId]) return schemaId;
  // The sampler store rewrites the host to the selected variant; the variant id alone loses the host keywords.
  const hostData = store[schemaId]?.data;
  const throughHost =
    active.picks.length > 1
      ? declaresVariantAxis(hostData)
      : samplesVariantThroughHost(hostData, store[active.schemaId].data);
  return throughHost ? schemaId : active.schemaId;
}

// Streaming media types fan a oneOf/anyOf body out into one chunk per variant; the body
// schema id is preserved so the streaming sampler can iterate all variants.
export function useBodySamplingSchemaId(
  schemaId: string | undefined,
  mediaType: string | undefined,
  section?: VariantSection,
): string | undefined {
  const isStreaming = isSequentialMediaType(mediaType);
  // Passing undefined short-circuits the variant resolution inside the hook; we still subscribe
  // to the underlying atoms (required by Rules of Hooks), but skip the schema-graph walk.
  const activeVariantSchemaId = useActiveVariantSchemaId(
    isStreaming ? undefined : schemaId,
    section,
  );
  return isStreaming ? schemaId : activeVariantSchemaId;
}

export function useSchemaVariantSelection(
  schemaId?: string,
  section?: VariantSection,
): SchemaVariantSelection | undefined {
  const store = useAtomValue(schemaStoreAtom);
  const itemId = useContext(ItemIdContext);
  const variantStoreId = buildVariantStoreId(itemId ?? '', section);
  const discState = useAtomValue(
    useMemo(() => activeDiscriminatorSelectAtom(variantStoreId), [variantStoreId]),
  );
  const oneOfState = useAtomValue(
    useMemo(() => activeOneOfSelectAtom(variantStoreId), [variantStoreId]),
  );
  const setItemState = useSetAtom(itemStoreAtom(variantStoreId));

  const leaves = useMemo(() => {
    if (!schemaId) return undefined;
    const resolved = findSchemaVariantLeaves(schemaId, store, { includeNested: true });
    if (!resolved || resolved.length < 2) return undefined;
    return resolved;
  }, [schemaId, store]);

  const onSelect = useCallback(
    (idx: number) => {
      const leaf = leaves?.[idx];
      if (!leaf || !itemId) return;
      setItemState((prev) => withVariantPicks(prev, leaf.picks));
    },
    [leaves, itemId, setItemState],
  );

  if (!leaves) return undefined;
  return {
    options: leaves.map((leaf) => ({ key: leaf.key, label: leaf.label })),
    activeIdx: resolveActiveVariantLeafIndex(leaves, discState, oneOfState),
    onSelect,
    kind: leaves[0].picks[0].axis.kind,
    optionMeta: leaves.map((leaf) => ({
      isDefaultMapping: leaf.isDefaultMapping,
      isDeprecated: leaf.isDeprecated,
    })),
  };
}
