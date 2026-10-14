import type { OpenAPIEncoding, OpenAPIHeader, OpenAPIMediaType } from '../../../types/openapi.js';
import type { FormFieldEncoding } from '../../../utils/form-urlencoded.js';

import { MediaTypes } from '../../../constants/openapi.js';
import { pickFormEncoding, stringifyFormFieldValue } from '../../../utils/form-urlencoded.js';
import { isFormUrlEncodedMediaType } from '../../../utils/media-type.js';
import { isRecord, resolveRef } from '../../helpers.js';

const CLIENT_PART_HEADERS = new Set(['content-type', 'content-disposition']);

export function pickStoredFormEncoding(
  mediaType: string,
  media: OpenAPIMediaType,
  doc: Record<string, unknown>,
): Record<string, FormFieldEncoding> | undefined {
  if (!isFormUrlEncodedMediaType(mediaType)) return undefined;
  return withXmlNames(pickFormEncoding(media.encoding), media.schema, doc);
}

export function pickFormFieldEncoding(
  mediaType: string,
  encoding: OpenAPIMediaType['encoding'],
  doc: Record<string, unknown> = {},
  schema?: unknown,
): Record<string, FormFieldEncoding> | undefined {
  const isMultipart = mediaType.toLowerCase().includes(MediaTypes.MULTIPART);
  if (!encoding || (!isMultipart && !isFormUrlEncodedMediaType(mediaType))) return undefined;

  const picked: Record<string, FormFieldEncoding> = {};
  for (const [field, raw] of Object.entries(encoding)) {
    if (!raw || typeof raw !== 'object') continue;
    const headers = isMultipart ? pickHeaderSamples(raw.headers, doc) : undefined;
    const entry: FormFieldEncoding = {
      ...(typeof raw.style === 'string' && { style: raw.style }),
      ...(typeof raw.explode === 'boolean' && { explode: raw.explode }),
      ...(typeof raw.allowReserved === 'boolean' && { allowReserved: raw.allowReserved }),
      ...(typeof raw.contentType === 'string' && { contentType: raw.contentType }),
      ...(headers && { headers }),
    };
    if (Object.keys(entry).length > 0) picked[field] = entry;
  }

  if (Object.keys(picked).length === 0) return undefined;
  return isMultipart ? picked : withXmlNames(picked, schema, doc);
}

function withXmlNames(
  encoding: Record<string, FormFieldEncoding> | undefined,
  schema: unknown,
  doc: Record<string, unknown>,
): Record<string, FormFieldEncoding> | undefined {
  if (!encoding) return undefined;
  return Object.fromEntries(
    Object.entries(encoding).map(([field, entry]) => {
      const xmlName = /xml/i.test(entry.contentType ?? '')
        ? propertyXmlName(schema, field, doc)
        : undefined;
      return [field, xmlName && xmlName !== field ? { ...entry, xmlName } : entry];
    }),
  );
}

function propertyXmlName(
  schema: unknown,
  field: string,
  doc: Record<string, unknown>,
): string | undefined {
  const property = schemaMembers(schema, doc)
    .map((member) => (isRecord(member.properties) ? member.properties[field] : undefined))
    .find(isRecord);
  const propertyMembers = schemaMembers(property, doc);
  const items = propertyMembers.map((member) => member.items).find(isRecord);
  return (items ? schemaMembers(items, doc) : propertyMembers)
    .map((member) => (isRecord(member.xml) ? member.xml.name : undefined))
    .find((name): name is string => typeof name === 'string' && name !== '');
}

function schemaMembers(
  schema: unknown,
  doc: Record<string, unknown>,
  seen = new Set<unknown>(),
): Record<string, unknown>[] {
  if (!isRecord(schema) || seen.has(schema)) return [];
  seen.add(schema);
  const target = typeof schema.$ref === 'string' ? resolveRef(doc, schema) : undefined;
  const allOf = Array.isArray(schema.allOf) ? schema.allOf : [];
  return [
    schema,
    ...schemaMembers(target, doc, seen),
    ...allOf.flatMap((member) => schemaMembers(member, doc, seen)),
  ];
}

function pickHeaderSamples(
  headers: OpenAPIEncoding['headers'],
  doc: Record<string, unknown>,
): Record<string, string> | undefined {
  if (!headers || typeof headers !== 'object') return undefined;
  const samples: Record<string, string> = {};
  for (const [name, raw] of Object.entries(headers)) {
    if (CLIENT_PART_HEADERS.has(name.toLowerCase()) || /[\r\n]/.test(name)) continue;
    const header = resolveRef<OpenAPIHeader>(doc, raw) ?? raw;
    samples[name] = sampleHeaderValue(header)
      .split(/[\r\n]+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ');
  }
  return Object.keys(samples).length > 0 ? samples : undefined;
}

function sampleHeaderValue(header: OpenAPIHeader | undefined): string {
  const schema = (header?.schema ?? {}) as Record<string, unknown>;
  const candidates = [
    header?.example,
    schema.example,
    schema.default,
    Array.isArray(schema.enum) ? schema.enum[0] : undefined,
  ];
  const found = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  if (found !== undefined) return stringifyFormFieldValue(found);
  switch (schema.type) {
    case 'integer':
    case 'number':
      return '0';
    case 'boolean':
      return 'true';
    default:
      return 'string';
  }
}
