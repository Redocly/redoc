import * as React from 'react';
import { TypeFormat, TypePrefix } from '../../common-elements/fields';
import { SchemaModel } from '../../services';
import styled from '../../styled-components';
import { ConstraintsView } from './FieldContstraints';
import { Pattern } from './Pattern';

export function ArrayItemDetails({ schema }: { schema: SchemaModel }) {
  if (!schema || (schema.type === 'string' && !schema.constraints.length)) return null;

  return (
    <Wrapper>
      [ items
      {schema.displayFormat && <TypeFormat>{` <${schema.displayFormat}> `}</TypeFormat>}
      <ConstraintsView constraints={schema.constraints} />
      <Pattern schema={schema} />
      {schema.items && <ArrayItemDetails schema={schema.items} />} ]
    </Wrapper>
  );
}

const Wrapper = styled(TypePrefix)`
  margin: 0 5px;
  vertical-align: text-top;
`;
