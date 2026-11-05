import { describe, expect, it } from 'vitest';

import { resolveStorePointer } from '../refPointer.js';

describe('resolveStorePointer', () => {
  const kind = { type: 'string' };
  const store: Record<string, unknown> = {
    'components/schemas/Drink': {
      properties: { kind, 'a/b': { const: 'x' }, 'c~d': { const: 'y' } },
      allOf: [{ properties: { kind } }],
      required: ['kind'],
    },
  };
  const lookup = (id: string) => store[id];

  it('walks from the longest matching store id into properties', () => {
    expect(resolveStorePointer('#/components/schemas/Drink/properties/kind', lookup)).toBe(kind);
  });

  it('returns the whole entry for a whole-schema ref', () => {
    expect(resolveStorePointer('#/components/schemas/Drink', lookup)).toBe(
      store['components/schemas/Drink'],
    );
  });

  it('passes through array segments', () => {
    expect(resolveStorePointer('#/components/schemas/Drink/allOf/0/properties/kind', lookup)).toBe(
      kind,
    );
  });

  it('decodes ~1 and ~0', () => {
    expect(resolveStorePointer('#/components/schemas/Drink/properties/a~1b', lookup)).toEqual({
      const: 'x',
    });
    expect(resolveStorePointer('#/components/schemas/Drink/properties/c~0d', lookup)).toEqual({
      const: 'y',
    });
  });

  it('is undefined when the pointer ends on a non-object or misses', () => {
    expect(resolveStorePointer('#/components/schemas/Drink/required/0', lookup)).toBeUndefined();
    expect(resolveStorePointer('#/components/schemas/Drink/required', lookup)).toBeUndefined();
    expect(
      resolveStorePointer('#/components/schemas/Nope/properties/kind', lookup),
    ).toBeUndefined();
    expect(
      resolveStorePointer('#/components/schemas/Drink/properties/nope', lookup),
    ).toBeUndefined();
  });
});
