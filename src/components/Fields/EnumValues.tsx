import * as React from 'react';
import { ExampleValue, FieldLabel } from '../../common-elements/fields';

export interface EnumValuesProps {
  values: string[];
  type: string;
}

export class EnumValues extends React.PureComponent<EnumValuesProps> {
  render() {
    const { values, type } = this.props;
    if (!values.length) {
      return null;
    }

    return (
      <div>
        <FieldLabel>{type === 'array' ? 'Items' : ''} Enum:</FieldLabel>
        {values.map((value, idx) => (
          <ExampleValue key={idx}>{JSON.stringify(value)} </ExampleValue>
        ))}
      </div>
    );
  }
}
