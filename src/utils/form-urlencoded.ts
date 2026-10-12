import { serializeParameterValue } from './serialize-parameter.js';

export type FormFieldEncoding = {
  contentType?: string;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
};

const RESERVED_ESCAPE_RE = /%(?:3A|2F|3F|40|24|2C|3B)/gi;

export function pickFormEncoding(
  encoding: Record<string, FormFieldEncoding | null> | undefined,
): Record<string, FormFieldEncoding> | undefined {
  if (!encoding) return undefined;
  return Object.fromEntries(
    Object.entries(encoding).map(([field, entry]) => {
      const { contentType, style, explode, allowReserved } = entry ?? {};
      return [field, { contentType, style, explode, allowReserved }];
    }),
  );
}

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
      const { contentType, style, explode, allowReserved } = encoding[field] ?? {};
      if (style !== undefined || explode !== undefined || allowReserved !== undefined) {
        const text = serializeParameterValue(
          { name: field, in: 'query', style, explode },
          fieldValue,
        );
        return allowReserved ? text.replace(RESERVED_ESCAPE_RE, decodeURIComponent) : text;
      }
      const isJson = /json/i.test(contentType ?? '');
      const items = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
      return items
        .map((item) => {
          const text = isJson ? (JSON.stringify(item) ?? '') : stringifyFormFieldValue(item);
          return `${encodeURIComponent(field)}=${encodeURIComponent(text)}`;
        })
        .join('&');
    })
    .filter(Boolean)
    .join('&');
}

export function stringifyFormFieldValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
