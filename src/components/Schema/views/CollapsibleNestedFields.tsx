import { useContext, useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';

import type { ReactElement, ReactNode } from 'react';
import type { TFunction } from '../../../hooks/useTranslate.js';
import type { PropertyType } from '../../../types/schema.js';

import { LEVEL_COLORS } from '../utils.js';
import { ShowProperty, CircleIconSpan, NestedWrapper, StyledNested } from '../styled.js';
import { tryDecodeURIComponent } from '../../../utils/string.js';
import { stripArrayMarkers } from '../../../utils/deep-link.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { useSchemaFieldTelemetry } from '../../../telemetry/index.js';
import { useUrlHash } from '../../../hooks/useUrlHash.js';
import { useUrlHashReassert } from '../../../hooks/useUrlHashReassert.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { itemStoreAtom } from '../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { isWithinExpansionLevel, isRequiredAutoExpanded } from '../../../utils/expansion.js';
import {
  useSectionExpandBaseline,
  useSectionBaselineKey,
} from '../hooks/useSchemaFieldDeepLink.js';
import {
  useCollapsibleEntryKey,
  useRegisterCollapsibleEntry,
} from '../../../hooks/useExpandableSection.js';
import { LazyMount } from '../../common/LazyMount.js';

export const COLLAPSIBLE_NESTED_DEFAULT_FALLBACK = 0;

export function getCollapsibleNestedInitialExpanded(
  expandByDefault?: boolean,
  decorationLevel?: number,
  schemasExpansionLevel?: number,
  fallback = COLLAPSIBLE_NESTED_DEFAULT_FALLBACK,
): boolean {
  return Boolean(
    expandByDefault &&
    isWithinExpansionLevel(decorationLevel ?? 0, schemasExpansionLevel, fallback),
  );
}

export function useIsDeepLinkTarget(fieldPath: string | undefined): boolean {
  const hash = useUrlHash();
  return useMemo(() => {
    if (!fieldPath || !hash) return false;
    const decoded = tryDecodeURIComponent(hash.slice(1)).toLowerCase();
    const normalizedPath = fieldPath.toLowerCase();
    if (
      decoded.includes(`path=${normalizedPath}/`) ||
      decoded.includes(`path=${normalizedPath}&`) ||
      decoded.includes(`path=${normalizedPath}[]`)
    ) {
      return true;
    }

    // Legacy (openapi-docs) deep links support
    const strippedPath = stripArrayMarkers(normalizedPath);
    if (strippedPath === normalizedPath) return false;
    const strippedHash = stripArrayMarkers(decoded);
    return (
      strippedHash.includes(`path=${strippedPath}/`) ||
      strippedHash.includes(`path=${strippedPath}&`) ||
      strippedHash.endsWith(`&path=${strippedPath}`) ||
      strippedHash.endsWith(`/path=${strippedPath}`)
    );
  }, [fieldPath, hash]);
}

export type CollapsibleNestedFieldsProps = {
  /** Indent / circle color level (same as `PropertyFieldRow` row `level` for nested chrome). */
  level: number;
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  property: Pick<PropertyType, 'properties' | 'items' | 'switcher'>;
  children: ReactNode;
  fieldPath?: string;
  expandByDefault?: boolean;
  required?: boolean;
};

type NestedFieldCount = { count: number; isArray: boolean };

export function countNestedFields(
  property: Pick<PropertyType, 'properties' | 'items' | 'switcher'>,
  skipReadOnly?: boolean,
  skipWriteOnly?: boolean,
): NestedFieldCount | null {
  const countVisibleProperties = (props: Record<string, PropertyType>): number =>
    Object.values(props).filter((prop) => {
      if (skipReadOnly && prop.accessMode === 'read-only') return false;
      if (skipWriteOnly && prop.accessMode === 'write-only') return false;
      return true;
    }).length;

  if (property.switcher?.type === 'discriminator') {
    const firstOption = Object.values(property.switcher.options)[0];
    if (firstOption?.properties) {
      return { count: countVisibleProperties(firstOption.properties), isArray: false };
    }
  }

  if (property.properties) {
    return { count: countVisibleProperties(property.properties), isArray: false };
  }

  const firstItem = property.items?.length === 1 ? property.items[0] : undefined;
  const arrayItemProperties =
    firstItem?.properties ??
    (firstItem?.switcher ? Object.values(firstItem.switcher.options)[0]?.properties : undefined);

  if (arrayItemProperties) {
    return { count: countVisibleProperties(arrayItemProperties), isArray: true };
  }

  return null;
}

export function buildNestedFieldsLabel(
  property: Pick<PropertyType, 'properties' | 'items' | 'switcher'>,
  skipReadOnly?: boolean,
  skipWriteOnly?: boolean,
  translate?: TFunction,
): string {
  const show = translate ? translate('actions.show', 'Show') : 'Show';
  const nested = countNestedFields(property, skipReadOnly, skipWriteOnly);

  if (!nested) {
    return `${show} ${translate ? translate('details', 'details') : 'details'}`;
  }

  const { count, isArray } = nested;
  const keyword = count === 1 ? 'property' : 'properties';
  const keywordLabel = translate ? translate(keyword, keyword) : keyword;
  const parts = [show];

  if (count !== 1) parts.push(String(count));
  if (isArray) parts.push(translate ? translate('array', 'array') : 'array');

  parts.push(keywordLabel);

  return parts.join(' ');
}

const NESTED_ROW_HEIGHT = 40;

export function CollapsibleNestedFields({
  level,
  skipReadOnly,
  skipWriteOnly,
  property,
  children,
  fieldPath,
  expandByDefault,
  required,
}: CollapsibleNestedFieldsProps): ReactElement {
  const isDeepLinkTarget = useIsDeepLinkTarget(fieldPath);
  const reassert = useUrlHashReassert();
  const { schemasExpansionLevel } = useAtomValue(globalOptionsAtom);
  const itemId = useContext(ItemIdContext) ?? '';
  const sectionKey = useSectionBaselineKey();
  const baselineExpanded = useSectionExpandBaseline();
  const entryKey = useCollapsibleEntryKey(sectionKey);
  const setItemState = useSetAtom(itemStoreAtom(itemId));
  const stored = useAtomValue(
    useMemo(
      () =>
        selectAtom(itemStoreAtom(itemId), (s) => (entryKey ? s.collapsibles[entryKey] : undefined)),
      [itemId, entryKey],
    ),
  );
  const [userToggle, setUserToggle] = useState<boolean | undefined>(undefined);

  const isExpanded =
    (entryKey ? stored : userToggle) ??
    baselineExpanded ??
    (isDeepLinkTarget ||
      getCollapsibleNestedInitialExpanded(expandByDefault, level, schemasExpansionLevel) ||
      isRequiredAutoExpanded(level, required, schemasExpansionLevel));

  useRegisterCollapsibleEntry(entryKey, isExpanded);

  useEffect(() => {
    if (!isDeepLinkTarget) return;
    if (entryKey) {
      setItemState((curr) => ({ collapsibles: { ...curr.collapsibles, [entryKey]: true } }));
    } else {
      setUserToggle(true);
    }
  }, [isDeepLinkTarget, entryKey, setItemState, reassert]);

  const translate = useSpecTranslate();
  const reportToggle = useSchemaFieldTelemetry();
  const nestedLabel = useMemo(
    () => buildNestedFieldsLabel(property, skipReadOnly, skipWriteOnly, translate),
    [property, skipReadOnly, skipWriteOnly, translate],
  );
  const nested = useMemo(
    () => countNestedFields(property, skipReadOnly, skipWriteOnly),
    [property, skipReadOnly, skipWriteOnly],
  );
  const estimatedHeight = nested && nested.count > 0 ? nested.count * NESTED_ROW_HEIGHT : undefined;

  const toggleNested = (): void => {
    const expanded = !isExpanded;
    reportToggle({
      depth: level,
      expanded,
      kind: 'property',
      ...(nested ? { childCount: nested.count, isArray: nested.isArray } : {}),
    });
    if (entryKey) {
      setItemState((curr) => ({ collapsibles: { ...curr.collapsibles, [entryKey]: expanded } }));
    } else {
      setUserToggle(expanded);
    }
  };

  return (
    <NestedWrapper data-schema-nested-open={isExpanded ? 'true' : 'false'}>
      <ShowProperty type="button" onClick={toggleNested}>
        <CircleIcon sign={isExpanded ? '−' : '+'} level={level} expanded={isExpanded} />
        {isExpanded ? '' : nestedLabel}
      </ShowProperty>
      {isExpanded && (
        <StyledNested $level={level}>
          <LazyMount forceMount={isDeepLinkTarget} estimatedHeight={estimatedHeight}>
            {children}
          </LazyMount>
        </StyledNested>
      )}
    </NestedWrapper>
  );
}

function CircleIcon({
  sign,
  level = 0,
  expanded,
}: {
  sign: string;
  level?: number;
  expanded?: boolean;
}): ReactElement {
  const color = expanded ? LEVEL_COLORS[level % LEVEL_COLORS.length] : undefined;
  return <CircleIconSpan $color={color}>{sign}</CircleIconSpan>;
}
