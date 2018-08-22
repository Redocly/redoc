import * as Sampler from 'openapi-sampler';

import { OpenAPIExample, OpenAPIMediaType } from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { SchemaModel } from './Schema';

import { isJsonLike, mapValues } from '../../utils';
import { OpenAPIParser } from '../OpenAPIParser';
import { ExampleModel } from './Example';

export class MediaTypeModel {
  examples?: { [name: string]: OpenAPIExample };
  schema?: SchemaModel;
  name: string;
  isRequestType: boolean;

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
    if (info.examples !== undefined) {
      this.examples = mapValues(info.examples, example => new ExampleModel(parser, example));
    } else if (info.example !== undefined) {
      this.examples = {
        default: new ExampleModel(parser, { value: info.example }),
      };
    } else if (isJsonLike(name)) {
      this.generateExample(parser, info);
    }
  }

  generateExample(parser: OpenAPIParser, info: OpenAPIMediaType) {
    if (this.schema && this.schema.oneOf) {
      this.examples = {};
      for (const subSchema of this.schema.oneOf) {
        const sample = Sampler.sample(
          subSchema.rawSchema,
          { skipReadOnly: this.isRequestType, skipWriteOnly: !this.isRequestType },
          parser.spec,
        );

        if (this.schema.discriminatorProp && typeof sample === 'object' && sample) {
          sample[this.schema.discriminatorProp] = subSchema.title;
        }

        this.examples[subSchema.title] = {
          value: sample,
        };
      }
    } else if (this.schema) {
      this.examples = {
        default: new ExampleModel(parser, {
          value: Sampler.sample(
            info.schema,
            { skipReadOnly: this.isRequestType, skipWriteOnly: !this.isRequestType },
            parser.spec,
          ),
        }),
      };
    }
  }
}
