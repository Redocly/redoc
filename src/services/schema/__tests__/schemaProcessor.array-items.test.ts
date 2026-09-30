import { describe, it, expect } from 'vitest';

import type { Document } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

const emptyDoc = {
  openapi: '3.1.0',
  info: { title: '', version: '1.0' },
  paths: {},
  components: { schemas: {} },
} as Document;

describe('schemaProcessor — tuple additional items', () => {
  it('appends a trailing additional-items row for a 2020-12 tuple with a rest schema', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        prefixItems: [{ type: 'number' }, { type: 'number' }],
        items: { type: 'string' },
      },
      emptyDoc,
    );

    expect(result.items).toHaveLength(3);
    expect(result.items?.[0].isAdditionalItems).toBeFalsy();
    expect(result.items?.[1].isAdditionalItems).toBeFalsy();
    expect(result.items?.[2].isAdditionalItems).toBe(true);
    expect(result.items?.[2].type).toBe('string');
  });

  it('does not append a trailing row when extra items are disallowed (items: false)', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        prefixItems: [{ type: 'string' }, { type: 'integer' }],
        items: false,
      },
      emptyDoc,
    );

    expect(result.items).toHaveLength(2);
    expect(result.items?.some((item) => item.isAdditionalItems)).toBe(false);
  });

  it('appends an open-ended trailing row when any extra items are allowed (items: true)', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        prefixItems: [{ type: 'string' }],
        items: true,
      },
      emptyDoc,
    );

    expect(result.items).toHaveLength(2);
    expect(result.items?.[1].isAdditionalItems).toBe(true);
  });

  it('marks a single-element items-array tuple entry as a tuple item', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: [{ type: 'object', properties: { object: { type: 'string' } } }],
        additionalItems: false,
        minItems: 1,
        maxItems: 1,
      },
      emptyDoc,
    );

    expect(result.items).toHaveLength(1);
    expect(result.items?.[0].isTupleItem).toBe(true);
    expect(result.items?.[0].isAdditionalItems).toBeFalsy();
  });

  it('marks a single-element prefixItems tuple entry as a tuple item', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        prefixItems: [{ type: 'object', properties: { object: { type: 'string' } } }],
        items: false,
      },
      emptyDoc,
    );

    expect(result.items).toHaveLength(1);
    expect(result.items?.[0].isTupleItem).toBe(true);
  });

  it('appends a trailing row from draft-07 additionalItems for an array-form items tuple', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: [{ type: 'string' }, { type: 'boolean' }],
        additionalItems: { type: 'number' },
      },
      emptyDoc,
    );

    expect(result.items).toHaveLength(3);
    expect(result.items?.[2].isAdditionalItems).toBe(true);
    expect(result.items?.[2].type).toBe('number');
  });
});

describe('schemaProcessor — documented primitive array items', () => {
  const aclGroupItems = {
    type: 'string',
    format: 'email',
    maxLength: 256,
    pattern: '^\\S+@\\S+$',
    description: 'OSDU Access Control List (ACL) group that controls data access.',
    'x-original-ref': '#/components/schemas/AclGroup',
  };

  it('keeps only array-level info on the array row and items info on the nested items row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        minItems: 1,
        maxItems: 20,
        description: 'List of groups which have write and read privileges over the collection.',
        items: aclGroupItems,
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of strings, [ 1 .. 20 ] items');
    expect(result.pattern).toBeUndefined();
    expect(result.title).toBeUndefined();
    expect(result.description).toBe(
      'List of groups which have write and read privileges over the collection.',
    );
    // the items info is rendered in the nested items row
    expect(result.items).toHaveLength(1);
    expect(result.items?.[0].type).toBe('string, (email), <= 256 characters');
    expect(result.items?.[0].pattern).toBe('^\\S+@\\S+$');
    expect(result.items?.[0].title).toBe('AclGroup');
    expect(result.items?.[0].description).toBe(
      'OSDU Access Control List (ACL) group that controls data access.',
    );
  });

  it('array with no own description shows the items description only on the nested items row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: aclGroupItems,
      },
      emptyDoc,
    );

    expect(result.description).toBeUndefined();
    expect(result.items?.[0].description).toBe(
      'OSDU Access Control List (ACL) group that controls data access.',
    );
  });

  it('keeps the array own description and pattern when items have no extra info', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        minItems: 1,
        description: 'List of tags.',
        items: { type: 'string' },
      },
      emptyDoc,
    );

    expect(result.description).toBe('List of tags.');
    expect(result.pattern).toBeUndefined();
    expect(result.type).toBe('Array of strings, non-empty');
    // trivial items stay flattened into the array row
    expect(result.items).toBeUndefined();
  });

  it('renders number items constraints, format and description on the nested items row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        maxItems: 5,
        items: {
          type: 'number',
          format: 'double',
          minimum: 0,
          maximum: 100,
          multipleOf: 0.5,
          description: 'A percentage value.',
        },
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of numbers, <= 5 items');
    expect(result.description).toBeUndefined();
    expect(result.items?.[0].type).toBe('number, (double), multiple of 0.5, [ 0 .. 100 ]');
    expect(result.items?.[0].description).toBe('A percentage value.');
  });

  it('renders integer items constraints and format on the nested items row', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'integer', format: 'int64', minimum: 1 } },
      emptyDoc,
    );

    expect(result.type).toBe('Array of integers');
    expect(result.items?.[0].type).toBe('integer, (int64), >= 1');
  });

  it('renders boolean items description on the nested items row', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'boolean', description: 'Feature flags.' } },
      emptyDoc,
    );

    expect(result.type).toBe('Array of booleans');
    expect(result.description).toBeUndefined();
    expect(result.items?.[0].description).toBe('Feature flags.');
  });

  it('renders constraints of nullable primitive items on the nested items row', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: ['number', 'null'], maximum: 10 } },
      emptyDoc,
    );

    expect(result.type).toBe('Array of numbers or null');
    expect(result.items?.[0].type).toBe('number or null, <= 10');
  });

  it.each([
    ['default', { type: 'string', default: 'admin' }],
    ['const', { type: 'string', const: 'fixed' }],
    ['deprecated', { type: 'string', deprecated: true }],
    ['contentEncoding', { type: 'string', contentEncoding: 'base64' }],
  ])('items with own %s render as a nested items row', (_keyword, items) => {
    const result = schemaProcessor({ type: 'array', items }, emptyDoc);

    expect(result.items).toHaveLength(1);
  });

  it('keeps enum-only items flattened with the enum promoted onto the array row', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string', enum: ['a', 'b'] } },
      emptyDoc,
    );

    expect(result.items).toBeUndefined();
    expect(result.enum).toEqual(['a', 'b']);
  });

  it('keeps the items enum on the nested items row when items also have a description', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string', enum: ['a', 'b'], description: 'A choice.' } },
      emptyDoc,
    );

    expect(result.enum).toBeUndefined();
    expect(result.items?.[0].enum).toEqual(['a', 'b']);
  });

  it('shows the items example on the nested items row instead of the array row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'string', description: 'ACL group.', example: 'kuku.test' },
      },
      emptyDoc,
    );

    expect(result.example).toBeUndefined();
    expect(result.items?.[0].example).toBe('"kuku.test"');
  });

  it('keeps the array own example on the array row along with the nested items example', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        example: ['own@example.com'],
        items: { type: 'string', description: 'ACL group.', example: 'kuku.test' },
      },
      emptyDoc,
    );

    expect(result.example).toEqual(['own@example.com']);
    expect(result.items?.[0].example).toBe('"kuku.test"');
  });

  it('hoists the example of trivial items onto the array row', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string', example: 'kuku.test' } },
      emptyDoc,
    );

    expect(result.items).toBeUndefined();
    expect(result.example).toEqual(['kuku.test']);
  });

  it('displays an array with no items schema as Array of any', () => {
    const result = schemaProcessor({ type: 'array' }, emptyDoc);
    expect(result.type).toBe('Array of any');
  });

  it('does not advertise an item type when extra items are disallowed (items: false)', () => {
    const result = schemaProcessor({ type: 'array', items: false }, emptyDoc);
    expect(result.type).toBe('Array of items');
  });

  it('labels the parent of an items-less nested array as Array of arrays', () => {
    const result = schemaProcessor({ type: 'array', items: { type: 'array' } }, emptyDoc);
    expect(result.type).toBe('Array of arrays');
  });

  it('does not promote items info when items are an object (non-primitive)', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        minItems: 1,
        description: 'List of members.',
        items: {
          type: 'object',
          description: 'A member of the museum.',
          maxProperties: 5,
          properties: { name: { type: 'string' } },
        },
      },
      emptyDoc,
    );

    expect(result.description).toBe('List of members.');
    expect(result.type).toBe('Array of objects, non-empty');
    expect(result.items).toHaveLength(1);
    expect(result.items?.[0].properties?.name).toBeDefined();
  });

  it('does not promote rest-schema info onto a tuple (prefixItems present)', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        prefixItems: [{ type: 'number' }],
        items: aclGroupItems,
        description: 'A tuple.',
      },
      emptyDoc,
    );

    expect(result.description).toBe('A tuple.');
    expect(result.pattern).toBeUndefined();
    expect(result.type).not.toContain('<= 256 characters');
  });
});

describe('schemaProcessor — nested arrays keep their structure', () => {
  it('renders an array of arrays of primitives as a nested structure', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        description: 'Array of arrays of primitives.',
        items: {
          type: 'array',
          items: {
            type: 'string',
            description: 'Inner primitive item description.',
            minLength: 1,
          },
        },
      },
      emptyDoc,
    );

    // the label stays generic and nothing is promoted from the nested array
    expect(result.type).toBe('Array of items');
    expect(result.description).toBe('Array of arrays of primitives.');

    // the inner array keeps its own row; its documented items get their own nested row
    expect(result.items).toHaveLength(1);
    expect(result.items?.[0].type).toBe('Array of strings');
    expect(result.items?.[0].description).toBeUndefined();
    expect(result.items?.[0].items?.[0].type).toBe('string, non-empty');
    expect(result.items?.[0].items?.[0].description).toBe('Inner primitive item description.');
  });

  it('keeps per-level constraints and pattern on their own rows', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        maxItems: 5,
        items: {
          type: 'array',
          maxItems: 10,
          items: { type: 'string', format: 'uuid', maxLength: 64, pattern: '^[0-9a-f-]+$' },
        },
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of items, <= 5 items');
    expect(result.pattern).toBeUndefined();
    expect(result.items?.[0].type).toBe('Array of strings, <= 10 items');
    expect(result.items?.[0].pattern).toBeUndefined();
    expect(result.items?.[0].items?.[0].type).toBe('string, (uuid), <= 64 characters');
    expect(result.items?.[0].items?.[0].pattern).toBe('^[0-9a-f-]+$');
  });

  it('renders an array of arrays of objects with the nested items tree', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        description: 'Array of arrays of objects.',
        items: {
          type: 'array',
          items: { type: 'object', properties: { name: { type: 'string' } } },
        },
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of items');
    expect(result.description).toBe('Array of arrays of objects.');
    expect(result.items?.[0].items?.[0].properties?.name).toBeDefined();
  });

  it('deduplicates identical constraint labels of the array and its items', () => {
    const result = schemaProcessor(
      { type: 'array', minItems: 1, items: { type: 'string', minLength: 1 } },
      emptyDoc,
    );

    // minItems: 1 and minLength: 1 both humanize to "non-empty"
    expect(result.type).toBe('Array of strings, non-empty');
  });

  it('does not surface the inner array format on the nested structure row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'array', format: 'matrix', items: { type: 'integer' } },
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of items');
    // arrays display their items' format, never their own — matching openapi-docs
    expect(result.items?.[0].type).toBe('Array of integers');
  });

  it('renders a documented circular array-of-array item as a nested recursive row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        description: 'Own description.',
        items: {
          type: 'array',
          'x-circular-ref': true,
          description: 'Cycle target description.',
          items: { $ref: '#/components/schemas/Tree' },
        },
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of arrays');
    expect(result.description).toBe('Own description.');
    expect(result.items).toHaveLength(1);
    expect(result.items?.[0].isCircular).toBe(true);
    expect(result.items?.[0].description).toBe('Cycle target description.');
  });

  it('does not promote metadata of circular object items onto the array row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        description: 'Direct children of this node.',
        items: {
          type: 'object',
          'x-circular-ref': true,
          description: 'A node in the tree.',
          minProperties: 1,
          properties: { children: { type: 'array' } },
        },
      },
      emptyDoc,
    );

    expect(result.description).toBe('Direct children of this node.');
    expect(result.type).toBe('Array of objects');
  });

  it('renders a documented inner array without items as a nested row', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: { type: 'array', description: 'Inner array description.' },
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of arrays');
    expect(result.description).toBeUndefined();
    expect(result.items?.[0].type).toBe('Array of any');
    expect(result.items?.[0].description).toBe('Inner array description.');
  });

  it('renders a deeper chain level by level', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'integer', minimum: 0 },
          },
        },
      },
      emptyDoc,
    );

    expect(result.type).toBe('Array of items');
    expect(result.items?.[0].type).toBe('Array of items');
    expect(result.items?.[0].items?.[0].type).toBe('Array of integers');
    expect(result.items?.[0].items?.[0].items?.[0].type).toBe('integer, >= 0');
  });
});

describe('schemaProcessor — tuple example distribution', () => {
  const tupleSchema = {
    type: 'array',
    prefixItems: [{ type: 'string' }, { type: 'number' }],
  };

  it('moves a tuple example to the item rows when it fits the tuple length', () => {
    const result = schemaProcessor({ ...tupleSchema, example: ['first', 42] }, emptyDoc);

    expect(result.example).toBeUndefined();
    expect(result.items?.[0].example).toBe('"first"');
    expect(result.items?.[1].example).toBe('42');
  });

  it('distributes falsy example values to the item rows', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        prefixItems: [{ type: 'number' }, { type: 'boolean' }],
        example: [0, false],
      },
      emptyDoc,
    );

    expect(result.example).toBeUndefined();
    expect(result.items?.[0].example).toBe('0');
    expect(result.items?.[1].example).toBe('false');
  });

  it('keeps an example longer than the tuple on the array row without distributing it', () => {
    const result = schemaProcessor({ ...tupleSchema, example: ['first', 42, 'extra'] }, emptyDoc);

    expect(result.example).toEqual(['first', 42, 'extra']);
    expect(result.items?.[0].example).toBeUndefined();
    expect(result.items?.[1].example).toBeUndefined();
  });

  it('keeps an explicit empty example on the array row', () => {
    const result = schemaProcessor({ ...tupleSchema, example: [] }, emptyDoc);

    expect(result.example).toEqual([]);
    expect(result.items?.[0].example).toBeUndefined();
  });

  it('keeps the example on the array row when distribution would override an item own example', () => {
    const result = schemaProcessor(
      {
        type: 'array',
        example: ['100', 'string1'],
        prefixItems: [{ type: 'string', example: 'kuku.test' }, { type: 'number' }],
      },
      emptyDoc,
    );

    // the item's own example is more specific and no array entries are lost
    expect(result.example).toEqual(['100', 'string1']);
    expect(result.items?.[0].example).toBe('"kuku.test"');
    expect(result.items?.[1].example).toBeUndefined();
  });

  it('object property own example wins over the parent object example entry', () => {
    const result = schemaProcessor(
      {
        type: 'object',
        example: { id: 1, users: [] },
        properties: {
          id: { type: 'integer' },
          users: {
            type: 'array',
            example: ['data.default.owners@opendes.testing.slb.com'],
            items: { type: 'string' },
          },
        },
      },
      emptyDoc,
    );

    // the parent example fills properties without their own example
    expect(result.properties?.id.example).toBe('1');
    // but never overrides a property's own example
    expect(result.properties?.users.example).toEqual([
      'data.default.owners@opendes.testing.slb.com',
    ]);
  });
});

describe('schemaProcessor — array title inherits from items', () => {
  it('surfaces the item schema `title` as the array title (title || items.title)', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'string', title: 'Foo' } },
      emptyDoc,
    );
    expect(result.title).toBe('Foo');
  });

  it('surfaces a referenced item schema name as the array title', () => {
    const result = schemaProcessor(
      { type: 'array', items: { type: 'object', 'x-original-ref': '#/components/schemas/Pet' } },
      emptyDoc,
    );
    expect(result.title).toBe('Pet');
  });

  it('keeps the array own title over the item title', () => {
    const result = schemaProcessor(
      { type: 'array', title: 'Tags', items: { type: 'string', title: 'Foo' } },
      emptyDoc,
    );
    expect(result.title).toBe('Tags');
  });

  it('leaves an anonymous array of untitled primitives without a title', () => {
    const result = schemaProcessor({ type: 'array', items: { type: 'string' } }, emptyDoc);
    expect(result.title).toBeUndefined();
  });
});
