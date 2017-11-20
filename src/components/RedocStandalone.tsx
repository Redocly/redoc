import * as React from 'react';

import { ThemeInterface } from '../theme';

import { LoadingWrap } from './LoadingWrap/LoadingWrap';
import { StoreProvider } from './StoreProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { Redoc } from './Redoc/Redoc';

export interface RedocStandaloneProps {
  spec?: object;
  specUrl?: string;
  options?: {
    theme?: ThemeInterface;
  };
}

export class RedocStandalone extends React.Component<RedocStandaloneProps> {
  render() {
    const { spec, specUrl, options } = this.props;

    return (
      <ErrorBoundary>
        <StoreProvider spec={spec} specUrl={specUrl}>
          {({ loading, store }) => (
            <LoadingWrap loading={loading}>
              <Redoc store={store} options={options} />
            </LoadingWrap>
          )}
        </StoreProvider>
      </ErrorBoundary>
    );
  }
}
