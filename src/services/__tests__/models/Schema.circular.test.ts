import outdent from 'outdent';
import { parseYaml } from '@redocly/openapi-core';

/* eslint-disable @typescript-eslint/no-var-requires */
import { SchemaModel } from '../../models';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

import { circularDetailsPrinter, printSchema } from './helpers';

const opts = new RedocNormalizedOptions({}) as RedocNormalizedOptions;

describe('Models', () => {
  describe.only('Schema Circular tracking', () => {
    let parser;

    expect.addSnapshotSerializer({
      test: val => typeof val === 'string',
      print: v => v as string,
    });

    test('should detect circular for array nested in allOf', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Schema:
            type: object
            properties:
              a: { $ref: '#/components/schemas/Schema' }
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Schema,
        '#/components/schemas/Schema',
        opts,
      );

      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(
        `a: <object> !circular`,
      );
    });

    test('should not detect circular refs when ref used multiple times across allOf', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Foo:
            type: object
            properties:
              foo: { type: string }
          Schema:
            allOf:
              - $ref: '#/components/schemas/Foo'
              - type: object
                properties:
                  foobar: { $ref: '#/components/schemas/Foo' }
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Schema, '', opts);
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        foo: <string>
        foobar:
          foo: <string>
      `);
    });

    test('should detect circular for array with self-reference', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Array:
            type: "array"
            items: { "$ref": "#/components/schemas/Array" }
          Schema:
            allOf: [{ "$ref": "#/components/schemas/Array" }]
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Schema,
        '#/components/schemas/Schema',
        opts,
      );
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(
        `[<array> !circular]`,
      );
    });

    test('should detect circular for object nested in allOf', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Object:
            allOf:
              - $ref: '#/components/schemas/Object'
              - type: "object"
                properties: { "a": { "$ref": "#/components/schemas/Object" } }
          Schema:
            allOf: [{ "$ref": "#/components/schemas/Object" }]
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Schema,
        '#/components/schemas/Schema',
        opts,
      );
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(
        `a: <any> !circular`,
      );
    });

    test('should not detect circular for base DTO case', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          BaseDTO:
            type: object
            properties:
              id: {type: string}
          BaseB:
            type: object
            allOf:
              - $ref: '#/components/schemas/BaseDTO'
              - type: object
                properties:
                  fieldB: { type: string }
          BaseA:
            type: object
            allOf:
              - $ref: '#/components/schemas/BaseDTO'
              - type: object
                properties:
                  b: { $ref: '#/components/schemas/BaseB' }
                  fieldA: { type: string }
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.BaseA, '', opts);
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        id: <string>
        b:
          id: <string>
          fieldB: <string>
        fieldA: <string>
      `);
    });

    test('should detect circular ref for self referencing discriminator', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          SelfComponentDto:
            type: object
            properties:
              self:
                type: object
                discriminator:
                  propertyName: schemaId
                  mapping:
                    title: '#/components/schemas/SelfComponentDto'
                oneOf:
                  - $ref: '#/components/schemas/SelfComponentDto'
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.SelfComponentDto, '', opts);
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        self: oneOf
            title ->
              self: oneOf
                  title -> <object> !circular
      `);
    });

    test('should detect circular with nested oneOf hoisting', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Node:
            type: 'object'
            allOf:
              - oneOf:
                - type: object
                  properties:
                    parent:
                      $ref: '#/components/schemas/Node'
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.Node, '', opts);
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        oneOf
          object ->
            parent: oneOf
                object ->
                  parent: <object> !circular
      `);
    });

    test('should detect simple props recursion', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          PropRecursion:
            properties:
              children:
                type: object
                properties:
                  a:
                    $ref: '#/components/schemas/PropRecursion'
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.PropRecursion, '', opts);
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        children:
          a:
            children:
              a: <object> !circular
      `);
    });

    test('should detect recursion for props with type array', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          PropsRecursion:
            properties:
              children:
                type: array
                items:
                  $ref: '#/components/schemas/PropsRecursion'
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(parser, spec.components.schemas.PropsRecursion, '', opts);
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        children: [
          children: [<object> !circular]
        ]
      `);
    });

    test('should detect and ignore allOf recursion', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Parent:
            $ref: '#/components/schemas/Child'
          Child:
            allOf:
              - $ref: '#/components/schemas/Parent'
              - type: object
                properties:
                  a:
                    type: string
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Child,
        '#/components/schemas/Child',
        opts,
      );
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`a: <string>`);
    });

    test('should detect and ignore allOf recursion in nested prop', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          ExternalReference:
            type: object
            allOf:
              - $ref: '#/components/schemas/CompanyReference'
              - type: object
                properties:
                  externalId: { type: string }
          CompanyReference:
            type: object
            required: [ guid, externalId ]
            properties:
              guid: { type: string }
              nestedRecursive: { $ref: '#/components/schemas/ExternalReference' }
          Entity:
            type: object
            allOf:
              - $ref: '#/components/schemas/ExternalReference'
              - type: object
                properties:
                  directRecursive: { $ref: '#/components/schemas/ExternalReference' }
                  selfRecursive: { $ref: '#/components/schemas/Entity' }
                  anotherField: { $ref: '#/components/schemas/AnotherEntity' }
          AnotherEntity:
            type: object
            allOf:
              - $ref: '#/components/schemas/CompanyReference'
              - type: object
                properties:
                  someField: { type: number }
                  anotherSelfRecursive: { $ref: '#/components/schemas/AnotherEntity' }
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Entity,
        '#/components/schemas/Entity',
        opts,
      );

      // TODO: this has a little issue with too early detection in anotherField -> nestedRecursive
      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        guid*: <string>
        nestedRecursive: <object> !circular
        externalId*: <string>
        directRecursive:
          guid*: <string>
          nestedRecursive: <object> !circular
          externalId*: <string>
        selfRecursive: <object> !circular
        anotherField:
          guid*: <string>
          nestedRecursive: <object> !circular
          someField: <number>
          anotherSelfRecursive: <object> !circular
      `);
    });

    test('should detect and ignore allOf with discriminator recursion', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Pet:
            type: object
            required: [ petType ]
            discriminator:
              propertyName: petType
              mapping:
                cat: '#/components/schemas/Cat'
                dog: '#/components/schemas/Dog'
            properties:
              category: { $ref: '#/components/schemas/Category' }
              status: { type: string }
              friend:
                allOf: [{ $ref: '#/components/schemas/Pet' }]
              petType: { type: string }
          Cat:
            description: A representation of a cat
            allOf:
              - $ref: '#/components/schemas/Pet'
              - type: object
                properties:
                  huntingSkill: { type: string }
          Dog:
            description: A representation of a dog
            allOf:
              - $ref: '#/components/schemas/Pet'
              - type: object
                properties:
                  packSize: { type: integer }
          Category:
            type: object
            properties:
              name: { type: string }
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Pet,
        '#/components/schemas/Pet',
        opts,
      );

      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        oneOf
          cat ->
            category:
              name: <string>
            status: <string>
            friend: <object> !circular
            petType*: <string>
            huntingSkill: <string>
          dog ->
            category:
              name: <string>
            status: <string>
            friend: <object> !circular
            petType*: <string>
            packSize: <integer>
      `);
    });

    test('should detect and recursion on the right level with array of discriminators', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Pet:
            type: object
            required: [ petType ]
            discriminator:
              propertyName: petType
              mapping:
                cat: '#/components/schemas/Cat'
                dog: '#/components/schemas/Dog'
            properties:
              category: { $ref: '#/components/schemas/Category' }
              status: { type: string }
              friend:
                allOf: [{ $ref: '#/components/schemas/Pet' }]
              petType: { type: string }
          Cat:
            description: A representation of a cat
            allOf:
              - $ref: '#/components/schemas/Pet'
              - type: object
                properties:
                  huntingSkill: { type: string }
          Dog:
            description: A representation of a dog
            allOf:
              - $ref: '#/components/schemas/Pet'
              - type: object
                properties:
                  packSize: { type: integer }
          Category:
            type: object
            properties:
              name: { type: string }
          Response:
            type: array
            items:
              $ref: '#/components/schemas/Pet'
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Response,
        '#/components/schemas/Response',
        opts,
      );

      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        [
        oneOf
          cat ->
            category:
              name: <string>
            status: <string>
            friend: <object> !circular
            petType*: <string>
            huntingSkill: <string>
          dog ->
            category:
              name: <string>
            status: <string>
            friend: <object> !circular
            petType*: <string>
            packSize: <integer>
        ]
      `);
    });

    test('should detect and recursion with discriminator and oneOf', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          User:
            type: object
            properties:
              pet:
                oneOf:
                  - $ref: '#/components/schemas/Pet'
          Pet:
            type: object
            required: [ petType ]
            discriminator:
              propertyName: petType
              mapping:
                cat: '#/components/schemas/Cat'
                dog: '#/components/schemas/Dog'
            properties:
              category: { $ref: '#/components/schemas/Category' }
              status: { type: string }
              friend:
                allOf: [{ $ref: '#/components/schemas/Pet' }]
              petType: { type: string }
          Cat:
            description: A representation of a cat
            allOf:
              - $ref: '#/components/schemas/Pet'
              - type: object
                properties:
                  huntingSkill: { type: string }
          Dog:
            description: A representation of a dog
            allOf:
              - $ref: '#/components/schemas/Pet'
              - type: object
                properties:
                  packSize: { type: integer }
          Category:
            type: object
            properties:
              name: { type: string }
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.User,
        '#/components/schemas/User',
        opts,
      );

      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
      pet: oneOf
          Pet -> oneOf
              cat ->
                category:
                  name: <string>
                status: <string>
                friend: <object> !circular
                petType*: <string>
                huntingSkill: <string>
              dog ->
                category:
                  name: <string>
                status: <string>
                friend: <object> !circular
                petType*: <string>
                packSize: <integer>
      `);
    });

    test('should detect and recursion with nested oneOf', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Tag:
            type: object
            properties:
              name:
                description: Tag name
                type: string
                minLength: 1
              items:
                oneOf:
                  - $ref: "#/components/schemas/Tag"
          User:
            type: object
            properties:
              pet:
                oneOf:
                  - $ref: '#/components/schemas/Tag'
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.User,
        '#/components/schemas/User',
        opts,
      );

      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
      pet: oneOf
          Tag ->
            name: <string> (Tag name)
            items: oneOf
                Tag -> <object> !circular
      `);
    });

    test('should not use discriminator for direct schemas refs in oneOf/anyOf', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Parent:
            type: object
            discriminator:
              propertyName: type
              mapping:
                foo: '#/components/schemas/Foo'
                bar: '#/components/schemas/Bar'
                baz: '#/components/schemas/Baz'
            properties:
              type:
                type: string
          Foo:
            allOf:
              - $ref: '#/components/schemas/Parent'
              - type: object
          Bar:
            allOf:
            - $ref: '#/components/schemas/Parent'
            - type: object
          Baz:
            allOf:
            - $ref: '#/components/schemas/Parent'
            - type: object
              properties:
                nested:
                  anyOf:
                    - $ref: '#/components/schemas/Foo'
                    - $ref: '#/components/schemas/Bar'

      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Parent,
        '#/components/schemas/Parent',
        opts,
      );

      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        oneOf
          foo ->
            type: <string>
          bar ->
            type: <string>
          baz ->
            type: <string>
            nested: oneOf
                Foo ->
                  type: <string>
                Bar ->
                  type: <string>
        `);
    });

    test('should detect and recursion with nested oneOf case same schema', () => {
      const spec = parseYaml(outdent`
      openapi: 3.0.0
      components:
        schemas:
          Test:
            allOf:
              - type: object
                required:
                  - "@relations"
                properties:
                  "@relations":
                    type: object
                    properties:
                      A:
                        $ref: "#/components/schemas/A"
              - type: object
                required:
                  - "@relations"
                properties:
                  "@relations":
                    type: object
                    properties:
                      A:
                        $ref: "#/components/schemas/A"
          A:
            type: object
            description: Description
            properties:
              B:
                type: array
                items:
                  oneOf:
                    - type: object
                    - title: tableLookup
                      type: object
                      properties:
                        fallback:
                          type: array
                          default: []
                          items:
                            $ref: "#/components/schemas/A/properties/B"
      `) as any;

      parser = new OpenAPIParser(spec, undefined, opts);
      const schema = new SchemaModel(
        parser,
        spec.components.schemas.Test,
        '#/components/schemas/Test',
        opts,
      );

      expect(printSchema(schema, circularDetailsPrinter)).toMatchInlineSnapshot(`
        @relations*:
          A:
            B: [
              oneOf
                object -> <object>
                tableLookup ->
                  fallback: [
                    [
                    oneOf
                      object -> <object>
                      tableLookup ->
                        fallback: [<array> !circular]
                    ]
                  ]
            ]
        `);
    });
  });
});
