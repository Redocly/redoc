import type { ComponentType, FC } from 'react';

// HOC type that preserves props
type HOC<P> = (Component: ComponentType<P>) => FC<P>;

// Overloads for composing HOCs that preserve component props
export function compose<P>(f: HOC<P>): (Component: ComponentType<P>) => FC<P>;
export function compose<P>(f: HOC<P>, g: HOC<P>): (Component: ComponentType<P>) => FC<P>;
export function compose<P>(f: HOC<P>, g: HOC<P>, h: HOC<P>): (Component: ComponentType<P>) => FC<P>;
export function compose<P>(
  f: HOC<P>,
  g: HOC<P>,
  h: HOC<P>,
  i: HOC<P>,
): (Component: ComponentType<P>) => FC<P>;
export function compose<P>(
  f: HOC<P>,
  g: HOC<P>,
  h: HOC<P>,
  i: HOC<P>,
  j: HOC<P>,
): (Component: ComponentType<P>) => FC<P>;
export function compose<P>(...fns: Array<HOC<P>>): (Component: ComponentType<P>) => FC<P> {
  return (Component: ComponentType<P>) =>
    fns.reduceRight((acc, fn) => fn(acc) as ComponentType<P>, Component) as FC<P>;
}
