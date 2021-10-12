import * as React from 'react';
import { TypeFormat, TypeName, TypePrefix } from '../../common-elements/fields';
import { ConstraintsView } from './FieldContstraints';
import { Pattern } from './Pattern';
import { SchemaModel } from '../../services';
import styled from '../../styled-components';

export function ArrayItemDetails({ schema }: { schema: SchemaModel }) {
  if (!schema || schema.type === 'string' && !schema.constraints.length) return null;

  return (
    <ArrayItemDetailsStyled>
      <TypePrefix>{schema.typePrefix}</TypePrefix>
      <TypeName>{schema.displayType}</TypeName>
      {schema.displayFormat && (
        <TypeFormat>{` &lt;${schema.displayFormat}&gt; `}</TypeFormat>
      )}
      <ConstraintsView constraints={schema.constraints} />
      <Pattern schema={schema}/>
      {schema.items && <ArrayItemDetails schema={schema.items}/> }
    </ArrayItemDetailsStyled>
  );
}

 const ArrayItemDetailsStyled = styled.div`
  padding-left: 7px;
`;
