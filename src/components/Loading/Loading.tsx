import * as React from 'react';
import styled from '../../styled-components';

import { Spinner } from './Spinner.svg';

const LoadingMessage = styled.div<{ color: string }>`
  font-family: helvetica, sans;
  width: 100%;
  text-align: center;
  font-size: 25px;
  margin: 30px 0 20px 0;
  color: ${props => props.color};
`;

export interface LoadingProps {
  color: string;
}

export class Loading extends React.PureComponent<LoadingProps> {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <LoadingMessage color={this.props.color}>Loading ...</LoadingMessage>
        <Spinner color={this.props.color} />
      </div>
    );
  }
}
