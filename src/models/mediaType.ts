import type { JSONSchema7 } from 'json-schema';
import type { OpenAPIMediaType } from '../types/index.js';
import type { OpenAPIParser, Options } from '../services/index.js';
import type {
  ExampleModel,
  MediaTypeModel,
  ResponseModel,
  OperationModel,
  SchemaModel,
} from './types.js';

import { getSchema } from './schema.js';
import {
  isFormUrlEncoded,
  isJsonLike,
  isXmlLike,
  isMultipartFormData,
  JsonPointer,
  mapValues,
} from '../utils/index.js';
import { getExamples } from './example.js';
import { safeSample } from '../services/code-samples/index.js';

type GenerateExamplesInput = {
  parser: OpenAPIParser;
  info: OpenAPIMediaType;
  schema?: SchemaModel;
  mime: string;
  options: {
    isRequestType: boolean;
    onlyRequiredInSamples: Options['onlyRequiredInSamples'];
    generatedSamplesMaxDepth: Options['generatedSamplesMaxDepth'];
    format?: 'json' | 'xml';
  };
};

function generateExamples({
  parser,
  info: { encoding, schema: infoSchema },
  schema,
  mime,
  options: { isRequestType, onlyRequiredInSamples, generatedSamplesMaxDepth, format = 'json' },
}: GenerateExamplesInput): { [name: string]: ExampleModel } {
  // FIXME: check warning in rebilly spec
  const samplerOptions = {
    skipReadOnly: isRequestType,
    skipWriteOnly: !isRequestType,
    skipNonRequired: isRequestType && onlyRequiredInSamples,
    maxSampleDepth: generatedSamplesMaxDepth,
    quiet: true,
    format,
  };

  let examples = {};

  if (schema && schema.oneOf) {
    for (const subSchema of schema.oneOf) {
      const sample = safeSample(
        subSchema.rawSchema as JSONSchema7,
        samplerOptions,
        parser.definition,
      );

      if (sample === null) {
        continue;
      }

      if (
        schema.discriminatorProp &&
        typeof sample === 'object' &&
        sample &&
        sample[schema.discriminatorProp] // handle case with readOnly with discriminator
      ) {
        sample[schema.discriminatorProp] = subSchema.title;
      }

      examples[subSchema.title] = getExamples({
        parser,
        infoOrRef: {
          value: sample,
        },
        mime,
        encoding,
      });
    }
  } else if (schema) {
    const sample = safeSample(infoSchema as JSONSchema7, samplerOptions, parser.definition);

    if (sample !== null) {
      examples = {
        default: getExamples({
          parser,
          infoOrRef: {
            value: sample,
          },
          mime,
          encoding,
        }),
      };
    } else {
      examples = {
        default: {
          value: null,
          rawValue: 'null',
        },
      };
    }
  } else {
    // default to {} example when schema is not defined
    examples = {
      default: {
        value: null,
        rawValue: 'null',
      },
    };
  }

  return examples;
}

/**
 * @param parser
 * @param name
 * @param isRequestType needed to know if skip RO/RW fields in objects
 * @param info
 * @param options
 * @param operation
 * @param type
 * @param response
 */
export function getMediaType(
  parser: OpenAPIParser,
  name: string,
  isRequestType: boolean,
  info: OpenAPIMediaType,
  options: Options,
  {
    operation,
    type,
    response,
    absolutePointer = '',
  }: {
    operation: OperationModel;
    type?: 'request' | 'response';
    response?: ResponseModel;
    absolutePointer?: string;
  },
): MediaTypeModel {
  let examples;
  let formExamples;
  const schema =
    info.schema &&
    getSchema({
      parser,
      schemaOrRef: info.schema,
      pointer: '',
      absolutePointer: JsonPointer.join(absolutePointer, ['content', name, 'schema']),
      options,
      deps: {
        operation,
        type,
        response,
      },
    });

  const { onlyRequiredInSamples, generatedSamplesMaxDepth } = options;
  const { encoding, examples: infoExamples, example } = info;

    if (infoExamples !== undefined) {
      examples = mapValues(infoExamples, (example) =>
        getExamples({ parser, infoOrRef: example, mime: name, encoding }),
      );
    } else if (example !== undefined) {
      examples = {
        default: getExamples({
          parser,
          infoOrRef: { value: parser.deref(example).resolved },
          mime: name,
          encoding,
        }),
      };
    } else if (isJsonLike(name) || isXmlLike(name)) {
      examples = generateExamples({
        parser,
        info,
        schema,
        mime: name,
        options: {
          isRequestType,
          onlyRequiredInSamples,
          generatedSamplesMaxDepth,
          format: isXmlLike(name) ? 'xml' : 'json',
        },
      });
    } else if (isFormUrlEncoded(name) || isMultipartFormData(name)) {
      formExamples = generateExamples({
        parser,
        info,
        schema,
        mime: name,
        options: {
          isRequestType,
          onlyRequiredInSamples,
          generatedSamplesMaxDepth,
        },
      });
    }

  return {
    examples,
    schema,
    name,
    isRequestType,
    formExamples,
    onlyRequiredInSamples,
    operation,
  };
}
