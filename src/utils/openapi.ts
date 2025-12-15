import { dirname } from 'path';
import UrlTemplate from 'url-template';

import type {
  OpenAPIEncoding,
  OpenAPIMediaType,
  OpenAPIParameterStyle,
  OpenAPIRequestBody,
  OpenAPIResponse,
  OpenAPISchema,
  OpenAPIServer,
  Referenced,
  OpenAPIParameter,
} from '../types/index.js';
import type { ExtendedOpenAPIOperation, OpenAPIParser } from '../services/index.js';
import type { FieldModel, GroupModel } from '../models/index.js';

import {
  deleteEmptyArrayItem,
  isArrayOfObjects,
  isNumeric,
  removeQueryStringAndHash,
  resolveUrl,
  sanitizeItemId,
  normalizeText,
  getValueFromMdParsedExtension,
  isAbsoluteUrl,
} from './helpers.js';
import { DEFAULT_TAG_SLUG, MediaTypes } from '../constants.js';
import { JsonPointer } from './JsonPointer.js';
import { joinWithSeparator } from '../services/index.js';
import { tryDecodeURIComponent } from './string.js';
import { getUrlDirname } from './url.js';
import { IS_BROWSER } from './dom.js';

function isWildcardStatusCode(statusCode: string | number): statusCode is string {
  return typeof statusCode === 'string' && /\dxx/i.test(statusCode);
}

export function isStatusCode(statusCode: string): boolean {
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
  $ref: true,
};

export function isOperationName(key: string): boolean {
  return key in operationNames;
}

export function getOperationName(operation: ExtendedOpenAPIOperation): string {
  const { operationId, pathName } = operation;
  const _description = normalizeText(getValueFromMdParsedExtension(operation, 'description'));
  return (
    normalizeText(getValueFromMdParsedExtension(operation, 'summary')) ||
    operationId ||
    (_description && _description.substring(0, 50)) ||
    pathName ||
    '<no summary>'
  );
}

export function getOperationId(operation: ExtendedOpenAPIOperation, parent?: GroupModel): string {
  if (parent?.id) {
    return joinWithSeparator(
      parent.id,
      sanitizeItemId(
        operation.operationId ? operation.operationId : pointerToId(operation.pointer),
      ),
    ).toLowerCase();
  }
  if (!operation.tags?.length) {
    return sanitizeItemId(
      operation.operationId
        ? joinWithSeparator(DEFAULT_TAG_SLUG, operation.operationId)
        : pointerToId(operation.pointer),
    );
  }
  return sanitizeItemId(
    operation.operationId ? operation.operationId : pointerToId(operation.pointer),
  );
}

function pointerToId(pointer: string): string {
  return pointer?.startsWith('/') ? pointer.slice(1, pointer.length) : pointer;
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
  contentEncoding: 'string',
  contentMediaType: 'string',

  items: 'array',
  maxItems: 'array',
  minItems: 'array',
  uniqueItems: 'array',

  maxProperties: 'object',
  minProperties: 'object',
  required: 'object',
  additionalProperties: 'object',
  unevaluatedProperties: 'object',
  patternProperties: 'object',
  properties: 'object',
};

export function detectType(schema: OpenAPISchema): string {
  if (schema.type !== undefined && !Array.isArray(schema.type)) {
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

export function isPrimitiveType(
  schema: OpenAPISchema,
  type: string | string[] | undefined = schema.type,
): boolean {
  if (schema['x-circular-ref']) {
    return true;
  }
  if (schema['x-complex']) {
    return true;
  }
  if (schema.oneOf !== undefined || schema.anyOf !== undefined) {
    return false;
  }

  if ((schema.if && schema.then) || (schema.if && schema.else)) {
    return false;
  }

  let isPrimitive = true;
  const isArray = Array.isArray(type);

  if (type === 'object' || (isArray && type?.includes('object'))) {
    isPrimitive =
      schema.properties !== undefined
        ? Object.keys(schema.properties).length === 0
        : schema.additionalProperties === undefined &&
          schema.unevaluatedProperties === undefined &&
          schema.patternProperties === undefined;
  }

  if (Array.isArray(schema.items) || Array.isArray(schema.prefixItems)) {
    return false;
  }

  if (
    schema.items !== undefined &&
    typeof schema.items !== 'boolean' &&
    (type === 'array' || (isArray && type?.includes('array')))
  ) {
    isPrimitive = isPrimitiveType(schema.items, schema.items.type);
  }

  return isPrimitive;
}

export function isJsonLike(contentType: string): boolean {
  return contentType.search(/json/i) !== -1;
}

export function isXmlLike(contentType: string): boolean {
  return contentType?.search(/xml/i) !== -1;
}

export function isFormUrlEncoded(contentType: string): boolean {
  return contentType === MediaTypes.URL_ENCODED;
}

export function isMultipartFormData(contentType: string): boolean {
  return contentType === MediaTypes.MULTIPART;
}

function delimitedEncodeField(fieldVal: any, fieldName: string, delimiter: string): string {
  if (Array.isArray(fieldVal)) {
    return fieldVal.map((v) => v.toString()).join(delimiter);
  } else if (typeof fieldVal === 'object') {
    return Object.keys(fieldVal)
      .map((k) => `${k}${delimiter}${fieldVal[k]}`)
      .join(delimiter);
  } else {
    return fieldName + '=' + fieldVal.toString();
  }
}

function deepObjectEncodeField(fieldVal: any, fieldName: string): string {
  if (Array.isArray(fieldVal)) {
    console.warn('deepObject style cannot be used with array value:' + fieldVal.toString());
    return '';
  } else if (typeof fieldVal === 'object') {
    return Object.keys(fieldVal)
      .map((k) => (fieldVal[k] ? `${fieldName}[${k}]=${fieldVal[k]}` : undefined))
      .filter(Boolean)
      .join('&');
  } else {
    console.warn('deepObject style cannot be used with non-object value:' + fieldVal.toString());
    return '';
  }
}

function serializeFormValue(name: string, explode: boolean, value: unknown) {
  // Use RFC6570 safe name ([a-zA-Z0-9_]) and replace with our name later
  // e.g. URI.template doesn't parse names with hyphen (-) which are valid query param names
  const safeName = '__redoc_param_name__';
  const suffix = explode ? '*' : '';
  const template = UrlTemplate.parse(`{?${safeName}${suffix}}`);
  return template
    .expand({ [safeName]: value })
    .substring(1)
    .replace(/__redoc_param_name__/g, name);
}

function serializeSimpleValue(explode: boolean, value: unknown) {
  const suffix = explode ? '*' : '';

  // name is not important here, so use RFC6570 safe name ([a-zA-Z0-9_])
  const name = '__redoc_param_name__';
  const template = UrlTemplate.parse(`{${name}${suffix}}`);
  return tryDecodeURIComponent(template.expand({ [name]: value }));
}

/*
 * Should be used only for url-form-encoded body payloads
 * To be used for parameters should be extended with other style values
 */
export function urlFormEncodePayload(
  payload: GenericObject,
  encoding: { [field: string]: OpenAPIEncoding } = {},
): string {
  if (Array.isArray(payload)) {
    throw new Error('Payload must have fields: ' + payload.toString());
  } else {
    return Object.keys(payload)
      .map((fieldName) => {
        const fieldVal = payload[fieldName];
        const { style = 'form', explode = true } = encoding[fieldName] || {};
        switch (style) {
          case 'form':
            return serializeFormValue(fieldName, explode, fieldVal);
          case 'spaceDelimited':
            return delimitedEncodeField(fieldVal, fieldName, '%20');
          case 'pipeDelimited':
            return delimitedEncodeField(fieldVal, fieldName, '|');
          case 'deepObject':
            return deepObjectEncodeField(fieldVal, fieldName);
          default:
            // TODO implement rest of styles for path parameters
            console.warn('Incorrect or unsupported encoding style: ' + style);
            return '';
        }
      })
      .join('&');
  }
}

function serializePathParameter(
  name: string,
  style: OpenAPIParameterStyle,
  explode: boolean,
  value: unknown,
): string {
  const suffix = explode ? '*' : '';
  let prefix = '';

  if (style === 'label') {
    prefix = '.';
  } else if (style === 'matrix') {
    prefix = ';';
  }

  // Use RFC6570 safe name ([a-zA-Z0-9_]) and replace with our name later
  // e.g. URI.template doesn't parse names with hyphen (-) which are valid query param names
  const safeName = '__redoc_param_name__';
  const template = UrlTemplate.parse(`{${prefix}${safeName}${suffix}}`);

  return template.expand({ [safeName]: value }).replace(/__redoc_param_name__/g, name);
}

export function serializeQueryParameter(
  name: string,
  style: OpenAPIParameterStyle | undefined,
  explode: boolean,
  value: unknown,
): string {
  const serializationByStyle = (val) => {
    switch (style) {
      case 'form':
        return serializeFormValue(name, explode, val);
      case 'spaceDelimited':
        if (!Array.isArray(val) && typeof val !== 'object') {
          console.warn('The style spaceDelimited is applicable to arrays or objects');
          return '';
        }
        if (explode) {
          return serializeFormValue(name, explode, val);
        }

        return delimitedEncodeField(value, name, '%20');

      case 'pipeDelimited':
        if (!Array.isArray(val) && typeof val !== 'object') {
          console.warn('The style pipeDelimited is applicable to arrays or objects');
          return '';
        }

        if (explode) {
          return serializeFormValue(name, explode, val);
        }

        return delimitedEncodeField(value, name, '|');

      case 'deepObject':
        if (!explode || Array.isArray(val) || typeof val !== 'object') {
          console.warn('The style deepObject is only applicable for objects with explode=true');
          return '';
        }

        return deepObjectEncodeField(val, name);
      case 'simple': {
        return serializeSimpleValue(explode, value);
      }

      default:
        console.warn('Unexpected style for query: ' + style);
        return '';
    }
  };

  if (isArrayOfObjects(value)) {
    value = deleteEmptyArrayItem(value).map((value) => serializationByStyle(value));
  }
  return serializationByStyle(value);
}

function serializeHeaderParameter(
  style: OpenAPIParameterStyle,
  explode: boolean,
  value: unknown,
): string {
  switch (style) {
    case 'simple': {
      return serializeSimpleValue(explode, value);
    }
    default:
      console.warn('Unexpected style for header: ' + style);
      return '';
  }
}

function serializeCookieParameter(
  name: string,
  style: OpenAPIParameterStyle,
  explode: boolean,
  value: unknown,
): string {
  switch (style) {
    case 'form':
      return serializeFormValue(name, explode, value);
    default:
      console.warn('Unexpected style for cookie: ' + style);
      return '';
  }
}

export function serializeParameterValueWithMime(value: unknown, mime: string): string {
  if (isJsonLike(mime)) {
    return JSON.stringify(value);
  } else {
    console.warn(`Parameter serialization as ${mime} is not supported`);
    return '';
  }
}

export function serializeParameterValue(parameter: FieldModel, value: unknown): string {
  const { name, style, explode = false, serializationMime } = parameter;

  if (serializationMime) {
    switch (parameter.in) {
      case 'path':
      case 'header':
        return serializeParameterValueWithMime(value, serializationMime);
      case 'cookie':
      case 'query':
        return `${name}=${serializeParameterValueWithMime(value, serializationMime)}`;
      default:
        console.warn('Unexpected parameter location: ' + parameter.in);
        return '';
    }
  }

  if (!style) {
    console.warn(`Missing style attribute or content for parameter ${name}`);
    return '';
  }

  switch (parameter.in) {
    case 'path':
      return serializePathParameter(name, style, explode, value);
    case 'query':
      return serializeQueryParameter(name, style, explode, value);
    case 'header':
      return serializeHeaderParameter(style, explode, value);
    case 'cookie':
      return serializeCookieParameter(name, style, explode, value);
    default:
      console.warn('Unexpected parameter location: ' + parameter.in);
      return '';
  }
}

export function langFromMime(contentType: string): string {
  if (contentType.search(/xml/i) !== -1) {
    return 'xml';
  }
  return 'clike';
}

const DEFINITION_NAME_REGEX = /^#\/components\/(schemas|pathItems)\/([^/]+)$/;

export function isNamedDefinition(pointer?: string): boolean {
  return DEFINITION_NAME_REGEX.test(pointer || '');
}

export function getDefinitionName(pointer?: string): string | undefined {
  return pointer?.match(DEFINITION_NAME_REGEX)?.pop();
}

function humanizeMultipleOfConstraint(multipleOf: number | undefined): string | undefined {
  if (multipleOf === undefined) {
    return;
  }
  const strigifiedMultipleOf = multipleOf.toString(10);
  if (!/^0\.0*1$/.test(strigifiedMultipleOf)) {
    return `multiple of ${strigifiedMultipleOf}`;
  }
  return `decimal places <= ${strigifiedMultipleOf.split('.')[1].length}`;
}

function humanizeRangeConstraint(
  description: string,
  min: number | undefined,
  max: number | undefined,
): string | undefined {
  let stringRange;
  if (min !== undefined && max !== undefined) {
    if (min === max) {
      stringRange = `= ${min} ${description}`;
    } else {
      stringRange = `[ ${min} .. ${max} ] ${description}`;
    }
  } else if (max !== undefined) {
    stringRange = `<= ${max} ${description}`;
  } else if (min !== undefined) {
    if (min === 1) {
      stringRange = 'non-empty';
    } else {
      stringRange = `>= ${min} ${description}`;
    }
  }

  return stringRange;
}

export function humanizeNumberRange(schema: OpenAPISchema): string | undefined {
  const minimum =
    typeof schema.exclusiveMinimum === 'number'
      ? Math.min(schema.exclusiveMinimum, schema.minimum ?? Infinity)
      : schema.minimum;
  const maximum =
    typeof schema.exclusiveMaximum === 'number'
      ? Math.max(schema.exclusiveMaximum, schema.maximum ?? -Infinity)
      : schema.maximum;
  const exclusiveMinimum = typeof schema.exclusiveMinimum === 'number' || schema.exclusiveMinimum;
  const exclusiveMaximum = typeof schema.exclusiveMaximum === 'number' || schema.exclusiveMaximum;

  if (minimum !== undefined && maximum !== undefined) {
    return `${exclusiveMinimum ? '( ' : '[ '}${minimum} .. ${maximum}${
      exclusiveMaximum ? ' )' : ' ]'
    }`;
  } else if (maximum !== undefined) {
    return `${exclusiveMaximum ? '< ' : '<= '}${maximum}`;
  } else if (minimum !== undefined) {
    return `${exclusiveMinimum ? '> ' : '>= '}${minimum}`;
  }
}

export function humanizeConstraints(schema: OpenAPISchema): string[] {
  const res: string[] = [];

  const stringRange = humanizeRangeConstraint('characters', schema.minLength, schema.maxLength);
  if (stringRange !== undefined) {
    res.push(stringRange);
  }

  const arrayRange = humanizeRangeConstraint('items', schema.minItems, schema.maxItems);
  if (arrayRange !== undefined) {
    res.push(arrayRange);
  }

  const propertiesRange = humanizeRangeConstraint(
    schema.minProperties === 1 && schema.maxProperties === 1 ? 'property' : 'properties',
    schema.minProperties,
    schema.maxProperties,
  );
  if (propertiesRange !== undefined) {
    res.push(propertiesRange);
  }

  const multipleOfConstraint = humanizeMultipleOfConstraint(schema.multipleOf);
  if (multipleOfConstraint !== undefined) {
    res.push(multipleOfConstraint);
  }

  const numberRange = humanizeNumberRange(schema);
  if (numberRange !== undefined) {
    res.push(numberRange);
  }

  if (schema.uniqueItems) {
    res.push('unique');
  }

  return res;
}

export function sortByRequired(fields: FieldModel[], order: string[] = []): Array<FieldModel> {
  const unrequiredFields: FieldModel[] = [];
  const orderedFields: FieldModel[] = [];
  const unorderedFields: FieldModel[] = [];

  fields.forEach((field) => {
    if (field.required) {
      if (order.includes(field.name)) {
        orderedFields.push(field);
      } else {
        unorderedFields.push(field);
      }
    } else {
      unrequiredFields.push(field);
    }
  });

  orderedFields.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

  return [...orderedFields, ...unorderedFields, ...unrequiredFields];
}

export function sortByDeprecated(fields: FieldModel[]): Array<FieldModel> {
  return fields.sort((a, b) => Number(a.deprecated) - Number(b.deprecated));
}

export function mergeParams(
  parser: OpenAPIParser,
  pathParams: Array<Referenced<OpenAPIParameter>> = [],
  operationParams: Array<Referenced<OpenAPIParameter>> = [],
  { pathPointer, operationPointer },
): Array<{ paramOrRef: Referenced<OpenAPIParameter>; pointer: string }> {
  const operationParamNames = {};
  operationParams.forEach((param: OpenAPIParameter) => {
    ({ resolved: param as OpenAPIParameter } = parser.deref(param));
    operationParamNames[param.name + '_' + param.in] = true;
  });

  const pathParamsPointer = pathParams
    .map((paramOrRef, index) => ({
      paramOrRef,
      pointer: JsonPointer.join(pathPointer, ['parameters', String(index)]),
    }))
    // filter out path params overridden by operation ones with the same name
    .filter(({ paramOrRef }: { paramOrRef: OpenAPIParameter; pointer: string }) => {
      ({ resolved: paramOrRef as OpenAPIParameter } = parser.deref(paramOrRef));
      return !operationParamNames[paramOrRef.name + '_' + paramOrRef.in];
    });

  const operationParamsPointer = operationParams.map((paramOrRef, index) => ({
    paramOrRef,
    pointer: JsonPointer.join(operationPointer, ['parameters', String(index)]),
  }));

  return [...pathParamsPointer, ...operationParamsPointer];
}

export function normalizeServers(
  specUrl: string | undefined,
  servers: OpenAPIServer[],
): OpenAPIServer[] {
  const getHref = () => {
    if (!IS_BROWSER) {
      return (globalThis as any).SSR_HOSTNAME || '';
    }
    const href = window.location.href;
    return href.endsWith('.html') ? dirname(href) : href;
  };

  const baseUrl =
    specUrl === undefined
      ? removeQueryStringAndHash(getHref())
      : isAbsoluteUrl(specUrl)
        ? getUrlDirname(specUrl)
        : dirname(specUrl);

  if (servers.length === 0) {
    // Behaviour defined in OpenAPI spec: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#openapi-object
    servers = [
      {
        url: '/',
      },
    ];
  }

  return servers.map((server) => {
    return {
      ...server,
      url: baseUrl ? resolveUrl(baseUrl, server.url) : server.url,
      description: server.description || '',
    };
  });
}

export const shortenHTTPVerb = (verb: string): string =>
  ({
    delete: 'del',
    options: 'opts',
  })[verb] || verb;

export function isRedocExtension(key: string): boolean {
  const redocExtensions = {
    'x-circular-ref': true,
    'x-complex': true,
    'x-parentRefs': true,
    'x-refsStack': true,
    'x-codeSamples': true,
    'x-displayName': true,
    'x-examples': true,
    'x-logo': true,
    'x-nullable': true,
    'x-servers': true,
    'x-tagGroups': true,
    'x-traitTag': true,
    'x-additionalPropertiesName': true,
    'x-explicitMappingOnly': true,
    'x-enumDescriptions': true,
    'x-badges': true,
  };

  return key in redocExtensions || key.startsWith('x-parsed-md-');
}

export function extractExtensions(
  obj: GenericObject,
  showExtensions: string[] | true,
): GenericObject {
  return Object.keys(obj)
    .filter((key) => {
      if (showExtensions === true) {
        return key.startsWith('x-') && !isRedocExtension(key);
      }
      return key.startsWith('x-') && showExtensions.indexOf(key) > -1;
    })
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

export function pluralizeType(displayType: string): string {
  return displayType
    .split(' or ')
    .map((type) => type.replace(/^(string|object|number|integer|array|boolean)s?( ?.*)/, '$1s$2'))
    .join(' or ');
}

export function getContentWithLegacyExamples(
  info: OpenAPIRequestBody | OpenAPIResponse,
): { [mime: string]: OpenAPIMediaType } | undefined {
  let mediaContent = info.content;
  const xExamples = info['x-examples']; // converted from OAS2 body param
  const xExample = info['x-example']; // converted from OAS2 body param

  if (xExamples) {
    mediaContent = { ...mediaContent };
    for (const mime of Object.keys(xExamples)) {
      const examples = xExamples[mime];
      mediaContent[mime] = {
        ...mediaContent[mime],
        examples,
      };
    }
  } else if (xExample) {
    mediaContent = { ...mediaContent };
    for (const mime of Object.keys(xExample)) {
      const example = xExample[mime];
      mediaContent[mime] = {
        ...mediaContent[mime],
        example,
      };
    }
  }

  return mediaContent;
}
