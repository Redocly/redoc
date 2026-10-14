import { isRecord } from './is-record.js';
import { serializeParameterValue } from './serialize-parameter.js';
import { jsonToXml } from './xml.js';

export type FormFieldEncoding = {
  contentType?: string;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  headers?: Record<string, string>;
  xmlName?: string;
};

const RESERVED_ESCAPE_RE = /%(?:3A|2F|3F|40|24|2C|3B)/gi;

const STYLE_DELIMITER_RE = /[|[\]]/g;

const ESCAPED_TRIPLE_RE = /%25(?=[0-9A-F]{2})/gi;

export function pickFormEncoding(
  encoding: Record<string, Omit<FormFieldEncoding, 'headers'> | null> | undefined,
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
      const fieldEncoding = encoding[field] ?? {};
      const { contentType, style, explode, allowReserved } = fieldEncoding;
      if (hasSerializationStyle(fieldEncoding)) {
        const text = serializeParameterValue(
          { name: field, in: 'query', style, explode },
          definedValue(fieldValue),
        ).replace(STYLE_DELIMITER_RE, encodeURIComponent);
        return allowReserved
          ? text.replace(RESERVED_ESCAPE_RE, decodeURIComponent).replace(ESCAPED_TRIPLE_RE, '%')
          : text;
      }
      const items = (Array.isArray(fieldValue) ? fieldValue : [fieldValue]).filter((item) =>
        keepsFormItem(item, contentType),
      );
      return items
        .map((item) => {
          const text = serializeFormValue(item, contentType, fieldEncoding.xmlName ?? field);
          return `${encodeURIComponent(field)}=${encodeURIComponent(text)}`;
        })
        .join('&');
    })
    .filter(Boolean)
    .join('&');
}

export function serializeFormValue(
  item: unknown,
  contentType: string | undefined,
  xmlName: string,
): string {
  if (contentType && /xml/i.test(contentType) && isRecord(item)) {
    return jsonToXml(item, xmlName, { compact: true });
  }
  if (contentType && /json/i.test(contentType)) {
    return typeof item === 'string' && isJsonDocument(item) ? item : (JSON.stringify(item) ?? '');
  }
  return stringifyFormFieldValue(item);
}

export function hasSerializationStyle(encoding: FormFieldEncoding): boolean {
  return (
    encoding.style !== undefined ||
    encoding.explode !== undefined ||
    encoding.allowReserved !== undefined
  );
}

/** The value without `null` array items and object members, or `undefined` when nothing is left. */
export function definedValue(value: unknown): unknown {
  const defined = Array.isArray(value)
    ? value.filter(isDefined)
    : isRecord(value)
      ? Object.fromEntries(Object.entries(value).filter(([, item]) => isDefined(item)))
      : value;
  return isDefined(defined) && !(typeof defined === 'object' && Object.keys(defined).length === 0)
    ? defined
    : undefined;
}

/** False for a `null` content-based item, unless a JSON content type writes it as `null`. */
export function keepsFormItem(item: unknown, contentType: string | undefined): boolean {
  return isDefined(item) || (contentType !== undefined && /json/i.test(contentType));
}

function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function stringifyFormFieldValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function isJsonDocument(value: string): boolean {
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
}
