import * as React from 'react';
import { observer } from 'mobx-react';

import { RecursiveLabel, TypeName, TypeTitle } from '../../common-elements/fields';
import { l } from '../../services/Labels';
import type { SchemaProps } from '.';

export const RecursiveSchema = observer(({ schema }: SchemaProps) => {
  return (
    <div>
      <TypeName>{schema.displayType}</TypeName>
      {schema.title && <TypeTitle> {schema.title} </TypeTitle>}
      <RecursiveLabel> {l('recursive')} </RecursiveLabel>
    </div>
  );
});
