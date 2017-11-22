import * as React from 'react';

import { Loading } from './Loading/Loading';
import { StoreProvider } from './StoreProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { Redoc } from './Redoc/Redoc';
import { RedocNormalizedOptions, RedocRawOptions } from '../services/RedocNormalizedOptions';

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
    const { spec, specUrl, options = {} } = this.props;
    const hideLoading = options.hideLoading !== undefined;

    const normalizedOpts = new RedocNormalizedOptions(options);

    return (
      <ErrorBoundary>
        <StoreProvider spec={spec} specUrl={specUrl} options={options}>
          {({ loading, store }) =>
            !loading ? (
              <Redoc store={store!} />
            ) : hideLoading ? null : (
              <Loading color={normalizedOpts.theme.colors.main} />
            )
          }
        </StoreProvider>
      </ErrorBoundary>
    );
  }
}
