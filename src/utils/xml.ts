import { XMLBuilder } from 'fast-xml-parser';

const xmlBuilder = new XMLBuilder({
  format: true,
  cdataPropName: '#cdata',
});

const compactXmlBuilder = new XMLBuilder({
  cdataPropName: '#cdata',
});

export function jsonToXml(value: unknown, rootName = 'root', { compact = false } = {}): string {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);

  const wrapped = Array.isArray(value) ? value : { [rootName]: value };
  return (compact ? compactXmlBuilder : xmlBuilder).build(wrapped).trimEnd();
}
