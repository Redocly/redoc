import * as React from 'react';

import { Schema, SchemaProps } from './Schema';

import { ArrayClosingLabel, ArrayOpenningLabel } from '../../common-elements';
import styled from '../../styled-components';
import { humanizeConstraints } from '../../utils';
import { TypeName } from '../../common-elements/fields';
import { ObjectSchema } from './ObjectSchema';

const PaddedSchema = styled.div`
  padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

export class ArraySchema extends React.PureComponent<SchemaProps> {
  render() {
    const schema = this.props.schema;
    const itemsSchema = schema.items;
    const fieldParentsName = this.props.fieldParentsName;

    const minMaxItems =
      schema.minItems === undefined && schema.maxItems === undefined
        ? ''
        : `(${humanizeConstraints(schema)})`;

    const updatedParentsArray = fieldParentsName
      ? [...fieldParentsName.slice(0, -1), fieldParentsName[fieldParentsName.length - 1] + '[]']
      : fieldParentsName;
    if (schema.fields) {
      return (
        <ObjectSchema
          {...(this.props as any)}
          level={this.props.level}
          fieldParentsName={updatedParentsArray}
        />
      );
    }
    if (schema.displayType && !itemsSchema && !minMaxItems.length) {
      return (
        <div>
          <TypeName>{schema.displayType}</TypeName>
        </div>
      );
    }

    return (
      <div>
        <ArrayOpenningLabel> Array {minMaxItems}</ArrayOpenningLabel>
        <PaddedSchema>
          <Schema {...this.props} schema={itemsSchema} fieldParentsName={updatedParentsArray} />
        </PaddedSchema>
        <ArrayClosingLabel />
      </div>
    );
  }
}
