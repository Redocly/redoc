import * as React from 'react';

import {
  argValueToBoolean,
  RedocNormalizedOptions,
  RedocRawOptions,
} from '../services/RedocNormalizedOptions';
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

declare let __webpack_nonce__: string;

export const RedocStandalone = function (props: RedocStandaloneProps) {
  const { spec, specUrl, options = {}, onLoaded } = props;
  const hideLoading = argValueToBoolean(options.hideLoading, false);

  const normalizedOpts = new RedocNormalizedOptions(options);

  if (normalizedOpts.nonce !== undefined) {
    try {
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      __webpack_nonce__ = normalizedOpts.nonce;
    } catch {} // If we have exception, Webpack was not used to run this.
  }

  return (
    <ErrorBoundary>
      <StoreBuilder
        spec={spec ? { ...spec } : undefined}
        specUrl={specUrl}
        options={options}
        onLoaded={onLoaded}
      >
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
};
