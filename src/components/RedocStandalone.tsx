import * as React from 'react';

import { RedocNormalizedOptions, RedocRawOptions } from '../services/RedocNormalizedOptions';
import { ErrorBoundary } from './ErrorBoundary';
import { Loading } from './Loading/Loading';
import { Redoc } from './Redoc/Redoc';
import { StoreBuilder } from './StoreBuilder';

export interface RedocStandaloneProps {
  spec?: object;
  specUrl?: string;
  options?: RedocRawOptions;
  onLoaded?: (e?: Error) => any;
}

export const RedocStandalone = function (props: RedocStandaloneProps) {
  const { spec, specUrl, options = {}, onLoaded } = props;
  const hideLoading = options.hideLoading !== undefined;

  const normalizedOpts = new RedocNormalizedOptions(options);

  return (
    <ErrorBoundary>
      <StoreBuilder spec={spec} specUrl={specUrl} options={options} onLoaded={onLoaded}>
        {({ loading, store }) =>
          !loading ? (
            <Redoc store={store!} />
          ) : hideLoading ? null : (
            <Loading color={normalizedOpts.theme.colors.primary.main} />
          )
        }
      </StoreBuilder>
    </ErrorBoundary>
  );
}
