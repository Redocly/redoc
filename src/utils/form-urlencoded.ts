import { serializeParameterValue } from './serialize-parameter.js';

export type FormFieldEncoding = { style?: string; explode?: boolean };

export function formUrlEncodeValue(
  value: unknown,
  encoding: Record<string, FormFieldEncoding> = {},
): string {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);

  const entries = Array.isArray(value)
    ? value.map((item, idx) => [String(idx), item] as const)
    : Object.entries(value as Record<string, unknown>);

  return entries
    .map(([field, fieldValue]) => {
      const fieldEncoding = encoding[field];
      if (fieldEncoding) {
        return serializeParameterValue(
          { name: field, in: 'query', style: fieldEncoding.style, explode: fieldEncoding.explode },
          fieldValue,
        );
      }
      return `${encodeURIComponent(field)}=${encodeURIComponent(stringifyFormFieldValue(fieldValue))}`;
    })
    .join('&');
}

export function stringifyFormFieldValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
