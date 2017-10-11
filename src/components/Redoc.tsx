import * as React from 'react';

import { ContentRoot } from './ContentRoot/ContentRoot';

import { ThemeProvider } from '../styled-components';
import defaultTheme from '../theme';

import LoadingWrap from './LoadingWrap/LoadingWrap';
import { StoreProvider } from './StoreProvider';
import { ErrorBoundary } from './ErrorBoundary';

export interface RedocProps {
  specUrl?: string;
  spec?: object;
  theme?: any;
  store?: any;
}

export class Redoc extends React.Component<RedocProps> {
  render() {
    return (
      <ErrorBoundary>
        <StoreProvider {...this.props}>
          <ThemeProvider theme={this.props.theme || defaultTheme}>
            <LoadingWrap>
              <ContentRoot />
            </LoadingWrap>
          </ThemeProvider>
        </StoreProvider>
      </ErrorBoundary>
    );
  }
}
