import { describe, it, expect } from 'vitest';

import { createScopedContext } from '../scopedContext.js';

describe('createScopedContext', () => {
  it('throws when read outside of run', () => {
    const context = createScopedContext<{ id: string }>('Test');

    expect(() => context.get()).toThrow('Test context is not available outside of a build');
  });

  it('exposes the value inside run and returns the callback result', () => {
    const context = createScopedContext<{ id: string }>('Test');

    expect(context.run({ id: 'a' }, () => context.get().id)).toBe('a');
  });

  it('restores the outer value after a nested run', () => {
    const context = createScopedContext<{ id: string }>('Test');

    const seen = context.run({ id: 'outer' }, () => {
      const inner = context.run({ id: 'inner' }, () => context.get().id);
      return [inner, context.get().id];
    });

    expect(seen).toEqual(['inner', 'outer']);
    expect(() => context.get()).toThrow();
  });

  it('restores the previous value when the callback throws', () => {
    const context = createScopedContext<{ id: string }>('Test');

    const afterThrow = context.run({ id: 'outer' }, () => {
      expect(() =>
        context.run({ id: 'inner' }, () => {
          throw new Error('boom');
        }),
      ).toThrow('boom');
      return context.get().id;
    });

    expect(afterThrow).toBe('outer');
    expect(() => context.get()).toThrow('Test context is not available outside of a build');
  });
});
