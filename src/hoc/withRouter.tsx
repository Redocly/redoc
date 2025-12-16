import type { ComponentType, FC } from 'react';
import type { RoutingProps } from './types.js';

import { useRouter } from '../hooks/index.js';
import { getDisplayName } from './utils.js';

export function withRouter<P extends RoutingProps>(
  WrappedComponent: ComponentType<Omit<P, 'disableRouter'>>,
): FC<P> {
  const WithRouter = ({ disableRouter, ...props }: P) => {
    const basePath = props.basePath ?? '/';
    const routerType = props.router ?? 'hash';
    const { Router, routerProps } = useRouter(routerType, basePath);

    return disableRouter ? (
      <WrappedComponent {...props} />
    ) : (
      <Router {...routerProps} key={basePath}>
        <WrappedComponent {...props} />
      </Router>
    );
  };

  WithRouter.displayName = `WithRouter(${getDisplayName(WrappedComponent)})`;

  return WithRouter;
}
