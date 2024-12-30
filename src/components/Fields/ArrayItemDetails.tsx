import * as React from 'react';
import { TypeFormat, TypePrefix } from '../../common-elements/fields';
import { ConstraintsView } from './FieldConstraints';
import { Pattern } from './Pattern';
import { SchemaModel } from '../../services';
import styled from '../../styled-components';
import { OptionsContext } from '../OptionsProvider';

export function ArrayItemDetails({ schema }: { schema: SchemaModel }) {
  const { hideSchemaPattern } = React.useContext(OptionsContext);
  if (
    !schema ||
    ((!schema?.pattern || hideSchemaPattern) &&
      !schema.items &&
      !schema.displayFormat &&
      !schema.constraints?.length) // return null for cases where all constraints are empty
  ) {
    return null;
  }

  return (
    <Wrapper>
      [ items
      {schema.displayFormat && <TypeFormat> &lt;{schema.displayFormat} &gt;</TypeFormat>}
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
