import { XMLBuilder } from 'fast-xml-parser';

const xmlBuilder = new XMLBuilder({
  format: true,
  cdataPropName: '#cdata',
});

export function jsonToXml(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);

  const wrapped = Array.isArray(value) ? value : { root: value };
  return xmlBuilder.build(wrapped).trimEnd();
}
