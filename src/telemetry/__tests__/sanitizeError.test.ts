import { describe, expect, it } from 'vitest';

import { sanitizeErrorDetails, sanitizeLoadFailureMessage } from '../sanitizeError.js';

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

describe('sanitizeLoadFailureMessage', () => {
  it.each([
    [
      'bad indentation of a mapping entry in "https://docs.example.com/openapi.yaml" (4:11)\n 3 | info:',
      'bad indentation of a mapping entry in <text>',
    ],
    [`Unexpected token 'o', "openapi: 3"... is not valid JSON`, 'Unexpected token <text>, <text>'],
    [`Unexpected token 'x', "x{"title":"... is not valid JSON`, 'Unexpected token <text>, <text>'],
    [
      `Expected ':' after property name in JSON at position 5 (line 1 column 6)`,
      'Expected <text> after property name in JSON at position 5 (line 1 column 6)',
    ],
    [
      'JSON Parse error: Unexpected identifier "openapi"',
      'JSON Parse error: Unexpected identifier <text>',
    ],
    ['Failed to load https://docs.example.com/v3/api-docs: 500', 'Failed to load <path> 500'],
  ])('keeps the error kind of %j and drops its content', (message, expected) => {
    expect(sanitizeLoadFailureMessage(message)).toBe(expected);
  });

  it('caps the length at 120 characters', () => {
    expect(sanitizeLoadFailureMessage('m'.repeat(500))).toHaveLength(120);
  });
});
