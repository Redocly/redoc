
import type {
  OpenAPIParameter,
  OpenAPIParameterLocation,
  OpenAPIParameterStyle,
  Referenced,
} from '../types/index.js';
import type { FieldModel, Deps } from './types.js';

import { joinWithSeparator, type OpenAPIParser, type Options } from '../services/index.js';
import {
  extractExtensions,
  getValueFromMdParsedExtension,
  mapValues,
  removePercentChart,
} from '../utils/index.js';
import { getSchema } from './schema.js';
import { getExamples } from './example.js';

const DEFAULT_SERIALIZATION: Record<
  OpenAPIParameterLocation,
  { explode: boolean; style: OpenAPIParameterStyle }
> = {
  path: {
    style: 'simple',
    explode: false,
  },
  query: {
    style: 'form',
    explode: true,
  },
  header: {
    style: 'simple',
    explode: false,
  },
  cookie: {
    style: 'form',
    explode: true,
  },
};

export function getField(
  parser: OpenAPIParser,
  infoOrRef: Referenced<OpenAPIParameter> & { name?: string; kind?: string },
  pointer: string,
  options: Options,
  deps: Deps,
  refsStack?: string[],
  absolutePointer = pointer,
): FieldModel {
  const { resolved: info } = parser.deref<OpenAPIParameter>(infoOrRef);
  const kind = infoOrRef.kind || 'field';
  const name = infoOrRef.name || info.name;
  const inValue = info.in;
  const required = !!info.required;

  let fieldSchema = info.schema;
  let serializationMime;
  let rawSerializationMime = '';
  let style;
  if (!fieldSchema && info.in && info.content) {
    rawSerializationMime = Object.keys(info.content)[0];
    const mediaContent = info.content[rawSerializationMime];

    fieldSchema =
      mediaContent && mediaContent?.example
        ? {
            ...parser.deref(mediaContent.schema, refsStack, true).resolved,
            example: info.example || mediaContent.example,
          }
        : mediaContent.schema;
  }
  const fieldFullPath = joinWithSeparator(deps.parentFieldFullPath, removePercentChart(name || '')); // We need to remove percent chart for field full path for prevent URI malformed error

  const schema = getSchema({
    parser,
    schemaOrRef: fieldSchema || {},
    pointer,
    options,
    baseRefsStack: refsStack,
    absolutePointer: infoOrRef['$ref'] || info.schema?.['absolutePointer'] || absolutePointer,
    deps: {
      ...deps,
      parentFieldFullPath: fieldFullPath,
      in: inValue,
    },
  });
  const description =
    info.description === undefined
      ? getValueFromMdParsedExtension(schema, 'description') || ''
      : getValueFromMdParsedExtension(info, 'description');
  const example = info.example || schema.example;

  const infoExamples = info.examples || info.content?.[rawSerializationMime]?.examples;

  const examples = infoExamples
    ? mapValues(infoExamples, (example, name) =>
        getExamples({
          parser,
          infoOrRef: example,
          mime: name,
          encoding: info.encoding,
        }),
      )
    : undefined;

  if (rawSerializationMime) {
    serializationMime = rawSerializationMime;
  } else if (info.style) {
    style = info.style;
  } else if (inValue) {
    style = DEFAULT_SERIALIZATION[inValue]?.style ?? 'form'; // fallback to from in case "in" is invalid
  }

  const explode =
    info.explode === undefined && inValue
      ? (DEFAULT_SERIALIZATION[inValue]?.explode ?? true)
      : !!info.explode;

  const deprecated = info.deprecated === undefined ? schema.deprecated : info.deprecated;

  const extensions = options.showExtensions
    ? extractExtensions(info, options.showExtensions)
    : undefined;

  const constValue = schema?.const || info?.const || '';

  return {
    deps: deps || {},
    schema,
    name,
    required,
    description,
    example,
    examples,
    deprecated,
    in: inValue,
    kind,
    extensions,
    explode,
    style,
    const: constValue,
    serializationMime,
    fieldFullPath,
  };
}
