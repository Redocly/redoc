import { describe, expect, it } from 'vitest';

import { jsonToXml } from '../xml.js';

describe('jsonToXml', () => {
  it('wraps a flat object in a <root> element', () => {
    const xml = jsonToXml({ name: 'Mona', count: 5 });

    expect(xml).toContain('<root>');
    expect(xml).toContain('<name>Mona</name>');
    expect(xml).toContain('<count>5</count>');
    expect(xml).toContain('</root>');
  });

  it('does not wrap top-level arrays in <root>', () => {
    const xml = jsonToXml([{ item: 'one' }, { item: 'two' }]);

    expect(xml).not.toContain('<root>');
    expect(xml).toContain('<item>one</item>');
    expect(xml).toContain('<item>two</item>');
  });

  it('renders #cdata properties as CDATA sections', () => {
    const xml = jsonToXml({
      Documentation: {
        '#cdata': '<html><head><title>Docs</title></head></html>',
      },
    });

    expect(xml).toContain('<![CDATA[');
    expect(xml).toContain('<html><head><title>Docs</title></head></html>');
    expect(xml).toContain(']]>');
  });

  it('returns an empty string for null or undefined', () => {
    expect(jsonToXml(null)).toBe('');
    expect(jsonToXml(undefined)).toBe('');
  });

  it('returns the string representation of primitive values as-is', () => {
    expect(jsonToXml('hello')).toBe('hello');
    expect(jsonToXml(42)).toBe('42');
  });
});
