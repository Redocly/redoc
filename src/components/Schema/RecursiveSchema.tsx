import { memo } from 'react';

import type { ReactElement } from 'react';
import type { SchemaProps } from './types.js';

import { RecursiveLabel, TypeName, TypeTitle } from '../common/index.js';
import { useTranslate } from '../../hooks/index.js';

function RecursiveSchemaComponent({ schema }: SchemaProps): ReactElement {
  const translate = useTranslate();
  return (
    <div>
      <TypeName>{schema.displayType}</TypeName>
      {schema.title && <TypeTitle> {schema.title} </TypeTitle>}
      <RecursiveLabel> {translate('openapi.recursive', 'Recursive')} </RecursiveLabel>
    </div>
  );
}

export const RecursiveSchema = memo<SchemaProps>(RecursiveSchemaComponent);
