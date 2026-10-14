import { describe, expect, it } from 'vitest';

import { logoFromSpec } from '../x-logo.js';

describe('logoFromSpec', () => {
  it('maps info x-logo to a logo config', () => {
    expect(
      logoFromSpec({
        info: {
          'x-logo': {
            url: 'https://example.com/logo.png',
            href: 'https://example.com',
            altText: 'Example',
            backgroundColor: '#fff',
          },
        },
      }),
    ).toEqual({
      url: 'https://example.com/logo.png',
      href: 'https://example.com',
      altText: 'Example',
      backgroundColor: '#fff',
    });
  });

  it('falls back to info.contact.url for the link', () => {
    expect(
      logoFromSpec({
        info: {
          'x-logo': { url: 'https://example.com/logo.png' },
          contact: { url: 'https://example.com/contact' },
        },
      }),
    ).toEqual({
      url: 'https://example.com/logo.png',
      href: 'https://example.com/contact',
      altText: undefined,
      backgroundColor: undefined,
    });
  });

  it('returns undefined without an x-logo url', () => {
    expect(logoFromSpec(undefined)).toBeUndefined();
    expect(logoFromSpec({})).toBeUndefined();
    expect(logoFromSpec({ info: {} })).toBeUndefined();
    expect(logoFromSpec({ info: { 'x-logo': { altText: 'no url' } } })).toBeUndefined();
  });
});
