import * as React from 'react';
import { ConstraintItem } from '../../common-elements/fields';

export interface ConstraintsViewProps {
  constraints: string[];
}

export class ConstraintsView extends React.PureComponent<ConstraintsViewProps> {
  render() {
    if (this.props.constraints.length === 0) {
      return null;
    }
    return (
      <span>
        {' '}
        {this.props.constraints.map(constraint => (
          <ConstraintItem key={constraint}> {constraint} </ConstraintItem>
        ))}
      </span>
    );
  }
}
