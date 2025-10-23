/* eslint @typescript-eslint/no-var-requires: 0 */
import { parseYaml } from '@redocly/openapi-core';
import { outdent } from 'outdent';

import type { OperationModel, SchemaModel } from '../types';

import { getMediaType } from '../mediaType';
import { getField } from '../field';
import { normalizeOptions, OpenAPIParser } from '../../services';
import { enumDetailsPrinter, printSchema } from './helpers';
import { getSchema } from '../schema';

const options = normalizeOptions({});
const deps = { operation: { pointer: 'testSchema' } as OperationModel };
describe('Models', () => {
  describe('Schema', () => {
    let parser;

    test('parsing nested x-enumDescription', () => {
      const spec = require('./fixtures/nestedEnumDescroptionSample.json');
      parser = new OpenAPIParser(spec, undefined, options);
      const testSchema = spec.components.schemas.Test;
      const schemaModel = getSchema({
        parser,
        schemaOrRef: testSchema,
        pointer: '',
        options,
        deps,
      });

      expect(schemaModel['x-enumDescriptions']).toStrictEqual(
        testSchema.items['x-enumDescriptions'],
      );
    });

    test('discriminator with one field', () => {
      const spec = require('./fixtures/discriminator.json');
      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.Foo,
        pointer: '',
        options,
        deps,
      });
      expect(schema.oneOf).toHaveLength(1);
      expect(schema.discriminatorProp).toEqual('type');
    });

    test('oneOf/allOf titles', () => {
      const spec = require('./fixtures/oneOfTitles.json');
      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.Test,
        pointer: '',
        options,
        deps,
      });
      expect(schema.fields).toHaveLength(3);
      const anyOfField = schema.fields?.[0];
      const oneOfField = schema.fields?.[1];

      expect(anyOfField?.schema.displayType).toMatchInlineSnapshot(
        `"Foo (object) or Bar (object) or Base (object) or SpecificBase (object) or SpecificBase2 (object)"`,
      );
      expect(anyOfField?.schema.oneOf?.[0].title).toBe('Foo');
      expect(anyOfField?.schema.oneOf?.[1].title).toBe('Bar');
      expect(anyOfField?.schema.oneOf?.[2].title).toBe('Base');
      expect(anyOfField?.schema.oneOf?.[3].title).toBe('SpecificBase');
      expect(anyOfField?.schema.oneOf?.[4].title).toBe('SpecificBase2');

      expect(oneOfField?.schema.displayType).toMatchInlineSnapshot(
        `"Foo (object) or Bar (object) or Base (object) or SpecificBase (object) or SpecificBase2 (object)"`,
      );
      expect(oneOfField?.schema.oneOf?.[0].title).toBe('Foo');
      expect(oneOfField?.schema.oneOf?.[1].title).toBe('Bar');
      expect(oneOfField?.schema.oneOf?.[2].title).toBe('Base');
      expect(oneOfField?.schema.oneOf?.[3].title).toBe('SpecificBase');
      expect(oneOfField?.schema.oneOf?.[4].title).toBe('SpecificBase2');
    });

    test('oneOf/allOf titles with hideSchemaTitles', () => {
      const spec = require('./fixtures/oneOfTitles.json');
      const options = normalizeOptions({
        hideSchemaTitles: true,
      });
      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.Test,
        pointer: '',
        options,
        deps,
      });
      expect(schema.fields).toHaveLength(3);
      const anyOfField = schema.fields?.[0];
      const oneOfField = schema.fields?.[1];

      expect(anyOfField?.schema.displayType).toMatchInlineSnapshot(`"object"`);
      expect(anyOfField?.schema.oneOf?.[0].title).toBe('Foo');
      expect(anyOfField?.schema.oneOf?.[1].title).toBe('Bar');
      expect(anyOfField?.schema.oneOf?.[2].title).toBe('Base');
      expect(anyOfField?.schema.oneOf?.[3].title).toBe('SpecificBase');
      expect(anyOfField?.schema.oneOf?.[4].title).toBe('SpecificBase2');

      expect(oneOfField?.schema.displayType).toMatchInlineSnapshot(`"object"`);
      expect(oneOfField?.schema.oneOf?.[0].title).toBe('Foo');
      expect(oneOfField?.schema.oneOf?.[1].title).toBe('Bar');
      expect(oneOfField?.schema.oneOf?.[2].title).toBe('Base');
      expect(oneOfField?.schema.oneOf?.[3].title).toBe('SpecificBase');
      expect(oneOfField?.schema.oneOf?.[4].title).toBe('SpecificBase2');
    });

    test('oneOf/allOf schema complex displayType', () => {
      const spec = require('./fixtures/oneOfTitles.json');
      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.WithArray,
        pointer: '',
        options,
        deps,
      });
      expect(schema.oneOf).toHaveLength(2);
      expect(schema.displayType).toBe('(Array of strings or numbers) or string');
    });

    test('oneOf titles should not be overridden by parent schema title', () => {
      const spec = {
        openapi: '3.1.0',
        components: {
          schemas: {
            Parent: {
              title: 'Parent',
              type: 'object',
              oneOf: [
                { $ref: '#/components/schemas/Child1' },
                { $ref: '#/components/schemas/Child2' },
              ],
            },
            Child1: {
              title: 'Child1',
              type: 'object',
            },
            Child2: {
              type: 'object',
            },
          },
        },
      };

      parser = new OpenAPIParser(spec, undefined, options);

      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.Parent,
        pointer: '',
        options,
        deps,
      });

      expect(schema.oneOf?.[0].rawSchema.allOf[0].title).toBe('Child1');
      expect(schema.oneOf?.[1].rawSchema.allOf[0].title).toBe('Child2');
    });

    test('schemaDefinition should resolve schema with conditional operators', () => {
      const spec = require('./fixtures/3.1/conditionalSchema.json');
      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.Test,
        pointer: '',
        options,
        deps,
      });
      expect(schema.oneOf).toHaveLength(2);

      expect(schema.oneOf?.[0].schema.title).toBe('=== 10');
      expect(schema.oneOf?.[1].schema.title).toBe('case 2');

      expect(schema.oneOf?.[0].schema).toMatchSnapshot();
      expect(schema.oneOf?.[1].schema).toMatchSnapshot();
    });

    test('schemaDefinition should resolve field with conditional operators', () => {
      const spec = require('./fixtures/3.1/conditionalField.json');
      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.Test,
        pointer: '',
        options,
        deps,
      });
      expect(schema.fields).toHaveLength(1);
      expect(schema.fields && schema.fields[0].schema.oneOf).toHaveLength(2);
      expect(schema.fields && schema.fields[0].schema.oneOf?.[0].schema.title).toBe('isString');
      expect(schema.fields && schema.fields[0].schema.oneOf?.[1].schema.title).toBe('notString');

      expect(schema.fields && schema.fields[0].schema.oneOf?.[0].schema).toMatchSnapshot();
      expect(schema.fields && schema.fields[0].schema.oneOf?.[1].schema).toMatchSnapshot();
    });

    test('schemaDefinition should resolve patternProperties', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      const spec = require('./fixtures/3.1/patternProperties.json');
      parser = new OpenAPIParser(spec, undefined, {
        ...options,
        sortRequiredPropsFirst: true,
      });
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.Patterns,
        pointer: '',
        options: {
          ...options,
          sortRequiredPropsFirst: true,
        },
        deps,
      });
      expect(schema.fields).toHaveLength(5);
      expect(schema.fields?.[0].kind).toEqual('field');
      expect(schema.fields?.[0].name).toEqual('nestedObjectProp');
      expect(schema.fields?.[0].schema.fields?.[0].kind).toEqual('patternProperties');

      expect(schema.fields?.[1].kind).toEqual('field');
      expect(schema.fields?.[1].name).toEqual('nestedArrayProp');
      expect(schema.fields?.[1].schema.type).toEqual('array');
      expect(schema.fields?.[1].schema.items?.fields?.[0].kind).toEqual('patternProperties');

      expect(schema.fields?.[2].kind).toEqual('patternProperties');
      expect(schema.fields?.[2].schema.type).toEqual('string');
      expect(schema.fields?.[3].kind).toEqual('patternProperties');
      expect(schema.fields?.[3].schema.type).toEqual('object');
      expect(schema.fields?.[4].kind).toEqual('patternProperties');
      expect(schema.fields?.[4].schema.type).toEqual('any');
    });

    describe('type array', () => {
      function testImmutablePart(schema: SchemaModel) {
        expect(schema.minItems).toEqual(1);
        expect(schema.maxItems).toEqual(10);
        expect(schema.fields?.[0].schema.type).toEqual('string');
        expect(schema.fields?.[1].schema.type).toEqual('number');
      }
      const eachArray = ['./fixtures/3.1/prefixItems.json', './fixtures/arrayItems.json'];

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems without additional items',
        (specFixture) => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, options);
          const schema = getSchema({
            parser,
            schemaOrRef: spec.components.schemas.Case1,
            pointer: '',
            options,
            deps,
          });

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(3);
          expect(schema.fields?.[2].name).toEqual('[2]');
          expect(schema.fields?.[2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields?.[2].schema.type).toEqual('object');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional items',
        (specFixture) => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, options);
          const schema = getSchema({
            parser,
            schemaOrRef: spec.components.schemas.Case2,
            pointer: '',
            options,
            deps,
          });

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields?.[3].name).toEqual('[3...]');
          expect(schema.fields?.[2].schema.type).toEqual('object');
          expect(schema.fields?.[2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields?.[3].schema.type).toEqual('any');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional items with $ref',
        (specFixture) => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, options);
          const schema = getSchema({
            parser,
            schemaOrRef: spec.components.schemas.Case3,
            pointer: '',
            options,
            deps,
          });

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields?.[3].name).toEqual('[3...]');
          expect(schema.fields?.[2].schema.type).toEqual('object');
          expect(schema.fields?.[2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields?.[3].schema.type).toEqual('object');
          expect(schema.fields?.[3].schema.pointer).toEqual('#/components/schemas/Dog');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional schema items',
        (specFixture) => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, options);
          const schema = getSchema({
            parser,
            schemaOrRef: spec.components.schemas.Case4,
            pointer: '',
            options,
            deps,
          });

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields?.[3].name).toEqual('[3...]');
          expect(schema.fields?.[2].schema.type).toEqual('object');
          expect(schema.fields?.[2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields?.[3].schema.type).toEqual('object');
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional array items',
        (specFixture) => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, options);
          const schema = getSchema({
            parser,
            schemaOrRef: spec.components.schemas.Case5,
            pointer: '',
            options,
            deps,
          });

          testImmutablePart(schema);

          expect(schema.fields).toHaveLength(4);
          expect(schema.fields?.[3].name).toEqual('[3...]');
          expect(schema.fields?.[2].schema.type).toEqual('object');
          expect(schema.fields?.[2].schema.pointer).toEqual('#/components/schemas/Cat');
          expect(schema.fields?.[3].schema.type).toEqual('array');
          expect(schema.fields?.[3].schema.fields).toHaveLength(1);
          expect(schema.fields?.[3].schema.fields?.[0].schema.type).toEqual('string');
          expect(schema.fields?.[3].schema.fields?.[0].schema.constraints).toEqual([
            '>= 0 characters',
          ]);
        },
      );

      test.each(eachArray)(
        'schemaDefinition should resolve prefixItems with additional array items',
        (specFixture) => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, options);
          const schema = getSchema({
            parser,
            schemaOrRef: spec.components.schemas.Case6,
            pointer: '',
            options,
            deps,
          });
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
        (specFixture) => {
          const spec = require(specFixture);
          const parser = new OpenAPIParser(spec, undefined, options);
          const schema = getSchema({
            parser,
            schemaOrRef: spec.components.schemas.Case7,
            pointer: '',
            options,
            deps,
          });
          expect(schema.fields?.[0].schema?.type).toBe('array');
          expect(schema.fields?.[0].schema?.typePrefix).toBe('Array of ');
          expect(schema.fields?.[0].schema.items?.displayType).toBe('object');
          expect(schema?.fields).toHaveLength(1);
          expect(schema.fields?.[0].schema.pointer).toEqual('#/components/schemas/AnyArray');
          expect(schema.fields?.[0].schema.isPrimitive).toBe(true);
        },
      );
    });

    test('content example should be override the example provided by the schema', () => {
      const spec = require('./fixtures/fields.json');
      parser = new OpenAPIParser(spec, undefined, options);
      const field = getField(
        parser,
        {
          $ref: '#/components/parameters/queryParamWithContentExample',
        },
        '',
        options,
        deps,
      );
      const schema = getSchema({
        parser,
        schemaOrRef: field.schema.schema,
        pointer: '',
        options,
        deps,
      });
      expect(schema.fields && schema.fields[0].example).toEqual('content example');
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
            description: name description
            readOnly: true
            writeOnly: true
      `) as any;

      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.User,
        pointer: '#/components/schemas/User',
        options,
        deps,
      });
      expect(schema.fields?.[0].schema?.readOnly).toBe(false);
      expect(schema.fields?.[0].schema?.writeOnly).toBe(false);
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

        parser = new OpenAPIParser(spec, undefined, options);
        const schemaWithOneOf = getSchema({
          parser,
          schemaOrRef: spec.components.schemas.ObjectWithOneOf,
          pointer: '#/components/schemas/ObjectWithOneOf',
          options,
          deps,
        });
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

        const schemaWithAllOf = getSchema({
          parser,
          schemaOrRef: spec.components.schemas.ObjectWithAllOf,
          pointer: '#/components/schemas/ObjectWithAllOf',
          options,
          deps,
        });
        expect(printSchema(schemaWithAllOf, enumDetailsPrinter)).toMatchInlineSnapshot(`
          "oneOf
            StringFilter ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [A,B,C]
              values*: [<string>enum: [A1,A2,A3]]
            StringFilter ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [B,A,C]
              values*: [<string>enum: [B1,B2,B3]]
            StringFilter ->
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

        parser = new OpenAPIParser(spec, undefined, options);
        const schemaWithOneOf = getSchema({
          parser,
          schemaOrRef: spec.components.schemas.ObjectWithOneOf,
          pointer: '#/components/schemas/ObjectWithOneOf',
          options,
          deps,
        });
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

        const schemaWithAllOf = getSchema({
          parser,
          schemaOrRef: spec.components.schemas.ObjectWithAllOf,
          pointer: '#/components/schemas/ObjectWithAllOf',
          options,
          deps,
        });
        expect(printSchema(schemaWithAllOf, enumDetailsPrinter)).toMatchInlineSnapshot(`
          "oneOf
            StringFilter ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [A]
              values*: [<string>enum: [A1,A2,A3]]
            StringFilter ->
              type*: <string>enum: [STRING]
              field*: <string>enum: [B]
              values*: [<string>enum: [B1,B2,B3]]
            StringFilter ->
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

      parser = new OpenAPIParser(spec, undefined, options);
      const name = 'application/json';
      const mediaType = getMediaType(
        parser,
        name,
        true,
        spec.paths['/test'].get.responses['200'].content[name],
        options,
        deps,
      );

      expect(printSchema(mediaType?.schema as any)).toMatchInlineSnapshot(
        `"testAttr: <object> (Overridden description)"`,
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

      parser = new OpenAPIParser(spec, undefined, options);
      const name = 'application/json';
      const mediaType = getMediaType(
        parser,
        name,
        true,
        spec.paths['/test'].get.responses['200'].content[name],
        options,
        deps,
      );

      expect(printSchema(mediaType?.schema as any)).toMatchInlineSnapshot(
        `"testAttr: <object> (Refed description)"`,
      );
    });

    test('should correctly merge the types of props in an allOf', () => {
      const spec = parseYaml(outdent`
        openapi: 3.0.0
        components:
          schemas:
            value:
              allOf:
                - type: object
                  properties:
                    baseProp: { type: string }
                    testProp: { type: boolean }
                - type: object
                  properties:
                    baseProp: { type: string }
                    testProp: { type: number }
      `) as any;

      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.value,
        pointer: '#/components/schemas/value',
        options,
        deps,
      });

      expect(printSchema(schema)).toMatchInlineSnapshot(`
        "baseProp: <string>
        testProp: <number>"
      `);
    });

    // Required for JSON Schema Specification Draft 07, which is used by asyncapi-docs
    test('should handle array schema with items as an array', () => {
      const spec = parseYaml(outdent`
        openapi: 3.0.0
        components:
          schemas:
            BranchPayload:
              title: Branch created payload
              allOf:
                - type: object
                  properties:
                    subjects:
                      type: array
                      items:
                        - type: object
                          description: Summary of Branch resource.
                          properties:
                            uri:
                              type: string
                              format: uri
                              readOnly: true
                          required:
                            - uri
                        - type: object
                          description: Summary of Branch resource.
                          properties:
                            id:
                              type: string
                              readOnly: true
                          required:
                            - id
                    additionalItems: false
                    minItems: 1
                    maxItems: 1
      `) as any;

      parser = new OpenAPIParser(spec, undefined, options);
      const schema = getSchema({
        parser,
        schemaOrRef: spec.components.schemas.BranchPayload,
        pointer: '#/components/schemas/BranchPayload',
        options,
        deps,
      });

      expect(printSchema(schema as any)).toMatchInlineSnapshot(`
        "subjects:
          [0]:
            uri*: <string>
          [1]:
            id*: <string>
        additionalItems: <any>
        minItems: <any>
        maxItems: <any>"
      `);
    });
  });
});
