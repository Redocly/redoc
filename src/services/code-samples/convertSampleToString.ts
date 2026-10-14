import { MediaTypes } from '../../constants/openapi.js';

type RawSchema = Record<string, unknown> | undefined;

type ConverterConfig = {
  shouldConvert: (sample: unknown) => boolean;
  convert: (sample: unknown, schema?: RawSchema) => string;
  lineSeparator: string;
};

const MULTIPART_BOUNDARY = 'boundary-separator';

const isObjectAndNotNull = (sample: unknown): boolean =>
  typeof sample === 'object' && sample !== null;

function getSchemaFormat(schema?: RawSchema): string | undefined {
  const format = schema?.format;
  return typeof format === 'string' ? format : undefined;
}

function getSchemaContentMediaType(schema?: RawSchema): string | undefined {
  const value = schema?.contentMediaType;
  return typeof value === 'string' ? value : undefined;
}

function getSchemaType(schema?: RawSchema): string | undefined {
  const type = schema?.type;
  return typeof type === 'string' ? type : undefined;
}

function getSchemaArrayItem(schema: RawSchema, index: number): RawSchema {
  if (!schema) return undefined;

  const prefixItems = schema.prefixItems;
  if (Array.isArray(prefixItems)) {
    const tupleItem = prefixItems[index];
    if (tupleItem && typeof tupleItem === 'object') {
      return tupleItem as RawSchema;
    }
  }

  const items = schema.items;
  if (Array.isArray(items)) {
    const tupleItem = items[index];
    if (tupleItem && typeof tupleItem === 'object') {
      return tupleItem as RawSchema;
    }
    return undefined;
  }

  if (items && typeof items === 'object') {
    return items as RawSchema;
  }

  return undefined;
}

function getPropertySchema(schema: RawSchema, name: string): RawSchema {
  const properties = schema?.properties;
  if (!properties || typeof properties !== 'object') return undefined;
  const propSchema = (properties as Record<string, unknown>)[name];
  if (!propSchema || typeof propSchema !== 'object') return undefined;
  return propSchema as RawSchema;
}

const getContentTypeForValue = (value: unknown, schema?: RawSchema): string => {
  const contentMediaType = getSchemaContentMediaType(schema);
  if (contentMediaType) return contentMediaType;
  if (getSchemaFormat(schema) === 'binary') return 'application/octet-stream';
  if (typeof value === 'object' && value !== null) return 'application/json';
  return 'text/plain';
};

const sseTemplate = (fields: Record<string, unknown>): string => {
  const lines: string[] = [];
  if (fields.event !== undefined) lines.push(`event: ${fields.event}`);
  if (fields.data !== undefined) {
    const dataValue = fields.data;
    const dataStr = typeof dataValue === 'string' ? dataValue : JSON.stringify(dataValue);
    dataStr.split('\n').forEach((line) => {
      lines.push(`data: ${line}`);
    });
  }
  if (fields.id !== undefined) lines.push(`id: ${fields.id}`);
  if (fields.retry !== undefined) lines.push(`retry: ${fields.retry}`);
  return lines.join('\n');
};

const enhanceBinaryPlaceholder = (value: unknown, schema?: RawSchema): unknown => {
  if (typeof value !== 'string') return value;

  const format = getSchemaFormat(schema);
  if (format === 'binary') return '[Binary data]';
  if (format === 'byte') return '[Base64 encoded data]';
  return value;
};

const enhanceObjectFields = (
  obj: Record<string, unknown>,
  schema?: RawSchema,
): Record<string, unknown> => {
  if (!schema?.properties || typeof schema.properties !== 'object') return obj;

  const enhanced = { ...obj };
  for (const [name, value] of Object.entries(enhanced)) {
    const fieldSchema = getPropertySchema(schema, name);
    if (fieldSchema) {
      enhanced[name] = enhanceBinaryPlaceholder(value, fieldSchema);
    }
  }
  return enhanced;
};

const multipartItemTemplate = (contentType: string, body: string, encoding?: string): string => {
  const headers = [`Content-Type: ${contentType}`];
  if (encoding) headers.push(`Content-Transfer-Encoding: ${encoding}`);
  return [...headers, '', body].join('\r\n');
};

const multipartTemplate = (boundary: string, parts: string[]): string => {
  return parts.map((part) => `--${boundary}\r\n${part}`).join('\r\n');
};

const isArrayLikeObject = (obj: unknown): obj is Record<string, unknown> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }

  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return false;
  }

  return keys.every((key) => /^\d+$/.test(key));
};

const convertArrayLikeToArray = (obj: Record<string, unknown>): unknown[] => {
  const keys = Object.keys(obj)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b);
  return keys.map((key) => obj[String(key)]);
};

const convertObjectToMultipartMixed = (obj: unknown, schema?: RawSchema): string => {
  const parts: string[] = [];

  const normalizeValue = (value: unknown): unknown => {
    if (isArrayLikeObject(value)) {
      return convertArrayLikeToArray(value);
    }
    return value;
  };

  const addPart = (item: unknown, itemSchema?: RawSchema): void => {
    const normalizedItem = normalizeValue(item);

    if (typeof normalizedItem === 'object' && normalizedItem !== null) {
      const enhanced = Array.isArray(normalizedItem)
        ? normalizedItem.map((subItem) =>
            typeof subItem === 'object' && subItem !== null
              ? enhanceObjectFields(subItem as Record<string, unknown>, itemSchema)
              : enhanceBinaryPlaceholder(subItem, itemSchema),
          )
        : enhanceObjectFields(normalizedItem as Record<string, unknown>, itemSchema);
      parts.push(multipartItemTemplate('application/json', JSON.stringify(enhanced, null, 2)));
    } else {
      const enhanced = enhanceBinaryPlaceholder(normalizedItem, itemSchema);
      const contentType = getContentTypeForValue(enhanced, itemSchema);
      const format = getSchemaFormat(itemSchema);
      const encoding = format === 'binary' ? 'binary' : format === 'byte' ? 'base64' : undefined;
      parts.push(multipartItemTemplate(contentType, String(enhanced), encoding));
    }
  };

  const normalizedObj = normalizeValue(obj);

  if (Array.isArray(normalizedObj)) {
    normalizedObj.forEach((item, i) => addPart(item, getSchemaArrayItem(schema, i) ?? schema));
  } else {
    addPart(normalizedObj, schema);
  }

  return multipartTemplate(MULTIPART_BOUNDARY, parts);
};

const convertObjectToSSE = (obj: unknown): string => {
  if (Array.isArray(obj)) {
    return obj.map((item) => sseTemplate(item as Record<string, unknown>)).join('\n\n');
  }
  return sseTemplate(obj as Record<string, unknown>);
};

const convertObjectToJsonSeq = (obj: unknown, schema?: RawSchema): string => {
  const RECORD_SEPARATOR_DISPLAY = '0x1E';
  const LINE_FEED_DISPLAY = '0x0A';

  if (typeof obj === 'string') {
    return obj;
  }

  if (getSchemaType(schema) === 'array') {
    return `${RECORD_SEPARATOR_DISPLAY}${[JSON.stringify(obj)]}${LINE_FEED_DISPLAY}`;
  }

  if (Array.isArray(obj) && obj.length >= 1) {
    return obj
      .map((item) => `${RECORD_SEPARATOR_DISPLAY}${JSON.stringify(item)}${LINE_FEED_DISPLAY}`)
      .join('\n');
  }

  return `${RECORD_SEPARATOR_DISPLAY}${JSON.stringify(obj)}${LINE_FEED_DISPLAY}`;
};

const convertObjectToJsonLines = (obj: unknown, schema?: RawSchema): string => {
  if (typeof obj === 'string') {
    return obj;
  }

  if (getSchemaType(schema) === 'array') {
    return `${[JSON.stringify(obj)]}`;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => JSON.stringify(item)).join('\n');
  }

  return JSON.stringify(obj);
};

const MEDIA_TYPE_CONVERTERS: Record<string, ConverterConfig> = {
  [MediaTypes.EVENT_STREAM]: {
    shouldConvert: isObjectAndNotNull,
    convert: convertObjectToSSE,
    lineSeparator: '\n\n',
  },
  [MediaTypes.JSON_SEQ]: {
    shouldConvert: isObjectAndNotNull,
    convert: convertObjectToJsonSeq,
    lineSeparator: '\n',
  },
  [MediaTypes.JSONL]: {
    shouldConvert: isObjectAndNotNull,
    convert: convertObjectToJsonLines,
    lineSeparator: '\n',
  },
  [MediaTypes.NDJSON]: {
    shouldConvert: isObjectAndNotNull,
    convert: convertObjectToJsonLines,
    lineSeparator: '\n',
  },
  [MediaTypes.MULTIPART_MIXED]: {
    shouldConvert: (sample): boolean => sample !== null,
    convert: convertObjectToMultipartMixed,
    lineSeparator: '\r\n',
  },
};

export function convertSampleToString(
  sample: unknown,
  mime: string,
  schema?: RawSchema,
  repeat: boolean = false,
): unknown {
  const converter = MEDIA_TYPE_CONVERTERS[mime];

  if (converter?.shouldConvert(sample)) {
    const converted = converter.convert(sample, schema);

    let example: string;

    if (repeat) {
      example = Array.from({ length: 3 }, () => converted).join(converter.lineSeparator);
    } else {
      example = converted;
    }

    if (mime === MediaTypes.MULTIPART_MIXED) {
      example = example + `\r\n--${MULTIPART_BOUNDARY}--`;
    }

    return example;
  }

  return sample;
}
