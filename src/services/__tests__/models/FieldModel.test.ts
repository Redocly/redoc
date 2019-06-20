import { FieldModel } from '../../models/Field';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('FieldModel', () => {
    let parser;
    const spec = require('../fixtures/fields.json');
    parser = new OpenAPIParser(spec, undefined, opts);

    test('basic field details', () => {
      const field = new FieldModel(
        parser,
        {
          $ref: '#/components/parameters/testParam',
        },
        '#/components/parameters/testParam',
        opts,
      );

      expect(field.name).toEqual('test_name');
      expect(field.in).toEqual('path');
      expect(field.required).toEqual(false);
      expect(field.schema.type).toEqual('string');
    });

    test('field details relevant for parameter serialization', () => {
      const field = new FieldModel(
        parser,
        {
          $ref: '#/components/parameters/serializationParam',
        },
        '#/components/parameters/serializationParam',
        opts,
      );

      expect(field.name).toEqual('serialization_test_name');
      expect(field.in).toEqual('query');
      expect(field.schema.type).toEqual('array');
      expect(field.style).toEqual('form');
      expect(field.explode).toEqual(true);
    });

    test('field name should populated from name even if $ref (headers)', () => {
      const field = new FieldModel(
        parser,
        {
          $ref: '#/components/headers/testHeader',
          name: 'Test-Header',
        },
        '#/components/headers/testHeader',
        opts,
      );

      expect(field.name).toEqual('Test-Header');
    });
  });
});
