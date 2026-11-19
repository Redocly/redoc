import type { ReactElement } from 'react';
import type { PropertyType } from '../../../types/schema.js';

import { AccessLabel, DeprecatedBadge, PrimitiveWrapper, Row } from '../styled.js';
import { SchemaDescription } from '../SchemaDescription.js';
import { SchemaEnumValues } from './SchemaEnumValues.js';
import { SchemaEnumDescriptions } from './SchemaEnumDescriptions.js';
import { PropertyTypeLabel } from './PropertyTypeLabel.js';
import { Pattern } from './Pattern.js';
import { renderPropertyBadge } from '../../common/Badge.js';
import { splitBadgesByPosition } from '../../../utils/split-badges-by-position.js';

export function PrimitiveRenderer({ property }: { property: PropertyType }): ReactElement {
  const enumValues = property.enum;
  const enumDescriptions = enumValues && !Array.isArray(enumValues) ? enumValues : undefined;
  const enumArray = enumValues && Array.isArray(enumValues) ? enumValues : undefined;
  const { before: beforeBadges, after: afterBadges } = splitBadgesByPosition(property.badges);

  return (
    <PrimitiveWrapper>
      <Row>
        {beforeBadges.map(renderPropertyBadge)}
        <PropertyTypeLabel property={property} />
        {property.accessMode ? <AccessLabel>{property.accessMode}</AccessLabel> : null}
        {property.isDeprecated ? <DeprecatedBadge>deprecated</DeprecatedBadge> : null}
        <Pattern pattern={property.pattern} />
        {afterBadges.map(renderPropertyBadge)}
      </Row>
      <SchemaDescription value={property.description} />
      {enumDescriptions ? (
        <SchemaEnumDescriptions values={enumDescriptions} />
      ) : enumArray && enumArray.length > 0 ? (
        <SchemaEnumValues label="Enum:" values={enumArray} />
      ) : null}
    </PrimitiveWrapper>
  );
}
