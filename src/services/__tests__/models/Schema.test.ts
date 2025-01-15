/* eslint-disable @typescript-eslint/no-var-requires */
import { parseYaml } from '@redocly/openapi-core';
import { outdent } from 'outdent';
import { MediaTypeModel } from '../../models';
import { SchemaModel } from '../../models/Schema';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';
import { enumDetailsPrinter, printSchema } from './helpers';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('Schema', () => {
    let parser;

    test('parsing nested x-enumDescription', () => {
      const spec = require('../fixtures/nestedEnumDescroptionSample.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const testSchema = spec.components.schemas.Test;
      const schemaModel = new SchemaModel(parser, testSchema, '', opts);

      expect(schemaModel['x-enumDescriptions']).toStrictEqual(
        testSchema.items['x-enumDescriptions'],
      );
    });

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

      expect(schema.fields).toHaveLength(4);
      expect(schema.fields![0].kind).toEqual('field');
      expect(schema.fields![0].name).toEqual('nestedObjectProp');
      expect(schema.fields![0].schema.type).toEqual('object');
      expect(schema.fields![0].schema.fields![0].kind).toEqual('patternProperties');

      expect(schema.fields).toHaveLength(4);
      expect(schema.fields![1].kind).toEqual('field');
      expect(schema.fields![1].name).toEqual('nestedArrayProp');
      expect(schema.fields![1].schema.items!.fields![0].kind).toEqual('patternProperties');

      expect(schema.fields![2].kind).toEqual('patternProperties');
      expect(schema.fields![2].schema.type).toEqual('string');
      expect(schema.fields![3].kind).toEqual('patternProperties');
      expect(schema.fields![3].schema.type).toEqual('object');
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

      test.each(eachArray)(
        'schemaDefinition should resolve items with boolean type',
        specFixture => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, opts);
          const schema = new SchemaModel(parser, spec.components.schemas.Case7, '', opts);
          expect(schema.fields?.[0].schema?.type).toBe('array');
          expect(schema.fields?.[0].schema?.typePrefix).toBe('Array of ');
          expect(schema.fields?.[0].schema.items?.displayType).toBe('any');
          expect(schema?.fields).toHaveLength(1);
          expect(schema.fields?.[0].schema.pointer).toEqual('#/components/schemas/AnyArray');
          expect(schema.fields?.[0].schema.isPrimitive).toBe(true);
        },
      );
    });

    test('should get correct fields data if it includes allOf', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          User:
            allOf:
              - type: object
                properties:
                  name:
                    type: string
                    description: correct description name
                    readOnly: false
                    writeOnly: false
                  allOf:
                    - '#/components/schemas/NameField'
          NameField:
            type: object
            description: name description
            readOnly: true
            writeOnly: false

      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.User,
        '#/components/schemas/User',
        opts,
      );
      const fieldSchema = schema.fields?.[0].schema;
      expect(fieldSchema?.readOnly).toBe(false);
      expect(fieldSchema?.writeOnly).toBe(false);
      expect(printSchema(schema)).toMatchInlineSnapshot(`
        "name: <string> (correct description name)
        allOf: <any>"
      `);
    });
    describe('enum values', () => {
      test('should get correct fields enum fields without duplication', () => {
        const spec = parseYaml(outdent`
          openapi: 3.0.0
          components:
            schemas:
              StringField: { type: string, title: StringField, enum: [A, B, C] }
              FieldA: { type: string, title: FieldA, enum: [A1, A2, A3] }
              FieldB: { type: string, title: FieldB, enum: [B1, B2, B3] }
              FieldC: { type: string, title: FieldC, enum: [C1, C2, C3] }
              ObjectWithAllOf:
                title: StringFilter
                type: object
                allOf:
                  - properties:
                      type: { type: string, enum: [STRING] }
                      field: { $ref: '#/components/schemas/StringField' }
                    required: [type, field, values]
                  - oneOf:
                      - properties:
                          field: { type: string, enum: [A] }
                          values: { type: array, items: { $ref: '#/components/schemas/FieldA' } }
                      - properties:
                          field: { type: string, enum: [B] }
                          values: { type: array, items: { $ref: '#/components/schemas/FieldB' } }
                      - properties:
                          field: { type: string, enum: [C] }
                          values: { type: array, items: { $ref: '#/components/schemas/FieldC' } }
              ObjectWithOneOf:
                title: StringFilter
                type: object
                properties:
                  type: { type: string, enum: [STRING] }
                  field: { $ref: '#/components/schemas/StringField' }
                required: [type, field, values]
                oneOf:
                  - properties:
                      field: { type: string, enum: [A] }
                      values: { type: array, items: { $ref: '#/components/schemas/FieldA' } }
                  - properties:
                      field: { type: string, enum: [B] }
                      values: { type: array, items: { $ref: '#/components/schemas/FieldB' } }
                  - properties:
                      field: { type: string, enum: [C] }
                      values: { type: array, items: { $ref: '#/components/schemas/FieldC' } }
        `) as any;

        parser = new OpenAPIParser(spec, undefined, opts);
        const schemaWithOneOf = new SchemaModel(
          parser,
          spec.components.schemas.ObjectWithOneOf,
          '#/components/schemas/ObjectWithOneOf',
          opts,
        );
        expect(printSchema(schemaWithOneOf, enumDetailsPrinter)).toMatchInlineSnapshot(`
          "oneOf
            StringFilter ->
              field*: <string>enum: [A,B,C]
              values*: [<string>enum: [A1,A2,A3]]
              type*: <string>enum: [STRING]
            StringFilter ->
              field*: <string>enum: [A,B,C]
              values*: [<string>enum: [B1,B2,B3]]
              type*: <string>enum: [STRING]
            StringFilter ->
              field*: <string>enum: [A,B,C]
              values*: [<string>enum: [C1,C2,C3]]
              type*: <string>enum: [STRING]"
        `);

        const schemaWithAllOf = new SchemaModel(
          parser,
          spec.components.schemas.ObjectWithAllOf,
          '#/components/schemas/ObjectWithAllOf',
          opts,
        );
        expect(printSchema(schemaWithAllOf, enumDetailsPrinter)).toMatchInlineSnapshot(`
          "oneOf
            object ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [A,B,C]
              values*: [<string>enum: [A1,A2,A3]]
            object ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [B,A,C]
              values*: [<string>enum: [B1,B2,B3]]
            object ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [C,A,B]
              values*: [<string>enum: [C1,C2,C3]]"
        `);
      });

      test('should get correct fields enum limits', () => {
        const spec = parseYaml(outdent`
          openapi: 3.0.0
          components:
            schemas:
              StringField: { type: string, title: StringField, enum: [A, B, C] }
              FieldA: { type: string, title: FieldA, enum: [A1, A2, A3] }
              FieldB: { type: string, title: FieldB, enum: [B1, B2, B3] }
              FieldC: { type: string, title: FieldC, enum: [C1, C2, C3] }
              ObjectWithAllOf:
                title: StringFilter
                type: object
                allOf:
                  - properties:
                      type: { type: string, enum: [STRING] }
                    required: [type, field, values]
                  - oneOf:
                      - properties:
                          field: { type: string, enum: [A] }
                          values: { type: array, items: { $ref: '#/components/schemas/FieldA' } }
                      - properties:
                          field: { type: string, enum: [B] }
                          values: { type: array, items: { $ref: '#/components/schemas/FieldB' } }
                      - properties:
                          field: { type: string, enum: [C] }
                          values: { type: array, items: { $ref: '#/components/schemas/FieldC' } }
              ObjectWithOneOf:
                title: StringFilter
                type: object
                properties:
                  type: { type: string, enum: [STRING] }
                required: [type, field, values]
                oneOf:
                  - properties:
                      field: { type: string, enum: [A] }
                      values: { type: array, items: { $ref: '#/components/schemas/FieldA' } }
                  - properties:
                      field: { type: string, enum: [B] }
                      values: { type: array, items: { $ref: '#/components/schemas/FieldB' } }
                  - properties:
                      field: { type: string, enum: [C] }
                      values: { type: array, items: { $ref: '#/components/schemas/FieldC' } }
        `) as any;

        parser = new OpenAPIParser(spec, undefined, opts);
        const schemaWithOneOf = new SchemaModel(
          parser,
          spec.components.schemas.ObjectWithOneOf,
          '#/components/schemas/ObjectWithOneOf',
          opts,
        );
        expect(printSchema(schemaWithOneOf, enumDetailsPrinter)).toMatchInlineSnapshot(`
          "oneOf
            StringFilter ->
              field*: <string>enum: [A]
              values*: [<string>enum: [A1,A2,A3]]
              type*: <string>enum: [STRING]
            StringFilter ->
              field*: <string>enum: [B]
              values*: [<string>enum: [B1,B2,B3]]
              type*: <string>enum: [STRING]
            StringFilter ->
              field*: <string>enum: [C]
              values*: [<string>enum: [C1,C2,C3]]
              type*: <string>enum: [STRING]"
        `);

        const schemaWithAllOf = new SchemaModel(
          parser,
          spec.components.schemas.ObjectWithAllOf,
          '#/components/schemas/ObjectWithAllOf',
          opts,
        );
        expect(printSchema(schemaWithAllOf, enumDetailsPrinter)).toMatchInlineSnapshot(`
          "oneOf
            object ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [A]
              values*: [<string>enum: [A1,A2,A3]]
            object ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [B]
              values*: [<string>enum: [B1,B2,B3]]
            object ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [C]
              values*: [<string>enum: [C1,C2,C3]]"
        `);
      });
    });

    test('should get correct sibling inside schema type for openapi 3.1', () => {
      const spec = parseYaml(outdent`
        openapi: 3.1.0
        paths:
          /test:
            get:
              operationId: test
              responses:
                '200':
                  content:
                    application/json:
                      schema:
                        type: object
                        properties:
                          testAttr:
                            description: Overridden description
                            type: string
                            $ref: '#/components/schemas/Test'
        components:
          schemas:
            Test:
              type: object
              description: Refed description
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const name = 'application/json';
      const mediaType = new MediaTypeModel(
        parser,
        name,
        true,
        spec.paths['/test'].get.responses['200'].content[name],
        opts,
      );

      expect(printSchema(mediaType?.schema as any)).toMatchInlineSnapshot(
        `"testAttr: <string> (Overridden description)"`,
      );
    });

    test('should not override schema in openapi 3.0', () => {
      const spec = parseYaml(outdent`
        openapi: 3.0.0
        paths:
          /test:
            get:
              operationId: test
              responses:
                '200':
                  content:
                    application/json:
                      schema:
                        type: object
                        properties:
                          testAttr:
                            type: string
                            description: Overridden description
                            $ref: '#/components/schemas/Test'
        components:
          schemas:
            Test:
              type: object
              description: Refed description
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const name = 'application/json';
      const mediaType = new MediaTypeModel(
        parser,
        name,
        true,
        spec.paths['/test'].get.responses['200'].content[name],
        opts,
      );

      expect(printSchema(mediaType?.schema as any)).toMatchInlineSnapshot(
        `"testAttr: <object> (Refed description)"`,
      );
    });

    test('should correct get title from in oneOf ->const', () => {
      const spec = parseYaml(outdent`
        openapi: 3.0.0
        paths:
          /test:
            get:
              operationId: test
              responses:
                '200':
                  content:
                    application/json:
                      schema:
                        type: object
                        properties:
                          data:
                            type: object
                            properties:
                              response_code:
                                type: integer
                                description: A numeric response code
                                oneOf:
                                  - const: 0
                                    description: >
                                      Description for const 0
                                  - const: 1
                                    description: >
                                      Description for const 1
                                  - const: 2
                                    description: >
                                      Description for const 2
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const name = 'application/json';
      const mediaType = new MediaTypeModel(
        parser,
        name,
        true,
        spec.paths['/test'].get.responses['200'].content[name],
        opts,
      );

      expect(printSchema(mediaType?.schema as any)).toMatchInlineSnapshot(`
        "data:
          response_code: oneOf
              0 -> <integer> (Description for const 0
        )
              1 -> <integer> (Description for const 1
        )
              2 -> <integer> (Description for const 2
        )"
      `);
    });
  });
});
