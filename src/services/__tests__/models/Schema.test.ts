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
  });
});
