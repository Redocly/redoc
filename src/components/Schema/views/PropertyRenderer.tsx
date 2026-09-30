import { memo } from 'react';

import type { ReactElement } from 'react';
import type { PropertyType } from '../../../types/schema.js';
import type { OneOfChangeParams } from '../../../types/pluggable.js';

import { Row, RecursiveLabel, SchemaTypeLabel } from '../styled.js';
import { ObjectRenderer } from './ObjectRenderer.js';
import { ArrayRenderer } from './ArrayRenderer.js';
import { SwitcherRenderer } from './SwitcherRenderer.js';
import { PrimitiveRenderer } from './PrimitiveRenderer.js';
import { SchemaTitleLabel } from './SchemaTitleLabel.js';

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
        <SchemaTypeLabel>{property.type}</SchemaTypeLabel>
        <SchemaTitleLabel title={property.title} schemaName={property.schemaName} />
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
