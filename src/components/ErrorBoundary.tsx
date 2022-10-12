import * as React from 'react';
import styled from '../styled-components';

const ErrorWrapper = styled.div`
  padding: 20px;
  color: red;
`;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<unknown>,
  { error?: Error }
> {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error) {
    this.setState({ error });
    return false;
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorWrapper>
          <h1>Something went wrong...</h1>
          <small> {this.state.error.message} </small>
          <p>
            <details>
              <summary>Stack trace</summary>
              <pre>{this.state.error.stack}</pre>
            </details>
          </p>
          <small> ReDoc Version: {__REDOC_VERSION__}</small> <br />
          <small> Commit: {__REDOC_REVISION__}</small>
        </ErrorWrapper>
      );
    }
    return <React.Fragment>{React.Children.only(this.props.children)}</React.Fragment>;
  }
}
