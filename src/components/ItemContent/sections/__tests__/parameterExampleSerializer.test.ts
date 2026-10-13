import { describe, it, expect } from 'vitest';

import type { ParameterData } from '../../../../types/content.js';

import { getParameterExampleSerializer } from '../ParametersSection.js';

function param(overrides: Partial<ParameterData>): ParameterData {
  return { name: 'imageSize', schemaId: 'sid', ...overrides };
}

describe('getParameterExampleSerializer', () => {
  it('renders query examples as "name=value"', () => {
    const serialize = getParameterExampleSerializer(param({ in: 'query' }));
    expect(serialize?.('700x700')).toBe('imageSize=700x700');
  });

  it('renders cookie examples as "name=value"', () => {
    const serialize = getParameterExampleSerializer(param({ in: 'cookie' }));
    expect(serialize?.('700x700')).toBe('imageSize=700x700');
  });

  it('renders path and header scalar examples as the raw value', () => {
    expect(getParameterExampleSerializer(param({ in: 'path' }))?.('700x700')).toBe('700x700');
    expect(getParameterExampleSerializer(param({ in: 'header' }))?.('700x700')).toBe('700x700');
  });

  it('renders query examples in the declared style', () => {
    expect(
      getParameterExampleSerializer(param({ in: 'query', style: 'pipeDelimited' }))?.(['a', 'b']),
    ).toBe('imageSize=a|b');
    expect(
      getParameterExampleSerializer(param({ in: 'query', explode: false }))?.(['a', 'b']),
    ).toBe('imageSize=a,b');
  });

  it('returns undefined when the param has no location', () => {
    expect(getParameterExampleSerializer(param({}))).toBeUndefined();
  });
});
