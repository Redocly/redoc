import { describe, expect, it } from 'vitest';

import { toSidebarLogo } from '../logo.js';

const RAW = { url: 'https://cdn.test/logo.png', altText: 'Cafe logo' };

describe('toSidebarLogo', () => {
  it('maps the authored `url` onto `imageUrl`', () => {
    expect(toSidebarLogo(RAW)?.imageUrl).toBe('https://cdn.test/logo.png');
  });

  it('uses the href fallback when the logo has no href of its own', () => {
    expect(toSidebarLogo(RAW, 'https://contact.test')?.href).toBe('https://contact.test');
  });

  it('prefers an explicit href over the fallback', () => {
    expect(toSidebarLogo({ ...RAW, href: 'https://logo.test' }, 'https://contact.test')?.href).toBe(
      'https://logo.test',
    );
  });

  it('leaves href undefined when there is neither an href nor a fallback', () => {
    expect(toSidebarLogo(RAW)?.href).toBeUndefined();
  });

  it('passes altText and backgroundColor through', () => {
    expect(toSidebarLogo({ ...RAW, backgroundColor: '#eee' })).toMatchObject({
      altText: 'Cafe logo',
      backgroundColor: '#eee',
    });
  });

  // undefined is what lets call sites fall through to the next source with `??`.
  it('is undefined without an image url — nothing to render', () => {
    expect(toSidebarLogo({ href: 'https://logo.test' })).toBeUndefined();
    expect(toSidebarLogo(undefined)).toBeUndefined();
  });
});
