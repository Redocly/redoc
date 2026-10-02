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

  it('returns undefined when the param has no location', () => {
    expect(getParameterExampleSerializer(param({}))).toBeUndefined();
  });
});
