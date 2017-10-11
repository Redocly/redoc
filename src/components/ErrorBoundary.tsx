import * as React from 'react';
import { Children } from 'react';
import styled from '../styled-components';

const ErrorWrapper = styled.div`
  padding: 20px;
  color: red;
`;

export class ErrorBoundary extends React.Component<{}, { error?: Error }> {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error) {
    this.setState({ error: error });
    return false;
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorWrapper>
          <h1>Something went wrong.</h1>
          <small> {this.state.error.message} </small>
        </ErrorWrapper>
      );
    }
    return Children.only(this.props.children);
  }
}
