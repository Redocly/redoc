import { FieldModel } from '../../models/Field';
import { SchemaModel } from '../../models';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';
import { convertSwagger2OpenAPI } from '../../../utils/loadAndBundleSpec';

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

    test('field uses field description for complex objects', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const source = require('../fixtures/2.0/complexFieldDescriptions.json');

      // check incoming source
      expect(source.swagger).toEqual('2.0');

      const spec = await convertSwagger2OpenAPI(source);

      // sanity check for swagger 2.0 => 3.0
      expect(spec?.openapi).toEqual('3.0.0');

      const parser = new OpenAPIParser(spec, undefined, opts);
      if (!spec.components?.schemas?.Box) {
        throw Error('spec.components.schemas.Box is not a defined schema.');
      }

      const boxSchema = new SchemaModel(
        parser,
        spec.components.schemas.Box,
        '#/components/schemas/Box',
        opts,
      );

      if (!boxSchema.fields?.length) {
        throw Error('No fields defined on the box schema.');
      }

      // expected on the measurement _type_ only.
      const measurementSchemaDescription = 'Reusable measurement type.';

      // expected on the weight _field_ only.
      const weightField = boxSchema.fields[0];

      expect(weightField.name).toBe('weight');
      expect(weightField.description).toBe('The gross weight of the box and its contents (in kg).');

      expect(weightField.schema.type).toBe('object');
      expect(weightField.schema.title).toBe('Measurement');
      expect(weightField.schema.description).toBe(measurementSchemaDescription);

      // ensure all fields (they're all Measurements) don't inherit the schema's description.
      for (const field of boxSchema.fields) {
        expect(field.schema.title).toBe('Measurement');
        expect(field.description).not.toBe(measurementSchemaDescription);
      }
    });
  });
});
