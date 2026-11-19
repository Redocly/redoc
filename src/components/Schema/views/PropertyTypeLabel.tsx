import type { ReactElement } from 'react';
import type { PropertyType } from '../../../types/schema.js';

import { SchemaTypeLabel } from '../styled.js';
import { SchemaTitleLabel } from './SchemaTitleLabel.js';

export function PropertyTypeLabel({ property }: { property: PropertyType }): ReactElement {
  return (
    <>
      <SchemaTypeLabel>{property.type}</SchemaTypeLabel>
      <SchemaTitleLabel title={property.title} schemaName={property.schemaName} />
    </>
  );
}
