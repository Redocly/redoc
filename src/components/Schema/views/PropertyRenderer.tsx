import { memo } from 'react';

import type { ReactElement } from 'react';
import type { OneOfChangeParams, PropertyType } from '../../../types/schema.js';

import { Row, RecursiveLabel } from '../styled.js';
import { ObjectRenderer } from './ObjectRenderer.js';
import { ArrayRenderer } from './ArrayRenderer.js';
import { SwitcherRenderer } from './SwitcherRenderer.js';
import { PrimitiveRenderer } from './PrimitiveRenderer.js';
import { PropertyTypeLabel } from './PropertyTypeLabel.js';

export type PropertyRendererProps = {
  property: PropertyType;
  level: number;
  expandByDefault?: boolean;
  fieldParentsName?: string[];
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
};

function PropertyRendererComponent({
  property,
  level,
  expandByDefault,
  fieldParentsName,
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
}: PropertyRendererProps): ReactElement {
  if (property.isCircular) {
    return (
      <Row>
        <PropertyTypeLabel property={property} />
        <RecursiveLabel>Recursive</RecursiveLabel>
      </Row>
    );
  }

  if (property.switcher) {
    return (
      <SwitcherRenderer
        property={property}
        level={level}
        expandByDefault={expandByDefault}
        fieldParentsName={fieldParentsName}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        onOneOfChange={onOneOfChange}
      />
    );
  }

  if (property.properties) {
    return (
      <ObjectRenderer
        property={property}
        level={level}
        expandByDefault={expandByDefault}
        fieldParentsName={fieldParentsName}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        onOneOfChange={onOneOfChange}
      />
    );
  }

  if (property.items && property.items.length > 0) {
    return (
      <ArrayRenderer
        property={property}
        level={level}
        fieldParentsName={fieldParentsName}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        onOneOfChange={onOneOfChange}
      />
    );
  }

  return <PrimitiveRenderer property={property} />;
}

export const PropertyRenderer = memo(PropertyRendererComponent);

/** Whether `PropertyRenderer` prints `property.description` itself: primitives and oneOf/anyOf switchers do, objects, arrays and discriminators do not. */
export function printsOwnDescription(property: PropertyType): boolean {
  if (property.switcher) return property.switcher.type !== 'discriminator';
  return !property.properties && !property.items?.length;
}
