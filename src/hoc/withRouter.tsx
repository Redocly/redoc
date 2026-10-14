import { memo } from 'react';
import { BrowserRouter, MemoryRouter, useInRouterContext } from 'react-router';

import type { ComponentType, FC } from 'react';

const FallbackRouter = typeof window !== 'undefined' ? BrowserRouter : MemoryRouter;

export function withRouter<P extends { basePath: string }>(
  WrappedComponent: ComponentType<P>,
): FC<P> {
  const WithRouter = memo((props: P) => {
    const isInRouterContext = useInRouterContext();

    return !isInRouterContext ? (
      <FallbackRouter>
        <WrappedComponent {...props} />
      </FallbackRouter>
    ) : (
      <WrappedComponent {...props} />
    );
  });

  WithRouter.displayName = `WithRouter(${getDisplayName(WrappedComponent)})`;

  return WithRouter;
}

function getDisplayName<T>(WrappedComponent: ComponentType<T>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'RedoclyApiDocs';
}
