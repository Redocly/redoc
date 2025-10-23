import type { ComponentType } from 'react';

export function getDisplayName<T>(WrappedComponent: ComponentType<T>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
