import { FieldModel } from '../../models/Field';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('FieldModel', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const spec = require('../fixtures/fields.json');
    const parser = new OpenAPIParser(spec, undefined, opts);

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

    test('field details relevant for default path param serialization', () => {
      const field = new FieldModel(
        parser,
        {
          $ref: '#/components/parameters/pathParamWithNoStyle',
        },
        '#/components/parameters/pathParamWithNoStyle',
        opts,
      );

      expect(field.name).toEqual('serialization_test_name');
      expect(field.in).toEqual('path');
      expect(field.schema.type).toEqual('array');
      expect(field.style).toEqual('simple');
      expect(field.explode).toEqual(false);
    });

    test('field details relevant for default query parameter serialization', () => {
      const field = new FieldModel(
        parser,
        {
          $ref: '#/components/parameters/queryParamWithNoStyle',
        },
        '#/components/parameters/queryParamWithNoStyle',
        opts,
      );

      expect(field.name).toEqual('serialization_test_name');
      expect(field.in).toEqual('query');
      expect(field.schema.type).toEqual('array');
      expect(field.style).toEqual('form');
      expect(field.explode).toEqual(true);
    });

    test('field details relevant for default cookie parameter serialization', () => {
      const field = new FieldModel(
        parser,
        {
          $ref: '#/components/parameters/queryParamWithNoStyle',
        },
        '#/components/parameters/queryParamWithNoStyle',
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

    test('header schema should be taken from content when inline schema is absent', () => {
      const field = new FieldModel(
        parser,
        {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
          name: 'Test-Header-With-Content',
        },
        '#/components/headers/Test-Header-With-Content',
        opts,
      );

      // header objects have no `in`, but their schema can still come from `content`
      expect(field.in).toBeUndefined();
      expect(field.schema.type).toEqual('array');
      expect(field.serializationMime).toEqual('application/json');
    });

    test('inline schema should win over content', () => {
      const field = new FieldModel(
        parser,
        {
          schema: { type: 'string' },
          content: {
            'application/json': {
              schema: { type: 'array' },
            },
          },
          name: 'Test-Header-With-Both',
        },
        '#/components/headers/Test-Header-With-Both',
        opts,
      );

      expect(field.schema.type).toEqual('string');
      expect(field.serializationMime).toBeUndefined();
    });
  });
});
