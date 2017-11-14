import * as React from 'react';
import { Children } from 'react';
import styled from '../../styled-components';

import { Spinner } from './Spinner.svg';

const LoadingMessage = styled.div`
  font-family: ${props => props.theme.baseFont.family};
  width: 100%;
  text-align: center;
  font-size: 25px;
  margin: 30px 0 20px 0;
  color: ${props => props.theme.colors.main};
`;

export class LoadingWrap extends React.Component<{ loading: boolean }> {
  render() {
    if (this.props.loading) {
      return Children.only(this.props.children);
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <LoadingMessage>Loading ...</LoadingMessage>
        <Spinner />
      </div>
    );
  }
}
