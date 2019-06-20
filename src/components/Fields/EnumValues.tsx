import * as React from 'react';
import { ExampleValue, FieldLabel } from '../../common-elements/fields';

import { l } from '../../services/Labels';

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
        <FieldLabel>
          {type === 'array' ? l('enumArray') : ''}{' '}
          {values.length === 1 ? l('enumSingleValue') : l('enum')}:
        </FieldLabel>
        {values.map((value, idx) => (
          <React.Fragment key={idx}>
            <ExampleValue>{JSON.stringify(value)}</ExampleValue>{' '}
          </React.Fragment>
        ))}
      </div>
    );
  }
}
