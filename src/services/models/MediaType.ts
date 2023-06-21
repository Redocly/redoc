import * as Sampler from 'openapi-sampler';

import { OpenAPIExample, OpenAPIMediaType, OpenAPISchema, Referenced } from '../../types';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { SchemaModel } from './Schema';

import { mapValues } from '../../utils';
import type { OpenAPIParser } from '../OpenAPIParser';
import { ExampleModel } from './Example';
import { ConfigAccessOptions, generateXmlExample } from '../../utils/xml';
import { MergedOpenAPISchema } from '../types';
import { generateCsvExample } from '../../utils/csv';
import { CODE_SAMPLE_LANGUAGES } from '../../constants/languages';
import { Example } from '../../types/example';

export class MediaTypeModel {
  examples?: { [name: string]: ExampleModel };
  schema?: SchemaModel;
  name: string;
  isRequestType: boolean;
  onlyRequiredInSamples: boolean;
  generatedPayloadSamplesMaxDepth: number;
  private readonly samplerOptions: {
    maxSampleDepth: number;
    skipNonRequired: boolean;
    skipReadOnly: boolean;
    skipWriteOnly: boolean;
  };

  /**
   * @param isRequestType needed to know if skipe RO/RW fields in objects
   */
  constructor(
    parser: OpenAPIParser,
    name: string,
    isRequestType: boolean,
    info: OpenAPIMediaType,
    options: RedocNormalizedOptions,
  ) {
    this.name = name;
    this.isRequestType = isRequestType;
    this.schema = info.schema && new SchemaModel(parser, info.schema, '', options);
    this.onlyRequiredInSamples = options.onlyRequiredInSamples;
    this.generatedPayloadSamplesMaxDepth = options.generatedPayloadSamplesMaxDepth;
    const isCodeGenerationSupported = options.codeSamplesLanguages.some(lang =>
      name.toLowerCase().includes(lang),
    );
    this.samplerOptions = {
      maxSampleDepth: this.generatedPayloadSamplesMaxDepth,
      skipNonRequired: this.isRequestType && this.onlyRequiredInSamples,
      skipReadOnly: this.isRequestType,
      skipWriteOnly: !this.isRequestType,
    };
    if (info.examples !== undefined) {
      this.examples = mapValues(
        info.examples,
        example => new ExampleModel(parser, example, name, info.encoding),
      );
    } else if (info.example !== undefined) {
      this.examples = {
        default: new ExampleModel(
          parser,
          { value: parser.deref(info.example).resolved },
          name,
          info.encoding,
        ),
      };
    } else if (isCodeGenerationSupported) {
      this.generateExample(parser, info);
    }
  }

  generateExample(parser: OpenAPIParser, info: OpenAPIMediaType) {
    if (this.schema) {
      if (this.schema.oneOf) {
        this.examples = {};
        for (const subSchema of this.schema.oneOf) {
          const sample = Sampler.sample(
            subSchema.rawSchema as any,
            this.samplerOptions,
            parser.spec,
          );

          if (this.schema.discriminatorProp && typeof sample === 'object' && sample) {
            sample[this.schema.discriminatorProp] = subSchema.title;
          }

          this.examples[subSchema.title] = new ExampleModel(
            parser,
            {
              value: sample,
            },
            this.name,
            info.encoding,
          );

          const [generatedExample] = this.resolveGeneratedExample(parser, sample as OpenAPIExample);
          if (generatedExample) {
            this.examples[subSchema.title].value = generatedExample.exampleValue;
          }
        }
      } else {
        let infoOrRef: Referenced<OpenAPIExample> = {
          value: Sampler.sample(info.schema as any, this.samplerOptions, parser.spec),
        };
        const generatedExamples = this.resolveGeneratedExample(parser, infoOrRef.value);

        if (generatedExamples.length > 1) {
          this.examples = Object.fromEntries(
            generatedExamples.map(item => [
              item.exampleId,
              new ExampleModel(
                parser,
                {
                  description: item.exampleDescription,
                  summary: item.exampleSummary,
                  value: item.exampleValue,
                },
                this.name,
                info.encoding,
              ),
            ]),
          );
        } else {
          const [generatedExample] = generatedExamples;
          if (generatedExample) {
            infoOrRef = {
              description: generatedExample.exampleDescription,
              summary: generatedExample.exampleSummary,
              value: generatedExample.exampleValue,
            };
          }
          this.examples = {
            default: new ExampleModel(parser, infoOrRef, this.name, info.encoding),
          };
        }
      }
    }
  }

  private resolveGeneratedExample(parser: OpenAPIParser, sample: OpenAPIExample): Example[] {
    const mimeType = this.name.toLowerCase();
    switch (true) {
      case mimeType.includes(CODE_SAMPLE_LANGUAGES.JSON):
        return []; // Already supported
      case mimeType.includes(CODE_SAMPLE_LANGUAGES.XML):
        return this.resolveXmlExample(parser, sample);
      case mimeType.includes(CODE_SAMPLE_LANGUAGES.CSV):
        return this.resolveCsvExample(parser, sample);
      default:
        throw new Error(`Unsupported code sample language: ${this.name}`);
    }
  }

  private resolveXmlExample(parser: OpenAPIParser, sample: OpenAPIExample) {
    const configAccessOptions: ConfigAccessOptions = {
      includeReadOnly: !this.isRequestType,
      includeWriteOnly: this.isRequestType,
    };
    const subSchema = this.schema?.schema;
    let xmlExamples: Example[] = [];
    if (subSchema) {
      let resolved: OpenAPISchema;
      if (subSchema.items) {
        resolved = {
          ...subSchema,
          items: parser.derefSchemaWithExample(
            subSchema.items as MergedOpenAPISchema,
            Array.isArray(sample) ? sample[0] : sample,
          ),
        };
      } else {
        resolved = parser.derefSchemaWithExample(subSchema, sample);
      }
      xmlExamples = generateXmlExample({
        includeReadOnly: configAccessOptions?.includeReadOnly,
        includeWriteOnly: configAccessOptions?.includeWriteOnly,
        schema: resolved,
      });
    }

    return xmlExamples;
  }

  private resolveCsvExample(parser: OpenAPIParser, sample: OpenAPIExample): Example[] {
    const subSchema = this.schema?.schema;
    return generateCsvExample({
      parser,
      schema: subSchema as MergedOpenAPISchema,
      sample,
      samplerOptions: this.samplerOptions,
    });
  }
}
