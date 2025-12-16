import { useAtomValue } from 'jotai';

import type { ComponentType, FC } from 'react';
import type { StoreProps } from './types.js';

import { layoutAtom, collapsedSidebarAtom } from '../jotai/app.js';
import { globalStoreAtom } from '../jotai/store.js';

export function withStore<T extends StoreProps>(WrappedComponent: ComponentType<T>): FC<T> {
  const WithStore = (props: T) => {
    const layout = useAtomValue(layoutAtom);
    const collapsedSidebar = useAtomValue(collapsedSidebarAtom);
    const { options, parser } = useAtomValue(globalStoreAtom);

    if (!parser) {
      return null;
    }

    return (
      <WrappedComponent
        {...props}
        options={options}
        layout={layout}
        collapsedSidebar={collapsedSidebar}
        parser={parser}
      />
    );
  };

  return WithStore;
}
