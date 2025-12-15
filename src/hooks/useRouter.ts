import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';

import type { ComponentType, PropsWithChildren } from 'react';
import type { RouterType } from '../types/index.js';

const RouterComponent: Dictionary<ComponentType<PropsWithChildren>, RouterType> = {
  history: BrowserRouter,
  memory: MemoryRouter,
  hash: HashRouter,
};

interface RouterProps {
  basename?: string;
  location?: string;
  future?: {
    v7_startTransition: boolean;
    v7_relativeSplatPath: boolean;
  };
}

export const useRouter = (router: RouterType, basePath: string) => {
  const Router = RouterComponent[router];
  const routerProps: RouterProps = {
    ...(router !== 'memory' && {
      basename: basePath,
      feature: { v7_startTransition: false, v7_relativeSplatPath: false },
    }),
  };

  return {
    Router,
    routerProps,
  };
};
