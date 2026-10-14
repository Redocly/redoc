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

  it('renders compact XML on one line', () => {
    expect(jsonToXml({ title: 'Resume', year: 2026 }, 'metadata', { compact: true })).toBe(
      '<metadata><title>Resume</title><year>2026</year></metadata>',
    );
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
    expect(jsonToXml({ '#cdata': 'a <b>' }, 'note', { compact: true })).toBe(
      '<note><![CDATA[a <b>]]></note>',
    );
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
