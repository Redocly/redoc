import * as React from 'react';

import { Schema, SchemaProps } from './Schema';

import { ArrayClosingLabel, ArrayOpenningLabel } from '../../common-elements';
import styled from '../../styled-components';
import { humanizeConstraints } from "../../utils";
import { TypeTitle } from '../../common-elements/fields';

const PaddedSchema = styled.div`
  padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

export class ArraySchema extends React.PureComponent<SchemaProps> {
  render() {
    const schema = this.props.schema;
    const itemsSchema = schema.items;

    const minMaxItems = schema.minItems === undefined && schema.maxItems === undefined ?
      '' :
      `(${humanizeConstraints(schema)})`;

    if (schema.displayType && !itemsSchema && !minMaxItems.length) {
      return (<div>
        <TypeName>{schema.displayType}</TypeName>
      </div>);
    }

    return (
      <div>
        <ArrayOpenningLabel> Array ({minMaxItems})</ArrayOpenningLabel>
        {itemsSchema.schema.title && <TypeTitle> {itemsSchema.schema.title} </TypeTitle>}
        <PaddedSchema>
          <Schema {...this.props} schema={itemsSchema} />
        </PaddedSchema>
        <ArrayClosingLabel />
      </div>
    );
  }
}
