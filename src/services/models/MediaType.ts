import * as Sampler from 'openapi-sampler';

import type { OpenAPIMediaType } from '../../types';
import type { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { SchemaModel } from './Schema';

import { isXml, mapValues } from '../../utils';
import type { OpenAPIParser } from '../OpenAPIParser';
import { ExampleModel } from './Example';
import { ConfigAccessOptions, FinalExamples, generateXmlExample } from '../../utils/xml';
import { MergedOpenAPISchema } from '../types';
import { OpenAPIExample, Referenced } from '../../types';

export class MediaTypeModel {
  examples?: { [name: string]: ExampleModel };
  schema?: SchemaModel;
  name: string;
  isRequestType: boolean;
  onlyRequiredInSamples: boolean;
  generatedPayloadSamplesMaxDepth: number;

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
    const samplerOptions = {
      skipReadOnly: this.isRequestType,
      skipWriteOnly: !this.isRequestType,
      skipNonRequired: this.isRequestType && this.onlyRequiredInSamples,
      maxSampleDepth: this.generatedPayloadSamplesMaxDepth,
    };
    if (this.schema) {
      if (this.schema.oneOf) {
        this.examples = {};
        for (const subSchema of this.schema.oneOf) {
          const sample = Sampler.sample(subSchema.rawSchema as any, samplerOptions, parser.spec);

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

          const xmlExamples = this.resolveXmlExample(parser, sample as OpenAPIExample);
          if (xmlExamples[0]) {
            this.examples[subSchema.title].value = xmlExamples[0]?.exampleValue;
          }
        }
      } else {
        const infoOrRef: Referenced<OpenAPIExample> = {
          value: Sampler.sample(info.schema as any, samplerOptions, parser.spec),
        };
        const xmlExamples = this.resolveXmlExample(parser, infoOrRef.value);

        if (xmlExamples.length > 1) {
          this.examples = Object.fromEntries(
            xmlExamples.map(item => [
              item.exampleId,
              new ExampleModel(
                parser,
                {
                  value: item.exampleValue,
                },
                this.name,
                info.encoding,
              ),
            ]),
          );
        } else {
          this.examples = {
            default: new ExampleModel(
              parser,
              {
                value: xmlExamples[0]?.exampleValue || infoOrRef.value,
              },
              this.name,
              info.encoding,
            ),
          };
        }
      }
    }
  }

  resolveXmlExample(parser: OpenAPIParser, sample: OpenAPIExample) {
    const configAccessOptions: ConfigAccessOptions = {
      includeReadOnly: !this.isRequestType,
      includeWriteOnly: this.isRequestType,
    };
    const subSchema = this.schema?.schema;
    let xmlExamples: FinalExamples[] = [];
    if (subSchema && isXml(this.name)) {
      let resolved;
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
}
