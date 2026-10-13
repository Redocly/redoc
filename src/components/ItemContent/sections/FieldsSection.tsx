import { memo } from 'react';
import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';
import { SchemaView } from '../../Schema/SchemaView.js';

function FieldsSectionComponent({ node }: { node: ItemContentNode }): ReactElement {
  if (node.schemaId) {
    return <SchemaView schemaId={node.schemaId} expandByDefault />;
  }

  return <></>;
}

export const FieldsSection = memo(FieldsSectionComponent);
