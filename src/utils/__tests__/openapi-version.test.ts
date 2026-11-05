import { describe, expect, it } from 'vitest';

import { openapiAppliesRefSiblings } from '../openapi-version.js';

describe('openapiAppliesRefSiblings', () => {
  it.each([
    ['2.0', false],
    ['3.0.3', false],
    [undefined, false],
    ['3.1.0', true],
    ['3.2.0', true],
  ])('returns %s → %s', (version, applies) => {
    expect(openapiAppliesRefSiblings(version)).toBe(applies);
  });
});
