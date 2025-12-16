import type { OperationModel } from '../index.js';

import { getField } from '../field.js';
import { normalizeOptions, OpenAPIParser } from '../../services/index.js';
import spec from './fixtures/fields.json';

const opts = normalizeOptions({});
const deps = { operation: { pointer: 'testFieldModel' } as OperationModel };
describe('Models', () => {
  describe('FieldModel', () => {
    const parser = new OpenAPIParser(
      spec as unknown as ConstructorParameters<typeof OpenAPIParser>[0],
      undefined,
      opts,
    );

    test('basic field details', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/testParam',
        },
        '#/components/parameters/testParam',
        opts,
        deps,
      );

      expect(field.name).toEqual('test_name');
      expect(field.in).toEqual('path');
      expect(field.required).toEqual(false);
      expect(field.schema.type).toEqual('string');
    });

    test('field details relevant for parameter serialization', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/serializationParam',
        },
        '#/components/parameters/serializationParam',
        opts,
        deps,
      );

      expect(field.name).toEqual('serialization_test_name');
      expect(field.in).toEqual('query');
      expect(field.schema.type).toEqual('array');
      expect(field.style).toEqual('form');
      expect(field.explode).toEqual(true);
    });

    test('field details relevant for default path param serialization', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/pathParamWithNoStyle',
        },
        '#/components/parameters/pathParamWithNoStyle',
        opts,
        deps,
      );

      expect(field.name).toEqual('serialization_test_name');
      expect(field.in).toEqual('path');
      expect(field.schema.type).toEqual('array');
      expect(field.style).toEqual('simple');
      expect(field.explode).toEqual(false);
    });

    test('field details relevant for default query parameter serialization', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/queryParamWithNoStyle',
        },
        '#/components/parameters/queryParamWithNoStyle',
        opts,
        deps,
      );

      expect(field.name).toEqual('serialization_test_name');
      expect(field.in).toEqual('query');
      expect(field.schema.type).toEqual('array');
      expect(field.style).toEqual('form');
      expect(field.explode).toEqual(true);
    });

    test('field details relevant for default cookie parameter serialization', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/queryParamWithNoStyle',
        },
        '#/components/parameters/queryParamWithNoStyle',
        opts,
        deps,
      );

      expect(field.name).toEqual('serialization_test_name');
      expect(field.in).toEqual('query');
      expect(field.schema.type).toEqual('array');
      expect(field.style).toEqual('form');
      expect(field.explode).toEqual(true);
    });

    test('field name should populated from name even if $ref (headers)', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/headers/testHeader',
          name: 'Test-Header',
        },
        '#/components/headers/testHeader',
        opts,
        deps,
      );

      expect(field.name).toEqual('Test-Header');
    });

    test('param example should be override the example provided by the schema', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/queryParamExample',
        },
        '',
        opts,
        deps,
      );

      expect(field.example).toEqual({ id: 'main example' });
      expect(field.schema.example).toEqual({ id: 'main example' });
      expect(field.schema.schema.example).toEqual({ id: 'main example' });
    });

    test('content example should be override the example provided by the schema', () => {
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/queryParamWithContentExample',
        },
        '',
        opts,
        deps,
      );

      expect(field.example).toEqual({ id: 'content example' });
      expect(field.schema.example).toEqual({ id: 'content example' });
      expect(field.schema.schema.example).toEqual({ id: 'content example' });
    });
  });
});
