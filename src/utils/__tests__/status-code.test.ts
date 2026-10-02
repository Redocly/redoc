import { describe, expect, it } from 'vitest';

import { isStatusCode } from '../status-code.js';

describe('isStatusCode', () => {
  it('accepts numeric codes, `default`, and Nxx wildcards', () => {
    expect(isStatusCode('200')).toBe(true);
    expect(isStatusCode('404')).toBe(true);
    expect(isStatusCode('default')).toBe(true);
    expect(isStatusCode('2XX')).toBe(true);
    expect(isStatusCode('5xx')).toBe(true);
  });

  it('rejects vendor extensions, marker keys, and other non-status keys', () => {
    expect(isStatusCode('x-mock')).toBe(false);
    expect(isStatusCode('summary')).toBe(false);
    expect(isStatusCode('')).toBe(false);
  });
});
