import { useContext } from 'react';

import type { ComponentType, FC } from 'react';

import { ItemIdContext } from '../hooks/useDeepLinkSection.js';

type WithItemIdProps = {
  itemPath: string;
};

export function withItemId<P extends WithItemIdProps>(WrappedComponent: ComponentType<P>): FC<P> {
  function WithItemId(props: P) {
    const parentItemId = useContext(ItemIdContext);
    if (parentItemId === props.itemPath) {
      return <WrappedComponent {...props} />;
    }
    return (
      <ItemIdContext.Provider value={props.itemPath}>
        <WrappedComponent {...props} />
      </ItemIdContext.Provider>
    );
  }

  WithItemId.displayName = `WithItemId(${getDisplayName(WrappedComponent)})`;

  return WithItemId;
}

function getDisplayName<T>(WrappedComponent: ComponentType<T>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
