import { useContext, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';

import type { ContentNode, ItemContentNode } from '../../types/content.js';

import { nodeTypes } from '../../types/common.js';
import { ItemIdContext } from '../../hooks/useDeepLinkSection.js';
import {
  collapsibleEntrySection,
  expandableSectionKeysAtom,
  itemStoreAtom,
} from '../../jotai/itemStore.js';

const HEADER_SUFFIX_ALIASES: Record<string, string> = { responses: 'response' };

export function matchesHeaderSuffix(deepLinkKey: string, headerSuffix: string): boolean {
  if (!deepLinkKey || !headerSuffix) return false;
  const target = HEADER_SUFFIX_ALIASES[headerSuffix] ?? headerSuffix;
  return deepLinkKey.split('&').some((segment) => {
    const eq = segment.indexOf('=');
    const value = eq === -1 ? segment : segment.slice(eq + 1);
    return value === target;
  });
}

export function useHeaderExpandableKeys(deepLinkSuffix?: string): string[] {
  const itemId = useContext(ItemIdContext) ?? '';
  const keys = useAtomValue(expandableSectionKeysAtom(itemId));
  return useMemo(() => {
    if (!deepLinkSuffix) return [];
    return keys.filter((key) => matchesHeaderSuffix(key, deepLinkSuffix));
  }, [keys, deepLinkSuffix]);
}

export function useHeaderHasRenderedCollapsibles(deepLinkSuffix?: string): boolean {
  const itemId = useContext(ItemIdContext) ?? '';
  return useAtomValue(
    useMemo(
      () =>
        selectAtom(
          itemStoreAtom(itemId),
          (s) =>
            !!deepLinkSuffix &&
            Object.keys(s.collapsibles).some((key) =>
              matchesHeaderSuffix(collapsibleEntrySection(key), deepLinkSuffix),
            ),
        ),
      [itemId, deepLinkSuffix],
    ),
  );
}

export function useResponseCodes(
  parentNode: ContentNode | undefined,
  deepLinkSuffix?: string,
): string[] | undefined {
  return useMemo(() => {
    if (deepLinkSuffix !== 'responses' || parentNode?.nodeType !== nodeTypes.CONTAINER) {
      return undefined;
    }
    const responsesItem = parentNode.children.find(
      (child): child is ItemContentNode =>
        child.nodeType === nodeTypes.ITEM && child.variant === 'responses',
    );
    return responsesItem?.responses?.map((response) => response.code);
  }, [parentNode, deepLinkSuffix]);
}
