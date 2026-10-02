import { useCallback, useContext, useEffect, useMemo, type ReactElement } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type { PropertyType, SwitcherOptionType, SwitcherType } from '../../../types/schema.js';
import type { OneOfChangeParams } from '../../../types/pluggable.js';

import { SECTION_ATTR } from '../../../constants/openapi.js';
import {
  PropertyList,
  Row,
  OneOfWrapper,
  SwitcherWrapper,
  SwitcherBadge,
  PrimitiveOptionWrapper,
  SchemaTypeLabel,
  AccessLabel,
} from '../styled.js';
import { SchemaDescription } from '../SchemaDescription.js';
import { SchemaEnumValues } from './SchemaEnumValues.js';
import { SchemaEnumDescriptions } from './SchemaEnumDescriptions.js';
import { getSchemaEnumRowLabel } from '../utils.js';
import {
  itemStoreAtom,
  activeDiscriminatorSelectAtom,
  activeOneOfSelectAtom,
  buildVariantStateKey,
} from '../../../jotai/itemStore.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { isWithinExpansionLevel } from '../../../utils/expansion.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { SchemaTitleLabel } from './SchemaTitleLabel.js';
import { appendVariantSuffix, variantMarkersOnly } from '../../../utils/deep-link.js';
import { useVariantIndexFromHash } from '../hooks/useVariantIndexFromHash.js';
import { useUrlHashReassert } from '../../../hooks/useUrlHashReassert.js';
import { PropertyRenderer } from './PropertyRenderer.js';
import { PropertyFieldRow } from './PropertyFieldRow.js';
import { DiscriminatorPropertyRow } from './DiscriminatorPropertyRow.js';
import { SchemaVariantSelector } from './SchemaVariantSelector.js';
import { CollapsibleNestedFields } from './CollapsibleNestedFields.js';

function variantHashLevel(fieldParentsName: string[] | undefined, segment: 'oneof' | 'd'): number {
  if (!fieldParentsName?.length) return 1;
  const ancestorMarkers = fieldParentsName.join('').match(new RegExp(`${segment}=`, 'g'));
  return (ancestorMarkers?.length ?? 0) + 1;
}

function mergeDiscriminatorFallback(
  activeOptionProps: Record<string, PropertyType>,
  baseProps: Record<string, PropertyType>,
  discriminatorPropertyName: string | undefined,
): Record<string, PropertyType> {
  if (discriminatorPropertyName === undefined) return activeOptionProps;
  if (discriminatorPropertyName in activeOptionProps) return activeOptionProps;
  const fallbackProp = baseProps[discriminatorPropertyName];
  if (fallbackProp === undefined) return activeOptionProps;
  return { [discriminatorPropertyName]: fallbackProp, ...activeOptionProps };
}

type SwitcherRendererProps = {
  property: PropertyType;
  level: number;
  expandByDefault?: boolean;
  fieldParentsName?: string[];
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
};

export function SwitcherRenderer({
  property,
  level,
  expandByDefault,
  fieldParentsName,
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
}: SwitcherRendererProps): ReactElement {
  const switcher = property.switcher;
  if (!switcher) {
    return <></>;
  }

  if (switcher.type === 'oneOf') {
    return (
      <OneOfSwitcher
        property={property}
        switcher={switcher}
        level={level}
        expandByDefault={expandByDefault}
        fieldParentsName={fieldParentsName}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        onOneOfChange={onOneOfChange}
      />
    );
  }

  return (
    <DiscriminatorSwitcher
      property={property}
      switcher={switcher}
      level={level}
      expandByDefault={expandByDefault}
      fieldParentsName={fieldParentsName}
      skipReadOnly={skipReadOnly}
      skipWriteOnly={skipWriteOnly}
      onOneOfChange={onOneOfChange}
    />
  );
}

function OneOfSwitcher({
  property,
  switcher,
  level,
  expandByDefault,
  fieldParentsName,
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
}: {
  property: PropertyType;
  switcher: SwitcherType;
  level: number;
  expandByDefault?: boolean;
  fieldParentsName?: string[];
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
}): ReactElement {
  const itemId = useContext(ItemIdContext);
  const oneOfState = useAtomValue(useMemo(() => activeOneOfSelectAtom(itemId ?? ''), [itemId]));
  const setItemState = useSetAtom(itemStoreAtom(itemId ?? ''));
  const optionEntries = useMemo(() => Object.entries(switcher.options), [switcher.options]);

  const schemaKey = buildVariantStateKey(fieldParentsName, switcher.label);

  const reassert = useUrlHashReassert();
  const hashIdx = useVariantIndexFromHash(
    'oneof',
    optionEntries.length,
    variantHashLevel(fieldParentsName, 'oneof'),
  );
  const stateIdx = oneOfState[schemaKey];
  const activeIdx = stateIdx !== undefined ? stateIdx : hashIdx !== -1 ? hashIdx : 0;

  useEffect(() => {
    if (itemId && hashIdx !== -1) {
      setItemState((prev) => ({
        activeOneOf: { ...prev.activeOneOf, [schemaKey]: hashIdx },
      }));
    }
  }, [itemId, hashIdx, schemaKey, setItemState, reassert]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (itemId) {
        setItemState((prev) => ({
          activeOneOf: { ...prev.activeOneOf, [schemaKey]: idx },
        }));
      }
      if (switcher.jsonPointer !== undefined) {
        onOneOfChange?.({ pointer: switcher.jsonPointer, index: idx });
      }
    },
    [itemId, onOneOfChange, schemaKey, setItemState, switcher.jsonPointer],
  );

  const activeOption = optionEntries[activeIdx] ?? optionEntries[0];
  const opt = activeOption?.[1];
  const mergedProperty: PropertyType | null =
    opt && (opt.properties || opt.switcher || opt.items)
      ? {
          ...property,
          type: getMergedVariantType(property, opt),
          description: opt.description,
          switcher: opt.switcher,
          properties: opt.properties,
          items: opt.items,
        }
      : null;

  const variantParentsName = useMemo(
    () => appendVariantSuffix(fieldParentsName, `&oneof=${activeIdx}`),
    [fieldParentsName, activeIdx],
  );

  // A variant may carry only a nested switcher (e.g. a nullable oneOf whose
  // non-null branch is a discriminated oneOf). Discriminator variants must be
  // wrapped like object bodies — mirrors the direct-property rule in
  // PropertyFieldRow — otherwise their fields render flat at the parent level.
  const hasCollapsibleVariantBody =
    !!(
      mergedProperty?.properties ||
      mergedProperty?.items ||
      mergedProperty?.switcher?.type === 'discriminator'
    ) && level > 1;

  const variantBody = mergedProperty !== null && (
    <PropertyRenderer
      property={mergedProperty}
      level={level}
      expandByDefault={expandByDefault}
      fieldParentsName={variantParentsName}
      skipReadOnly={skipReadOnly}
      skipWriteOnly={skipWriteOnly}
      onOneOfChange={onOneOfChange}
    />
  );

  const variantFieldPath = useMemo(() => variantParentsName.join('/'), [variantParentsName]);

  const wrappedVariantBody =
    mergedProperty !== null && hasCollapsibleVariantBody ? (
      <CollapsibleNestedFields
        level={level - 1}
        expandByDefault={expandByDefault}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        property={mergedProperty}
        fieldPath={variantFieldPath}
      >
        {variantBody}
      </CollapsibleNestedFields>
    ) : (
      variantBody
    );

  return (
    <OneOfWrapper>
      <SwitcherWrapper {...{ [SECTION_ATTR]: 'switcher' }}>
        <SwitcherBadge>{switcher.label}</SwitcherBadge>
        <SchemaVariantSelector
          optionEntries={optionEntries}
          activeIndex={activeIdx}
          onChange={handleSelect}
          data-testid="one-of-schema"
        />
      </SwitcherWrapper>
      <SchemaDescription value={opt?.description || property.description} />
      {mergedProperty ? (
        wrappedVariantBody
      ) : activeOption?.[1] ? (
        <PrimitiveOptionRenderer option={activeOption[1]} label={activeOption[0]} />
      ) : null}
    </OneOfWrapper>
  );
}

function DiscriminatorSwitcher({
  property,
  switcher,
  level,
  expandByDefault,
  fieldParentsName = [],
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
}: {
  property: PropertyType;
  switcher: SwitcherType;
  level: number;
  expandByDefault?: boolean;
  fieldParentsName?: string[];
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
}): ReactElement {
  const itemId = useContext(ItemIdContext);
  const discState = useAtomValue(
    useMemo(() => activeDiscriminatorSelectAtom(itemId ?? ''), [itemId]),
  );
  const setItemState = useSetAtom(itemStoreAtom(itemId ?? ''));
  const optionEntries = useMemo(() => Object.entries(switcher.options), [switcher.options]);

  const hasParentPath = fieldParentsName?.length;
  const localPart = hasParentPath
    ? (switcher.propertyName ?? 'discriminator')
    : (switcher.propertyName ?? switcher.label);
  const schemaKey = buildVariantStateKey(fieldParentsName, localPart);

  const reassert = useUrlHashReassert();
  const hashIdx = useVariantIndexFromHash(
    'd',
    optionEntries.length,
    variantHashLevel(fieldParentsName, 'd'),
  );
  const stateIdx = discState[schemaKey];
  const activeIdx = stateIdx !== undefined ? stateIdx : hashIdx !== -1 ? hashIdx : 0;

  useEffect(() => {
    if (itemId && hashIdx !== -1) {
      setItemState((prev) => ({
        activeDiscriminator: { ...prev.activeDiscriminator, [schemaKey]: hashIdx },
      }));
    }
  }, [itemId, hashIdx, schemaKey, setItemState, reassert]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (itemId) {
        setItemState((prev) => ({
          activeDiscriminator: {
            ...prev.activeDiscriminator,
            [schemaKey]: idx,
          },
        }));
      }
      if (switcher.jsonPointer !== undefined) {
        onOneOfChange?.({ pointer: switcher.jsonPointer, index: idx });
      }
    },
    [itemId, onOneOfChange, schemaKey, setItemState, switcher.jsonPointer],
  );

  const activeOption = optionEntries[activeIdx] ?? optionEntries[0];
  const activeOptionProps = activeOption?.[1]?.properties ?? {};
  const baseProps = property.properties ?? {};
  const allProperties = mergeDiscriminatorFallback(
    activeOptionProps,
    baseProps,
    switcher.propertyName,
  );

  const { schemasExpansionLevel } = useAtomValue(globalOptionsAtom);
  const expand = expandByDefault ?? isWithinExpansionLevel(level, schemasExpansionLevel, 1);

  const variantParentsName = useMemo(
    () => appendVariantSuffix(fieldParentsName, `&d=${activeIdx}`),
    [fieldParentsName, activeIdx],
  );

  const entries = Object.entries(allProperties).filter(([, prop]) => {
    if (skipReadOnly && prop.accessMode === 'read-only') return false;
    if (skipWriteOnly && prop.accessMode === 'write-only') return false;
    return true;
  });

  return (
    <PropertyList>
      {entries.map(([name, prop], index) => {
        if (name === switcher.propertyName) {
          const mappingKeys = optionEntries.map(([k]) => k);
          return (
            <DiscriminatorPropertyRow
              key={name}
              fieldName={name}
              fieldParentsName={fieldParentsName}
              property={prop}
              isFirst={index === 0}
              mappingKeys={mappingKeys}
              optionEntries={optionEntries}
              activeIdx={activeIdx}
              onSelect={handleSelect}
            />
          );
        }

        return (
          <PropertyFieldRow
            key={name}
            name={name}
            property={prop}
            level={level}
            expandByDefault={expand}
            isFirst={index === 0}
            fieldParentsName={
              level > 1 ? variantParentsName : variantMarkersOnly(variantParentsName)
            }
            skipReadOnly={skipReadOnly}
            skipWriteOnly={skipWriteOnly}
            onOneOfChange={onOneOfChange}
          />
        );
      })}
    </PropertyList>
  );
}

function getMergedVariantType(property: PropertyType, opt: SwitcherOptionType): string {
  if (opt.properties && Object.keys(opt.properties).length > 0) {
    return 'object';
  }
  if (opt.items && opt.items.length > 0) {
    return 'array';
  }
  return property.type;
}

function PrimitiveOptionRenderer({
  option,
  label,
}: {
  option: SwitcherOptionType;
  label: string;
}): ReactElement {
  const typeLabel = option.typeLabel ?? label;

  // What to show in parens after the type label, so a named enum reads `string, (TimePluralUnit)`:
  // the variant's `title` or, for a `$ref`'d variant, the option key. This is display text only —
  // `option.schemaName` is the component-schema name that resolves the link target.
  const displayTitle = option.title || (label !== typeLabel ? label : undefined);

  const enumValues = option.enum;
  const enumDescriptions = enumValues && !Array.isArray(enumValues) ? enumValues : undefined;
  const enumArray = enumValues && Array.isArray(enumValues) ? enumValues : undefined;

  return (
    <PrimitiveOptionWrapper>
      {option.constraints && option.constraints.length > 0 && (
        <Row>
          {option.constraints.map((c) => (
            <SchemaTypeLabel key={c}>{c}</SchemaTypeLabel>
          ))}
        </Row>
      )}
      <Row>
        <SchemaTypeLabel>{typeLabel}</SchemaTypeLabel>
        <SchemaTitleLabel title={displayTitle} schemaName={option.schemaName} />

        {option.accessMode ? <AccessLabel>{option.accessMode}</AccessLabel> : null}
      </Row>
      {enumDescriptions ? (
        <SchemaEnumDescriptions values={enumDescriptions} type={typeLabel} />
      ) : enumArray && enumArray.length > 0 ? (
        <SchemaEnumValues
          label={getSchemaEnumRowLabel(typeLabel, enumArray.length)}
          values={enumArray}
        />
      ) : null}
    </PrimitiveOptionWrapper>
  );
}
