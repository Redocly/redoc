import { Children } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import type { ReactNode, ReactElement } from 'react';
import type { OpenAPIDefinition } from './types';
import type { StoreProviderProps } from './components';
import type { BrowserRouterProps, MemoryRouterProps } from 'react-router-dom';

import { StoreProvider } from './components';

const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

export function TestBrowserRouter({ children, ...props }: BrowserRouterProps): ReactElement {
  return (
    <BrowserRouter {...props} future={routerFutureFlags}>
      {children}
    </BrowserRouter>
  );
}

export function TestMemoryRouter({ children, ...props }: MemoryRouterProps): ReactElement {
  return (
    <MemoryRouter {...props} future={routerFutureFlags}>
      {children}
    </MemoryRouter>
  );
}

export function withTestProviders(children: ReactNode, store?: StoreProviderProps): ReactElement {
  return (
    <StoreProvider {...(store || { definition: { openapi: '3.0.0' } as OpenAPIDefinition })}>
      {Children.only(children)}
    </StoreProvider>
  );
}
