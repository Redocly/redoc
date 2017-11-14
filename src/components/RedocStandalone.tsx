import * as React from 'react';

import { ThemeInterface } from '../theme';

import { LoadingWrap } from './LoadingWrap/LoadingWrap';
import { StoreProvider } from './StoreProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { Redoc } from './Redoc/Redoc';

export interface RedocProps {
  specOrSpecUrl: string | object;
  options?: {
    theme?: ThemeInterface;
  };
}

export class RedocStandalone extends React.Component<RedocProps> {
  render() {
    const { specOrSpecUrl, options } = this.props;
    let specUrl;
    let spec;

    if (typeof specOrSpecUrl === 'string') {
      specUrl = specOrSpecUrl;
    } else if (typeof specOrSpecUrl === 'object') {
      spec = specOrSpecUrl;
    }

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
