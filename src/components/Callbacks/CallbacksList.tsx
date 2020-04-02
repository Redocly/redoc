import * as React from 'react';

import { CallbackModel } from '../../services/models';
import styled from '../../styled-components';
import { CallbackOperation } from './CallbackOperation';

export interface CallbacksListProps {
  callbacks: CallbackModel[];
}

export class CallbacksList extends React.PureComponent<CallbacksListProps> {
  render() {
    const { callbacks } = this.props;

    if (!callbacks || callbacks.length === 0) {
      return null;
    }

    return (
      <div>
        <CallbacksHeader> Callbacks </CallbacksHeader>
        {callbacks.map(callback => {
          return callback.operations.map((operation, index) => {
            return (
              <CallbackOperation key={`${callback.name}_${index}`} callbackOperation={operation} />
            );
          });
        })}
      </div>
    );
  }
}

// TODO: get text color and font size from the theme?
const CallbacksHeader = styled.h3`
  font-size: 18px;
  padding: 0.2em 0;
  margin: 3em 0 1.1em;
  color: #253137;
  font-weight: normal;
`;
