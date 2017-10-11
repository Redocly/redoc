import { OpenAPIOperation, OpenAPISchema } from '../types';

export function getStatusCodeType(statusCode: string | number, defaultAsError = false): string {
  if (statusCode === 'default') {
    return defaultAsError ? 'error' : 'success';
  }

  if (statusCode < 100 || statusCode > 599) {
    throw new Error('invalid HTTP code');
  }
  let res = 'success';
  if (statusCode >= 300 && statusCode < 400) {
    res = 'redirect';
  } else if (statusCode >= 400) {
    res = 'error';
  } else if (statusCode < 200) {
    res = 'info';
  }
  return res;
}

const operationNames = {
  get: true,
  post: true,
  put: true,
  head: true,
  patch: true,
  delete: true,
  options: true,
};

export function isOperationName(key: string): boolean {
  return key in operationNames;
}

export function getOperationSummary(operation: OpenAPIOperation): string {
  return (
    operation.summary ||
    operation.operationId ||
    (operation.description && operation.description.substring(0, 50)) ||
    '<no summary>'
  );
}

const schemaKeywordTypes = {
  multipleOf: 'number',
  maximum: 'number',
  exclusiveMaximum: 'number',
  minimum: 'number',
  exclusiveMinimum: 'number',

  maxLength: 'string',
  minLength: 'string',
  pattern: 'string',

  items: 'array',
  maxItems: 'array',
  minItems: 'array',
  uniqueItems: 'array',

  maxProperties: 'object',
  minProperties: 'object',
  required: 'object',
  additionalProperties: 'object',
  properties: 'object',
};

export function detectType(schema: OpenAPISchema): string {
  if (schema.type !== undefined) {
    return schema.type;
  }
  const keywords = Object.keys(schemaKeywordTypes);
  for (var i = 0; i < keywords.length; i++) {
    let keyword = keywords[i];
    let type = schemaKeywordTypes[keyword];
    if (schema[keyword] !== undefined) {
      return type;
    }
  }

  return 'any';
}

export function isPrimitiveType(schema: OpenAPISchema) {
  if (schema.oneOf !== undefined || schema.anyOf !== undefined) {
    return false;
  }

  if (schema.type === 'object') {
    return schema.properties !== undefined
      ? Object.keys(schema.properties).length === 0
      : schema.additionalProperties === undefined;
  }

  if (schema.type === 'array') {
    if (schema.items === undefined) {
      return true;
    }
    return false;
  }

  return true;
}

export function isJsonLike(contentType: string): boolean {
  return contentType.search(/json/i) !== -1;
}

export function langFromMime(contentType: string): string {
  if (contentType.search(/xml/i) !== -1) {
    return 'xml';
  }
  return 'clike';
}

export function isNamedDefinition(pointer: string): boolean {
  return /^#\/components\/schemas\/[^\/]+$/.test(pointer);
}

export function humanizeConstraints(schema: OpenAPISchema): string[] {
  const res: string[] = [];

  let stringRange;
  if (schema.minLength !== undefined && schema.maxLength !== undefined) {
    if (schema.minLength === schema.maxLength) {
      stringRange = `${schema.minLength} characters`;
    } else {
      stringRange = `[ ${schema.minLength} .. ${schema.maxLength} ] characters`;
    }
  } else if (schema.maxLength != undefined) {
    stringRange = `<= ${schema.maxLength} characters`;
  } else if (schema.minLength != undefined) {
    if (schema.minLength === 1) {
      stringRange = 'non-empty';
    } else {
      stringRange = `>= ${schema.minLength} characters`;
    }
  }
  if (stringRange !== undefined) {
    res.push(stringRange);
  }

  let numberRange;
  if (schema.minimum !== undefined && schema.maximum !== undefined) {
    numberRange = schema.exclusiveMinimum ? '( ' : '[ ';
    numberRange += schema.minimum;
    numberRange += ' .. ';
    numberRange += schema.maximum;
    numberRange += schema.exclusiveMaximum ? ' )' : ' ]';
  } else if (schema.maximum != undefined) {
    numberRange = schema.exclusiveMaximum ? '< ' : '<= ';
    numberRange += schema.maximum;
  } else if (schema.minimum != undefined) {
    numberRange = schema.exclusiveMinimum ? '> ' : '>= ';
    numberRange += schema.minimum;
  }

  if (numberRange !== undefined) {
    res.push(numberRange);
  }

  return res;
}
