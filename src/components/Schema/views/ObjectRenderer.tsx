import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { PropertyType } from '../../../types/schema.js';
import type { OneOfChangeParams } from '../../../types/pluggable.js';

import { PropertyList, ConstraintsRow, ConstraintBadge } from '../styled.js';
import { variantMarkersOnly } from '../../../utils/deep-link.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { isWithinExpansionLevel } from '../../../utils/expansion.js';
import { PropertyFieldRow } from './PropertyFieldRow.js';

type ObjectRendererProps = {
  property: PropertyType;
  level: number;
  expandByDefault?: boolean;
  fieldParentsName?: string[];
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
};

function getConstraintParts(type: string): string[] {
  return type.split(/,\s*/).slice(1).filter(Boolean);
}

export function ObjectRenderer({
  property,
  level,
  expandByDefault,
  fieldParentsName,
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
}: ObjectRendererProps): ReactElement {
  const { schemasExpansionLevel } = useAtomValue(globalOptionsAtom);
  const properties = property.properties;
  if (!properties || Object.keys(properties).length === 0) {
    return <></>;
  }

  const expand = expandByDefault ?? isWithinExpansionLevel(level, schemasExpansionLevel, 1);
  const constraintParts = level <= 1 ? getConstraintParts(property.type) : [];
  const hasHeaderRow = constraintParts.length > 0;

  const entries = Object.entries(properties).filter(([, prop]) => {
    if (skipReadOnly && prop.accessMode === 'read-only') return false;
    if (skipWriteOnly && prop.accessMode === 'write-only') return false;
    return true;
  });

  return (
    <PropertyList>
      {hasHeaderRow && (
        <ConstraintsRow>
          {constraintParts.map((constraint) => (
            <ConstraintBadge key={constraint}>{constraint}</ConstraintBadge>
          ))}
        </ConstraintsRow>
      )}
      {entries.map(([name, prop], index) => (
        <PropertyFieldRow
          key={name}
          name={name}
          property={prop}
          level={level}
          expandByDefault={expand}
          isFirst={!hasHeaderRow && index === 0}
          fieldParentsName={level > 1 ? fieldParentsName : variantMarkersOnly(fieldParentsName)}
          skipReadOnly={skipReadOnly}
          skipWriteOnly={skipWriteOnly}
          onOneOfChange={onOneOfChange}
        />
      ))}
    </PropertyList>
  );
}
