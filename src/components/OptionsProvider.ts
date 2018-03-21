import * as PropTypes from 'prop-types';
import * as React from 'react';

import { RedocNormalizedOptions } from '../services/RedocNormalizedOptions';

// TODO: contribute declarations to @types/react once 16.3 is released
type ReactProviderComponent<T> = React.ComponentType<{ value: T }>;
type ReactConsumerComponent<T> = React.ComponentType<{ children: ((value: T) => React.ReactNode) }>;

interface ReactContext<T> {
  Provider: ReactProviderComponent<T>;
  Consumer: ReactConsumerComponent<T>;
}

declare module 'react' {
  function createContext<T>(defatulValue: T): ReactContext<T>;
}

export const OptionsContext = React.createContext(new RedocNormalizedOptions({}));
export const OptionsProvider = OptionsContext.Provider;
export const OptionsConsumer = OptionsContext.Consumer;
