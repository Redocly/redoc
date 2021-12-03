import * as React from 'react';
import { ExampleValue, FieldLabel } from '../../common-elements/fields';

export interface FieldDetailProps {
  value?: any;
  label: string;
  raw?: boolean;
}

export class FieldDetail extends React.PureComponent<FieldDetailProps> {
  render() {
    if (this.props.value === undefined) {
      return null;
    }

    const value = this.props.raw ? String(this.props.value) : JSON.stringify(this.props.value);

    return (
      <div>
        <FieldLabel> {this.props.label} </FieldLabel> <ExampleValue>{value}</ExampleValue>
      </div>
    );
  }
}
