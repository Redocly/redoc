import { Children } from 'react';

import type { ReactNode, ReactElement } from 'react';
import type { OpenAPIDefinition } from './types';
import type { StoreProviderProps } from './components';

import { StoreProvider } from './components';

export function withTestProviders(children: ReactNode, store?: StoreProviderProps): ReactElement {
  return (
    <StoreProvider {...(store || { definition: { openapi: '3.0.0' } as OpenAPIDefinition })}>
      {Children.only(children)}
    </StoreProvider>
  );
}
