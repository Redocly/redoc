import * as React from 'react';

import { SchemaProps, Schema } from './Schema';

import { ArrayOpenningLabel, ArrayClosingLabel } from '../../common-elements';

export class ArraySchema extends React.PureComponent<SchemaProps> {
  render() {
    const itemsSchema = this.props.schema.items!;
    return (
      <div>
        <ArrayOpenningLabel> Array </ArrayOpenningLabel>
        <Schema schema={itemsSchema} />
        <ArrayClosingLabel />
      </div>
    );
  }
}
