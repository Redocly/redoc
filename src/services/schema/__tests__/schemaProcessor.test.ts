import { describe, it, expect } from 'vitest';

import {
  isSchemaNode,
  switcherLabel,
  type Document,
  type PropertyType,
  type SchemaNode,
  type SwitcherType,
} from '../../../types/schema.js';

import { JsonSchemaDialectId } from '../dialects/jsonSchema.js';
import { schemaProcessor } from '../schemaProcessor.js';

function requireProps(x: {
  properties?: Record<string, PropertyType>;
}): Record<string, PropertyType> {
  expect(x.properties).toBeDefined();
  const p = x.properties;
  if (!p) throw new Error('expected properties');
  return p;
}

function requireItems(x: { items?: PropertyType[] }): PropertyType[] {
  expect(x.items).toBeDefined();
  const items = x.items;
  if (!items) throw new Error('expected items');
  return items;
}

function requireSw(x: { switcher?: SwitcherType }): SwitcherType {
  expect(x.switcher).toBeDefined();
  const s = x.switcher;
  if (!s) throw new Error('expected switcher');
  return s;
}

function pageSchema(doc: Document, name: string): SchemaNode {
  const schema = doc.components?.schemas?.[name];
  if (!isSchemaNode(schema)) throw new Error(`expected schema ${name}`);
  return schema;
}

function makeDocument(components: Record<string, unknown>, openapi = '3.1.0'): Document {
  return {
    openapi,
    info: { title: '', version: '1.0' },
    paths: {},
    components: { schemas: components },
  } as Document;
}

const emptyDoc = makeDocument({});

describe('schemaProcessor metadata extraction', () => {
  it('should extract description', () => {
    const result = schemaProcessor({ type: 'string', description: 'A user name' }, emptyDoc);
    expect(result.description).toBe('A user name');
  });

  it('should extract pattern', () => {
    const result = schemaProcessor({ type: 'string', pattern: '^[a-z]+$' }, emptyDoc);
    expect(result.pattern).toBe('^[a-z]+$');
  });

  it('should JSON-stringify string examples (quotes around strings)', () => {
    const result = schemaProcessor({ type: 'string', example: 'hello' }, emptyDoc);
    expect(result.example).toBe('"hello"');
  });

  it('should keep structured examples as raw values for JSON rendering', () => {
    const result = schemaProcessor({ type: 'object', example: { key: 'val' } }, emptyDoc);
    expect(result.example).toEqual({ key: 'val' });
  });

  it('uses the exampleSerializer option for the single example when provided', () => {
    const result = schemaProcessor({ type: 'string', example: '700x700' }, emptyDoc, {
      exampleSerializer: (v) => `imageSize=${v}`,
    });
    expect(result.example).toBe('imageSize=700x700');
  });

  it('uses the exampleSerializer option for named example values', () => {
    const result = schemaProcessor(
      { type: 'string', examples: { square: { summary: 'Square', value: '700x700' } } },
      emptyDoc,
      { exampleSerializer: (v) => `imageSize=${v}` },
    );
    expect(result.examples?.square).toEqual({ summary: 'Square', value: 'imageSize=700x700' });
  });

  it('should JSON-stringify non-string named examples values', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        examples: {
          objectExample: {
            summary: 'Object example',
            value: { key: 'value' },
          },
          arrayExample: {
            value: ['a', 'b'],
          },
        },
      },
      emptyDoc,
    );

    expect(result.examples).toEqual({
      objectExample: {
        summary: 'Object example',
        value: '{"key":"value"}',
      },
      arrayExample: {
        value: '["a","b"]',
      },
    });
  });

  it('should keep string named examples values unchanged', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        examples: {
          plainText: {
            value: '{"already":"string"}',
          },
        },
      },
      emptyDoc,
    );

    expect(result.examples).toEqual({
      plainText: {
        value: '{"already":"string"}',
      },
    });
  });

  it('should JSON-stringify string defaults (quotes around strings)', () => {
    const result = schemaProcessor({ type: 'string', default: 'active' }, emptyDoc);
    expect(result.default).toBe('"active"');
  });

  it('should JSON-stringify non-string defaults', () => {
    const result = schemaProcessor({ type: 'number', default: 42 }, emptyDoc);
    expect(result.default).toBe('42');
  });

  it('should extract const value (JSON-stringified)', () => {
    const result = schemaProcessor({ type: 'string', const: 'fixed' }, emptyDoc);
    expect(result.const).toBe('"fixed"');
  });

  it('should extract enum values', () => {
    const result = schemaProcessor({ type: 'string', enum: ['a', 'b', 'c'] }, emptyDoc);
    expect(result.enum).toEqual(['a', 'b', 'c']);
  });

  it('should prefer x-enumDescriptions over enum', () => {
    const result = schemaProcessor(
      {
        type: 'string',
        enum: ['a', 'b'],
        'x-enumDescriptions': { a: 'Alpha', b: 'Beta' },
      },
      emptyDoc,
    );
    expect(result.enum).toEqual({ a: 'Alpha', b: 'Beta' });
  });

  it('should set accessMode for readOnly', () => {
    const result = schemaProcessor({ type: 'string', readOnly: true }, emptyDoc);
    expect(result.accessMode).toBe('read-only');
  });

  it('should set accessMode for writeOnly', () => {
    const result = schemaProcessor({ type: 'string', writeOnly: true }, emptyDoc);
    expect(result.accessMode).toBe('write-only');
  });

  it('should extract externalDocs', () => {
    const result = schemaProcessor(
      {
        type: 'string',
        externalDocs: { description: 'See docs', url: 'https://example.com' },
      },
      emptyDoc,
    );
    expect(result.externalDocs).toEqual({ description: 'See docs', url: 'https://example.com' });
  });

  it('should mark deprecated schemas', () => {
    const result = schemaProcessor({ type: 'string', deprecated: true }, emptyDoc);
    expect(result.isDeprecated).toBe(true);
  });

  it('should not mark non-deprecated schemas', () => {
    const result = schemaProcessor({ type: 'string' }, emptyDoc);
    expect(result.isDeprecated).toBeFalsy();
  });

  it('should extract custom extensions and exclude internal ones', () => {
    const result = schemaProcessor(
      {
        type: 'string',
        'x-custom': 'hello',
        'x-another': 42,
        'x-circular-ref': true,
        'x-badges': [],
        'x-redocly-something': 'ignored',
      },
      emptyDoc,
    );
    expect(result.extensions).toEqual({ 'x-custom': 'hello', 'x-another': '42' });
  });

  it('should not set extensions when none are present', () => {
    const result = schemaProcessor({ type: 'string' }, emptyDoc);
    expect(result.extensions).toBeUndefined();
  });

  it('should extract badges', () => {
    const badges = [{ name: 'beta', position: 'before' as const, color: 'blue' }];
    const result = schemaProcessor({ type: 'string', 'x-badges': badges }, emptyDoc);
    expect(result.badges).toEqual(badges);
  });
});

describe('schemaProcessor constraints', () => {
  it('should humanize string length range', () => {
    const result = schemaProcessor({ type: 'string', minLength: 1, maxLength: 100 }, emptyDoc);
    expect(result.type).toBe('string, [ 1 .. 100 ] characters');
  });

  it('should humanize exact string length', () => {
    const result = schemaProcessor({ type: 'string', minLength: 5, maxLength: 5 }, emptyDoc);
    expect(result.type).toBe('string, = 5 characters');
  });

  it('should humanize non-empty string length', () => {
    const result = schemaProcessor({ type: 'string', minLength: 1 }, emptyDoc);
    expect(result.type).toBe('string, non-empty');
  });

  it('should humanize min-only string length', () => {
    const result = schemaProcessor({ type: 'string', minLength: 2 }, emptyDoc);
    expect(result.type).toBe('string, >= 2 characters');
  });

  it('should humanize max-only string length', () => {
    const result = schemaProcessor({ type: 'string', maxLength: 255 }, emptyDoc);
    expect(result.type).toBe('string, <= 255 characters');
  });

  it('falls back to the last segment of x-original-ref when nested property has no title', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          pet: { type: 'object', 'x-original-ref': '#/components/schemas/Pet' },
        },
      },
      emptyDoc,
    );
    const props = requireProps(result);
    expect(props.pet.title).toBe('Pet');
  });

  it('carries the component name of a $ref oneOf variant as schemaName', () => {
    const result = schemaProcessor(
      {
        oneOf: [
          { type: 'string', 'x-original-ref': '#/components/schemas/TimePluralUnit' },
          { type: 'null' },
        ],
      },
      emptyDoc,
    );
    const switcher = requireSw(result);
    const named = Object.values(switcher.options).find((option) => option.schemaName);

    expect(named?.schemaName).toBe('TimePluralUnit');
  });

  it('should humanize array item count range', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 10 },
      emptyDoc,
    );
    expect(result.type).toBe('Array of strings, [ 1 .. 10 ] items');
  });

  it('should humanize non-empty array (minItems: 1)', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string' }, minItems: 1 },
      emptyDoc,
    );
    expect(result.type).toBe('Array of strings, non-empty');
  });

  it('should humanize non-empty object (minProperties: 1)', () => {
    const result = schemaProcessor({ type: 'object', minProperties: 1 }, emptyDoc);
    expect(result.type).toBe('object, non-empty');
  });

  it('should humanize property count range', () => {
    const result = schemaProcessor(
      { type: 'object', minProperties: 1, maxProperties: 5 },
      emptyDoc,
    );
    expect(result.type).toBe('object, [ 1 .. 5 ] properties');
  });

  it('should use singular "property" when min and max are both 1', () => {
    const result = schemaProcessor(
      { type: 'object', minProperties: 1, maxProperties: 1 },
      emptyDoc,
    );
    expect(result.type).toBe('object, = 1 property');
  });

  it('should humanize exclusive number range', () => {
    const result = schemaProcessor(
      { type: 'number', exclusiveMinimum: 0, exclusiveMaximum: 100 },
      emptyDoc,
    );
    expect(result.type).toBe('number, ( 0 .. 100 )');
  });

  it('should humanize inclusive number range', () => {
    const result = schemaProcessor({ type: 'integer', minimum: 0, maximum: 100 }, emptyDoc);
    expect(result.type).toBe('integer, [ 0 .. 100 ]');
  });

  it('should humanize minimum-only', () => {
    const result = schemaProcessor({ type: 'number', minimum: 0 }, emptyDoc);
    expect(result.type).toBe('number, >= 0');
  });

  it('should humanize exclusive minimum-only', () => {
    const result = schemaProcessor({ type: 'number', exclusiveMinimum: 0 }, emptyDoc);
    expect(result.type).toBe('number, > 0');
  });

  it('should humanize multipleOf', () => {
    const result = schemaProcessor({ type: 'number', multipleOf: 5 }, emptyDoc);
    expect(result.type).toBe('number, multiple of 5');
  });

  it('should humanize decimal places from multipleOf', () => {
    const result = schemaProcessor({ type: 'number', multipleOf: 0.01 }, emptyDoc);
    expect(result.type).toBe('number, decimal places <= 2');
  });

  it('should include uniqueItems constraint', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string' }, uniqueItems: true },
      emptyDoc,
    );
    expect(result.type).toBe('Array of strings, unique');
  });
});

describe('schemaProcessor object properties', () => {
  it('should process nested object properties', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
        },
      },
      emptyDoc,
    );

    expect(result.properties).toBeDefined();
    expect(requireProps(result)['name'].type).toBe('string');
    expect(requireProps(result)['age'].type).toBe('integer');
  });

  it('should mark required properties', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['name'].isRequired).toBe(true);
    expect(requireProps(result)['age'].isRequired).toBeFalsy();
  });

  it('should handle additionalProperties as schema', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        additionalProperties: { type: 'string' },
      },
      emptyDoc,
    );

    expect(result.properties).toBeDefined();
    expect(requireProps(result)['property name*']).toBeDefined();
    expect(requireProps(result)['property name*'].type).toBe('string');
    expect(requireProps(result)['property name*'].isAdditionalProperty).toBe(true);
  });

  it('should use x-additionalPropertiesName for the label', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        additionalProperties: { type: 'string', 'x-additionalPropertiesName': 'header name' },
      },
      emptyDoc,
    );

    expect(requireProps(result)['header name*']).toBeDefined();
    expect(requireProps(result)['header name*'].isAdditionalProperty).toBe(true);
  });

  it('should handle additionalProperties: true', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        additionalProperties: true,
      },
      emptyDoc,
    );

    expect(requireProps(result)['property name*']).toBeDefined();
    expect(requireProps(result)['property name*'].isAdditionalProperty).toBe(true);
  });

  it('should handle patternProperties', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        patternProperties: { '^x-': { type: 'string' } },
      },
      emptyDoc,
    );

    expect(requireProps(result)['^x-']).toBeDefined();
    expect(requireProps(result)['^x-'].isPatternProperty).toBe(true);
    expect(requireProps(result)['^x-'].type).toBe('string');
  });

  it('should inherit parent default into child property', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        default: { status: 'active' },
        properties: {
          status: { type: 'string' },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['status'].default).toBe('"active"');
  });

  it('should not override child default with parent default', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        default: { status: 'active' },
        properties: {
          status: { type: 'string', default: 'pending' },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['status'].default).toBe('"pending"');
  });

  it('should inherit parent example into child property', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        example: { name: 'John' },
        properties: {
          name: { type: 'string' },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['name'].example).toBe('"John"');
  });
});

describe('schemaProcessor arrays', () => {
  it('should process complex array items', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
      },
      emptyDoc,
    );

    expect(result.items).toBeDefined();
    expect(requireItems(result).length).toBe(1);
    expect(requireProps(requireItems(result)[0])['id'].type).toBe('string');
  });

  it('should not create items entry for primitive array items', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'string' },
      },
      emptyDoc,
    );

    expect(result.items).toBeUndefined();
  });

  it('should derive an array field example from its items example', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          memos: {
            type: 'array',
            items: {
              type: 'object',
              example: { invoiceId: 'abc' },
              properties: { invoiceId: { type: 'string' } },
            },
          },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['memos'].example).toEqual([{ invoiceId: 'abc' }]);
  });

  it('should not override an array field that already has its own example', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          memos: {
            type: 'array',
            example: [{ invoiceId: 'own' }],
            items: {
              type: 'object',
              example: { invoiceId: 'item' },
              properties: { invoiceId: { type: 'string' } },
            },
          },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['memos'].example).toEqual([{ invoiceId: 'own' }]);
  });

  it('should leave an array field example undefined when its items have no example', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          memos: {
            type: 'array',
            items: { type: 'object', properties: { invoiceId: { type: 'string' } } },
          },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['memos'].example).toBeUndefined();
  });

  it('should not roll up a tuple (prefixItems) array example', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          pair: {
            type: 'array',
            prefixItems: [
              { type: 'object', example: { a: 1 }, properties: { a: { type: 'number' } } },
            ],
          },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['pair'].example).toBeUndefined();
  });

  it('should wrap primitive array item examples as single-element arrays', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          tags: { type: 'array', items: { type: 'string', example: 'foo' } },
        },
      },
      emptyDoc,
    );

    expect(requireProps(result)['tags'].example).toEqual(['foo']);
  });

  it('should handle prefixItems (tuple)', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        prefixItems: [{ type: 'string' }, { type: 'number' }],
      },
      emptyDoc,
    );

    expect(result.items).toBeDefined();
    expect(requireItems(result).length).toBe(2);
    expect(requireItems(result)[0].type).toBe('string');
    expect(requireItems(result)[1].type).toBe('number');
  });

  it('should promote enum from primitive array items', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'string', enum: ['a', 'b', 'c'] },
      },
      emptyDoc,
    );

    expect(result.enum).toEqual(['a', 'b', 'c']);
  });

  it('should keep const of primitive array items on the nested items row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'string', const: 'fixed' },
      },
      emptyDoc,
    );

    expect(result.const).toBeUndefined();
    expect(result.items?.[0].const).toBe('"fixed"');
  });

  it('should promote example from primitive array items as a single-element array', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'string', example: 'hello' },
      },
      emptyDoc,
    );

    expect(result.example).toEqual(['hello']);
  });

  it('preserves the item value type when wrapping (numeric example yields [42], not ["42"])', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'integer', example: 42 },
      },
      emptyDoc,
    );

    expect(result.example).toEqual([42]);
  });

  it('does NOT overwrite an array-level example with items.example', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'string', example: 'fromItem' },
        example: ['first', 'second'],
      },
      emptyDoc,
    );

    expect(result.example).toEqual(['first', 'second']);
  });

  it('derives the array example from complex array items without promoting their type metadata', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: {
          type: 'object',
          properties: { id: { type: 'string' } },
          example: { id: '123' },
        },
      },
      emptyDoc,
    );

    // Example rolls up (parity with openapi-docs), but the array keeps its own type.
    expect(result.example).toEqual([{ id: '123' }]);
    expect(result.type).toBe('Array of objects');
  });
});

describe('schemaProcessor circular references', () => {
  it('should mark circular references as isCircular', () => {
    const doc = makeDocument({
      Node: {
        type: 'object',
        properties: {
          child: { $ref: '#/components/schemas/Node' },
        },
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Node' }, doc);
    expect(result.properties).toBeDefined();
    expect(requireProps(result)['child'].isCircular).toBe(true);
    expect(requireProps(result)['child'].properties).toBeUndefined();
  });

  it('detects self-references in an inline (already dereferenced) root schema when rootJsonPointer is set', () => {
    const onlyCircular = {
      type: 'object',
      properties: {
        self: { $ref: '#/components/schemas/OnlyCircular' },
      },
    };
    const doc = makeDocument({ OnlyCircular: onlyCircular });

    const result = schemaProcessor(onlyCircular, doc, {
      rootJsonPointer: '#/components/schemas/OnlyCircular',
    });

    const props = requireProps(result);
    expect(Object.keys(props)).toEqual(['self']);
    expect(props['self'].isCircular).toBe(true);
    expect(props['self'].properties).toBeUndefined();
    expect(props['self'].title).toBe('OnlyCircular');
  });

  it('keeps non-circular siblings expandable when only some properties are self-references', () => {
    const circularPlusNested = {
      type: 'object',
      properties: {
        self: { $ref: '#/components/schemas/CircularPlusNested' },
        meta: {
          type: 'object',
          properties: {
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    };
    const doc = makeDocument({ CircularPlusNested: circularPlusNested });

    const result = schemaProcessor(circularPlusNested, doc, {
      rootJsonPointer: '#/components/schemas/CircularPlusNested',
    });

    const props = requireProps(result);
    expect(props['self'].isCircular).toBe(true);
    expect(props['self'].properties).toBeUndefined();

    expect(props['meta'].isCircular).toBeUndefined();
    const metaProps = requireProps(props['meta']);
    expect(Object.keys(metaProps)).toEqual(['createdAt']);
    expect(metaProps['createdAt'].type).toContain('string');
  });

  it('does not mark sibling $refs to the same component as circular when neither is the root pointer', () => {
    const variant = { type: 'object', properties: { name: { type: 'string' } } };
    const doc = makeDocument({ Variant: variant });

    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          first: { $ref: '#/components/schemas/Variant' },
          second: { $ref: '#/components/schemas/Variant' },
        },
      },
      doc,
    );

    const props = requireProps(result);
    expect(props['first'].isCircular).toBeUndefined();
    expect(props['second'].isCircular).toBeUndefined();
    expect(requireProps(props['first'])['name'].type).toContain('string');
    expect(requireProps(props['second'])['name'].type).toContain('string');
  });
});

describe('schemaProcessor circular references through composition', () => {
  // Recursively detect whether the built tree truncated any edge as circular.
  function hasCircularEdge(node: PropertyType | SwitcherOptionType): boolean {
    if ((node as PropertyType).isCircular || (node as SwitcherOptionType).isCircular) return true;
    if (node.properties && Object.values(node.properties).some(hasCircularEdge)) return true;
    if (node.items?.some(hasCircularEdge)) return true;
    if (node.switcher && Object.values(node.switcher.options).some(hasCircularEdge)) return true;
    return false;
  }

  it('does not overflow on a cycle through a mapping-based discriminator', () => {
    // The mapped variant is resolved lazily (resolveMappedVariant), which starts
    // a fresh visited-set — this is the path resolveAllRefsInDocument cannot catch.
    const doc = makeDocument({
      Parent: {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: { childA: '#/components/schemas/ChildA' },
        },
        properties: { kind: { type: 'string' } },
      },
      ChildA: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          back: { $ref: '#/components/schemas/Parent' },
        },
      },
    });

    let result: PropertyType | undefined;
    expect(() => {
      result = schemaProcessor({ $ref: '#/components/schemas/Parent' }, doc);
    }).not.toThrow();
    expect(hasCircularEdge(result as PropertyType)).toBe(true);
  });

  it('does not overflow on an implicit/mapping discriminator cycle (tire shape)', () => {
    const doc = makeDocument({
      Goods: {
        type: 'object',
        discriminator: {
          propertyName: 'type',
          mapping: { transportEquipment: '#/components/schemas/TransportEquipment' },
        },
        properties: {
          type: { type: 'string' },
          actions: { type: 'array', items: { $ref: '#/components/schemas/Action' } },
        },
      },
      TransportEquipment: {
        type: 'object',
        allOf: [
          { $ref: '#/components/schemas/Goods' },
          { type: 'object', properties: { equipmentId: { type: 'string' } } },
        ],
      },
      Action: {
        type: 'object',
        discriminator: {
          propertyName: 'actionType',
          mapping: { attach: '#/components/schemas/AttachAction' },
        },
        properties: { actionType: { type: 'string' } },
      },
      AttachAction: {
        type: 'object',
        properties: {
          actionType: { type: 'string' },
          transportEquipment: { $ref: '#/components/schemas/TransportEquipment' },
        },
      },
    });

    // Goods → TransportEquipment (allOf Goods) → actions → Action → AttachAction
    // → transportEquipment → TransportEquipment → … must not overflow.
    let result: PropertyType | undefined;
    expect(() => {
      result = schemaProcessor({ $ref: '#/components/schemas/Goods' }, doc);
    }).not.toThrow();
    expect(hasCircularEdge(result as PropertyType)).toBe(true);
  });

  it('terminates finitely on a self-reference through a oneOf $ref variant', () => {
    // The merge layer collapses deeply-nested oneOf $ref cycles, so this path
    // does not overflow; the guard here is that the built tree stays bounded.
    const doc = makeDocument({
      Node: {
        oneOf: [{ $ref: '#/components/schemas/Wrapper' }],
      },
      Wrapper: {
        type: 'object',
        properties: {
          child: { $ref: '#/components/schemas/Node' },
        },
      },
    });

    let result: PropertyType | undefined;
    expect(() => {
      result = schemaProcessor({ $ref: '#/components/schemas/Node' }, doc);
    }).not.toThrow();
    // A finite (serializable) tree proves the recursion terminated.
    expect(() => JSON.stringify(result)).not.toThrow();
    expect(requireSw(result as PropertyType).options).toBeDefined();
  });

  it('keeps non-circular sibling refs through a switcher fully expandable', () => {
    const doc = makeDocument({
      Root: {
        type: 'object',
        discriminator: { propertyName: 'kind' },
        oneOf: [{ $ref: '#/components/schemas/OptionA' }, { $ref: '#/components/schemas/OptionB' }],
        properties: { kind: { type: 'string' } },
      },
      OptionA: {
        type: 'object',
        properties: { kind: { type: 'string' }, a: { $ref: '#/components/schemas/Shared' } },
      },
      OptionB: {
        type: 'object',
        properties: { kind: { type: 'string' }, b: { $ref: '#/components/schemas/Shared' } },
      },
      Shared: { type: 'object', properties: { name: { type: 'string' } } },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Root' }, doc);
    const options = Object.values(requireSw(result).options);
    const optA = options.find((o) => o.properties?.['a']);
    const optB = options.find((o) => o.properties?.['b']);
    expect(optA).toBeDefined();
    expect(optB).toBeDefined();
    const a = requireProps(optA as { properties?: Record<string, PropertyType> })['a'];
    const b = requireProps(optB as { properties?: Record<string, PropertyType> })['b'];
    expect(a.isCircular).toBeUndefined();
    expect(b.isCircular).toBeUndefined();
    expect(requireProps(a)['name'].type).toContain('string');
    expect(requireProps(b)['name'].type).toContain('string');
  });

  function buildChain(depth: number): Document {
    const components: Record<string, unknown> = {};
    for (let i = 0; i <= depth; i++) {
      components[`L${i}`] = {
        type: 'object',
        properties:
          i < depth
            ? { next: { $ref: `#/components/schemas/L${i + 1}` } }
            : { leaf: { type: 'string' } },
      };
    }
    return makeDocument(components);
  }

  it('fully expands a shallow finite ref chain (within the depth cap)', () => {
    const depth = 5;
    const result = schemaProcessor({ $ref: '#/components/schemas/L0' }, buildChain(depth));

    let node: PropertyType = result;
    for (let i = 0; i < depth; i++) {
      node = requireProps(node)['next'];
      expect(node.isComplex).toBeUndefined();
      expect(node.isCircular).toBeUndefined();
    }
    expect(requireProps(node)['leaf'].type).toContain('string');
  });

  it('truncates a very deep ref chain as complex (matching legacy level cap)', () => {
    const depth = 30;
    let result: PropertyType | undefined;
    expect(() => {
      result = schemaProcessor({ $ref: '#/components/schemas/L0' }, buildChain(depth));
    }).not.toThrow();

    // Somewhere down the chain the builder must stop expanding and flag isComplex,
    // rather than expanding all 30 levels.
    let node: PropertyType = result as PropertyType;
    let sawComplex = false;
    for (let i = 0; i < depth; i++) {
      if (node.isComplex) {
        sawComplex = true;
        break;
      }
      const next = node.properties?.['next'];
      if (!next) break;
      node = next;
    }
    expect(sawComplex).toBe(true);
  });
});

// Anonymized rename of a real transport-domain spec (Goods/TransportEquipment/…) that used to
// crash with "Maximum call stack size exceeded": a large strongly-connected component wired
// through an implicit-discriminator parent (Cargo), an explicit-mapping discriminator (Carrier,
// Operation), allOf inheritance, and arrays that all reference back into the component.
describe('schemaProcessor recursive component (transport-domain shape)', () => {
  function countDistinctNodes(root: PropertyType): number {
    const seen = new Set<object>();
    const stack: unknown[] = [root];
    while (stack.length) {
      const node = stack.pop();
      if (!node || typeof node !== 'object' || seen.has(node)) continue;
      seen.add(node);
      const n = node as PropertyType;
      if (n.properties) stack.push(...Object.values(n.properties));
      if (n.items) stack.push(...n.items);
      if (n.switcher) stack.push(...Object.values(n.switcher.options));
    }
    return seen.size;
  }

  function hasCircularEdge(node: PropertyType | SwitcherOptionType): boolean {
    if ((node as PropertyType).isCircular || (node as SwitcherOptionType).isCircular) return true;
    if (node.properties && Object.values(node.properties).some(hasCircularEdge)) return true;
    if (node.items?.some(hasCircularEdge)) return true;
    if (node.switcher && Object.values(node.switcher.options).some(hasCircularEdge)) return true;
    return false;
  }

  function transportDoc(extra: Record<string, unknown> = {}): Document {
    return makeDocument({
      // Discriminator parent with NO oneOf/mapping — variants come from implicit children.
      Cargo: {
        type: 'object',
        discriminator: { propertyName: 'type' },
        properties: {
          type: { type: 'string' },
          name: { type: 'string' },
          weight: { $ref: '#/components/schemas/Measure' },
          operations: { type: 'array', items: { $ref: '#/components/schemas/Operation' } },
          links: { type: 'array', items: { $ref: '#/components/schemas/CargoLink' } },
        },
      },
      // Implicit child of Cargo (allOf), also references the Carrier cycle.
      Container: {
        type: 'object',
        allOf: [
          { $ref: '#/components/schemas/Cargo' },
          {
            type: 'object',
            properties: {
              containerId: { type: 'string' },
              carrier: { $ref: '#/components/schemas/Carrier' },
            },
          },
        ],
      },
      // Explicit-mapping discriminator, with a property that points back to Cargo.
      Carrier: {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            truck: '#/components/schemas/Truck',
            ship: '#/components/schemas/Ship',
          },
        },
        oneOf: [{ $ref: '#/components/schemas/Truck' }, { $ref: '#/components/schemas/Ship' }],
        properties: {
          kind: { type: 'string' },
          cargo: { $ref: '#/components/schemas/Cargo' },
        },
      },
      Truck: {
        type: 'object',
        allOf: [
          { $ref: '#/components/schemas/Carrier' },
          { type: 'object', properties: { axles: { type: 'integer' } } },
        ],
      },
      Ship: {
        type: 'object',
        allOf: [
          { $ref: '#/components/schemas/Carrier' },
          { type: 'object', properties: { tonnage: { type: 'number' } } },
        ],
      },
      // Explicit-mapping discriminator whose variants re-enter the component via Container.
      Operation: {
        type: 'object',
        discriminator: {
          propertyName: 'op',
          mapping: {
            attach: '#/components/schemas/AttachOperation',
            detach: '#/components/schemas/DetachOperation',
          },
        },
        oneOf: [
          { $ref: '#/components/schemas/AttachOperation' },
          { $ref: '#/components/schemas/DetachOperation' },
        ],
        properties: { op: { type: 'string' } },
      },
      AttachOperation: {
        type: 'object',
        properties: {
          op: { type: 'string' },
          container: { $ref: '#/components/schemas/Container' },
        },
      },
      DetachOperation: {
        type: 'object',
        properties: {
          op: { type: 'string' },
          container: { $ref: '#/components/schemas/Container' },
        },
      },
      CargoLink: {
        type: 'object',
        properties: {
          relation: { type: 'string' },
          target: { $ref: '#/components/schemas/Cargo' },
        },
      },
      // Non-recursive leaf shared by many schemas.
      Measure: {
        type: 'object',
        properties: { value: { type: 'number' }, unit: { type: 'string' } },
      },
      ...extra,
    });
  }

  it('resolves the implicit-discriminator parent without overflowing', () => {
    const doc = transportDoc();
    let result: PropertyType | undefined;
    expect(() => {
      result = schemaProcessor({ $ref: '#/components/schemas/Cargo' }, doc, {
        rootJsonPointer: '#/components/schemas/Cargo',
      });
    }).not.toThrow();

    // Cargo renders as a discriminator switcher whose implicit variant is Container.
    const switcher = requireSw(result as PropertyType);
    expect(switcher.type).toBe('discriminator');
    expect(Object.keys(switcher.options).length).toBeGreaterThan(0);
    // The cycle is truncated somewhere rather than expanded forever.
    expect(hasCircularEdge(result as PropertyType)).toBe(true);
  });

  it('resolves an explicit-mapping discriminator in the cycle without overflowing', () => {
    const doc = transportDoc();
    let result: PropertyType | undefined;
    expect(() => {
      result = schemaProcessor({ $ref: '#/components/schemas/Carrier' }, doc);
    }).not.toThrow();

    const options = requireSw(result as PropertyType).options;
    // Distinguishing variant properties still render (not everything collapses to circular).
    const truck = options['truck'] ?? options['Truck'];
    expect(truck?.properties?.['axles']).toBeDefined();
    expect(hasCircularEdge(result as PropertyType)).toBe(true);
  });

  it('keeps the built tree bounded for a deeply cyclic component', () => {
    const doc = transportDoc();
    const result = schemaProcessor({ $ref: '#/components/schemas/Container' }, doc);
    // Without ref-memoization the SCC would expand into millions of nodes; it must stay small.
    expect(countDistinctNodes(result)).toBeLessThan(3000);
  });

  it('memoizes a recursive ref so repeated references do not multiply the tree', () => {
    const many: Record<string, unknown> = {};
    for (let i = 0; i < 8; i++) many[`c${i}`] = { $ref: '#/components/schemas/Container' };
    const doc = transportDoc({
      WrapMany: { type: 'object', properties: many },
      WrapOne: {
        type: 'object',
        properties: { c0: { $ref: '#/components/schemas/Container' } },
      },
    });

    const one = countDistinctNodes(schemaProcessor({ $ref: '#/components/schemas/WrapOne' }, doc));
    const eight = countDistinctNodes(
      schemaProcessor({ $ref: '#/components/schemas/WrapMany' }, doc),
    );
    // Eight references reuse the one memoized Container subtree, adding only per-occurrence
    // shells — not eight full copies.
    expect(eight - one).toBeLessThan(30);
  });

  it('marks the recursive back-edge circular, not the shared non-recursive leaf', () => {
    const doc = transportDoc();
    const result = schemaProcessor({ $ref: '#/components/schemas/CargoLink' }, doc);
    const props = requireProps(result);
    // Measure is a plain non-recursive leaf and must stay fully expanded.
    expect(props['relation'].type).toContain('string');
    // The `target` back to Cargo participates in the cycle and terminates.
    expect(() => countDistinctNodes(result)).not.toThrow();
    expect(hasCircularEdge(result)).toBe(true);
  });
});

describe('schemaProcessor $ref resolution', () => {
  it('should resolve $ref and process the referenced schema', () => {
    const doc = makeDocument({
      Address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Address' }, doc);
    expect(result.type).toBe('object');
    expect(result.properties).toBeDefined();
    expect(requireProps(result)['street'].type).toBe('string');
    expect(requireProps(result)['city'].type).toBe('string');
  });

  it('should merge $ref siblings', () => {
    const doc = makeDocument({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
    });

    const result = schemaProcessor(
      {
        $ref: '#/components/schemas/Base',
        description: 'Overridden description',
      },
      doc,
    );

    expect(result.description).toBe('Overridden description');
    expect(requireProps(result)['id']).toBeDefined();
  });
});

describe('schemaProcessor conditional (if/then/else)', () => {
  it('hoists a sibling example onto a oneOf field (merge distributes it into branches)', () => {
    // Reproduces `trialLimit`: `oneOf: [number, null]` with a sibling `example`.
    // mergeCombinarySibling pushes the example into the branches and drops it
    // from the top level, so it must be hoisted back for the field to show it.
    const result = schemaProcessor(
      {
        oneOf: [{ type: 'number', format: 'double', minimum: 0 }, { type: 'null' }],
        example: 20.725,
      },
      emptyDoc,
    );

    expect(result.switcher).toBeDefined();
    expect(result.example).toBe('20.725');
  });

  it('hoists a sibling example onto an anyOf field', () => {
    const result = schemaProcessor(
      {
        anyOf: [{ type: 'string' }, { type: 'null' }],
        example: 'hello',
      },
      emptyDoc,
    );

    expect(result.switcher).toBeDefined();
    expect(result.example).toBe('"hello"');
  });

  it('does not hoist when oneOf branches carry different per-branch examples', () => {
    // Authored per-branch examples (not a distributed sibling) must stay on their
    // variants, not collapse onto the field.
    const result = schemaProcessor(
      {
        oneOf: [
          { type: 'string', example: 'a' },
          { type: 'number', example: 1 },
        ],
      },
      emptyDoc,
    );
    expect(result.example).toBeUndefined();
  });

  it('hoists a sibling readOnly onto a oneOf field (merge distributes it into branches)', () => {
    const result = schemaProcessor(
      {
        oneOf: [{ type: 'object', properties: { id: { type: 'string' } } }, { type: 'null' }],
        readOnly: true,
      },
      emptyDoc,
    );

    expect(result.switcher).toBeDefined();
    expect(result.accessMode).toBe('read-only');
  });

  it('hoists a sibling writeOnly onto a oneOf field', () => {
    const result = schemaProcessor(
      {
        oneOf: [{ type: 'object' }, { type: 'string' }],
        writeOnly: true,
      },
      emptyDoc,
    );

    expect(result.switcher).toBeDefined();
    expect(result.accessMode).toBe('write-only');
  });

  it('does not hoist accessMode when branches disagree', () => {
    const result = schemaProcessor(
      {
        oneOf: [{ type: 'string', readOnly: true }, { type: 'number' }],
      },
      emptyDoc,
    );
    expect(result.accessMode).toBeUndefined();
  });

  it('captures enum and typeLabel on string-enum oneOf variants', () => {
    // Reproduces `unit: oneOf: [TimeUnit, TimePluralUnit]` — each variant is a
    // named string enum; the option must carry its enum and `string` typeLabel.
    const result = schemaProcessor(
      {
        oneOf: [
          {
            type: 'string',
            enum: ['second', 'minute'],
            'x-original-ref': '#/components/schemas/TimeUnit',
          },
          {
            type: 'string',
            enum: ['seconds', 'minutes'],
            'x-original-ref': '#/components/schemas/TimePluralUnit',
          },
        ],
      },
      emptyDoc,
    );
    const plural = requireSw(result).options['TimePluralUnit'];
    expect(plural.typeLabel).toBe('string');
    expect(plural.enum).toEqual(['seconds', 'minutes']);
  });

  it('should build a oneOf switcher from if/then/else', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        if: { title: 'WithDiscount', properties: { hasDiscount: { const: true } } },
        then: { properties: { discount: { type: 'number' } } },
        else: { title: 'NoDiscount', properties: { reason: { type: 'string' } } },
      },
      emptyDoc,
    );

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('oneOf');
    expect(requireSw(result).label).toBe(switcherLabel.ONE_OF);
    const keys = Object.keys(requireSw(result).options);
    expect(keys).toEqual(['WithDiscount', 'NoDiscount']);
  });

  it('unions required and merges properties across base/if/then layers (allOf semantics)', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        required: ['a'],
        properties: { a: { type: 'string' } },
        if: { required: ['b'], properties: { b: { type: 'string' } } },
        then: { required: ['c'], properties: { c: { type: 'string' } } },
        else: { properties: { d: { type: 'string' } } },
      },
      emptyDoc,
    );

    const caseOne = requireSw(result).options['case 1'];
    expect(Object.keys(caseOne.properties ?? {}).sort()).toEqual(['a', 'b', 'c']);
    expect(caseOne.properties?.a?.isRequired).toBe(true);
    expect(caseOne.properties?.b?.isRequired).toBe(true);
    expect(caseOne.properties?.c?.isRequired).toBe(true);
  });

  it('should use default labels when if/else have no title', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        if: { properties: { x: { const: true } } },
        then: { properties: { a: { type: 'string' } } },
        else: { properties: { b: { type: 'string' } } },
      },
      emptyDoc,
    );

    const keys = Object.keys(requireSw(result).options);
    expect(keys).toEqual(['case 1', 'case 2']);
  });

  it('should use x-displayName over title for if/else labels', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        if: { 'x-displayName': 'Option A', title: 'Ignored', properties: { x: { const: true } } },
        then: { properties: { a: { type: 'string' } } },
        else: { 'x-displayName': 'Option B', properties: { b: { type: 'string' } } },
      },
      emptyDoc,
    );

    const keys = Object.keys(requireSw(result).options);
    expect(keys).toEqual(['Option A', 'Option B']);
  });
});

describe('schemaProcessor discriminator', () => {
  it('should render discriminator when both discriminator and oneOf are present', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'type',
        mapping: {
          charge: '#/components/schemas/Charge',
          refund: '#/components/schemas/Refund',
        },
      },
      oneOf: [{ $ref: '#/components/schemas/Charge' }, { $ref: '#/components/schemas/Refund' }],
    };

    const doc = makeDocument({
      Charge: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          amount: { type: 'number' },
        },
      },
      Refund: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          reason: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('type');
    expect(requireSw(result).jsonPointer).toBe('#');
    expect(Object.keys(requireSw(result).options)).toEqual(['charge', 'refund']);
  });

  it('should preserve discriminator at top level after allOf merge', () => {
    const schema = {
      allOf: [
        {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        {
          discriminator: {
            propertyName: 'kind',
          },
          oneOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }],
        },
      ],
    };

    const doc = makeDocument({
      A: {
        type: 'object',
        title: 'VariantA',
        properties: {
          kind: { type: 'string' },
          a: { type: 'number' },
        },
      },
      B: {
        type: 'object',
        title: 'VariantB',
        properties: {
          kind: { type: 'string' },
          b: { type: 'boolean' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('kind');
    expect(Object.keys(requireSw(result).options)).toEqual(['VariantA', 'VariantB']);
  });

  it('should render discriminator (not One of) for OAS 3.1 allOf wrapper with $ref sibling', () => {
    const doc = makeDocument(
      {
        OptionA: {
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['A'] },
          },
        },
        OptionB: {
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['B'] },
          },
        },
        Discriminated: {
          oneOf: [
            { $ref: '#/components/schemas/OptionA' },
            { $ref: '#/components/schemas/OptionB' },
          ],
          discriminator: {
            propertyName: 'kind',
            mapping: {
              A: '#/components/schemas/OptionA',
              B: '#/components/schemas/OptionB',
            },
          },
        },
        WithSiblingRef: {
          allOf: [{ $ref: '#/components/schemas/Discriminated', default: null }],
        },
      },
      '3.1.0',
    );

    const result = schemaProcessor({ $ref: '#/components/schemas/WithSiblingRef' }, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('kind');
    expect(Object.keys(requireSw(result).options)).toEqual(['A', 'B']);
  });

  it('should use "One of" switcher when no discriminator is present', () => {
    const schema = {
      oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
    };

    const doc = makeDocument({
      Cat: {
        type: 'object',
        title: 'Cat',
        properties: {
          meow: { type: 'boolean' },
        },
      },
      Dog: {
        type: 'object',
        title: 'Dog',
        properties: {
          bark: { type: 'boolean' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('oneOf');
    expect(requireSw(result).label).toBe(switcherLabel.ONE_OF);
    expect(requireSw(result).propertyName).toBeUndefined();
  });

  it('should render discriminator variants with properties when discriminator mapping exists', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'status',
        mapping: {
          active: '#/components/schemas/Active',
          inactive: '#/components/schemas/Inactive',
        },
      },
      oneOf: [{ $ref: '#/components/schemas/Active' }, { $ref: '#/components/schemas/Inactive' }],
    };

    const doc = makeDocument({
      Active: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          activatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Inactive: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          deactivatedAt: { type: 'string', format: 'date-time' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('status');

    const options = requireSw(result).options;
    expect(Object.keys(options)).toEqual(['active', 'inactive']);
    expect(options['active'].properties).toBeDefined();
    expect(requireProps(options['active'])['activatedAt']).toBeDefined();
    expect(options['inactive'].properties).toBeDefined();
    expect(requireProps(options['inactive'])['deactivatedAt']).toBeDefined();
  });

  it('should use variant titles as option keys when discriminator has no mapping', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'type',
      },
      oneOf: [{ $ref: '#/components/schemas/Alpha' }, { $ref: '#/components/schemas/Beta' }],
    };

    const doc = makeDocument({
      Alpha: {
        type: 'object',
        title: 'AlphaVariant',
        properties: {
          type: { type: 'string' },
        },
      },
      Beta: {
        type: 'object',
        title: 'BetaVariant',
        properties: {
          type: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('type');
    expect(Object.keys(requireSw(result).options)).toEqual(['AlphaVariant', 'BetaVariant']);
  });

  it('should merge base properties into discriminator variant options', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
      },
      discriminator: {
        propertyName: 'type',
        mapping: {
          foo: '#/components/schemas/Foo',
        },
      },
      oneOf: [{ $ref: '#/components/schemas/Foo' }],
    };

    const doc = makeDocument({
      Foo: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          value: { type: 'number' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('type');
    // With sibling rules, base properties stay at root level (not distributed into variants)
    expect(result.properties).toBeDefined();
    expect(result.properties?.['id']).toBeDefined();
    const fooOption = requireSw(result).options['foo'];
    expect(fooOption).toBeDefined();
    expect(fooOption.properties).toBeDefined();
    expect(requireProps(fooOption)['value']).toBeDefined();
  });

  it('should derive implicit discriminator variants from allOf children (no oneOf/mapping)', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator: { propertyName: 'petType' },
        properties: {
          petType: { type: 'string' },
          name: { type: 'string' },
        },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Pet' }, doc, {
      rootJsonPointer: '#/components/schemas/Pet',
    });

    const sw = requireSw(result);
    expect(sw.type).toBe('discriminator');
    expect(sw.propertyName).toBe('petType');
    expect(Object.keys(sw.options).sort()).toEqual(['Cat', 'Dog']);
    expect(requireProps(sw.options['Cat'])['huntingSkill']).toBeDefined();
    expect(requireProps(sw.options['Dog'])['packSize']).toBeDefined();
  });

  it('should derive implicit variants when an allOf child is the rendered schema', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator: { propertyName: 'petType' },
        properties: {
          petType: { type: 'string' },
          name: { type: 'string' },
        },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Cat' }, doc);

    const sw = requireSw(result);
    expect(sw.type).toBe('discriminator');
    expect(sw.propertyName).toBe('petType');
    expect(Object.keys(sw.options)).toEqual(['Cat']);
    expect(Object.keys(requireProps(sw.options['Cat']))).toEqual([
      'petType',
      'name',
      'huntingSkill',
    ]);
  });

  it('should list sibling variants when an allOf child is the rendered schema', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Dog: {
        'x-discriminator-value': 'dog',
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Cat' }, doc);

    const sw = requireSw(result);
    expect(Object.keys(sw.options).sort()).toEqual(['Cat', 'dog']);
    expect(requireProps(sw.options['Cat'])['huntingSkill']).toBeDefined();
    expect(requireProps(sw.options['dog'])['packSize']).toBeDefined();
  });

  it("should not offer an unrelated allOf mixin's inheritors as discriminator variants", () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' } },
      },
      Auditable: {
        type: 'object',
        properties: { updatedAt: { type: 'string' } },
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { $ref: '#/components/schemas/Auditable' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      // shares only the mixin with Dog, so it is not a petType variant
      Invoice: {
        allOf: [
          { $ref: '#/components/schemas/Auditable' },
          { type: 'object', properties: { total: { type: 'number' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Dog' }, doc);

    const sw = requireSw(result);
    expect(sw.propertyName).toBe('petType');
    expect(Object.keys(sw.options).sort()).toEqual(['Cat', 'Dog']);
  });

  it('should keep the discriminator host when it is listed after an unrelated mixin', () => {
    const doc = makeDocument({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
      Pet: {
        type: 'object',
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' } },
      },
      // composed mixin: collectAllOfParentRefs recurses past it to Base
      Auditable: {
        allOf: [
          { $ref: '#/components/schemas/Base' },
          { type: 'object', properties: { updatedAt: { type: 'string' } } },
        ],
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { $ref: '#/components/schemas/Auditable' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Cat' }, doc);

    const sw = requireSw(result);
    expect(Object.keys(sw.options).sort()).toEqual(['Cat', 'Dog']);
  });

  it('should skip a mapping entry whose target schema is absent', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        discriminator: {
          propertyName: 'petType',
          mapping: {
            Cat: '#/components/schemas/Cat',
            SecretCat: '#/components/schemas/SecretCat',
          },
        },
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Pet' }, doc);

    const sw = requireSw(result);
    expect(Object.keys(sw.options)).toEqual(['Cat']);
  });

  it('should drop the Default mapping option when its target schema is absent', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        discriminator: {
          propertyName: 'petType',
          mapping: { Cat: '#/components/schemas/Cat' },
          defaultMapping: '#/components/schemas/SecretFallback',
        },
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Pet' }, doc);

    const sw = requireSw(result);
    expect(Object.keys(sw.options)).toEqual(['Cat']);
  });

  it('should look up grandchild variants by the topmost parent only', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Kitten: {
        allOf: [
          { $ref: '#/components/schemas/Cat' },
          { type: 'object', properties: { weeks: { type: 'integer' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Kitten' }, doc);

    const sw = requireSw(result);
    expect(Object.keys(sw.options)).toEqual(['Cat']);
    expect(requireProps(sw.options['Cat'])['huntingSkill']).toBeDefined();
  });

  it('should derive implicit variants for a $ref used as a property', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
      Envelope: {
        type: 'object',
        properties: { pet: { $ref: '#/components/schemas/Cat' } },
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Envelope' }, doc);

    const pet = requireProps(result)['pet'];
    const sw = requireSw(pet);
    expect(Object.keys(sw.options)).toEqual(['Cat', 'Dog']);
    expect(requireProps(sw.options['Cat'])['huntingSkill']).toBeDefined();
    expect(requireProps(sw.options['Dog'])['packSize']).toBeDefined();
  });

  it('should derive implicit variants for a $ref used as array items', () => {
    const doc = makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
      Envelope: {
        type: 'object',
        properties: { pets: { type: 'array', items: { $ref: '#/components/schemas/Cat' } } },
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Envelope' }, doc);

    const items = requireItems(requireProps(result)['pets']);
    const sw = requireSw(items[0]);
    expect(Object.keys(sw.options)).toEqual(['Cat', 'Dog']);
    expect(requireProps(sw.options['Dog'])['packSize']).toBeDefined();
  });

  it('should populate the schema listed as its own variant on a schema page', () => {
    const catSchema = {
      allOf: [
        { $ref: '#/components/schemas/Pet' },
        { type: 'object', properties: { huntingSkill: { type: 'string' } } },
      ],
    };
    const doc = makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' }, name: { type: 'string' } },
      },
      Cat: catSchema,
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
    });

    const result = schemaProcessor(catSchema, doc, {
      rootJsonPointer: '#/components/schemas/Cat',
    });

    const sw = requireSw(result);
    expect(sw.options['Cat'].isCircular).toBeUndefined();
    expect(Object.keys(requireProps(sw.options['Cat']))).toEqual([
      'petType',
      'name',
      'huntingSkill',
    ]);
    expect(Object.keys(requireProps(sw.options['Dog']))).toEqual(['petType', 'name', 'packSize']);
  });

  it('should populate the mapped variant pointing back at the rendered schema', () => {
    const cardSchema = {
      allOf: [
        { $ref: '#/components/schemas/Payment' },
        { type: 'object', properties: { last4: { type: 'string' } } },
      ],
    };
    const doc = makeDocument({
      Payment: {
        type: 'object',
        required: ['payType'],
        discriminator: {
          propertyName: 'payType',
          mapping: { card: '#/components/schemas/Card' },
        },
        properties: { payType: { type: 'string' } },
      },
      Card: cardSchema,
    });

    const result = schemaProcessor(cardSchema, doc, {
      rootJsonPointer: '#/components/schemas/Card',
    });

    const sw = requireSw(result);
    expect(sw.options['card'].isCircular).toBeUndefined();
    expect(Object.keys(requireProps(sw.options['card']))).toEqual(['payType', 'last4']);
  });

  it('should render the self-variant while still terminating on a self-referencing property', () => {
    const childSchema = {
      allOf: [
        { $ref: '#/components/schemas/Node' },
        { type: 'object', properties: { child: { $ref: '#/components/schemas/Child' } } },
      ],
    };
    const doc = makeDocument({
      Node: {
        type: 'object',
        required: ['nodeType'],
        discriminator: { propertyName: 'nodeType' },
        properties: { nodeType: { type: 'string' } },
      },
      Child: childSchema,
    });

    const result = schemaProcessor(childSchema, doc, {
      rootJsonPointer: '#/components/schemas/Child',
    });

    const sw = requireSw(result);
    expect(Object.keys(requireProps(sw.options['Child']))).toEqual(['nodeType', 'child']);
  });

  it('should render plain fields when no variant is derivable from an inline-only allOf', () => {
    const doc = makeDocument({
      InlineOnly: {
        allOf: [
          {
            type: 'object',
            required: ['k'],
            discriminator: { propertyName: 'k' },
            properties: { k: { type: 'string' } },
          },
          { type: 'object', properties: { z: { type: 'string' } } },
        ],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/InlineOnly' }, doc, {
      rootJsonPointer: '#/components/schemas/InlineOnly',
    });

    expect(result.switcher).toBeUndefined();
    expect(Object.keys(requireProps(result))).toEqual(['k', 'z']);
  });

  it('should drop an empty selector inside a oneOf variant', () => {
    const doc = makeDocument({
      InlineOnly: {
        allOf: [
          {
            type: 'object',
            required: ['k'],
            discriminator: { propertyName: 'k' },
            properties: { k: { type: 'string' } },
          },
          { type: 'object', properties: { z: { type: 'string' } } },
        ],
      },
      Wrapper: {
        oneOf: [{ $ref: '#/components/schemas/InlineOnly' }],
      },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Wrapper' }, doc, {
      rootJsonPointer: '#/components/schemas/Wrapper',
    });

    const sw = requireSw(result);
    expect(sw.options['InlineOnly'].switcher).toBeUndefined();
    expect(Object.keys(requireProps(sw.options['InlineOnly']))).toEqual(['k', 'z']);
  });

  it('should treat x-discriminator as One of (not in OpenAPI merge sibling list)', () => {
    // x-discriminator is not recognized by OpenAPI merge rules as a sibling key,
    // so mergeCombinarySibling folds it into each variant and it's lost from top level.
    const schema = {
      type: 'object',
      'x-discriminator': {
        propertyName: 'category',
      },
      oneOf: [{ $ref: '#/components/schemas/TypeA' }],
    };

    const doc = makeDocument({
      TypeA: {
        type: 'object',
        title: 'TypeA',
        properties: {
          category: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('oneOf');
    expect(requireSw(result).label).toBe(switcherLabel.ONE_OF);
    expect(requireSw(result).propertyName).toBeUndefined();
  });

  it('should work with OpenAPI 3.0 version detection', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'petType',
      },
      oneOf: [{ $ref: '#/components/schemas/Cat' }],
    };

    const doc = {
      openapi: '3.0.3',
      info: { title: '', version: '1.0' },
      paths: {},
      components: {
        schemas: {
          Cat: {
            type: 'object',
            title: 'Cat',
            properties: {
              petType: { type: 'string' },
            },
          },
        },
      },
    } as Document;

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('petType');
    expect(Object.keys(requireSw(result).options)).toEqual(['Cat']);
  });

  it('should not set propertyName on oneOf/anyOf switchers', () => {
    const schemaOneOf = {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    };

    const schemaAnyOf = {
      anyOf: [{ type: 'string' }, { type: 'boolean' }],
    };

    const doc = makeDocument({});

    const resultOneOf = schemaProcessor(schemaOneOf, doc);
    expect(requireSw(resultOneOf).type).toBe('oneOf');
    expect(requireSw(resultOneOf).propertyName).toBeUndefined();

    const resultAnyOf = schemaProcessor(schemaAnyOf, doc);
    expect(requireSw(resultAnyOf).type).toBe('oneOf');
    expect(requireSw(resultAnyOf).label).toBe(switcherLabel.ANY_OF);
    expect(requireSw(resultAnyOf).propertyName).toBeUndefined();
  });

  it('should compose property.type from variant titles for titled oneOf', () => {
    const schema = {
      type: 'object',
      title: 'EntityMetadata',
      oneOf: [
        { $ref: '#/components/schemas/PnrMetadataWrapper' },
        { $ref: '#/components/schemas/EventMetadataWrapper' },
        { $ref: '#/components/schemas/LegMetadataWrapper' },
      ],
    };

    const doc = makeDocument({
      PnrMetadataWrapper: {
        type: 'object',
        title: 'PnrMetadataWrapper',
        properties: { pnrId: { type: 'string' } },
      },
      EventMetadataWrapper: {
        type: 'object',
        title: 'EventMetadataWrapper',
        properties: { eventId: { type: 'string' } },
      },
      LegMetadataWrapper: {
        type: 'object',
        title: 'LegMetadataWrapper',
        properties: { legId: { type: 'string' } },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.type).toBe(
      'PnrMetadataWrapper (object) or EventMetadataWrapper (object) or LegMetadataWrapper (object)',
    );
    expect(result.title).toBe('EntityMetadata');
  });

  it('should compose property.type from variant displayTypes for untitled oneOf', () => {
    const schema = {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    };

    const result = schemaProcessor(schema, emptyDoc);

    expect(result.type).toBe('string or number');
  });

  it('should compose property.type for anyOf using variant titles', () => {
    const schema = {
      type: 'object',
      title: 'Plan',
      anyOf: [
        { $ref: '#/components/schemas/OneTimeSalePlan' },
        { $ref: '#/components/schemas/SubscriptionPlan' },
      ],
    };

    const doc = makeDocument({
      OneTimeSalePlan: {
        type: 'object',
        title: 'OneTimeSalePlan',
        properties: { name: { type: 'string' } },
      },
      SubscriptionPlan: {
        type: 'object',
        title: 'SubscriptionPlan',
        properties: { name: { type: 'string' } },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.type).toBe('OneTimeSalePlan (object) or SubscriptionPlan (object)');
    expect(result.title).toBe('Plan');
  });

  it('should deduplicate identical variant displayTypes in oneOf', () => {
    const schema = {
      oneOf: [{ type: 'string' }, { type: 'string' }, { type: 'number' }],
    };

    const result = schemaProcessor(schema, emptyDoc);

    expect(result.type).toBe('string or number');
  });

  it('should not override property.type for discriminator schemas', () => {
    const schema = {
      type: 'object',
      title: 'Pet',
      discriminator: {
        propertyName: 'petType',
        mapping: {
          cat: '#/components/schemas/Cat',
        },
      },
      oneOf: [{ $ref: '#/components/schemas/Cat' }],
    };

    const doc = makeDocument({
      Cat: {
        type: 'object',
        title: 'Cat',
        properties: { petType: { type: 'string' } },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.type).toBe('object');
    expect(result.title).toBe('Pet');
  });

  it('should preserve oneOf parent title for nested $ref properties', () => {
    const schema = {
      type: 'object',
      properties: {
        entityMetadata: { $ref: '#/components/schemas/EntityMetadata' },
      },
    };

    const doc = makeDocument({
      EntityMetadata: {
        type: 'object',
        title: 'EntityMetadata',
        description: 'Metadata for associated entity',
        oneOf: [
          { $ref: '#/components/schemas/PnrMetadataWrapper' },
          { $ref: '#/components/schemas/EventMetadataWrapper' },
        ],
      },
      PnrMetadataWrapper: {
        type: 'object',
        title: 'PnrMetadataWrapper',
        properties: { pnrId: { type: 'string' } },
      },
      EventMetadataWrapper: {
        type: 'object',
        title: 'EventMetadataWrapper',
        properties: { eventId: { type: 'string' } },
      },
    });

    const result = schemaProcessor(schema, doc);
    const entityMetadata = requireProps(result)['entityMetadata'];

    expect(entityMetadata.type).toBe(
      'PnrMetadataWrapper (object) or EventMetadataWrapper (object)',
    );
    expect(entityMetadata.title).toBe('EntityMetadata');
    expect(entityMetadata.description).toBe('Metadata for associated entity');
  });

  it('should preserve oneOf parent title for inline nested fields', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          choice: {
            type: 'object',
            title: 'NestedChoice',
            oneOf: [
              { type: 'object', title: 'A', properties: { a: { type: 'string' } } },
              { type: 'object', title: 'B', properties: { b: { type: 'number' } } },
            ],
          },
        },
      },
      emptyDoc,
    );
    const choice = requireProps(result)['choice'];

    expect(choice.type).toBe('A (object) or B (object)');
    expect(choice.title).toBe('NestedChoice');
  });

  it('should render $ref child property with discriminator+oneOf as Discriminator', () => {
    const schema = {
      type: 'object',
      properties: {
        shipping: { $ref: '#/components/schemas/Shipping' },
        tax: { $ref: '#/components/schemas/Taxes' },
        name: { type: 'string' },
      },
    };

    const doc = makeDocument({
      Shipping: {
        type: 'object',
        description: 'Shipping settings.',
        discriminator: {
          propertyName: 'calculator',
          mapping: {
            manual: '#/components/schemas/ManualShipping',
            rebilly: '#/components/schemas/RebillyShipping',
          },
        },
        oneOf: [
          { $ref: '#/components/schemas/ManualShipping' },
          { $ref: '#/components/schemas/RebillyShipping' },
        ],
      },
      ManualShipping: {
        type: 'object',
        properties: {
          calculator: { type: 'string', enum: ['manual'] },
          amount: { type: 'number' },
        },
      },
      RebillyShipping: {
        type: 'object',
        properties: {
          calculator: { type: 'string', enum: ['rebilly'] },
          rateId: { type: 'string' },
        },
      },
      Taxes: {
        type: 'object',
        description: 'Taxes.',
        discriminator: {
          propertyName: 'calculator',
          mapping: {
            manual: '#/components/schemas/ManualTax',
          },
        },
        oneOf: [{ $ref: '#/components/schemas/ManualTax' }],
      },
      ManualTax: {
        type: 'object',
        properties: {
          calculator: { type: 'string', enum: ['manual'] },
          amount: { type: 'number' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeUndefined();
    expect(result.properties).toBeDefined();
    expect(requireProps(result)['name']).toBeDefined();

    const shipping = requireProps(result)['shipping'];
    expect(shipping.switcher).toBeDefined();
    expect(requireSw(shipping).type).toBe('discriminator');
    expect(requireSw(shipping).label).toBe('Discriminator');
    expect(requireSw(shipping).propertyName).toBe('calculator');

    const tax = requireProps(result)['tax'];
    expect(tax.switcher).toBeDefined();
    expect(requireSw(tax).type).toBe('discriminator');
    expect(requireSw(tax).label).toBe('Discriminator');
    expect(requireSw(tax).propertyName).toBe('calculator');
  });

  it('should render inline child property with discriminator+oneOf as Discriminator', () => {
    const schema = {
      type: 'object',
      required: ['method', 'value', 'type'],
      properties: {
        method: { type: 'string', enum: ['partial'] },
        value: { type: 'number', format: 'float' },
        type: { type: 'string', enum: ['percent', 'fixed'] },
        afterApprovalPolicy: {
          description: 'Policy after approval.',
          discriminator: {
            propertyName: 'method',
            mapping: {
              none: '#/components/schemas/PolicyNone',
              'discount-amount-remaining': '#/components/schemas/PolicyDiscount',
            },
          },
          oneOf: [
            { $ref: '#/components/schemas/PolicyNone' },
            { $ref: '#/components/schemas/PolicyDiscount' },
          ],
        },
      },
    };

    const doc = makeDocument({
      PolicyNone: {
        type: 'object',
        properties: {
          method: { type: 'string', enum: ['none'] },
        },
      },
      PolicyDiscount: {
        type: 'object',
        properties: {
          method: { type: 'string', enum: ['discount-amount-remaining'] },
          discount: { type: 'number' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeUndefined();
    expect(result.properties).toBeDefined();

    const aap = requireProps(result)['afterApprovalPolicy'];
    expect(aap.switcher).toBeDefined();
    expect(requireSw(aap).type).toBe('discriminator');
    expect(requireSw(aap).label).toBe('Discriminator');
    expect(requireSw(aap).propertyName).toBe('method');
    expect(Object.keys(requireSw(aap).options)).toEqual(['none', 'discount-amount-remaining']);
  });

  it('should render playground PaymentOptionWithDiscriminator as Discriminator switcher for $ref child', () => {
    const schema = {
      type: 'object',
      properties: {
        paymentOptionWithDiscriminator: {
          $ref: '#/components/schemas/PaymentOptionWithDiscriminator',
        },
      },
    };

    const doc = makeDocument(
      {
        OptionA: {
          type: 'object',
          required: ['kind', 'valueA'],
          properties: {
            kind: { type: 'string', enum: ['A'] },
            valueA: { type: 'string', example: 'foo' },
          },
        },
        OptionB: {
          type: 'object',
          required: ['kind', 'valueB'],
          properties: {
            kind: { type: 'string', enum: ['B'] },
            valueB: { type: 'integer', example: 42 },
          },
        },
        PaymentOptionWithDiscriminator: {
          title: 'Payment Option (with discriminator)',
          description: 'Small example of discriminator usage',
          oneOf: [
            { $ref: '#/components/schemas/OptionA' },
            { $ref: '#/components/schemas/OptionB' },
          ],
          discriminator: {
            propertyName: 'kind',
            mapping: {
              A: '#/components/schemas/OptionA',
              B: '#/components/schemas/OptionB',
            },
          },
        },
      },
      '3.1.0',
    );

    const result = schemaProcessor(schema, doc);
    const paymentOption = requireProps(result)['paymentOptionWithDiscriminator'];

    expect(paymentOption.switcher).toBeDefined();
    expect(requireSw(paymentOption).type).toBe('discriminator');
    expect(requireSw(paymentOption).label).toBe('Discriminator');
    expect(requireSw(paymentOption).propertyName).toBe('kind');
    expect(Object.keys(requireSw(paymentOption).options)).toEqual(['A', 'B']);
  });

  it('should render top-level schema with discriminator+oneOf as Discriminator', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'calculator',
        mapping: {
          manual: '#/components/schemas/ManualShipping',
          rebilly: '#/components/schemas/RebillyShipping',
        },
      },
      oneOf: [
        { $ref: '#/components/schemas/ManualShipping' },
        { $ref: '#/components/schemas/RebillyShipping' },
      ],
    };

    const doc = makeDocument({
      ManualShipping: {
        type: 'object',
        properties: {
          calculator: { type: 'string', enum: ['manual'] },
          amount: { type: 'number' },
        },
      },
      RebillyShipping: {
        type: 'object',
        properties: {
          calculator: { type: 'string', enum: ['rebilly'] },
          rateId: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('calculator');
    expect(Object.keys(requireSw(result).options)).toEqual(['manual', 'rebilly']);
  });

  it('should handle discriminator with multiple mapping keys pointing to same schema', () => {
    // Matches PaymentMethodMetadata.supportedCurrencies pattern:
    // discriminator with 3 mapping entries but only 2 oneOf variants
    const schema = {
      type: 'object',
      properties: {
        supportedCurrencies: {
          type: 'object',
          description: 'Supported currencies.',
          required: ['mode'],
          discriminator: {
            propertyName: 'mode',
            mapping: {
              unknown: '#/components/schemas/CurrenciesUnrestricted',
              all: '#/components/schemas/CurrenciesUnrestricted',
              subset: '#/components/schemas/CurrenciesSubset',
            },
          },
          oneOf: [
            { $ref: '#/components/schemas/CurrenciesUnrestricted' },
            { $ref: '#/components/schemas/CurrenciesSubset' },
          ],
        },
      },
    };

    const doc = makeDocument({
      CurrenciesUnrestricted: {
        title: 'Unrestricted',
        required: ['mode'],
        properties: {
          mode: { type: 'string', enum: ['unknown', 'all'] },
        },
      },
      CurrenciesSubset: {
        title: 'Subset',
        required: ['mode', 'values'],
        properties: {
          mode: { type: 'string', enum: ['subset'] },
          values: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.properties).toBeDefined();
    const currencies = requireProps(result)['supportedCurrencies'];
    expect(currencies.switcher).toBeDefined();
    expect(requireSw(currencies).type).toBe('discriminator');
    expect(requireSw(currencies).label).toBe('Discriminator');
    expect(requireSw(currencies).propertyName).toBe('mode');
    expect(Object.keys(requireSw(currencies).options)).toEqual(['unknown', 'all', 'subset']);
  });

  it('should detect discriminator in nested discriminator variant properties', () => {
    // Matches InvoiceRetryAmountAdjustmentInstruction.[partial].afterApprovalPolicy pattern:
    // A top-level discriminator variant has a property with its own discriminator
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'method',
        mapping: {
          partial: '#/components/schemas/Partial',
          none: '#/components/schemas/None',
        },
      },
      oneOf: [{ $ref: '#/components/schemas/Partial' }, { $ref: '#/components/schemas/None' }],
    };

    const doc = makeDocument({
      Partial: {
        type: 'object',
        properties: {
          method: { type: 'string', enum: ['partial'] },
          policy: {
            description: 'Nested policy with its own discriminator.',
            discriminator: {
              propertyName: 'action',
              mapping: {
                none: '#/components/schemas/PolicyNone',
                discount: '#/components/schemas/PolicyDiscount',
              },
            },
            oneOf: [
              { $ref: '#/components/schemas/PolicyNone' },
              { $ref: '#/components/schemas/PolicyDiscount' },
            ],
          },
        },
      },
      None: {
        type: 'object',
        properties: {
          method: { type: 'string', enum: ['none'] },
        },
      },
      PolicyNone: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['none'] },
        },
      },
      PolicyDiscount: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['discount'] },
          amount: { type: 'number' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('method');

    const partialOption = requireSw(result).options['partial'];
    expect(partialOption).toBeDefined();
    expect(partialOption.properties).toBeDefined();
    const policy = requireProps(partialOption)['policy'];
    expect(policy.switcher).toBeDefined();
    expect(requireSw(policy).type).toBe('discriminator');
    expect(requireSw(policy).label).toBe('Discriminator');
    expect(requireSw(policy).propertyName).toBe('action');
    expect(Object.keys(requireSw(policy).options)).toEqual(['none', 'discount']);
  });

  it('should keep discriminator switchers for ref properties inside array items', () => {
    // Matches /payment-gateways-metadata response: { type: array, items: $ref: PaymentGatewayMetadata }
    // PaymentGatewayMetadata has merchantCountries ($ref) and currencies (inline discriminator)
    const schema = {
      type: 'array',
      items: { $ref: '#/components/schemas/PaymentGatewayMetadata' },
    };

    const doc = makeDocument({
      PaymentGatewayMetadata: {
        type: 'object',
        properties: {
          merchantCountries: { $ref: '#/components/schemas/CountriesMetadata' },
          currencies: {
            type: 'object',
            discriminator: {
              propertyName: 'mode',
              mapping: {
                unknown: '#/components/schemas/Unrestricted',
                all: '#/components/schemas/Unrestricted',
                subset: '#/components/schemas/Subset',
              },
            },
            oneOf: [
              { $ref: '#/components/schemas/Unrestricted' },
              { $ref: '#/components/schemas/Subset' },
            ],
          },
        },
      },
      CountriesMetadata: {
        type: 'object',
        discriminator: {
          propertyName: 'mode',
          mapping: {
            unknown: '#/components/schemas/CountriesUnrestricted',
            all: '#/components/schemas/CountriesUnrestricted',
            subset: '#/components/schemas/CountriesSubset',
          },
        },
        oneOf: [
          { $ref: '#/components/schemas/CountriesUnrestricted' },
          { $ref: '#/components/schemas/CountriesSubset' },
        ],
      },
      CountriesUnrestricted: {
        title: 'Unrestricted',
        type: 'object',
        properties: { mode: { type: 'string' } },
      },
      CountriesSubset: {
        title: 'Subset',
        type: 'object',
        properties: { mode: { type: 'string' } },
      },
      Unrestricted: {
        title: 'Unrestricted',
        type: 'object',
        properties: { mode: { type: 'string' } },
      },
      Subset: {
        title: 'Subset',
        type: 'object',
        properties: { mode: { type: 'string' } },
      },
    });

    const result = schemaProcessor(schema, doc);

    // The result is an array, items[0] is the PaymentGatewayMetadata
    expect(result.items).toBeDefined();
    expect(requireItems(result).length).toBe(1);

    const gwItem = requireItems(result)[0];
    expect(gwItem.properties).toBeDefined();

    const mc = requireProps(gwItem)['merchantCountries'];
    expect(mc.switcher).toBeDefined();
    expect(requireSw(mc).type).toBe('discriminator');
    expect(requireSw(mc).label).toBe('Discriminator');
    expect(requireSw(mc).propertyName).toBe('mode');

    const cur = requireProps(gwItem)['currencies'];
    expect(cur.switcher).toBeDefined();
    expect(requireSw(cur).type).toBe('discriminator');
    expect(requireSw(cur).label).toBe('Discriminator');
    expect(requireSw(cur).propertyName).toBe('mode');
  });

  it('should synthesize oneOf from discriminator.mapping when oneOf is absent', () => {
    // Matches TimelineTable pattern: discriminator + mapping but no oneOf
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'type',
        mapping: {
          'three-columns': '#/components/schemas/ThreeColumnsTable',
          'two-columns': '#/components/schemas/TwoColumnsTable',
          list: '#/components/schemas/ListTable',
        },
      },
      properties: {
        type: {
          type: 'string',
          enum: ['list', 'two-columns', 'three-columns'],
        },
        title: { type: 'string' },
      },
    };

    const doc = makeDocument({
      ThreeColumnsTable: {
        allOf: [
          { $ref: '#/components/schemas/BaseTable' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    attribute: { type: 'string' },
                    previousValue: { type: 'string' },
                    newValue: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      },
      TwoColumnsTable: {
        allOf: [
          { $ref: '#/components/schemas/BaseTable' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    attribute: { type: 'string' },
                    value: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      },
      ListTable: {
        allOf: [
          { $ref: '#/components/schemas/BaseTable' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        ],
      },
      BaseTable: {
        type: 'object',
        discriminator: {
          propertyName: 'type',
          mapping: {
            'three-columns': '#/components/schemas/ThreeColumnsTable',
            'two-columns': '#/components/schemas/TwoColumnsTable',
            list: '#/components/schemas/ListTable',
          },
        },
        properties: {
          type: {
            type: 'string',
            enum: ['list', 'two-columns', 'three-columns'],
          },
          title: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).label).toBe('Discriminator');
    expect(requireSw(result).propertyName).toBe('type');
    expect(Object.keys(requireSw(result).options)).toEqual([
      'three-columns',
      'two-columns',
      'list',
    ]);

    // After merge with mergeCombinarySibling, base properties (type, title) are
    // distributed into each oneOf variant, so they appear in the options, not at the top level
  });

  it('should produce two discriminators for nested array items with discriminator.mapping and no oneOf', () => {
    // Mirrors the CustomerTimeline → TimelineExtraData → tables[] (TimelineTable) pattern
    // where actions[] has discriminator + oneOf, but tables[] has discriminator + mapping only
    const schema = {
      type: 'object',
      properties: {
        extraData: {
          type: 'object',
          properties: {
            actions: {
              type: 'array',
              items: {
                type: 'object',
                discriminator: {
                  propertyName: 'action',
                  mapping: {
                    cancel: '#/components/schemas/CancelAction',
                    retry: '#/components/schemas/RetryAction',
                  },
                },
                oneOf: [
                  { $ref: '#/components/schemas/CancelAction' },
                  { $ref: '#/components/schemas/RetryAction' },
                ],
              },
            },
            tables: {
              type: 'array',
              items: {
                type: 'object',
                discriminator: {
                  propertyName: 'type',
                  mapping: {
                    'two-columns': '#/components/schemas/TwoColTable',
                    list: '#/components/schemas/ListTbl',
                  },
                },
                // NO oneOf here — relies on discriminator.mapping only
                properties: {
                  type: { type: 'string', enum: ['list', 'two-columns'] },
                  title: { type: 'string' },
                },
              },
            },
          },
        },
      },
    };

    const doc = makeDocument({
      CancelAction: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['cancel'] },
          reason: { type: 'string' },
        },
      },
      RetryAction: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['retry'] },
          delay: { type: 'number' },
        },
      },
      TwoColTable: {
        allOf: [
          { $ref: '#/components/schemas/BaseTimeline' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    attribute: { type: 'string' },
                    value: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      },
      ListTbl: {
        allOf: [
          { $ref: '#/components/schemas/BaseTimeline' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        ],
      },
      BaseTimeline: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          title: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.properties).toBeDefined();
    const extraData = requireProps(result)['extraData'];
    expect(extraData.properties).toBeDefined();

    // actions[] items have discriminator+oneOf → discriminator takes priority
    const actions = requireProps(extraData)['actions'];
    expect(actions.items).toBeDefined();
    expect(requireItems(actions).length).toBe(1);
    const actionItem = requireItems(actions)[0];
    expect(actionItem.switcher).toBeDefined();
    expect(requireSw(actionItem).type).toBe('discriminator');
    expect(requireSw(actionItem).label).toBe('Discriminator');
    expect(requireSw(actionItem).propertyName).toBe('action');
    expect(Object.keys(requireSw(actionItem).options)).toEqual(['cancel', 'retry']);

    // tables[] items should ALSO have a Discriminator (synthesized from mapping)
    const tables = requireProps(extraData)['tables'];
    expect(tables.items).toBeDefined();
    expect(requireItems(tables).length).toBe(1);
    const tableItem = requireItems(tables)[0];
    expect(tableItem.switcher).toBeDefined();
    expect(requireSw(tableItem).type).toBe('discriminator');
    expect(requireSw(tableItem).label).toBe('Discriminator');
    expect(requireSw(tableItem).propertyName).toBe('type');
    expect(Object.keys(requireSw(tableItem).options)).toEqual(['two-columns', 'list']);

    // Table variant options should have resolved properties
    const twoCol = requireSw(tableItem).options['two-columns'];
    expect(twoCol.properties).toBeDefined();
    expect(requireProps(twoCol)['data']).toBeDefined();
  });
});

describe('schemaProcessor discriminator defaultMapping (OpenAPI 3.2)', () => {
  it('should append defaultMapping after mapping entries with isDefaultMapping=true', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'petType',
        mapping: {
          cat: '#/components/schemas/Cat',
          dog: '#/components/schemas/Dog',
        },
        defaultMapping: '#/components/schemas/OtherPet',
      },
      oneOf: [
        { $ref: '#/components/schemas/Cat' },
        { $ref: '#/components/schemas/Dog' },
        { $ref: '#/components/schemas/OtherPet' },
      ],
    };

    const doc = makeDocument({
      Cat: { type: 'object', properties: { petType: { type: 'string' } } },
      Dog: { type: 'object', properties: { petType: { type: 'string' } } },
      OtherPet: {
        type: 'object',
        properties: {
          petType: { type: 'string' },
          species: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);
    const sw = requireSw(result);

    expect(sw.type).toBe('discriminator');
    expect(Object.keys(sw.options)).toEqual(['cat', 'dog', 'Default mapping']);
    expect(sw.options['cat'].isDefaultMapping).toBe(false);
    expect(sw.options['dog'].isDefaultMapping).toBe(false);
    expect(sw.options['Default mapping'].isDefaultMapping).toBe(true);
    expect(requireProps(sw.options['Default mapping'])['species']).toBeDefined();
  });

  it('should support defaultMapping when mapping is absent', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'type',
        defaultMapping: '#/components/schemas/GenericAnimal',
      },
    };

    const doc = makeDocument({
      GenericAnimal: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          species: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);
    const sw = requireSw(result);

    expect(sw.type).toBe('discriminator');
    expect(Object.keys(sw.options)).toEqual(['Default mapping']);
    expect(sw.options['Default mapping'].isDefaultMapping).toBe(true);
    expect(requireProps(sw.options['Default mapping'])['species']).toBeDefined();
  });

  it('should keep an explicit mapping entry that points to the same ref as defaultMapping', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'petType',
        mapping: {
          cat: '#/components/schemas/Cat',
          other: '#/components/schemas/OtherPet',
        },
        defaultMapping: '#/components/schemas/OtherPet',
      },
    };

    const doc = makeDocument({
      Cat: { type: 'object', properties: { petType: { type: 'string' } } },
      OtherPet: { type: 'object', properties: { petType: { type: 'string' } } },
    });

    const result = schemaProcessor(schema, doc);
    const sw = requireSw(result);

    expect(Object.keys(sw.options)).toEqual(['cat', 'other', 'Default mapping']);
    expect(sw.options['other'].isDefaultMapping).toBe(false);
    expect(sw.options['Default mapping'].isDefaultMapping).toBe(true);
  });

  it('should place defaultMapping last regardless of mapping order', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'type',
        mapping: {
          truck: '#/components/schemas/Truck',
          bike: '#/components/schemas/Bike',
          car: '#/components/schemas/Car',
        },
        defaultMapping: '#/components/schemas/GenericVehicle',
      },
    };

    const doc = makeDocument({
      Truck: { type: 'object', properties: { type: { type: 'string' } } },
      Bike: { type: 'object', properties: { type: { type: 'string' } } },
      Car: { type: 'object', properties: { type: { type: 'string' } } },
      GenericVehicle: { type: 'object', properties: { type: { type: 'string' } } },
    });

    const result = schemaProcessor(schema, doc);
    const sw = requireSw(result);

    expect(Object.keys(sw.options)).toEqual(['truck', 'bike', 'car', 'Default mapping']);
    expect(sw.options['Default mapping'].isDefaultMapping).toBe(true);
  });

  it('should not mark plain mapping entries as isDefaultMapping', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'type',
        mapping: {
          a: '#/components/schemas/A',
          b: '#/components/schemas/B',
        },
      },
    };

    const doc = makeDocument({
      A: { type: 'object', properties: { type: { type: 'string' } } },
      B: { type: 'object', properties: { type: { type: 'string' } } },
    });

    const sw = requireSw(schemaProcessor(schema, doc));
    expect(sw.options['a'].isDefaultMapping).toBe(false);
    expect(sw.options['b'].isDefaultMapping).toBe(false);
    expect(Object.keys(sw.options)).toEqual(['a', 'b']);
  });

  it('should fold an implicit variant named like the defaultMapping schema into Default mapping', () => {
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'defType',
        defaultMapping: '#/components/schemas/DefaultedPet',
      },
      properties: { defType: { type: 'string' } },
    };

    const doc = makeDocument({
      DefaultedRoot: schema,
      DefaultedPet: {
        allOf: [
          { $ref: '#/components/schemas/DefaultedRoot' },
          { type: 'object', properties: { petName: { type: 'string' } } },
        ],
      },
      DefaultedCar: {
        allOf: [
          { $ref: '#/components/schemas/DefaultedRoot' },
          { type: 'object', properties: { plate: { type: 'string' } } },
        ],
      },
    });

    const result = schemaProcessor(schema, doc, {
      rootJsonPointer: '#/components/schemas/DefaultedRoot',
    });
    const sw = requireSw(result);

    expect(Object.keys(sw.options)).toEqual(['DefaultedCar', 'Default mapping']);
    expect(sw.options['Default mapping'].isDefaultMapping).toBe(true);
    expect(requireProps(sw.options['Default mapping'])['petName'].type).toBe('string');
  });
});

describe('schemaProcessor discriminator+oneOf as $ref property (PlanPriceFormula pattern)', () => {
  it('should render discriminator+oneOf $ref property as Discriminator', () => {
    const schema = {
      type: 'object',
      properties: {
        pricing: { $ref: '#/components/schemas/PlanPriceFormula' },
      },
    };

    const doc = makeDocument({
      PlanPriceFormula: {
        description: 'Pricing details.',
        type: 'object',
        discriminator: {
          propertyName: 'formula',
          mapping: {
            'fixed-fee': '#/components/schemas/PlanFormulaFixedFee',
            'flat-rate': '#/components/schemas/PlanFormulaFlatRate',
            tiered: '#/components/schemas/PlanFormulaTiered',
          },
        },
        oneOf: [
          { $ref: '#/components/schemas/PlanFormulaFixedFee' },
          { $ref: '#/components/schemas/PlanFormulaFlatRate' },
          { $ref: '#/components/schemas/PlanFormulaTiered' },
        ],
      },
      PlanFormulaFixedFee: {
        title: 'Fixed-fee',
        type: 'object',
        description: 'Fixed-fee pricing.',
        properties: {
          formula: { type: 'string' },
          price: { type: 'number' },
        },
      },
      PlanFormulaFlatRate: {
        title: 'Flat rate',
        type: 'object',
        description: 'Flat rate pricing.',
        properties: {
          formula: { type: 'string' },
          maxQuantity: { type: 'integer' },
        },
      },
      PlanFormulaTiered: {
        title: 'Tiered',
        type: 'object',
        description: 'Tiered pricing.',
        properties: {
          formula: { type: 'string' },
          brackets: { type: 'array', items: { type: 'object' } },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.properties).toBeDefined();
    const pricing = requireProps(result)['pricing'];
    expect(pricing.switcher).toBeDefined();
    expect(requireSw(pricing).type).toBe('discriminator');
    expect(requireSw(pricing).label).toBe('Discriminator');
    expect(requireSw(pricing).propertyName).toBe('formula');
  });
});

describe('schemaProcessor discriminator+oneOf array items (SubscriptionOrOneTimeSale pattern)', () => {
  it('should render array items with discriminator+oneOf as Discriminator', () => {
    const schema = {
      type: 'object',
      properties: {
        orders: {
          description: 'List of returned orders.',
          readOnly: true,
          type: 'array',
          items: { $ref: '#/components/schemas/SubscriptionOrOneTimeSale' },
        },
      },
    };

    const doc = makeDocument({
      SubscriptionOrOneTimeSale: {
        type: 'object',
        description: 'Subscription details.',
        discriminator: {
          propertyName: 'orderType',
          mapping: {
            'subscription-order': '#/components/schemas/Subscription',
            'one-time-order': '#/components/schemas/OneTimeSale',
          },
        },
        oneOf: [
          { $ref: '#/components/schemas/Subscription' },
          { $ref: '#/components/schemas/OneTimeSale' },
        ],
      },
      Subscription: {
        type: 'object',
        properties: {
          id: { type: 'string', readOnly: true, maxLength: 50 },
          orderType: { type: 'string', enum: ['subscription-order'] },
          customerId: { type: 'string', maxLength: 50 },
          status: { type: 'string', enum: ['pending', 'active', 'abandoned', 'canceled'] },
        },
        required: ['orderType', 'customerId'],
      },
      OneTimeSale: {
        type: 'object',
        properties: {
          id: { type: 'string', readOnly: true, maxLength: 50 },
          orderType: { type: 'string', enum: ['one-time-order'] },
          customerId: { type: 'string', maxLength: 50 },
          status: { type: 'string', enum: ['pending', 'completed', 'canceled'] },
        },
        required: ['orderType', 'customerId'],
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.properties).toBeDefined();
    const orders = requireProps(result)['orders'];
    expect(orders.items).toBeDefined();
    expect(requireItems(orders).length).toBe(1);

    const orderItem = requireItems(orders)[0];
    expect(orderItem.switcher).toBeDefined();
    expect(requireSw(orderItem).type).toBe('discriminator');
    expect(requireSw(orderItem).label).toBe('Discriminator');
    expect(requireSw(orderItem).propertyName).toBe('orderType');
    expect(Object.keys(requireSw(orderItem).options)).toEqual([
      'subscription-order',
      'one-time-order',
    ]);

    const subscription = requireSw(orderItem).options['subscription-order'];
    expect(subscription.properties).toBeDefined();
    expect(requireProps(subscription)['id']).toBeDefined();
    expect(requireProps(subscription)['orderType']).toBeDefined();
    expect(requireProps(subscription)['customerId']).toBeDefined();

    const oneTimeSale = requireSw(orderItem).options['one-time-order'];
    expect(oneTimeSale.properties).toBeDefined();
    expect(requireProps(oneTimeSale)['id']).toBeDefined();
    expect(requireProps(oneTimeSale)['orderType']).toBeDefined();
  });
});

describe('schemaProcessor nested oneOf with allOf+anyOf (FlexiblePlan pattern)', () => {
  it('should show correct title and nested anyOf for allOf+anyOf variant', () => {
    const schema = {
      type: 'object',
      properties: {
        plan: {
          description: 'Plan details.',
          oneOf: [
            { $ref: '#/components/schemas/OriginalPlan' },
            { $ref: '#/components/schemas/FlexiblePlan' },
          ],
        },
      },
    };

    const doc = makeDocument({
      OriginalPlan: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID of the plan.' },
        },
      },
      FlexiblePlan: {
        allOf: [
          {
            type: 'object',
            required: ['id'],
            properties: {
              id: { type: 'string', description: 'ID of the plan.', maxLength: 50 },
            },
          },
          {
            anyOf: [
              { $ref: '#/components/schemas/PlanA' },
              { $ref: '#/components/schemas/PlanB' },
              { $ref: '#/components/schemas/PlanC' },
            ],
          },
        ],
      },
      PlanA: {
        type: 'object',
        title: 'PlanA',
        description: 'One-time sale plan.',
        properties: {
          name: { type: 'string', maxLength: 255 },
          currency: { type: 'string' },
        },
      },
      PlanB: {
        type: 'object',
        title: 'PlanB',
        description: 'Subscription plan.',
        properties: {
          name: { type: 'string', maxLength: 255 },
          interval: { type: 'string' },
        },
      },
      PlanC: {
        type: 'object',
        title: 'PlanC',
        description: 'Trial-only plan.',
        properties: {
          name: { type: 'string', maxLength: 255 },
          trialDays: { type: 'integer' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.properties).toBeDefined();
    const plan = requireProps(result)['plan'];
    expect(plan.switcher).toBeDefined();
    expect(requireSw(plan).type).toBe('oneOf');
    expect(requireSw(plan).label).toBe(switcherLabel.ONE_OF);

    const optionKeys = Object.keys(requireSw(plan).options);
    expect(optionKeys).toEqual(['OriginalPlan', 'FlexiblePlan']);

    const originalOption = requireSw(plan).options['OriginalPlan'];
    expect(originalOption.properties).toBeDefined();
    expect(requireProps(originalOption)['id']).toBeDefined();

    const flexibleOption = requireSw(plan).options['FlexiblePlan'];
    expect(flexibleOption.switcher).toBeDefined();
    expect(requireSw(flexibleOption).type).toBe('oneOf');
    expect(requireSw(flexibleOption).label).toBe(switcherLabel.ANY_OF);
    // With sibling rules, FlexiblePlan's id stays at the FlexiblePlan level
    expect(flexibleOption.properties).toBeDefined();
    expect(requireProps(flexibleOption)['id']).toBeDefined();

    const innerKeys = Object.keys(requireSw(flexibleOption).options);
    expect(innerKeys).toEqual(['PlanA', 'PlanB', 'PlanC']);

    const planA = requireSw(flexibleOption).options['PlanA'];
    expect(planA.properties).toBeDefined();
    expect(requireProps(planA)['name']).toBeDefined();
    expect(requireProps(planA)['currency']).toBeDefined();

    const planB = requireSw(flexibleOption).options['PlanB'];
    expect(planB.properties).toBeDefined();
    expect(requireProps(planB)['interval']).toBeDefined();
  });

  it('should handle oneOf variant with discriminator inside', () => {
    const schema = {
      oneOf: [{ $ref: '#/components/schemas/Simple' }, { $ref: '#/components/schemas/Complex' }],
    };

    const doc = makeDocument({
      Simple: { type: 'object', title: 'Simple', properties: { value: { type: 'string' } } },
      Complex: {
        type: 'object',
        title: 'Complex',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            alpha: '#/components/schemas/Alpha',
            beta: '#/components/schemas/Beta',
          },
        },
        oneOf: [{ $ref: '#/components/schemas/Alpha' }, { $ref: '#/components/schemas/Beta' }],
      },
      Alpha: {
        type: 'object',
        title: 'Alpha',
        properties: { kind: { type: 'string' }, a: { type: 'number' } },
      },
      Beta: {
        type: 'object',
        title: 'Beta',
        properties: { kind: { type: 'string' }, b: { type: 'boolean' } },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('oneOf');
    const keys = Object.keys(requireSw(result).options);
    expect(keys).toEqual(['Simple', 'Complex']);

    const complexOption = requireSw(result).options['Complex'];
    expect(complexOption.switcher).toBeDefined();
    expect(requireSw(complexOption).type).toBe('discriminator');
    expect(requireSw(complexOption).label).toBe('Discriminator');
    expect(requireSw(complexOption).propertyName).toBe('kind');
    expect(Object.keys(requireSw(complexOption).options)).toEqual(['alpha', 'beta']);
  });
});

describe('schemaProcessor rootJsonPointer', () => {
  it('does not reuse cache when rootJsonPointer differs for the same schema object', () => {
    const schema = {
      oneOf: [{ type: 'string' }, { type: 'number' }],
    };
    const doc = makeDocument({});
    const first = schemaProcessor(schema, doc, { rootJsonPointer: '#/components/schemas/Foo' });
    const second = schemaProcessor(schema, doc, { rootJsonPointer: '#/components/schemas/Bar' });
    expect(requireSw(first).jsonPointer).toBe('#/components/schemas/Foo');
    expect(requireSw(second).jsonPointer).toBe('#/components/schemas/Bar');
  });

  it('falls back to the last segment of rootJsonPointer as title when schema has no title or x-original-ref', () => {
    const result = schemaProcessor({ type: 'string' }, emptyDoc, {
      rootJsonPointer: '#/components/schemas/PrimitiveEnumDefinition',
    });
    expect(result.title).toBe('PrimitiveEnumDefinition');
  });

  it('does not apply the pointer-derived title fallback for non-named pointers', () => {
    const result = schemaProcessor({ type: 'string' }, emptyDoc, {
      rootJsonPointer: '#/components/schemas/Foo/properties/bar',
    });
    expect(result.title).toBeUndefined();
  });

  it('decodes JSON-pointer escapes (~1, ~0) in the pointer-derived title fallback', () => {
    const result = schemaProcessor({ type: 'string' }, emptyDoc, {
      rootJsonPointer: '#/components/schemas/foo~1bar~0baz',
    });
    expect(result.title).toBe('foo/bar~baz');
  });
});

describe('schemaProcessor propertyRefCache', () => {
  it('does not reuse cached subtree when the same $ref appears at different JSON pointers', () => {
    const doc = makeDocument({
      Variant: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    });
    const result = schemaProcessor(
      {
        type: 'object',
        properties: {
          first: { $ref: '#/components/schemas/Variant' },
          second: { $ref: '#/components/schemas/Variant' },
        },
      },
      doc,
    );
    const props = requireProps(result);
    expect(requireSw(props.first).jsonPointer).toBe('#/properties/first');
    expect(requireSw(props.second).jsonPointer).toBe('#/properties/second');
  });
});
describe('schemaProcessor sibling properties distribution', () => {
  it('should distribute sibling properties into oneOf variants', () => {
    // PostReadyToPay pattern: allOf merges a schema with properties alongside a schema with oneOf
    const schema = {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
      },
      oneOf: [
        { $ref: '#/components/schemas/WithAmount' },
        { $ref: '#/components/schemas/WithItems' },
      ],
    };

    const doc = makeDocument({
      WithAmount: {
        type: 'object',
        title: 'With amount',
        properties: {
          amount: { type: 'number' },
        },
      },
      WithItems: {
        type: 'object',
        title: 'With items',
        properties: {
          items: { type: 'array' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('oneOf');
    // Sibling properties exist at root
    expect(result.properties).toBeDefined();
    expect(result.properties?.['customerId']).toBeDefined();
    // Sibling properties are also distributed into each variant
    const withAmount = requireSw(result).options['With amount'];
    expect(withAmount.properties).toBeDefined();
    expect(requireProps(withAmount)['customerId']).toBeDefined();
    expect(requireProps(withAmount)['amount']).toBeDefined();
    const withItems = requireSw(result).options['With items'];
    expect(withItems.properties).toBeDefined();
    expect(requireProps(withItems)['customerId']).toBeDefined();
    expect(requireProps(withItems)['items']).toBeDefined();
  });

  it('should distribute sibling properties into anyOf variants', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      anyOf: [{ $ref: '#/components/schemas/OptionA' }, { $ref: '#/components/schemas/OptionB' }],
    };

    const doc = makeDocument({
      OptionA: {
        type: 'object',
        title: 'OptionA',
        properties: { name: { type: 'string' } },
      },
      OptionB: {
        type: 'object',
        title: 'OptionB',
        properties: { value: { type: 'number' } },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).label).toBe(switcherLabel.ANY_OF);
    // Root properties
    expect(result.properties).toBeDefined();
    expect(result.properties?.['id']).toBeDefined();
    // Distributed into variants
    const optA = requireSw(result).options['OptionA'];
    expect(requireProps(optA)['id']).toBeDefined();
    expect(requireProps(optA)['name']).toBeDefined();
    const optB = requireSw(result).options['OptionB'];
    expect(requireProps(optB)['id']).toBeDefined();
    expect(requireProps(optB)['value']).toBeDefined();
  });

  it('should not overwrite variant own properties with sibling properties', () => {
    const schema = {
      type: 'object',
      properties: {
        shared: { type: 'string', description: 'from root' },
      },
      oneOf: [
        {
          type: 'object',
          title: 'Override',
          properties: {
            shared: { type: 'string', description: 'from variant' },
            extra: { type: 'number' },
          },
        },
      ],
    };

    const result = schemaProcessor(schema, makeDocument({}));

    expect(result.switcher).toBeDefined();
    const option = requireSw(result).options['Override'];
    expect(requireProps(option)['shared']).toBeDefined();
    // Variant's own description takes precedence
    expect(requireProps(option)['shared'].description).toBe('from variant');
    expect(requireProps(option)['extra']).toBeDefined();
  });
});

describe('schemaProcessor mapping-only discriminator inside oneOf variant', () => {
  it('should render nested discriminator for mapping-only schema inside oneOf', () => {
    // BankAccountCreatePlain pattern: discriminator + mapping but NO oneOf,
    // reached as a variant of PaymentInstruction oneOf
    const doc = makeDocument({
      PaymentInstruction: {
        oneOf: [
          { $ref: '#/components/schemas/TokenInstr' },
          { $ref: '#/components/schemas/BankAccountCreatePlain' },
        ],
      },
      TokenInstr: {
        title: 'Token',
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      },
      BankAccountCreatePlain: {
        title: 'Bank account',
        type: 'object',
        required: ['accountNumberType'],
        discriminator: {
          propertyName: 'accountNumberType',
          mapping: {
            BBAN: '#/components/schemas/BBANType',
            IBAN: '#/components/schemas/IBANType',
          },
        },
        properties: {
          accountNumberType: { type: 'string', enum: ['IBAN', 'BBAN'] },
        },
      },
      BBANType: {
        allOf: [
          { $ref: '#/components/schemas/BankAccountCreatePlain' },
          {
            type: 'object',
            properties: {
              accountNumber: { type: 'string' },
              routingNumber: { type: 'string' },
            },
          },
        ],
      },
      IBANType: {
        allOf: [
          { $ref: '#/components/schemas/BankAccountCreatePlain' },
          {
            type: 'object',
            properties: {
              accountNumber: { type: 'string' },
            },
          },
        ],
      },
    });

    const schema = doc.components?.schemas && doc.components.schemas['PaymentInstruction'];
    expect(schema).toBeDefined();
    const result = schemaProcessor(schema as any, doc);

    // Top-level should be a oneOf switcher
    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('oneOf');

    const bankOption = requireSw(result).options['Bank account'];
    expect(bankOption).toBeDefined();
    expect(bankOption.switcher).toBeDefined();
    expect(requireSw(bankOption).type).toBe('discriminator');
    expect(requireSw(bankOption).propertyName).toBe('accountNumberType');
    expect(Object.keys(requireSw(bankOption).options).sort()).toEqual(['BBAN', 'IBAN']);

    expect(bankOption.properties).toBeDefined();
    expect(bankOption.properties?.['accountNumberType']).toBeDefined();
  });

  it('should render nested discriminator for MenuItem-like mapping-only ref inside parent oneOf', () => {
    const doc = makeDocument({
      Customer: {
        type: 'object',
        properties: {
          menuItem: {
            oneOf: [
              { $ref: '#/components/schemas/MenuItem', title: 'Favorite Item' },
              { $ref: '#/components/schemas/Tag' },
            ],
          },
        },
      },
      MenuItem: {
        type: 'object',
        discriminator: {
          propertyName: 'itemType',
          mapping: {
            coffee: '#/components/schemas/Coffee',
            pastry: '#/components/schemas/Pastry',
          },
        },
        properties: {
          name: { type: 'string' },
          itemType: { type: 'string' },
        },
      },
      Coffee: {
        type: 'object',
        properties: { itemType: { type: 'string', enum: ['coffee'] }, roast: { type: 'string' } },
      },
      Pastry: {
        type: 'object',
        properties: { itemType: { type: 'string', enum: ['pastry'] }, glaze: { type: 'string' } },
      },
      Tag: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
    });

    const schema = doc.components?.schemas && doc.components.schemas['Customer'];
    expect(schema).toBeDefined();
    const result = schemaProcessor(schema as any, doc);

    const menuItem = requireProps(result)['menuItem'];
    expect(requireSw(menuItem).type).toBe('oneOf');

    const menuItemOption = requireSw(menuItem).options['Favorite Item'];
    expect(menuItemOption).toBeDefined();
    expect(requireSw(menuItemOption).type).toBe('discriminator');
    expect(requireSw(menuItemOption).propertyName).toBe('itemType');
    expect(Object.keys(requireSw(menuItemOption).options).sort()).toEqual(['coffee', 'pastry']);
  });
});

describe('schemaProcessor discriminator without oneOf (mapping-only)', () => {
  it('should resolve discriminator variants from mapping when no oneOf present', () => {
    // TimelineTable pattern: discriminator + mapping but NO oneOf/anyOf
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'type',
        mapping: {
          'three-columns': '#/components/schemas/ThreeColumnsTable',
          'two-columns': '#/components/schemas/TwoColumnsTable',
        },
      },
      properties: {
        type: { type: 'string', enum: ['three-columns', 'two-columns'] },
        title: { type: 'string' },
      },
    };

    const doc = makeDocument({
      TimelineTable: schema,
      ThreeColumnsTable: {
        allOf: [
          { $ref: '#/components/schemas/TimelineTable' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    attribute: { type: 'string' },
                    previousValue: { type: 'string' },
                    newValue: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      },
      TwoColumnsTable: {
        allOf: [
          { $ref: '#/components/schemas/TimelineTable' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    attribute: { type: 'string' },
                    value: { type: 'string' },
                  },
                },
              },
            },
          },
        ],
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(result.switcher).toBeDefined();
    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).propertyName).toBe('type');
    expect(Object.keys(requireSw(result).options)).toEqual(['three-columns', 'two-columns']);

    const threeCol = requireSw(result).options['three-columns'];
    expect(threeCol.properties).toBeDefined();
    expect(requireProps(threeCol)['data']).toBeDefined();
  });

  it('should show discriminator for array items with discriminator (TimelineTable pattern)', () => {
    // InvoiceTimeline → extraData.tables[] → TimelineTable with discriminator
    const schema = {
      type: 'object',
      properties: {
        extraData: {
          type: 'object',
          properties: {
            tables: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TimelineTable',
              },
            },
          },
        },
      },
    };

    const doc = makeDocument({
      TimelineTable: {
        type: 'object',
        discriminator: {
          propertyName: 'type',
          mapping: {
            'three-columns': '#/components/schemas/ThreeColumnsTable',
            list: '#/components/schemas/ListTable',
          },
        },
        properties: {
          type: { type: 'string' },
          title: { type: 'string' },
        },
      },
      ThreeColumnsTable: {
        allOf: [
          { $ref: '#/components/schemas/TimelineTable' },
          {
            type: 'object',
            properties: {
              data: { type: 'array', items: { type: 'object' } },
            },
          },
        ],
      },
      ListTable: {
        allOf: [
          { $ref: '#/components/schemas/TimelineTable' },
          {
            type: 'object',
            properties: {
              data: { type: 'array', items: { type: 'string' } },
            },
          },
        ],
      },
    });

    const result = schemaProcessor(schema, doc);

    const extraData = requireProps(result)['extraData'];
    const tables = requireProps(extraData)['tables'];
    expect(tables.items).toBeDefined();
    const tableItem = tables.items?.[0];
    // The table item should have a discriminator switcher
    expect(tableItem).toBeDefined();
    if (!tableItem) throw new Error('expected tableItem');
    expect(tableItem.switcher).toBeDefined();
    expect(requireSw(tableItem).type).toBe('discriminator');
    expect(requireSw(tableItem).propertyName).toBe('type');
    expect(Object.keys(requireSw(tableItem).options)).toEqual(['three-columns', 'list']);
  });
});

describe('schemaProcessor discriminator x-explicitMappingOnly', () => {
  function makePetDoc(discriminator: Record<string, unknown>): Document {
    return makeDocument({
      Pet: {
        type: 'object',
        required: ['petType'],
        discriminator,
        properties: {
          petType: { type: 'string' },
          name: { type: 'string' },
        },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
    });
  }

  it('merges implicit allOf children with the explicit mapping when x-explicitMappingOnly is false', () => {
    const doc = makePetDoc({
      propertyName: 'petType',
      mapping: { cat: '#/components/schemas/Cat' },
      'x-explicitMappingOnly': false,
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Pet' }, doc, {
      rootJsonPointer: '#/components/schemas/Pet',
    });

    const sw = requireSw(result);
    expect(sw.type).toBe('discriminator');
    expect(sw.propertyName).toBe('petType');
    expect(Object.keys(sw.options).sort()).toEqual(['Dog', 'cat']);
    expect(requireProps(sw.options['cat'])['huntingSkill']).toBeDefined();
    expect(requireProps(sw.options['Dog'])['packSize']).toBeDefined();
  });

  it('does not duplicate a child that is both mapped and discovered via allOf', () => {
    const doc = makePetDoc({
      propertyName: 'petType',
      mapping: {
        cat: '#/components/schemas/Cat',
        dog: '#/components/schemas/Dog',
      },
      'x-explicitMappingOnly': false,
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Pet' }, doc, {
      rootJsonPointer: '#/components/schemas/Pet',
    });

    const sw = requireSw(result);
    expect(Object.keys(sw.options).sort()).toEqual(['cat', 'dog']);
  });

  it('stays explicit-only by default when a mapping exists and the extension is omitted', () => {
    const doc = makePetDoc({
      propertyName: 'petType',
      mapping: { cat: '#/components/schemas/Cat' },
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Pet' }, doc, {
      rootJsonPointer: '#/components/schemas/Pet',
    });

    expect(Object.keys(requireSw(result).options)).toEqual(['cat']);
  });

  it('stays explicit-only when x-explicitMappingOnly is true', () => {
    const doc = makePetDoc({
      propertyName: 'petType',
      mapping: { cat: '#/components/schemas/Cat' },
      'x-explicitMappingOnly': true,
    });

    const result = schemaProcessor({ $ref: '#/components/schemas/Pet' }, doc, {
      rootJsonPointer: '#/components/schemas/Pet',
    });

    expect(Object.keys(requireSw(result).options)).toEqual(['cat']);
  });
});

describe('schemaProcessor discriminator mapping ref not in oneOf', () => {
  it('should resolve mapped variant whose ref is not present in oneOf', () => {
    const schema = {
      type: 'object',
      required: ['type'],
      discriminator: {
        propertyName: 'type',
        mapping: {
          CreditCard: '#/components/schemas/CreditCardMethod',
          ACH: '#/components/schemas/AchMethod',
          GooglePay: '#/components/schemas/GooglePayMethod',
        },
      },
      oneOf: [
        { $ref: '#/components/schemas/CreditCardMethod' },
        { $ref: '#/components/schemas/AchMethod' },
      ],
    };

    const doc = makeDocument({
      CreditCardMethod: {
        type: 'object',
        required: ['type', 'cardNumber'],
        properties: {
          type: { type: 'string', enum: ['CreditCard'] },
          cardNumber: { type: 'string' },
        },
      },
      AchMethod: {
        type: 'object',
        required: ['type', 'routingNumber', 'accountNumber'],
        properties: {
          type: { type: 'string', enum: ['ACH'] },
          routingNumber: { type: 'string' },
          accountNumber: { type: 'string' },
        },
      },
      GooglePayMethod: {
        type: 'object',
        required: ['type', 'googlePaymentToken'],
        properties: {
          type: { type: 'string', enum: ['GooglePay'] },
          googlePaymentToken: { type: 'string' },
          email: { type: 'string' },
        },
      },
    });

    const result = schemaProcessor(schema, doc);

    expect(requireSw(result).type).toBe('discriminator');
    expect(requireSw(result).propertyName).toBe('type');

    const options = requireSw(result).options;
    expect(Object.keys(options)).toEqual(['CreditCard', 'ACH', 'GooglePay']);

    const googlePay = options['GooglePay'];
    expect(googlePay.properties).toBeDefined();
    expect(Object.keys(requireProps(googlePay))).toEqual(['type', 'googlePaymentToken', 'email']);
    expect(requireProps(googlePay)['googlePaymentToken'].type).toBe('string');
    expect(requireProps(googlePay)['email'].type).toBe('string');
  });
});

describe('schemaProcessor discriminator with self-listed oneOf variants (OneOfDisc pattern)', () => {
  function makeOneOfDiscDocument(): Document {
    return makeDocument({
      OneOfDiscRoot: {
        type: 'object',
        required: ['oneOfType'],
        discriminator: { propertyName: 'oneOfType' },
        oneOf: [
          { $ref: '#/components/schemas/OneOfDiscA' },
          { $ref: '#/components/schemas/OneOfDiscB' },
        ],
        properties: { oneOfType: { type: 'string' } },
      },
      OneOfDiscA: {
        allOf: [
          { $ref: '#/components/schemas/OneOfDiscRoot' },
          { type: 'object', properties: { a: { type: 'string' } } },
        ],
      },
      OneOfDiscB: {
        allOf: [
          { $ref: '#/components/schemas/OneOfDiscRoot' },
          { type: 'object', properties: { b: { type: 'string' } } },
        ],
      },
    });
  }

  it('lists both $ref variants as named options with their merged fields on the parent page', () => {
    const doc = makeOneOfDiscDocument();
    const result = schemaProcessor(pageSchema(doc, 'OneOfDiscRoot'), doc, {
      rootJsonPointer: '#/components/schemas/OneOfDiscRoot',
    });

    const sw = requireSw(result);
    expect(Object.keys(sw.options)).toEqual(['OneOfDiscA', 'OneOfDiscB']);
    expect(sw.options['OneOfDiscA'].schemaName).toBe('OneOfDiscA');
    expect(sw.options['OneOfDiscB'].schemaName).toBe('OneOfDiscB');
    expect(requireProps(sw.options['OneOfDiscA'])['oneOfType'].type).toBe('string');
    expect(requireProps(sw.options['OneOfDiscA'])['a'].type).toBe('string');
    expect(requireProps(sw.options['OneOfDiscB'])['b'].type).toBe('string');
  });

  it('does not nest the inherited parent selector inside variant bodies', () => {
    const doc = makeOneOfDiscDocument();
    const result = schemaProcessor(pageSchema(doc, 'OneOfDiscRoot'), doc, {
      rootJsonPointer: '#/components/schemas/OneOfDiscRoot',
    });

    const sw = requireSw(result);
    expect(sw.options['OneOfDiscA'].switcher).toBeUndefined();
    expect(sw.options['OneOfDiscB'].switcher).toBeUndefined();
  });

  it('renders the page own option by name and with full fields on a child page', () => {
    const doc = makeOneOfDiscDocument();
    const result = schemaProcessor(pageSchema(doc, 'OneOfDiscA'), doc, {
      rootJsonPointer: '#/components/schemas/OneOfDiscA',
    });

    expect(requireProps(result)['a'].type).toBe('string');
    const sw = requireSw(result);
    expect(Object.keys(sw.options)).toEqual(['OneOfDiscA', 'OneOfDiscB']);
    const self = sw.options['OneOfDiscA'];
    expect(self.isCircular).toBeUndefined();
    expect(requireProps(self)['oneOfType'].type).toBe('string');
    expect(requireProps(self)['a'].type).toBe('string');
    expect(requireProps(sw.options['OneOfDiscB'])['b'].type).toBe('string');
  });
});

describe('schemaProcessor discriminator host that is itself composed (mixin + own discriminator)', () => {
  const composedHostDoc = () =>
    makeDocument({
      Trackable: {
        type: 'object',
        properties: { updatedAt: { type: 'string' } },
      },
      Pet: {
        allOf: [{ $ref: '#/components/schemas/Trackable' }],
        discriminator: { propertyName: 'petType' },
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { huntingSkill: { type: 'string' } } },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { packSize: { type: 'integer' } } },
        ],
      },
    });

  it('lists sibling variants on a child page when the host declares the discriminator AND composes a mixin', () => {
    const doc = composedHostDoc();
    const schema = (doc.components as { schemas: Record<string, unknown> }).schemas
      .Cat as SchemaNode;

    const result = schemaProcessor(schema, doc, {
      rootJsonPointer: '#/components/schemas/Cat',
    });

    expect(result.switcher).toBeDefined();
    expect(Object.keys(requireSw(result).options).sort()).toEqual(['Cat', 'Dog']);
  });
});

describe('schemaProcessor discriminator through a mutual allOf cycle (CircularParent pattern)', () => {
  function makeCircularDocument(): Document {
    return makeDocument({
      CircularParent: {
        type: 'object',
        discriminator: { propertyName: 'circType' },
        allOf: [{ $ref: '#/components/schemas/CircularChild' }],
        properties: { circType: { type: 'string' } },
      },
      CircularChild: {
        allOf: [
          { $ref: '#/components/schemas/CircularParent' },
          { type: 'object', properties: { childProp: { type: 'string' } } },
        ],
      },
    });
  }

  it('merges both sides of the cycle into the page properties', () => {
    const doc = makeCircularDocument();
    const result = schemaProcessor(pageSchema(doc, 'CircularParent'), doc, {
      rootJsonPointer: '#/components/schemas/CircularParent',
    });

    expect(result.isCircular).toBeUndefined();
    expect(requireProps(result)['circType'].type).toBe('string');
    expect(requireProps(result)['childProp'].type).toBe('string');
  });

  it('offers only the other side of the cycle as an implicit variant, with full fields', () => {
    const doc = makeCircularDocument();
    const result = schemaProcessor(pageSchema(doc, 'CircularParent'), doc, {
      rootJsonPointer: '#/components/schemas/CircularParent',
    });

    const sw = requireSw(result);
    expect(sw.propertyName).toBe('circType');
    expect(Object.keys(sw.options)).toEqual(['CircularChild']);
    const child = sw.options['CircularChild'];
    expect(child.isCircular).toBeUndefined();
    expect(requireProps(child)['circType'].type).toBe('string');
    expect(requireProps(child)['childProp'].type).toBe('string');
  });

  it('mirrors on the child page: a single variant pointing back at the parent', () => {
    const doc = makeCircularDocument();
    const result = schemaProcessor(pageSchema(doc, 'CircularChild'), doc, {
      rootJsonPointer: '#/components/schemas/CircularChild',
    });

    expect(requireProps(result)['circType'].type).toBe('string');
    expect(requireProps(result)['childProp'].type).toBe('string');
    const sw = requireSw(result);
    expect(Object.keys(sw.options)).toEqual(['CircularParent']);
    expect(requireProps(sw.options['CircularParent'])['circType'].type).toBe('string');
  });
});

describe('schemaProcessor dialectId', () => {
  it('matches default when json-schema dialectId is passed explicitly', () => {
    const schema = { type: 'string' };
    const implicit = schemaProcessor(schema, makeDocument({}));
    const explicit = schemaProcessor(schema, makeDocument({}), { dialectId: JsonSchemaDialectId });
    expect(explicit).toEqual(implicit);
  });

  it('falls back to json-schema dialect for graphql-schema dialectId', () => {
    const schema = { type: 'string' };
    const fallback = schemaProcessor(schema, makeDocument({}), { dialectId: 'graphql-schema' });
    const defaultResult = schemaProcessor(schema, makeDocument({}));
    expect(fallback).toEqual(defaultResult);
  });

  it('falls back to json-schema dialect for unknown dialectId', () => {
    const schema = { type: 'string' };
    const fallback = schemaProcessor(schema, makeDocument({}), { dialectId: 'unit-test-unknown' });
    const defaultResult = schemaProcessor(schema, makeDocument({}));
    expect(fallback).toEqual(defaultResult);
  });
});

describe('schemaProcessor sortRequiredPropsFirst', () => {
  it('moves required properties before optional ones when enabled', () => {
    const schema = {
      type: 'object',
      required: ['alpha', 'beta'],
      properties: {
        zeta: { type: 'string' },
        alpha: { type: 'string' },
        mid: { type: 'string' },
        beta: { type: 'string' },
      },
    };

    const result = schemaProcessor(schema, emptyDoc, { sortRequiredPropsFirst: true });

    expect(Object.keys(requireProps(result))).toEqual(['alpha', 'beta', 'zeta', 'mid']);
  });

  it('orders required properties by the `required` array, not definition order', () => {
    const schema = {
      type: 'object',
      required: ['beta', 'alpha'],
      properties: {
        alpha: { type: 'string' },
        beta: { type: 'string' },
        gamma: { type: 'string' },
      },
    };

    const result = schemaProcessor(schema, emptyDoc, { sortRequiredPropsFirst: true });

    expect(Object.keys(requireProps(result))).toEqual(['beta', 'alpha', 'gamma']);
  });

  it('leaves order unchanged when there are no required properties', () => {
    const schema = {
      type: 'object',
      properties: {
        gamma: { type: 'string' },
        alpha: { type: 'string' },
        beta: { type: 'string' },
      },
    };

    const result = schemaProcessor(schema, emptyDoc, { sortRequiredPropsFirst: true });

    expect(Object.keys(requireProps(result))).toEqual(['gamma', 'alpha', 'beta']);
  });

  it('preserves definition order by default (flag off)', () => {
    const schema = {
      type: 'object',
      required: ['alpha'],
      properties: {
        zeta: { type: 'string' },
        alpha: { type: 'string' },
      },
    };

    const result = schemaProcessor(schema, emptyDoc);

    expect(Object.keys(requireProps(result))).toEqual(['zeta', 'alpha']);
  });
});
