export type ScopedContext<T> = {
  run<R>(ctx: T, fn: () => R): R;
  get(): T;
};

export function createScopedContext<T>(name: string): ScopedContext<T> {
  let current: T | null = null;

  return {
    run<R>(ctx: T, fn: () => R): R {
      const prev = current;
      current = ctx;
      try {
        return fn();
      } finally {
        current = prev;
      }
    },
    get(): T {
      if (!current) {
        throw new Error(`${name} context is not available outside of a build`);
      }
      return current;
    },
  };
}
