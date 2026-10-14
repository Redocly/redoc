import { describe, expect, it } from 'vitest';

import { sanitizeErrorDetails } from '../sanitizeError.js';

describe('sanitizeErrorDetails', () => {
  it('keeps known error classes and maps the rest to other', () => {
    expect(sanitizeErrorDetails(new TypeError('boom')).name).toBe('TypeError');
    expect(sanitizeErrorDetails(new Error('boom')).name).toBe('Error');
    const custom = new Error('boom');
    custom.name = 'ChunkLoadError';
    expect(sanitizeErrorDetails(custom).name).toBe('other');
  });

  it('strips URLs and file paths from the message and stack', () => {
    const error = new Error(
      'Failed to fetch https://docs.example.com/openapi.yaml from /Users/me/site/spec.yaml',
    );
    const details = sanitizeErrorDetails(
      error,
      '    at Foo (https://docs.example.com/redoc.js:1:2)\n    in Bar',
    );
    expect(details.message).not.toContain('example.com');
    expect(details.message).not.toContain('/Users/me');
    expect(details.message).toContain('<path>');
    expect(details.stack).not.toContain('example.com');
  });

  it('counts frames and caps lengths', () => {
    const stack = Array.from({ length: 300 }, (_, i) => `    at frame${i} (x)`).join('\n');
    const details = sanitizeErrorDetails(new Error('m'.repeat(500)), stack);
    expect(details.stackFrames).toBe(300);
    expect(details.message).toHaveLength(200);
    expect(details.stack).toHaveLength(2000);
  });

  it('omits the stack when there is none', () => {
    const error = new Error('plain');
    error.stack = '';
    expect(sanitizeErrorDetails(error, null)).not.toHaveProperty('stack');
  });
});
