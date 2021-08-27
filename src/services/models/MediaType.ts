import * as Sampler from 'openapi-sampler';

import { OpenAPIMediaType } from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { SchemaModel } from './Schema';

import { isJsonLike, mapValues } from '../../utils';
import { OpenAPIParser } from '../OpenAPIParser';
import { ExampleModel } from './Example';
import { ReverseEventsRWOProps } from './Operation';

export class MediaTypeModel {
  examples?: { [name: string]: ExampleModel };
  schema?: SchemaModel;
  name: string;
  isRequestType: boolean;
  onlyRequiredInSamples: boolean;

  /**
   * @param isRequestType needed to know if skipe RO/RW fields in objects
   */
  constructor(
    parser: OpenAPIParser,
    name: string,
    isRequestType: boolean,
    info: OpenAPIMediaType,
    options: RedocNormalizedOptions,
    reverseEventsReadWriteOnly: ReverseEventsRWOProps = {},
  ) {
    this.name = name;
    this.isRequestType = isRequestType;
    this.schema = info.schema && new SchemaModel(parser, info.schema, '', options, false, reverseEventsReadWriteOnly);
    this.onlyRequiredInSamples = options.onlyRequiredInSamples;
    if (info.examples !== undefined) {
      this.examples = mapValues(
        info.examples,
        example => new ExampleModel(parser, example, name, info.encoding),
      );
    } else if (info.example !== undefined) {
      this.examples = {
        default: new ExampleModel(
          parser,
          { value: parser.shalowDeref(info.example) },
          name,
          info.encoding,
        ),
      };
    } else if (isJsonLike(name)) {
      this.generateExample(parser, info, reverseEventsReadWriteOnly);
    }
  }

  generateExample(parser: OpenAPIParser, info: OpenAPIMediaType, reverseEventsReadWriteOnly: ReverseEventsRWOProps) {
    const { reverseEventsReadOnlyProps, reverseEventsWriteOnlyProps } = reverseEventsReadWriteOnly;
    const samplerOptions = {
      skipReadOnly: reverseEventsReadOnlyProps ? !this.isRequestType : this.isRequestType,
      skipWriteOnly: reverseEventsWriteOnlyProps ? this.isRequestType : !this.isRequestType,
      skipNonRequired: this.isRequestType && this.onlyRequiredInSamples,
      maxSampleDepth: 10,
    };
    if (this.schema && this.schema.oneOf) {
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
      }
    } else if (this.schema) {
      this.examples = {
        default: new ExampleModel(
          parser,
          {
            value: Sampler.sample(info.schema as any, samplerOptions, parser.spec),
          },
          this.name,
          info.encoding,
        ),
      };
    }
  }
}
