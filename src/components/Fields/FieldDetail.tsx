import { ExampleValue, FieldLabel } from '../../common-elements/fields';
import * as React from 'react';

export interface FieldDetailProps {
  value?: any;
  label: string;
}

export class FieldDetail extends React.PureComponent<FieldDetailProps> {
  render() {
    if (this.props.value === undefined) return null;
    return (
      <div>
        <FieldLabel> {this.props.label} </FieldLabel>{' '}
        <ExampleValue> {JSON.stringify(this.props.value)} </ExampleValue>
      </div>
    );
  }
}
