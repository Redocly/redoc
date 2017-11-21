import * as React from 'react';

import { LoadingWrap } from './LoadingWrap/LoadingWrap';
import { StoreProvider } from './StoreProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { Redoc } from './Redoc/Redoc';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';

export interface RedocStandaloneProps {
  spec?: object;
  specUrl?: string;
  options?: RedocRawOptions;
}

export class RedocStandalone extends React.Component<RedocStandaloneProps> {
  static propTypes = {
    spec: (props, _, componentName) => {
      if (!props.spec && !props.specUrl) {
        return new Error(
          `One of props 'spec' or 'specUrlurl' was not specified in '${componentName}'.`,
        );
      }
      return null;
    },

    specUrl: (props, _, componentName) => {
      if (!props.spec && !props.specUrl) {
        return new Error(
          `One of props 'spec' or 'specUrl' was not specified in '${componentName}'.`,
        );
      }
      return null;
    },
  };

  render() {
    const { spec, specUrl, options } = this.props;

    return (
      <ErrorBoundary>
        <StoreProvider spec={spec} specUrl={specUrl} options={options}>
          {({ loading, store }) => (
            <LoadingWrap loading={loading}>
              <Redoc store={store} />
            </LoadingWrap>
          )}
        </StoreProvider>
      </ErrorBoundary>
    );
  }
}
