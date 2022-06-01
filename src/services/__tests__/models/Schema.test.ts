/* eslint-disable @typescript-eslint/no-var-requires */
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

    test('oneOf/allOf titles', () => {
      const spec = require('../fixtures/oneOfTitles.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Test, '', opts);
      expect(schema.fields).toHaveLength(3);
      const oneOfField = schema.fields![0];
      expect(oneOfField.schema.displayType).toBe('Foo (object) or Bar (object)');
      expect(oneOfField.schema.oneOf![0].title).toBe('Foo');
      expect(oneOfField.schema.oneOf![1].title).toBe('Bar');

      const anyOfField = schema.fields![1];
      expect(anyOfField.schema.displayType).toBe('Foo (object) or Bar (object)');
      expect(anyOfField.schema.oneOf![0].title).toBe('Foo');
      expect(anyOfField.schema.oneOf![1].title).toBe('Bar');
    });

    test('oneOf/allOf schema complex displayType', () => {
      const spec = require('../fixtures/oneOfTitles.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.WithArray, '', opts);
      expect(schema.oneOf).toHaveLength(2);
      expect(schema.displayType).toBe('(Array of strings or numbers) or string');
    });

    test('schemaDefinition should resolve double ref', () => {
      const spec = require('../fixtures/3.1/schemaDefinition.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Parent, '', opts);
      expect(schema.fields).toHaveLength(1);
      expect(schema.pointer).toBe('#/components/schemas/Child');
    });

    test('schemaDefinition should resolve schema with conditional operators', () => {
      const spec = require('../fixtures/3.1/conditionalSchema.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Test, '', opts);
      expect(schema.oneOf).toHaveLength(2);

      expect(schema.oneOf![0].schema.title).toBe('=== 10');
      expect(schema.oneOf![1].schema.title).toBe('case 2');

      expect(schema.oneOf![0].schema).toMatchSnapshot();
      expect(schema.oneOf![1].schema).toMatchSnapshot();
    });

    test('schemaDefinition should resolve field with conditional operators', () => {
      const spec = require('../fixtures/3.1/conditionalField.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Test, '', opts);
      expect(schema.fields).toHaveLength(1);
      expect(schema.fields && schema.fields[0].schema.oneOf).toHaveLength(2);
      expect(schema.fields && schema.fields[0].schema.oneOf![0].schema.title).toBe('isString');
      expect(schema.fields && schema.fields[0].schema.oneOf![1].schema.title).toBe('notString');

      expect(schema.fields && schema.fields[0].schema.oneOf![0].schema).toMatchSnapshot();
      expect(schema.fields && schema.fields[0].schema.oneOf![1].schema).toMatchSnapshot();
    });

    test('schemaDefinition should resolve unevaluatedProperties in properties', () => {
      const spec = require('../fixtures/3.1/unevaluatedProperties.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Test, '', opts);
      expect(schema.fields).toHaveLength(2);
      expect(schema.fields![1].kind).toEqual('additionalProperties');
      expect(schema.fields![1].schema.type).toEqual('any');
    });

    test('schemaDefinition should resolve unevaluatedProperties in anyOf', () => {
      const spec = require('../fixtures/3.1/unevaluatedProperties.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Test2, '', opts);
      expect(schema.oneOf![0].fields).toHaveLength(2);
      expect(schema.oneOf![0].fields![1].kind).toEqual('additionalProperties');
      expect(schema.oneOf![1].fields).toHaveLength(2);
      expect(schema.oneOf![1].fields![1].kind).toEqual('additionalProperties');
    });

    test('schemaDefinition should resolve unevaluatedProperties type boolean', () => {
      const spec = require('../fixtures/3.1/unevaluatedProperties.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Test3, '', opts);
      expect(schema.fields).toHaveLength(2);
      expect(schema.fields![1].kind).toEqual('additionalProperties');
      expect(schema.fields![1].schema.type).toEqual('boolean');
    });

    test('schemaDefinition should resolve patternProperties', () => {
      const spec = require('../fixtures/3.1/patternProperties.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Patterns, '', opts);
      expect(schema.fields).toHaveLength(2);
      expect(schema.fields![0].kind).toEqual('patternProperties');
      expect(schema.fields![0].schema.type).toEqual('string');
      expect(schema.fields![1].kind).toEqual('patternProperties');
      expect(schema.fields![1].schema.type).toEqual('object');
    });

    describe('type array', () => {
      function testImmutablePart(schema: SchemaModel) {
        expect(schema.minItems).toEqual(1);
        expect(schema.maxItems).toEqual(10);
        expect(schema.fields![0].schema.type).toEqual('string');
        expect(schema.fields![1].schema.type).toEqual('number');
      }
      const eachArray = ['../fixtures/3.1/prefixItems.json', '../fixtures/arrayItems.json'];

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems without additional items',
        specFixture => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, opts);
          const schema = new SchemaModel(parser, spec.components.schemas.Case1, '', opts);

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(3);
          expect(schema.fields![2].name).toEqual('[2]');
          expect(schema.fields![2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields![2].schema.type).toEqual('object');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional items',
        specFixture => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, opts);
          const schema = new SchemaModel(parser, spec.components.schemas.Case2, '', opts);

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields![3].name).toEqual('[3...]');
          expect(schema.fields![2].schema.type).toEqual('object');
          expect(schema.fields![2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields![3].schema.type).toEqual('any');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional items with $ref',
        specFixture => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, opts);
          const schema = new SchemaModel(parser, spec.components.schemas.Case3, '', opts);

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields![3].name).toEqual('[3...]');
          expect(schema.fields![2].schema.type).toEqual('object');
          expect(schema.fields![2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields![3].schema.type).toEqual('object');
          expect(schema.fields![3].schema.pointer).toEqual('#/components/schemas/Dog');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional schema items',
        specFixture => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, opts);
          const schema = new SchemaModel(parser, spec.components.schemas.Case4, '', opts);

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields![3].name).toEqual('[3...]');
          expect(schema.fields![2].schema.type).toEqual('object');
          expect(schema.fields![2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields![3].schema.type).toEqual('object');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional array items',
        specFixture => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, opts);
          const schema = new SchemaModel(parser, spec.components.schemas.Case5, '', opts);

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields![3].name).toEqual('[3...]');
          expect(schema.fields![2].schema.type).toEqual('object');
          expect(schema.fields![2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields![3].schema.type).toEqual('array');
          expect(schema.fields![3].schema.fields).toHaveLength(1);
          expect(schema.fields![3].schema.fields![0].schema.type).toEqual('string');
          expect(schema.fields![3].schema.fields![0].schema.constraints).toEqual([
            '>= 0 characters',
          ]);
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional array items',
        specFixture => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, opts);
          const schema = new SchemaModel(parser, spec.components.schemas.Case6, '', opts);
          expect(schema.type).toBe('array');
          expect(schema.typePrefix).toBe('Array of ');
          expect(schema.items?.fields).toHaveLength(2);
          expect(schema.items?.pointer).toEqual('#/components/schemas/Tag');
          expect(schema.isPrimitive).toBe(false);
          expect(schema.items?.isPrimitive).toBe(false);
          expect(schema.minItems).toBe(1);
        },
      );
    });
  });
});
