import { dirname } from 'path';

import { OpenAPIParser } from '../services/OpenAPIParser';
import {
  OpenAPIMediaType,
  OpenAPIOperation,
  OpenAPIParameter,
  OpenAPISchema,
  OpenAPIServer,
  Referenced,
} from '../types';
import { IS_BROWSER } from './dom';
import { isNumeric, resolveUrl } from './helpers';

function isWildcardStatusCode(statusCode: string | number): statusCode is string {
  return typeof statusCode === 'string' && /\dxx/i.test(statusCode);
}

export function isStatusCode(statusCode: string) {
  return statusCode === 'default' || isNumeric(statusCode) || isWildcardStatusCode(statusCode);
}

export function getStatusCodeType(statusCode: string | number, defaultAsError = false): string {
  if (statusCode === 'default') {
    return defaultAsError ? 'error' : 'success';
  }

  let code = typeof statusCode === 'string' ? parseInt(statusCode, 10) : statusCode;
  if (isWildcardStatusCode(statusCode)) {
    code *= 100; // parseInt('2xx') parses to 2
  }

  if (code < 100 || code > 599) {
    throw new Error('invalid HTTP code');
  }
  let res = 'success';
  if (code >= 300 && code < 400) {
    res = 'redirect';
  } else if (code >= 400) {
    res = 'error';
  } else if (code < 200) {
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
  for (const keyword of keywords) {
    const type = schemaKeywordTypes[keyword];
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

export function isNamedDefinition(pointer?: string): boolean {
  return /^#\/components\/schemas\/[^\/]+$/.test(pointer || '');
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
  } else if (schema.maxLength !== undefined) {
    stringRange = `<= ${schema.maxLength} characters`;
  } else if (schema.minLength !== undefined) {
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
  } else if (schema.maximum !== undefined) {
    numberRange = schema.exclusiveMaximum ? '< ' : '<= ';
    numberRange += schema.maximum;
  } else if (schema.minimum !== undefined) {
    numberRange = schema.exclusiveMinimum ? '> ' : '>= ';
    numberRange += schema.minimum;
  }

  if (numberRange !== undefined) {
    res.push(numberRange);
  }

  return res;
}

export function sortByRequired(
  fields: Array<{ required: boolean; name: string }>,
  order: string[] = [],
) {
  fields.sort((a, b) => {
    if (!a.required && b.required) {
      return 1;
    } else if (a.required && !b.required) {
      return -1;
    } else if (a.required && b.required) {
      return order.indexOf(a.name) > order.indexOf(b.name) ? 1 : -1;
    } else {
      return 0;
    }
  });
}

export function mergeParams(
  parser: OpenAPIParser,
  pathParams: Array<Referenced<OpenAPIParameter>> = [],
  operationParams: Array<Referenced<OpenAPIParameter>> = [],
): Array<Referenced<OpenAPIParameter>> {
  const operationParamNames = {};
  operationParams.forEach(param => {
    param = parser.shalowDeref(param);
    operationParamNames[param.name + '_' + param.in] = true;
  });

  // filter out path params overriden by operation ones with the same name
  pathParams = pathParams.filter(param => {
    param = parser.shalowDeref(param);
    return !operationParamNames[param.name + '_' + param.in];
  });

  return pathParams.concat(operationParams);
}

export function mergeSimilarMediaTypes(types: Dict<OpenAPIMediaType>): Dict<OpenAPIMediaType> {
  const mergedTypes = {};
  Object.keys(types).forEach(name => {
    const mime = types[name];
    // ignore content type parameters (e.g. charset) and merge
    const normalizedMimeName = name.split(';')[0].trim();
    if (!mergedTypes[normalizedMimeName]) {
      mergedTypes[normalizedMimeName] = mime;
      return;
    }
    mergedTypes[normalizedMimeName] = { ...mergedTypes[normalizedMimeName], ...mime };
  });

  return mergedTypes;
}

function expandVariables(url: string, variables: object = {}) {
  return url.replace(
    /(?:{)(\w+)(?:})/g,
    (match, name) => (variables[name] && variables[name].default) || match,
  );
}

export function normalizeServers(
  specUrl: string | undefined,
  servers: OpenAPIServer[],
): OpenAPIServer[] {
  const baseUrl =
    specUrl === undefined ? (IS_BROWSER ? window.location.href : '') : dirname(specUrl);

  if (servers.length === 0) {
    return [
      {
        url: baseUrl,
      },
    ];
  }

  function normalizeUrl(url: string, variables: object | undefined): string {
    url = expandVariables(url, variables);
    return resolveUrl(baseUrl, url);
  }

  return servers.map(server => {
    return {
      ...server,
      url: normalizeUrl(server.url, server.variables),
      description: server.description || '',
    };
  });
}

export const SECURITY_SCHEMES_SECTION = 'section/Authentication/';
