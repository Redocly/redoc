import { SchemaModel } from '../../models/Schema';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('Schema', () => {
    let parser;

    test('discriminator with one field', () => {
      const spec = require('../fixtures/discriminator.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Foo, '', opts);
      expect(schema.oneOf).toHaveLength(1);
      expect(schema.discriminatorProp).toEqual('type');
    });
  });
});
