import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { PropertyType } from '../../../types/schema.js';
import type { OneOfChangeParams } from '../../../types/pluggable.js';

import {
  ArrayWrapper,
  ArrayLabel,
  ArrayClosingLabel,
  ArrayLabelValue,
  ArrayLine,
  SchemaTypeLabel,
  PropertyList,
} from '../styled.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { appendArraySuffix } from '../../../utils/deep-link.js';
import { isWithinExpansionLevel } from '../../../utils/expansion.js';
import { PropertyRenderer } from './PropertyRenderer.js';
import { ObjectRenderer } from './ObjectRenderer.js';
import { PropertyFieldRow } from './PropertyFieldRow.js';

type ArrayRendererProps = {
  property: PropertyType;
  level: number;
  fieldParentsName?: string[];
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
};

export function ArrayRenderer({
  property,
  level,
  fieldParentsName,
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
}: ArrayRendererProps): ReactElement {
  const { schemasExpansionLevel } = useAtomValue(globalOptionsAtom);
  const items = property.items;
  if (!items || items.length === 0) {
    return <SchemaTypeLabel>array</SchemaTypeLabel>;
  }
  // mirrors ObjectRenderer: item rows expand their nested content per the option
  const expandByDefault = isWithinExpansionLevel(level, schemasExpansionLevel, 1);

  const updatedParentsName = fieldParentsName && appendArraySuffix(fieldParentsName);
  const isFirstLevel = level === 1;
  const isTuple = items.some((item) => item.isTupleItem || item.isAdditionalItems);

  const firstItem = items[0];
  if (!isTuple && items.length === 1 && firstItem && firstItem.switcher) {
    const switcherContent = (
      <PropertyRenderer
        property={firstItem}
        level={level + 1}
        fieldParentsName={updatedParentsName}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        onOneOfChange={onOneOfChange}
      />
    );

    if (!isFirstLevel) {
      return switcherContent;
    }

    return (
      <ArrayWrapper>
        <ArrayLabel>
          <ArrayLabelValue>Array [</ArrayLabelValue>
          <ArrayLine />
        </ArrayLabel>
        {switcherContent}
        <ArrayClosingLabel className="array-closing-label">
          <ArrayLine />
          <ArrayLabelValue>]</ArrayLabelValue>
        </ArrayClosingLabel>
      </ArrayWrapper>
    );
  }

  if (!isTuple && items.length === 1 && firstItem && firstItem.properties) {
    const objectContent = (
      <ObjectRenderer
        property={firstItem}
        level={level}
        fieldParentsName={updatedParentsName}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        onOneOfChange={onOneOfChange}
      />
    );

    if (!isFirstLevel) {
      return objectContent;
    }

    return (
      <ArrayWrapper>
        <ArrayLabel>
          <ArrayLabelValue>Array [</ArrayLabelValue>
          <ArrayLine />
        </ArrayLabel>
        {objectContent}
        <ArrayClosingLabel className="array-closing-label">
          <ArrayLine />
          <ArrayLabelValue>]</ArrayLabelValue>
        </ArrayClosingLabel>
      </ArrayWrapper>
    );
  }

  // indexed item rows carry the array marker in their own name (`[0]`, `[i]`),
  // so the parents are kept without the `[]` suffix, e.g. `owners.[0]`
  if (isTuple || items.length > 1) {
    return (
      <PropertyList>
        {items.map((item, index) => (
          <PropertyFieldRow
            key={index}
            name={item.isAdditionalItems ? `[${index}...]` : `[${index}]`}
            property={item}
            level={level}
            expandByDefault={expandByDefault}
            isFirst={index === 0}
            fieldParentsName={fieldParentsName}
            skipReadOnly={skipReadOnly}
            skipWriteOnly={skipWriteOnly}
            onOneOfChange={onOneOfChange}
          />
        ))}
      </PropertyList>
    );
  }

  // a leaf items row, or a nested array whose own row (type, constraints,
  // description) must render before its collapsed content
  const isItemsRow = firstItem && !firstItem.switcher && !firstItem.properties;
  if (isItemsRow && !isFirstLevel) {
    return (
      <PropertyList>
        <PropertyFieldRow
          name="[i]"
          property={firstItem}
          level={level}
          expandByDefault={expandByDefault}
          isFirst
          fieldParentsName={fieldParentsName}
          skipReadOnly={skipReadOnly}
          skipWriteOnly={skipWriteOnly}
          onOneOfChange={onOneOfChange}
        />
      </PropertyList>
    );
  }

  return (
    <ArrayWrapper>
      <ArrayLabel>
        <ArrayLabelValue>Array [</ArrayLabelValue>
        <ArrayLine />
      </ArrayLabel>
      {items.map((item, index) => (
        <PropertyRenderer
          key={index}
          property={item}
          level={level + 1}
          fieldParentsName={updatedParentsName}
          skipReadOnly={skipReadOnly}
          skipWriteOnly={skipWriteOnly}
          onOneOfChange={onOneOfChange}
        />
      ))}
      <ArrayClosingLabel className="array-closing-label">
        <ArrayLine />
        <ArrayLabelValue>]</ArrayLabelValue>
      </ArrayClosingLabel>
    </ArrayWrapper>
  );
}
