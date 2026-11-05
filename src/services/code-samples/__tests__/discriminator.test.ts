import { describe, it, expect } from 'vitest';
import { schemaKind } from '../../../types/common.js';

import {
  applyActiveVariantsToSchema,
  applyActiveVariantsToStore,
  collectNestedVariantAxes,
  findEffectiveDiscriminator,
  findSchemaVariantAxis,
  findSchemaVariantLeaves,
  resolveActiveVariantLeafIndex,
  resolveActiveVariantIndex,
  samplesVariantThroughHost,
} from '../discriminator.js';
import type { SchemaEntry } from '../../../types/store.js';
import type { SchemaVariantAxis } from '../discriminator.js';

const menuItemDiscriminator = {
  propertyName: 'itemType',
  mapping: {
    coffee: '#/components/schemas/Coffee',
    pastry: '#/components/schemas/Pastry',
    tea: '#/components/schemas/Tea',
  },
} as const;

function makeStore(): Record<string, SchemaEntry> {
  return {
    'components/schemas/MenuItem': {
      id: 'components/schemas/MenuItem',
      kind: schemaKind.JSON_SCHEMA,
      data: {
        type: 'object',
        discriminator: { ...menuItemDiscriminator },
        properties: { itemType: { type: 'string' } },
      },
    },
    'components/schemas/Coffee': {
      id: 'components/schemas/Coffee',
      kind: schemaKind.JSON_SCHEMA,
      data: {
        allOf: [
          { $ref: '#/components/schemas/MenuItem' },
          { type: 'object', properties: { brewingMethod: { type: 'string' } } },
        ],
      },
    },
    'components/schemas/Pastry': {
      id: 'components/schemas/Pastry',
      kind: schemaKind.JSON_SCHEMA,
      data: {
        allOf: [
          { $ref: '#/components/schemas/MenuItem' },
          { type: 'object', properties: { sweetness: { type: 'integer' } } },
        ],
      },
    },
    'components/schemas/Tea': {
      id: 'components/schemas/Tea',
      kind: schemaKind.JSON_SCHEMA,
      data: {
        allOf: [
          { $ref: '#/components/schemas/MenuItem' },
          { type: 'object', properties: { steepingTime: { type: 'number' } } },
        ],
      },
    },
  };
}

describe('findEffectiveDiscriminator', () => {
  it('returns the discriminator when it sits directly on the schema (3.1 shape)', () => {
    const store = makeStore();
    const result = findEffectiveDiscriminator(store['components/schemas/MenuItem'].data, store);
    expect(result).toEqual(menuItemDiscriminator);
  });

  it('walks through an allOf wrapper with a $ref to find the discriminator (3.0 shape)', () => {
    const store = makeStore();
    const wrapper: Record<string, unknown> = {
      allOf: [
        { description: 'My Menu Item', title: 'Menu Item' },
        { $ref: '#/components/schemas/MenuItem' },
      ],
    };

    const result = findEffectiveDiscriminator(wrapper, store);
    expect(result).toEqual(menuItemDiscriminator);
  });

  it('returns undefined when no discriminator is reachable', () => {
    const store: Record<string, SchemaEntry> = {
      a: { id: 'a', kind: schemaKind.JSON_SCHEMA, data: { type: 'object' } },
    };
    expect(findEffectiveDiscriminator({ allOf: [{ $ref: '#/a' }] }, store)).toBeUndefined();
  });

  it('does not infinite-loop on circular allOf refs', () => {
    const store: Record<string, SchemaEntry> = {
      a: {
        id: 'a',
        kind: schemaKind.JSON_SCHEMA,
        data: { allOf: [{ $ref: '#/b' }] },
      },
      b: {
        id: 'b',
        kind: schemaKind.JSON_SCHEMA,
        data: { allOf: [{ $ref: '#/a' }] },
      },
    };
    expect(findEffectiveDiscriminator(store.a.data, store)).toBeUndefined();
  });

  it('ignores discriminators without a usable mapping', () => {
    const store: Record<string, SchemaEntry> = {};
    const schema = { discriminator: { propertyName: 'kind' } } as Record<string, unknown>;
    expect(findEffectiveDiscriminator(schema, store)).toBeUndefined();
  });

  it('accepts a mapping-less discriminator when the schema lists its variants', () => {
    const schema = {
      discriminator: { propertyName: 'kind' },
      oneOf: [{ $ref: '#/components/schemas/A' }],
    } as Record<string, unknown>;

    expect(findEffectiveDiscriminator(schema, {})).toEqual({
      propertyName: 'kind',
      mapping: {},
      variantsNode: schema,
    });
  });

  it('carries defaultMapping through an allOf walk', () => {
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Root': entry('components/schemas/Root', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: { cat: '#/components/schemas/Cat' },
          defaultMapping: '#/components/schemas/Other',
        },
      }),
    };
    const wrapper = { allOf: [{ $ref: '#/components/schemas/Root' }] } as Record<string, unknown>;

    expect(findEffectiveDiscriminator(wrapper, store)).toEqual({
      propertyName: 'kind',
      mapping: { cat: '#/components/schemas/Cat' },
      defaultMapping: '#/components/schemas/Other',
    });
  });
});

function entry(id: string, data: Record<string, unknown>): SchemaEntry {
  return { id, kind: schemaKind.JSON_SCHEMA, data };
}

describe('findSchemaVariantAxis', () => {
  it('skips a mapping entry whose target is not in the store', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            cat: '#/components/schemas/Cat',
            secret: '#/components/schemas/SecretCat',
          },
        },
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.options.map((option) => option.label)).toEqual(['cat']);
  });

  it('does not label a oneOf variant with the name of a schema absent from the store', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: { propertyName: 'kind' },
        oneOf: [
          { $ref: '#/components/schemas/Cat' },
          { $ref: '#/components/schemas/SecretCat' },
          { $ref: '#/components/schemas/Dog' },
        ],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    const labels = axis?.options.map((option) => option.label);
    expect(labels).not.toContain('SecretCat');
    expect(labels).toHaveLength(3);
    expect(labels?.[0]).toBe('Cat');
    expect(labels?.[2]).toBe('Dog');
    expect(axis?.options[1].schemaId).toBe('');
  });

  it('does not label a plain oneOf variant with the name of an absent schema', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/SecretCat' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.options.map((option) => option.label)).not.toContain('SecretCat');
    expect(axis?.options).toHaveLength(2);
  });

  it('drops the Default mapping option when its target is not in the store', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: { cat: '#/components/schemas/Cat' },
          defaultMapping: '#/components/schemas/SecretFallback',
        },
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.options.map((option) => option.label)).toEqual(['cat']);
  });

  it('builds a discriminator axis from a root mapping', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            cat: '#/components/schemas/Cat',
            dog: '#/components/schemas/Dog',
          },
        },
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis).toMatchObject({
      kind: 'discriminator',
      stateKey: 'kind',
      localPart: 'kind',
      parentPath: [],
      options: [
        { label: 'cat', schemaId: 'components/schemas/Cat', mappingKey: 'cat' },
        { label: 'dog', schemaId: 'components/schemas/Dog', mappingKey: 'dog' },
      ],
    });
  });

  it('appends defaultMapping as a tagged option at the end (OAS 3.2)', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'petType',
          mapping: {
            cat: '#/components/schemas/Cat',
            dog: '#/components/schemas/Dog',
          },
          defaultMapping: '#/components/schemas/OtherPet',
        },
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object' }),
      'components/schemas/OtherPet': entry('components/schemas/OtherPet', { type: 'object' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.options.map((o) => [o.label, o.isDefaultMapping ?? false])).toEqual([
      ['cat', false],
      ['dog', false],
      ['Default mapping', true],
    ]);
  });

  it('includes the Default mapping option for an allOf-wrapped host', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        allOf: [{ $ref: '#/components/schemas/Root' }],
      }),
      'components/schemas/Root': entry('components/schemas/Root', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: { cat: '#/components/schemas/Cat' },
          defaultMapping: '#/components/schemas/Other',
        },
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object' }),
      'components/schemas/Other': entry('components/schemas/Other', { type: 'object' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.options.map((o) => o.label)).toEqual(['cat', 'Default mapping']);
  });

  it('folds only the name-matching mapping entry into Default mapping (explicit names stay)', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'petType',
          mapping: {
            kitty: '#/components/schemas/OtherPet',
            OtherPet: '#/components/schemas/OtherPet',
            dog: '#/components/schemas/Dog',
          },
          defaultMapping: '#/components/schemas/OtherPet',
        },
      }),
      'components/schemas/OtherPet': entry('components/schemas/OtherPet', { type: 'object' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.options.map((o) => o.label)).toEqual(['kitty', 'dog', 'Default mapping']);
  });

  it('keys a mapping-less discriminator over oneOf by the discriminator property', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: { propertyName: 'vehicleType' },
        oneOf: [{ $ref: '#/components/schemas/Bike' }, { $ref: '#/components/schemas/Car' }],
        properties: { vehicleType: { type: 'string' } },
      }),
      'components/schemas/Bike': entry('components/schemas/Bike', {
        type: 'object',
        title: 'Bike',
      }),
      'components/schemas/Car': entry('components/schemas/Car', { type: 'object', title: 'Car' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis).toMatchObject({
      kind: 'discriminator',
      stateKey: 'vehicleType',
      localPart: 'vehicleType',
      parentPath: [],
    });
    expect(axis?.options.map((o) => o.label)).toEqual(['Bike', 'Car']);
  });

  it('flags deprecated variants on the axis options', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            legacy: '#/components/schemas/Legacy',
            modern: '#/components/schemas/Modern',
          },
        },
      }),
      'components/schemas/Legacy': entry('components/schemas/Legacy', {
        type: 'object',
        deprecated: true,
      }),
      'components/schemas/Modern': entry('components/schemas/Modern', { type: 'object' }),
    };

    const axis = findSchemaVariantAxis('body', store);
    expect(axis?.options.map((o) => o.isDeprecated ?? false)).toEqual([true, false]);
  });

  it('builds an anyOf axis when the root has only anyOf', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        anyOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }],
      }),
      'components/schemas/A': entry('components/schemas/A', { type: 'object', title: 'A' }),
      'components/schemas/B': entry('components/schemas/B', { type: 'object', title: 'B' }),
    };

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.kind).toBe('anyOf');
    expect(axis?.localPart).toBe('Any of:');
    expect(axis?.stateKey).toBe('Any of:');
    expect(axis?.options.map((o) => o.label)).toEqual(['A', 'B']);
  });

  it('dedups identical labels by appending the per-label occurrence count', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ type: 'string' }, { type: 'string' }],
      }),
    };

    const axis = findSchemaVariantAxis('body', store);
    expect(axis?.options.map((o) => o.label)).toEqual(['string', 'string (2)']);
  });

  it('uses the per-label occurrence count for non-consecutive duplicates', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'string' }],
      }),
    };

    const axis = findSchemaVariantAxis('body', store);
    expect(axis?.options.map((o) => o.label)).toEqual(['string', 'number', 'string (2)']);
  });

  it('returns undefined when the schema has no variants of any kind', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', { type: 'object', properties: { x: { type: 'string' } } }),
    };

    expect(findSchemaVariantAxis('body', store)).toBeUndefined();
  });

  it('returns undefined for an unknown schema id', () => {
    expect(findSchemaVariantAxis('missing', {})).toBeUndefined();
  });

  it('surfaces a single-option discriminator axis (sampler must hoist into the only variant)', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: { only: '#/components/schemas/OnlyVariant' },
        },
      }),
      'components/schemas/OnlyVariant': entry('components/schemas/OnlyVariant', {
        title: 'OnlyVariant',
      }),
    };

    const axis = findSchemaVariantAxis('body', store);
    expect(axis?.kind).toBe('discriminator');
    expect(axis?.options).toHaveLength(1);
    expect(axis?.options[0]?.schemaId).toBe('components/schemas/OnlyVariant');
  });

  it('surfaces a single-option oneOf axis (UI filters separately via options.length < 2)', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', { oneOf: [{ type: 'string' }] }),
    };
    const axis = findSchemaVariantAxis('body', store);
    expect(axis?.kind).toBe('oneOf');
    expect(axis?.options).toHaveLength(1);
  });

  it('does not surface nested axes by default (sampler-safe)', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: {
          tax: { oneOf: [{ type: 'object' }, { type: 'object' }] },
        },
      }),
    };

    expect(findSchemaVariantAxis('body', store)).toBeUndefined();
  });

  it('surfaces a single nested oneOf only when includeNested: true (right-panel opt-in)', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: {
          entityMetadata: { $ref: '#/components/schemas/EntityMetadata' },
          name: { type: 'string' },
        },
      }),
      'components/schemas/EntityMetadata': entry('components/schemas/EntityMetadata', {
        oneOf: [
          { $ref: '#/components/schemas/PnrWrapper' },
          { $ref: '#/components/schemas/EventWrapper' },
        ],
      }),
      'components/schemas/PnrWrapper': entry('components/schemas/PnrWrapper', {
        type: 'object',
        title: 'PnrWrapper',
      }),
      'components/schemas/EventWrapper': entry('components/schemas/EventWrapper', {
        type: 'object',
        title: 'EventWrapper',
      }),
    };

    expect(findSchemaVariantAxis('body', store)).toBeUndefined();

    const axis = findSchemaVariantAxis('body', store, { includeNested: true });
    expect(axis?.kind).toBe('oneOf');
    expect(axis?.stateKey).toBe('entityMetadata/One of:');
    expect(axis?.parentPath).toEqual(['entityMetadata']);
    expect(axis?.options.map((o) => o.label)).toEqual(['PnrWrapper', 'EventWrapper']);
  });

  it('returns undefined when two distinct nested axes are reachable (ambiguous) with includeNested', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: {
          first: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          second: {
            oneOf: [{ type: 'boolean' }, { type: 'integer' }],
          },
        },
      }),
    };

    expect(findSchemaVariantAxis('body', store, { includeNested: true })).toBeUndefined();
  });
});

describe('collectNestedVariantAxes', () => {
  it('collects an array-item oneOf with the [] suffix on the path', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: {
          tripFilters: {
            type: 'array',
            items: { $ref: '#/components/schemas/TripFilter' },
          },
        },
      }),
      'components/schemas/TripFilter': entry('components/schemas/TripFilter', {
        oneOf: [
          { $ref: '#/components/schemas/DateFilter' },
          { $ref: '#/components/schemas/PriceFilter' },
        ],
      }),
      'components/schemas/DateFilter': entry('components/schemas/DateFilter', { type: 'object' }),
      'components/schemas/PriceFilter': entry('components/schemas/PriceFilter', { type: 'object' }),
    };

    const collected = collectNestedVariantAxes(store.body.data, store);

    expect([...collected.keys()]).toEqual(['tripFilters[]/One of:']);
    const axis = collected.get('tripFilters[]/One of:');
    expect(axis?.parentPath).toEqual(['tripFilters[]']);
    expect(axis?.options).toHaveLength(2);
  });

  it('collects a nested discriminator with the parent path as prefix', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: {
          payment: { $ref: '#/components/schemas/Payment' },
        },
      }),
      'components/schemas/Payment': entry('components/schemas/Payment', {
        type: 'object',
        discriminator: {
          propertyName: 'method',
          mapping: {
            card: '#/components/schemas/Card',
            ach: '#/components/schemas/Ach',
          },
        },
      }),
      'components/schemas/Card': entry('components/schemas/Card', { type: 'object' }),
      'components/schemas/Ach': entry('components/schemas/Ach', { type: 'object' }),
    };

    const collected = collectNestedVariantAxes(store.body.data, store);

    expect([...collected.keys()]).toEqual(['payment/method']);
    expect(collected.get('payment/method')?.kind).toBe('discriminator');
  });

  it('returns an empty map for a plain object schema', () => {
    expect(collectNestedVariantAxes({ type: 'object' }, {})).toEqual(new Map());
  });

  it('does not infinite-loop on circular $ref chains', () => {
    const store: Record<string, SchemaEntry> = {
      a: entry('a', { properties: { b: { $ref: '#/b' } } }),
      b: entry('b', { properties: { a: { $ref: '#/a' } } }),
    };

    expect(() => collectNestedVariantAxes(store.a.data, store)).not.toThrow();
  });
});

describe('findSchemaVariantAxis (allOf-wrapped mapping-less host)', () => {
  const wrappedStore = (): Record<string, SchemaEntry> => ({
    'components/schemas/Body': entry('components/schemas/Body', {
      allOf: [{ $ref: '#/components/schemas/Shape' }],
    }),
    'components/schemas/Shape': entry('components/schemas/Shape', {
      discriminator: { propertyName: 'kind' },
      oneOf: [{ $ref: '#/components/schemas/Circle' }, { $ref: '#/components/schemas/Square' }],
      properties: { kind: { type: 'string' } },
    }),
    'components/schemas/Circle': entry('components/schemas/Circle', {
      type: 'object',
      title: 'Circle',
    }),
    'components/schemas/Square': entry('components/schemas/Square', {
      type: 'object',
      title: 'Square',
    }),
  });

  it('builds a root discriminator axis from the variant list of the node that declares it', () => {
    const axis = findSchemaVariantAxis('components/schemas/Body', wrappedStore());

    expect(axis?.kind).toBe('discriminator');
    expect(axis?.stateKey).toBe('kind');
    expect(axis?.options.map((o) => o.label)).toEqual(['Circle', 'Square']);
  });
});

describe('resolveActiveVariantIndex', () => {
  const axis: SchemaVariantAxis = {
    kind: 'oneOf',
    stateKey: 'One of:',
    localPart: 'One of:',
    parentPath: [],
    options: [
      { label: 'A', schemaId: 'A' },
      { label: 'B', schemaId: 'B' },
      { label: 'C', schemaId: 'C' },
    ],
  };

  it('returns 0 when no state record is provided', () => {
    expect(resolveActiveVariantIndex(axis)).toBe(0);
  });

  it('returns the direct index from the matching state slot', () => {
    expect(resolveActiveVariantIndex(axis, undefined, { 'One of:': 2 })).toBe(2);
  });

  it('reads from activeDiscriminator (not activeOneOf) for discriminator axes', () => {
    const discAxis: SchemaVariantAxis = {
      ...axis,
      kind: 'discriminator',
      localPart: 'kind',
      stateKey: 'kind',
    };
    expect(resolveActiveVariantIndex(discAxis, { kind: 1 }, { kind: 2 })).toBe(1);
  });

  it('falls back to 0 when the stored index is out of bounds', () => {
    expect(resolveActiveVariantIndex(axis, undefined, { 'One of:': 99 })).toBe(0);
    expect(resolveActiveVariantIndex(axis, undefined, { 'One of:': -1 })).toBe(0);
  });

  it('tolerates a single suffix-matching key for root discriminator axes (legacy)', () => {
    const discAxis: SchemaVariantAxis = {
      kind: 'discriminator',
      stateKey: 'kind',
      localPart: 'kind',
      parentPath: [],
      options: axis.options,
    };
    expect(resolveActiveVariantIndex(discAxis, { 'menuItems[]/kind': 2 })).toBe(2);
  });

  it('uses a single suffix-matching key for root oneOf axes', () => {
    expect(resolveActiveVariantIndex(axis, undefined, { 'something/One of:': 2 })).toBe(2);
  });

  it('does not apply the suffix fallback when multiple keys match', () => {
    const discAxis: SchemaVariantAxis = {
      kind: 'discriminator',
      stateKey: 'kind',
      localPart: 'kind',
      parentPath: [],
      options: axis.options,
    };
    expect(resolveActiveVariantIndex(discAxis, { 'a/kind': 1, 'b/kind': 2 })).toBe(0);
  });

  it('matches a state key that dropped leading ancestors (rows at level <= 1 strip parents)', () => {
    const nestedAxis: SchemaVariantAxis = {
      kind: 'oneOf',
      stateKey: 'rating/type/One of:',
      localPart: 'One of:',
      parentPath: ['rating', 'type'],
      options: axis.options,
    };
    expect(resolveActiveVariantIndex(nestedAxis, undefined, { 'type/One of:': 1 })).toBe(1);
  });

  it('does not treat a bare root switcher key as a suffix of nested axes', () => {
    const nestedAxis: SchemaVariantAxis = {
      kind: 'oneOf',
      stateKey: 'rating/type/One of:',
      localPart: 'One of:',
      parentPath: ['rating', 'type'],
      options: axis.options,
    };
    expect(resolveActiveVariantIndex(nestedAxis, undefined, { 'One of:': 1 })).toBe(0);
  });
});

describe('sampler-safety: nested oneOf must not replace parent body', () => {
  const taxRefId = 'components/schemas/Tax';
  const detailedTaxId = 'components/schemas/DetailedTax';
  const simpleTaxId = 'components/schemas/SimpleTax';

  function makeNestedTaxStore(): Record<string, SchemaEntry> {
    return {
      body: entry('body', {
        type: 'object',
        required: ['amount', 'tax'],
        properties: {
          amount: { type: 'number' },
          description: { type: 'string' },
          tax: { $ref: `#/${taxRefId}` },
        },
      }),
      [taxRefId]: entry(taxRefId, {
        oneOf: [{ $ref: `#/${simpleTaxId}` }, { $ref: `#/${detailedTaxId}` }],
      }),
      [simpleTaxId]: entry(simpleTaxId, {
        type: 'object',
        title: 'SimpleTax',
        properties: { rate: { type: 'number' } },
      }),
      [detailedTaxId]: entry(detailedTaxId, {
        type: 'object',
        title: 'DetailedTax',
        properties: { rate: { type: 'number' }, jurisdictions: { type: 'object' } },
      }),
    };
  }

  it('applyActiveVariantsToStore preserves the body schema unchanged', () => {
    const store = makeNestedTaxStore();
    const resolved = applyActiveVariantsToStore({ schemaStore: store });
    expect(resolved.body).toStrictEqual(store.body.data);
  });
});

describe('applyActiveVariantsToStore (a variant that pins the discriminator value)', () => {
  const store = (hostKind: Record<string, unknown>): Record<string, SchemaEntry> => ({
    'components/schemas/Beverage': entry('components/schemas/Beverage', {
      properties: { kind: hostKind },
      oneOf: [{ $ref: '#/components/schemas/Coffee' }, { $ref: '#/components/schemas/Tea' }],
      discriminator: {
        propertyName: 'kind',
        mapping: { coffee: '#/components/schemas/Coffee', tea: '#/components/schemas/Tea' },
      },
    }),
    'components/schemas/Coffee': entry('components/schemas/Coffee', {
      allOf: [
        { $ref: '#/components/schemas/Beverage' },
        { properties: { kind: { const: 'espresso' } } },
      ],
    }),
    'components/schemas/Tea': entry('components/schemas/Tea', {
      allOf: [{ $ref: '#/components/schemas/Beverage' }],
    }),
  });
  const stamps = (resolved: Record<string, unknown>) =>
    JSON.stringify(resolved).includes('"enum":[');

  it('keeps its own const instead of the mapping key', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: store({ type: 'string' }),
      activeDiscriminator: { kind: 0 },
    });

    expect(stamps(resolved['components/schemas/Beverage'])).toBe(false);
  });

  it('still stamps a variant that only inherits the host enum', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: store({ type: 'string', enum: ['coffee', 'tea'] }),
      activeDiscriminator: {
        kind: 1,
      },
    });

    expect(JSON.stringify(resolved['components/schemas/Beverage'])).toContain('"enum":["tea"]');
  });
});

describe('applyActiveVariantsToStore', () => {
  it('returns the original data for schemas with no variant axis', () => {
    const store: Record<string, SchemaEntry> = {
      plain: entry('plain', { type: 'object', properties: { x: { type: 'string' } } }),
    };

    const resolved = applyActiveVariantsToStore({ schemaStore: store });

    expect(resolved.plain).toStrictEqual(store.plain.data);
  });

  it('does not throw when an entry has no data (e.g. stripped by the platform)', () => {
    const store: Record<string, SchemaEntry> = {
      plain: entry('plain', { type: 'object' }),
      restricted: { id: 'restricted', kind: schemaKind.JSON_SCHEMA } as unknown as SchemaEntry,
    };

    expect(() => applyActiveVariantsToStore({ schemaStore: store })).not.toThrow();
  });

  it('rewrites root discriminator schemas to the selected variant body', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            cat: '#/components/schemas/Cat',
            dog: '#/components/schemas/Dog',
          },
        },
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { kind: 1 },
    });

    // The inlined variant is wrapped in allOf with an `enum` chunk so the
    // sampler emits the mapping key for the discriminator property. The first
    // allOf entry is the variant body itself. The host's top-level `type` is
    // preserved so the sampler's circular-$ref fallback samples back-references
    // into the host as `{}`, not `null`.
    expect(resolved.body).toEqual({
      type: 'object',
      allOf: [{ type: 'object', title: 'Dog' }, { properties: { kind: { enum: ['dog'] } } }],
    });
  });

  it('stamps the explicit mapping key even when it targets the defaultMapping schema', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        discriminator: {
          propertyName: 'defType',
          mapping: {
            kitty: '#/components/schemas/DefaultMappedA',
            doggo: '#/components/schemas/DefaultMappedB',
          },
          defaultMapping: '#/components/schemas/DefaultMappedA',
        },
      }),
      'components/schemas/DefaultMappedA': entry('components/schemas/DefaultMappedA', {
        type: 'object',
        properties: { a: { type: 'string' } },
      }),
      'components/schemas/DefaultMappedB': entry('components/schemas/DefaultMappedB', {
        type: 'object',
        properties: { b: { type: 'string' } },
      }),
    };

    // Options are [kitty, doggo, Default mapping]; kitty and Default mapping share a ref.
    const kittySelected = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { defType: 0 },
      activeOneOf: {},
    });
    expect(kittySelected.body.allOf).toContainEqual({
      properties: { defType: { enum: ['kitty'] } },
    });

    const defaultSelected = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { defType: 2 },
      activeOneOf: {},
    });
    expect(JSON.stringify(defaultSelected.body)).not.toContain('enum');
  });

  it('rewrites a mapping-less discriminator host via activeDiscriminator state', () => {
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Vehicle': entry('components/schemas/Vehicle', {
        type: 'object',
        discriminator: { propertyName: 'vehicleType' },
        oneOf: [{ $ref: '#/components/schemas/Bike' }, { $ref: '#/components/schemas/Car' }],
        properties: { vehicleType: { type: 'string' } },
      }),
      'components/schemas/Bike': entry('components/schemas/Bike', {
        type: 'object',
        title: 'Bike',
        properties: { gears: { type: 'integer' } },
      }),
      'components/schemas/Car': entry('components/schemas/Car', {
        type: 'object',
        title: 'Car',
        properties: { doors: { type: 'integer' } },
      }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { vehicleType: 1 },
      activeOneOf: {},
    });

    const allOf = resolved['components/schemas/Vehicle'].allOf as Array<Record<string, unknown>>;
    expect(allOf[0].properties).toHaveProperty('vehicleType');
    expect(allOf[1].properties).toHaveProperty('doors');
  });

  it('ignores activeOneOf state for a mapping-less discriminator host', () => {
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Vehicle': entry('components/schemas/Vehicle', {
        type: 'object',
        discriminator: { propertyName: 'vehicleType' },
        oneOf: [{ $ref: '#/components/schemas/Bike' }, { $ref: '#/components/schemas/Car' }],
        properties: { vehicleType: { type: 'string' } },
      }),
      'components/schemas/Bike': entry('components/schemas/Bike', {
        type: 'object',
        title: 'Bike',
        properties: { gears: { type: 'integer' } },
      }),
      'components/schemas/Car': entry('components/schemas/Car', {
        type: 'object',
        title: 'Car',
        properties: { doors: { type: 'integer' } },
      }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: {},
      activeOneOf: { 'One of:': 1 },
    });

    const allOf = resolved['components/schemas/Vehicle'].allOf as Array<Record<string, unknown>>;
    expect(allOf[0].properties).toHaveProperty('vehicleType');
    expect(allOf[1].properties).toHaveProperty('gears');
  });

  it('rewrites root oneOf schemas to the selected variant body', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeOneOf: { 'One of:': 1 },
    });

    expect(resolved.body).toEqual({ type: 'object', title: 'Dog' });
  });

  it('gives an untyped oneOf host the type of the selected variant', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        properties: { common: { type: 'string' } },
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeOneOf: { 'One of:': 1 },
    });

    expect(resolved.body).toEqual({
      type: 'object',
      allOf: [{ properties: { common: { type: 'string' } } }, { type: 'object', title: 'Dog' }],
    });
  });

  it('does not mutate the source store', () => {
    const cat = entry('components/schemas/Cat', { title: 'Cat' });
    const dog = entry('components/schemas/Dog', { title: 'Dog' });
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': cat,
      'components/schemas/Dog': dog,
    };

    applyActiveVariantsToStore({ schemaStore: store, activeOneOf: { 'One of:': 1 } });

    expect(store.body.data).toEqual({
      oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
    });
    expect(cat.data).toEqual({ title: 'Cat' });
    expect(dog.data).toEqual({ title: 'Dog' });
  });

  it('inlines host parent properties when variant has a back-ref to the host (breaks self-cycle)', () => {
    const store: Record<string, SchemaEntry> = {
      'components/schemas/GatewayAccount': entry('components/schemas/GatewayAccount', {
        type: 'object',
        required: ['gatewayName'],
        properties: {
          gatewayName: { type: 'string' },
          method: { type: 'string' },
        },
        discriminator: {
          propertyName: 'gatewayName',
          mapping: {
            A1Gateway: '#/components/schemas/A1Gateway',
            A2Gateway: '#/components/schemas/A2Gateway',
          },
        },
      }),
      'components/schemas/A1Gateway': entry('components/schemas/A1Gateway', {
        allOf: [
          { $ref: '#/components/schemas/GatewayAccount' },
          {
            type: 'object',
            properties: { credentials: { type: 'object' } },
          },
        ],
      }),
      'components/schemas/A2Gateway': entry('components/schemas/A2Gateway', {
        allOf: [
          { $ref: '#/components/schemas/GatewayAccount' },
          { type: 'object', properties: { token: { type: 'string' } } },
        ],
      }),
    };

    const resolved = applyActiveVariantsToStore({ schemaStore: store });

    const hostResolved = resolved['components/schemas/GatewayAccount'];
    const allOf = hostResolved.allOf as Array<Record<string, unknown>>;

    expect(allOf[0]).not.toHaveProperty('$ref');
    expect(allOf[0]).toMatchObject({
      type: 'object',
      properties: {
        gatewayName: { type: 'string' },
        method: { type: 'string' },
      },
    });
    expect(allOf[0]).not.toHaveProperty('discriminator');
    expect(allOf[1]).toMatchObject({
      properties: { credentials: { type: 'object' } },
    });
    // Appended chunk: enum on the discriminator property so the sampler emits
    // the mapping key directly (including for nested $ref'd hosts).
    expect(allOf[2]).toEqual({
      properties: { gatewayName: { enum: ['A1Gateway'] } },
    });
  });

  it('inlines back-ref for root oneOf bodies where the variant extends the host', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: { kind: { type: 'string' } },
        oneOf: [
          { $ref: '#/components/schemas/VariantA' },
          { $ref: '#/components/schemas/VariantB' },
        ],
      }),
      'components/schemas/VariantA': entry('components/schemas/VariantA', {
        allOf: [{ $ref: '#/body' }, { properties: { extra: { type: 'string' } } }],
      }),
      'components/schemas/VariantB': entry('components/schemas/VariantB', {
        type: 'object',
        properties: { other: { type: 'string' } },
      }),
    };

    const resolved = applyActiveVariantsToStore({ schemaStore: store });
    const allOf = resolved.body.allOf as Array<Record<string, unknown>>;

    expect(allOf[0]).not.toHaveProperty('$ref');
    expect(allOf[0]).toMatchObject({
      type: 'object',
      properties: { kind: { type: 'string' } },
    });
    expect(allOf[0]).not.toHaveProperty('oneOf');
  });

  it('rewrites root anyOf schemas to the selected variant body', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        anyOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeOneOf: { 'Any of:': 1 },
    });

    expect(resolved.body).toEqual({ type: 'object', title: 'Dog' });
  });

  it('defaults to the first anyOf variant when no selection is provided', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        anyOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const resolved = applyActiveVariantsToStore({ schemaStore: store });

    expect(resolved.body).toEqual({ type: 'object', title: 'Cat' });
  });

  it('inlines back-ref for root anyOf bodies where the variant extends the host', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: { kind: { type: 'string' } },
        anyOf: [
          { $ref: '#/components/schemas/VariantA' },
          { $ref: '#/components/schemas/VariantB' },
        ],
      }),
      'components/schemas/VariantA': entry('components/schemas/VariantA', {
        allOf: [{ $ref: '#/body' }, { properties: { extra: { type: 'string' } } }],
      }),
      'components/schemas/VariantB': entry('components/schemas/VariantB', {
        type: 'object',
        properties: { other: { type: 'string' } },
      }),
    };

    const resolved = applyActiveVariantsToStore({ schemaStore: store });
    const allOf = resolved.body.allOf as Array<Record<string, unknown>>;

    expect(allOf[0]).not.toHaveProperty('$ref');
    expect(allOf[0]).toMatchObject({
      type: 'object',
      properties: { kind: { type: 'string' } },
    });
    expect(allOf[0]).not.toHaveProperty('anyOf');
  });

  function paymentStore(withDiscriminator: boolean): Record<string, SchemaEntry> {
    return {
      'components/schemas/Payment': entry('components/schemas/Payment', {
        type: 'object',
        required: ['amount'],
        properties: {
          method: { type: 'string', description: 'Payment method' },
          amount: { type: 'number', example: 4.2 },
        },
        oneOf: [{ $ref: '#/components/schemas/Card' }, { $ref: '#/components/schemas/Bank' }],
        ...(withDiscriminator
          ? {
              discriminator: {
                propertyName: 'method',
                mapping: {
                  card: '#/components/schemas/Card',
                  bank: '#/components/schemas/Bank',
                },
              },
            }
          : {}),
      }),
      'components/schemas/Card': entry('components/schemas/Card', {
        type: 'object',
        required: ['method'],
        properties: { method: { const: 'card' }, last4: { type: 'string', example: '4242' } },
      }),
      'components/schemas/Bank': entry('components/schemas/Bank', {
        type: 'object',
        required: ['method'],
        properties: {
          method: { const: 'bank' },
          iban: { type: 'string', example: 'DE89370400440532013000' },
        },
      }),
    };
  }

  it('keeps the host own properties next to the selected discriminator variant', () => {
    const store = paymentStore(true);

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { method: 0 },
    });

    expect(resolved['components/schemas/Payment']).toEqual({
      type: 'object',
      allOf: [
        {
          type: 'object',
          required: ['amount'],
          properties: {
            method: { type: 'string', description: 'Payment method' },
            amount: { type: 'number', example: 4.2 },
          },
        },
        store['components/schemas/Card'].data,
      ],
    });
  });

  it('keeps the host own properties next to the selected plain oneOf variant', () => {
    const store = paymentStore(false);

    const resolved = applyActiveVariantsToStore({ schemaStore: store });

    expect(resolved['components/schemas/Payment']).toEqual({
      type: 'object',
      allOf: [
        {
          type: 'object',
          required: ['amount'],
          properties: {
            method: { type: 'string', description: 'Payment method' },
            amount: { type: 'number', example: 4.2 },
          },
        },
        store['components/schemas/Card'].data,
      ],
    });
  });

  it('does not merge a host example into the selected variant', () => {
    const store = paymentStore(true);
    const payment = store['components/schemas/Payment'];
    store['components/schemas/Payment'] = {
      ...payment,
      data: { ...payment.data, example: { method: 'card', last4: '1111' }, default: {} },
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { method: 1 },
    });
    const host = (resolved['components/schemas/Payment'].allOf as Record<string, unknown>[])[0];

    expect(host).not.toHaveProperty('example');
    expect(host).not.toHaveProperty('default');
  });

  it('keeps the selected variant XML name on the rewritten host', () => {
    const store = paymentStore(true);
    const bank = store['components/schemas/Bank'];
    store['components/schemas/Bank'] = { ...bank, data: { ...bank.data, xml: { name: 'Bank' } } };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { method: 1 },
    });

    expect(resolved['components/schemas/Payment'].xml).toEqual({ name: 'Bank' });
  });

  it('prefers oneOf over anyOf when both are present at the root', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
        anyOf: [{ $ref: '#/components/schemas/Fish' }, { $ref: '#/components/schemas/Bird' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
      'components/schemas/Fish': entry('components/schemas/Fish', {
        type: 'object',
        title: 'Fish',
      }),
      'components/schemas/Bird': entry('components/schemas/Bird', {
        type: 'object',
        title: 'Bird',
      }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeOneOf: {
        'One of:': 1,
        'Any of:': 1,
      },
    });

    expect(resolved.body).toEqual({ type: 'object', title: 'Dog' });
  });
});

describe('applyActiveVariantsToSchema', () => {
  const bodyWithNestedOneOf = () => ({
    type: 'object',
    properties: {
      name: { type: 'string' },
      metadata: {
        description: 'Arbitrary metadata',
        oneOf: [{ type: 'null' }, { type: 'object', properties: { tag: { type: 'string' } } }],
      },
    },
  });

  it('collapses a nested inline oneOf to the first branch by default (null samples as null, not {})', () => {
    const collapsed = applyActiveVariantsToSchema({
      schema: bodyWithNestedOneOf(),
      schemaStore: {},
    });

    expect((collapsed.properties as Record<string, unknown>).metadata).toEqual({
      description: 'Arbitrary metadata',
      type: 'null',
    });
  });

  it('collapses a nested inline oneOf to the selected branch', () => {
    const collapsed = applyActiveVariantsToSchema({
      schema: bodyWithNestedOneOf(),
      schemaStore: {},
      activeOneOf: {
        'metadata/One of:': 1,
      },
    });

    expect((collapsed.properties as Record<string, unknown>).metadata).toEqual({
      description: 'Arbitrary metadata',
      type: 'object',
      properties: { tag: { type: 'string' } },
    });
  });

  it('collapses an inline oneOf under array items using the [] path suffix', () => {
    const schema = {
      type: 'object',
      properties: {
        events: {
          type: 'array',
          items: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
        },
      },
    };

    const collapsed = applyActiveVariantsToSchema({
      schema,
      schemaStore: {},
      activeOneOf: {
        'events[]/One of:': 1,
      },
    });

    expect((collapsed.properties as Record<string, unknown>).events).toEqual({
      type: 'array',
      items: { type: 'integer' },
    });
  });

  it('collapses a single-element null oneOf (sampler emits {} for any surviving wrapper)', () => {
    const schema = {
      type: 'object',
      properties: { actor: { oneOf: [{ type: 'null' }] } },
    };

    const collapsed = applyActiveVariantsToSchema({ schema, schemaStore: {} });

    expect((collapsed.properties as Record<string, unknown>).actor).toEqual({ type: 'null' });
  });

  it('does not descend into $ref nodes (their store entries are collapsed separately)', () => {
    const schema = {
      type: 'object',
      properties: { pet: { $ref: '#/components/schemas/Pet' } },
    };

    const collapsed = applyActiveVariantsToSchema({
      schema,
      schemaStore: {},
      activeOneOf: { 'pet/One of:': 1 },
    });

    expect(collapsed).toEqual(schema);
  });

  it('leaves discriminator nodes to the store-level rewrite', () => {
    const store = makeStore();
    const host = store['components/schemas/MenuItem'].data;

    const collapsed = applyActiveVariantsToSchema({
      schema: { ...host },
      schemaStore: store,
      activeOneOf: {
        'itemType/One of:': 1,
      },
    });

    expect(collapsed).toEqual(host);
  });

  it('does not mutate the input schema', () => {
    const schema = bodyWithNestedOneOf();

    applyActiveVariantsToSchema({
      schema,
      schemaStore: {},
      activeOneOf: { 'metadata/One of:': 1 },
    });

    expect(schema).toEqual(bodyWithNestedOneOf());
  });

  it('applies the host keywords a selected variant also declares', () => {
    const schema = {
      type: 'object',
      required: ['kind'],
      properties: { kind: { type: 'string' }, id: { type: 'integer' } },
      allOf: [{ $ref: '#/components/schemas/Base' }],
      anyOf: [
        { type: 'null' },
        {
          required: ['id', 'name'],
          properties: { name: { type: 'string' }, kind: { enum: ['named'] } },
          allOf: [{ $ref: '#/components/schemas/Named' }],
        },
      ],
    };

    expect(applyActiveVariantsToSchema({ schema, schemaStore: {} })).toEqual({
      type: 'null',
      required: ['kind'],
      properties: { kind: { type: 'string' }, id: { type: 'integer' } },
      allOf: [{ $ref: '#/components/schemas/Base' }],
    });
    expect(
      applyActiveVariantsToSchema({ schema, schemaStore: {}, activeOneOf: { 'Any of:': 1 } }),
    ).toEqual({
      type: 'object',
      required: ['kind', 'id', 'name'],
      properties: { kind: { enum: ['named'] }, id: { type: 'integer' }, name: { type: 'string' } },
      allOf: [{ $ref: '#/components/schemas/Base' }, { $ref: '#/components/schemas/Named' }],
    });
  });
});

describe('applyActiveVariantsToStore (nested inline oneOf)', () => {
  it('collapses nested inline oneOf inside $ref-resolved component entries', () => {
    const store: Record<string, SchemaEntry> = {
      payload: entry('payload', { $ref: '#/components/schemas/BaseEvent' }),
      'components/schemas/BaseEvent': entry('components/schemas/BaseEvent', {
        type: 'object',
        properties: {
          actor: { oneOf: [{ type: 'null' }, { type: 'object', title: 'User' }] },
        },
      }),
    };

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeOneOf: { 'actor/One of:': 1 },
    });

    expect(resolved['components/schemas/BaseEvent']).toEqual({
      type: 'object',
      properties: { actor: { type: 'object', title: 'User' } },
    });
  });
});

describe('applyActiveVariantsToStore (nested inline discriminator)', () => {
  const accountsDiscriminator = () => ({
    propertyName: 'Type',
    mapping: {
      InvestmentAccountDetail: '#/components/schemas/HoldingAccountDetail',
      BankAccountDetail: '#/components/schemas/BankAccountDetail',
    },
  });

  function accountsStore(itemsNode?: Record<string, unknown>): Record<string, SchemaEntry> {
    return {
      'components/schemas/InvestmentDetails': entry('components/schemas/InvestmentDetails', {
        type: 'object',
        properties: {
          Items: {
            type: 'array',
            items: itemsNode ?? {
              oneOf: [
                { $ref: '#/components/schemas/HoldingAccountDetail' },
                { $ref: '#/components/schemas/BankAccountDetail' },
              ],
              discriminator: accountsDiscriminator(),
            },
          },
        },
      }),
      'components/schemas/HoldingAccountDetail': entry('components/schemas/HoldingAccountDetail', {
        type: 'object',
        properties: { Type: { type: 'string' }, holdingOnly: { type: 'string' } },
      }),
      'components/schemas/BankAccountDetail': entry('components/schemas/BankAccountDetail', {
        type: 'object',
        properties: { Type: { type: 'string' }, bankOnly: { type: 'string' } },
      }),
    };
  }

  function collapsedItems(resolved: Record<string, Record<string, unknown>>): unknown {
    const props = resolved['components/schemas/InvestmentDetails'].properties as Record<
      string,
      Record<string, unknown>
    >;
    return props.Items.items;
  }

  it('collapses an inline discriminator host to the selected mapping option with its value stamped', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: accountsStore(),
      activeDiscriminator: {
        'InvestmentDetails/Items[]/Type': 1,
      },
    });

    expect(collapsedItems(resolved)).toEqual({
      allOf: [
        { $ref: '#/components/schemas/BankAccountDetail' },
        { properties: { Type: { enum: ['BankAccountDetail'] } } },
      ],
    });
  });

  it('collapses to the first mapping option with its value stamped when nothing is selected', () => {
    const resolved = applyActiveVariantsToStore({ schemaStore: accountsStore() });

    expect(collapsedItems(resolved)).toEqual({
      allOf: [
        { $ref: '#/components/schemas/HoldingAccountDetail' },
        { properties: { Type: { enum: ['InvestmentAccountDetail'] } } },
      ],
    });
  });

  it('keeps non-axis siblings of the inline host', () => {
    const store = accountsStore({
      description: 'Polymorphic account',
      oneOf: [
        { $ref: '#/components/schemas/HoldingAccountDetail' },
        { $ref: '#/components/schemas/BankAccountDetail' },
      ],
      discriminator: accountsDiscriminator(),
    });

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { 'InvestmentDetails/Items[]/Type': 1 },
    });

    expect(collapsedItems(resolved)).toEqual({
      description: 'Polymorphic account',
      allOf: [
        { $ref: '#/components/schemas/BankAccountDetail' },
        { properties: { Type: { enum: ['BankAccountDetail'] } } },
      ],
    });
  });

  it('selects the Default mapping option without stamping a value', () => {
    const store = accountsStore({
      oneOf: [
        { $ref: '#/components/schemas/HoldingAccountDetail' },
        { $ref: '#/components/schemas/BankAccountDetail' },
      ],
      discriminator: {
        propertyName: 'Type',
        mapping: {
          InvestmentAccountDetail: '#/components/schemas/HoldingAccountDetail',
        },
        defaultMapping: '#/components/schemas/BankAccountDetail',
      },
    });

    // Options: [InvestmentAccountDetail, Default mapping] — pick the default.
    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { 'InvestmentDetails/Items[]/Type': 1 },
    });

    expect(collapsedItems(resolved)).toEqual({
      allOf: [{ $ref: '#/components/schemas/BankAccountDetail' }],
    });
  });

  it('collapses a mapping-less inline discriminator over $ref variants and stamps the schema name', () => {
    const store = accountsStore({
      oneOf: [
        { $ref: '#/components/schemas/HoldingAccountDetail' },
        { $ref: '#/components/schemas/BankAccountDetail' },
      ],
      discriminator: { propertyName: 'Type' },
    });

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { 'InvestmentDetails/Items[]/Type': 1 },
    });

    expect(collapsedItems(resolved)).toEqual({
      allOf: [
        { $ref: '#/components/schemas/BankAccountDetail' },
        { properties: { Type: { enum: ['BankAccountDetail'] } } },
      ],
    });
  });

  it('leaves an inline discriminator over inline-only variants untouched', () => {
    const itemsNode = {
      oneOf: [
        { type: 'object', properties: { a: { type: 'string' } } },
        { type: 'object', properties: { b: { type: 'string' } } },
      ],
      discriminator: { propertyName: 'Type' },
    };
    const store = accountsStore({ ...itemsNode, oneOf: [...itemsNode.oneOf] });

    const resolved = applyActiveVariantsToStore({
      schemaStore: store,
      activeDiscriminator: { 'InvestmentDetails/Items[]/Type': 1 },
    });

    expect(collapsedItems(resolved)).toEqual(itemsNode);
  });

  it('does not rewrite an entry-root discriminator host that lists itself (store pass owns roots)', () => {
    const selfListed = {
      type: 'object',
      oneOf: [
        { $ref: '#/components/schemas/OneOfDiscA' },
        { $ref: '#/components/schemas/OneOfDiscB' },
      ],
      discriminator: {
        propertyName: 'kind',
        mapping: {
          a: '#/components/schemas/OneOfDiscA',
          b: '#/components/schemas/OneOfDiscB',
        },
      },
      properties: { kind: { type: 'string' } },
    };
    const store: Record<string, SchemaEntry> = {
      'components/schemas/OneOfDiscA': entry('components/schemas/OneOfDiscA', selfListed),
      'components/schemas/OneOfDiscB': entry('components/schemas/OneOfDiscB', {
        type: 'object',
        properties: { kind: { type: 'string' } },
      }),
    };

    const resolved = applyActiveVariantsToStore({ schemaStore: store });

    // Option 0 maps to the host itself: pass 1 keeps the entry as-is, and the
    // nested collapse must not turn the root into a self-$ref wrapper.
    expect(resolved['components/schemas/OneOfDiscA']).toEqual(selfListed);
  });
});

describe('samplesVariantThroughHost', () => {
  const variant = { type: 'object', properties: { last4: { type: 'string' } } };

  it('samples through a host that declares oneOf/anyOf or a discriminator mapping', () => {
    expect(samplesVariantThroughHost({ oneOf: [] }, variant)).toBe(true);
    expect(samplesVariantThroughHost({ anyOf: [] }, variant)).toBe(true);
    expect(
      samplesVariantThroughHost(
        { discriminator: { propertyName: 'kind', mapping: { a: '#/A' } } },
        variant,
      ),
    ).toBe(true);
  });

  it('samples the variant alone when the host inherits the discriminator through allOf', () => {
    expect(
      samplesVariantThroughHost({ allOf: [{ $ref: '#/components/schemas/Pet' }] }, variant),
    ).toBe(false);
  });

  it('samples the variant alone when the variant is a discriminator host itself', () => {
    const nestedHost = { discriminator: { propertyName: 'petType', mapping: { cat: '#/Cat' } } };
    expect(samplesVariantThroughHost({ oneOf: [] }, nestedHost)).toBe(false);
  });
});

describe('findSchemaVariantAxis (several nested axes)', () => {
  const drinkStore = (body: Record<string, unknown>): Record<string, SchemaEntry> => {
    const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
    const leaf = (name: string) =>
      entry(`components/schemas/${name}`, {
        type: 'object',
        properties: { kind: { type: 'string' } },
      });
    return {
      body: entry('body', body),
      'components/schemas/Drink': entry('components/schemas/Drink', {
        oneOf: [ref('Brew'), ref('Juice')],
        discriminator: {
          propertyName: 'kind',
          mapping: { brew: '#/components/schemas/Brew', juice: '#/components/schemas/Juice' },
        },
      }),
      'components/schemas/Brew': entry('components/schemas/Brew', {
        oneOf: [ref('Espresso'), ref('Latte')],
        discriminator: {
          propertyName: 'style',
          mapping: {
            espresso: '#/components/schemas/Espresso',
            latte: '#/components/schemas/Latte',
          },
        },
      }),
      'components/schemas/Espresso': leaf('Espresso'),
      'components/schemas/Latte': leaf('Latte'),
      'components/schemas/Juice': leaf('Juice'),
    };
  };

  it('uses the outer axis of array items whose options nest the others', () => {
    const store = drinkStore({ type: 'array', items: { $ref: '#/components/schemas/Drink' } });

    expect(
      findSchemaVariantLeaves('body', store, { includeNested: true })?.map((leaf) => leaf.label),
    ).toEqual(['brew / espresso', 'brew / latte', 'juice']);
  });

  it('stays ambiguous when another axis sits at a different path', () => {
    const sibling = {
      oneOf: [{ $ref: '#/components/schemas/Espresso' }, { $ref: '#/components/schemas/Latte' }],
    };
    for (const properties of [
      { a: { $ref: '#/components/schemas/Drink' }, b: sibling },
      { b: sibling, a: { $ref: '#/components/schemas/Drink' } },
    ]) {
      expect(
        findSchemaVariantAxis('body', drinkStore({ type: 'object', properties }), {
          includeNested: true,
        }),
      ).toBeUndefined();
    }
  });

  it('stays ambiguous when another axis at the same path has options the outer axis does not reach', () => {
    const store = drinkStore({
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/components/schemas/Drink' },
          { oneOf: [{ type: 'string' }, { type: 'number' }] },
        ],
      },
    });

    expect(findSchemaVariantAxis('body', store, { includeNested: true })).toBeUndefined();
  });
});

describe('findSchemaVariantAxis (discriminator without mapping)', () => {
  const paymentStore = (card: Record<string, unknown>): Record<string, SchemaEntry> => ({
    'components/schemas/PaymentMethod': entry('components/schemas/PaymentMethod', {
      oneOf: [{ $ref: '#/components/schemas/Card' }, { $ref: '#/components/schemas/BankTransfer' }],
      discriminator: { propertyName: 'type' },
    }),
    'components/schemas/Card': entry('components/schemas/Card', card),
    'components/schemas/BankTransfer': entry('components/schemas/BankTransfer', {
      type: 'object',
      properties: { type: { type: 'string' }, iban: { type: 'string' } },
    }),
  });

  it('gives each variant its schema name as the mapping key', () => {
    const axis = findSchemaVariantAxis(
      'components/schemas/PaymentMethod',
      paymentStore({ type: 'object', properties: { type: { type: 'string' } } }),
    );

    expect(axis?.options.map((option) => option.mappingKey)).toEqual(['Card', 'BankTransfer']);
  });

  it('gives no mapping key to a variant that pins the property', () => {
    const axis = findSchemaVariantAxis(
      'components/schemas/PaymentMethod',
      paymentStore({ allOf: [{ properties: { type: { enum: ['card', 'credit'] } } }] }),
    );

    expect(axis?.options[0].mappingKey).toBeUndefined();
  });

  it('gives the schema name to variants whose enum lists it', () => {
    const store = paymentStore({
      type: 'object',
      properties: { type: { $ref: '#/components/schemas/MethodType' } },
    });
    store['components/schemas/MethodType'] = entry('components/schemas/MethodType', {
      type: 'string',
      enum: ['Card', 'BankTransfer'],
    });
    store['components/schemas/BankTransfer'].data.properties = {
      type: { $ref: '#/components/schemas/MethodType' },
    };

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual(['Card', 'BankTransfer']);
  });

  it('gives the schema name when the host enum lists it', () => {
    const store = paymentStore({ type: 'object', properties: { type: { type: 'string' } } });
    store['components/schemas/PaymentMethod'].data.properties = {
      type: { enum: ['Card', 'BankTransfer'] },
    };

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual(['Card', 'BankTransfer']);
  });

  it('gives the schema name to a variant whose property has only an x-example', () => {
    const axis = findSchemaVariantAxis(
      'components/schemas/PaymentMethod',
      paymentStore({
        type: 'object',
        properties: { type: { type: 'string', 'x-example': 'card' } },
      }),
    );

    expect(axis?.options.map((option) => option.mappingKey)).toEqual(['Card', 'BankTransfer']);
  });

  it('gives no mapping key to a variant that pins the property through a $ref', () => {
    const store = paymentStore({
      type: 'object',
      properties: { type: { $ref: '#/components/schemas/CardType' } },
    });
    store['components/schemas/CardType'] = entry('components/schemas/CardType', {
      type: 'string',
      enum: ['card'],
    });

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual([undefined, 'BankTransfer']);
  });

  it('gives no mapping key to a variant that inherits a pinned property from an allOf base', () => {
    const store = paymentStore({ allOf: [{ $ref: '#/components/schemas/CardBase' }] });
    store['components/schemas/CardBase'] = entry('components/schemas/CardBase', {
      type: 'object',
      properties: { type: { const: 'card' } },
    });

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options[0].mappingKey).toBeUndefined();
  });

  it('gives no mapping key when the explicit mapping names no stored schema', () => {
    const store = paymentStore({ type: 'object', properties: { type: { type: 'string' } } });
    store['components/schemas/PaymentMethod'].data.discriminator = {
      propertyName: 'type',
      mapping: { card: 'Card' },
    };

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual([undefined, undefined]);
  });

  it('gives no mapping key to a variant whose property points at a schema the store does not hold', () => {
    const axis = findSchemaVariantAxis(
      'components/schemas/PaymentMethod',
      paymentStore({
        type: 'object',
        properties: { type: { $ref: '#/components/schemas/CardBase/properties/type' } },
      }),
    );

    expect(axis?.options.map((option) => option.mappingKey)).toEqual([undefined, 'BankTransfer']);
  });

  it('gives no mapping key when the schema around an allOf part with the variants constrains the property', () => {
    const store = paymentStore({ type: 'object', properties: { type: { type: 'string' } } });
    store.body = entry('body', {
      type: 'object',
      properties: { type: { enum: ['card', 'bank'] } },
      allOf: [store['components/schemas/PaymentMethod'].data],
    });

    const axis = findSchemaVariantAxis('body', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual([undefined, undefined]);
  });

  it('gives no mapping key when the host constrains the property values', () => {
    const store = paymentStore({ type: 'object', properties: { type: { type: 'string' } } });
    store['components/schemas/PaymentMethod'].data.properties = {
      type: { type: 'string', enum: ['card', 'bank_transfer'] },
    };

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual([undefined, undefined]);
  });

  it('gives no mapping key to a variant that gives the property only an example or a default', () => {
    for (const value of [{ example: 'card' }, { examples: ['card'] }, { default: 'card' }]) {
      const axis = findSchemaVariantAxis(
        'components/schemas/PaymentMethod',
        paymentStore({ type: 'object', properties: { type: { type: 'string', ...value } } }),
      );

      expect(axis?.options.map((option) => option.mappingKey)).toEqual([undefined, 'BankTransfer']);
    }
  });

  it('gives each variant its schema name when a variant allOf chain is cyclic', () => {
    const store = paymentStore({ allOf: [{ $ref: '#/components/schemas/CardBase' }] });
    store['components/schemas/CardBase'] = entry('components/schemas/CardBase', {
      allOf: [{ $ref: '#/components/schemas/Card' }],
    });

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual(['Card', 'BankTransfer']);
  });

  it('gives no mapping key to a variant stored outside components/schemas', () => {
    const store = paymentStore({ type: 'object', properties: { type: { type: 'string' } } });
    store['definitions/PaymentCard'] = entry('definitions/PaymentCard', {
      type: 'object',
      properties: { type: { type: 'string' } },
    });
    store['components/schemas/PaymentMethod'].data.oneOf = [
      { $ref: '#/definitions/PaymentCard' },
      { $ref: '#/components/schemas/BankTransfer' },
    ];

    const axis = findSchemaVariantAxis('components/schemas/PaymentMethod', store);

    expect(axis?.options.map((option) => option.mappingKey)).toEqual([undefined, 'BankTransfer']);
  });
});

describe('findSchemaVariantLeaves (nested discriminators that share a property name)', () => {
  const animalStore = (animalMapping: Record<string, string>): Record<string, SchemaEntry> => ({
    'components/schemas/Animal': entry('components/schemas/Animal', {
      oneOf: [{ $ref: '#/components/schemas/Dog' }, { $ref: '#/components/schemas/Cat' }],
      discriminator: { propertyName: 'type', mapping: animalMapping },
    }),
    'components/schemas/Dog': entry('components/schemas/Dog', {
      oneOf: [{ $ref: '#/components/schemas/Lab' }, { $ref: '#/components/schemas/Poodle' }],
      discriminator: {
        propertyName: 'type',
        mapping: { lab: '#/components/schemas/Lab', poodle: '#/components/schemas/Poodle' },
      },
    }),
    'components/schemas/Lab': entry('components/schemas/Lab', { type: 'object' }),
    'components/schemas/Poodle': entry('components/schemas/Poodle', { type: 'object' }),
    'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object' }),
  });

  it('lists only the inner variant whose value matches the outer one', () => {
    const leaves = findSchemaVariantLeaves(
      'components/schemas/Animal',
      animalStore({
        lab: '#/components/schemas/Dog',
        poodle: '#/components/schemas/Dog',
        cat: '#/components/schemas/Cat',
      }),
    );

    expect(leaves?.map((leaf) => [leaf.label, leaf.schemaId])).toEqual([
      ['lab', 'components/schemas/Lab'],
      ['poodle', 'components/schemas/Poodle'],
      ['cat', 'components/schemas/Cat'],
    ]);
  });

  it('keeps every inner variant when the outer value names none of them', () => {
    const leaves = findSchemaVariantLeaves(
      'components/schemas/Animal',
      animalStore({ dog: '#/components/schemas/Dog', cat: '#/components/schemas/Cat' }),
    );

    expect(leaves?.map((leaf) => leaf.label)).toEqual(['dog / lab', 'dog / poodle', 'cat']);
  });

  it('selects the reachable inner variant when only the outer value is picked', () => {
    const leaves = findSchemaVariantLeaves(
      'components/schemas/Animal',
      animalStore({
        lab: '#/components/schemas/Dog',
        poodle: '#/components/schemas/Dog',
        cat: '#/components/schemas/Cat',
      }),
    );

    expect(leaves?.[resolveActiveVariantLeafIndex(leaves, { type: 1 })]?.schemaId).toBe(
      'components/schemas/Poodle',
    );
  });

  it('keeps the inner default mapping when the outer value is not an inner key', () => {
    const store = animalStore({
      lab: '#/components/schemas/Dog',
      poodle: '#/components/schemas/Dog',
      cat: '#/components/schemas/Cat',
    });
    store['components/schemas/Dog'].data.discriminator = {
      propertyName: 'type',
      mapping: { lab: '#/components/schemas/Lab' },
      defaultMapping: '#/components/schemas/Poodle',
    };

    const leaves = findSchemaVariantLeaves('components/schemas/Animal', store);

    expect(leaves?.map((leaf) => [leaf.label, leaf.schemaId])).toEqual([
      ['lab', 'components/schemas/Lab'],
      ['poodle', 'components/schemas/Poodle'],
      ['cat', 'components/schemas/Cat'],
    ]);
  });

  it('labels both levels when nested discriminators use different properties', () => {
    const store = animalStore({ dog: '#/components/schemas/Dog', cat: '#/components/schemas/Cat' });
    store['components/schemas/Dog'].data.discriminator = {
      propertyName: 'breed',
      mapping: { dog: '#/components/schemas/Lab', poodle: '#/components/schemas/Poodle' },
    };

    const leaves = findSchemaVariantLeaves('components/schemas/Animal', store);

    expect(leaves?.map((leaf) => leaf.label)).toEqual(['dog / dog', 'dog / poodle', 'cat']);
  });

  it('keeps every inner variant under an outer option without a value', () => {
    const store = animalStore({ cat: '#/components/schemas/Cat' });
    store['components/schemas/Animal'].data.discriminator = {
      propertyName: 'type',
      mapping: { cat: '#/components/schemas/Cat' },
      defaultMapping: '#/components/schemas/Dog',
    };
    store['components/schemas/Dog'].data.discriminator = {
      propertyName: 'type',
      mapping: { lab: '#/components/schemas/Lab' },
      defaultMapping: '#/components/schemas/Poodle',
    };

    const leaves = findSchemaVariantLeaves('components/schemas/Animal', store);

    expect(leaves?.map((leaf) => [leaf.label, leaf.schemaId])).toEqual([
      ['cat', 'components/schemas/Cat'],
      ['Default mapping / lab', 'components/schemas/Lab'],
      ['Default mapping / Default mapping', 'components/schemas/Poodle'],
    ]);
  });

  it('stamps only the inner value when the outer value names no inner variant', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: animalStore({
        dog: '#/components/schemas/Dog',
        cat: '#/components/schemas/Cat',
      }),
    });

    expect(resolved['components/schemas/Animal']).toEqual({
      type: 'object',
      allOf: [{ type: 'object' }, { properties: { type: { enum: ['lab'] } } }],
    });
  });
});

describe('applyActiveVariantsToStore (variant property referencing part of the host)', () => {
  const store = (kind: Record<string, unknown>): Record<string, SchemaEntry> => ({
    'components/schemas/Drink': entry('components/schemas/Drink', {
      type: 'object',
      properties: { kind: { type: 'string' } },
      oneOf: [{ $ref: '#/components/schemas/Coffee' }, { $ref: '#/components/schemas/Tea' }],
      discriminator: {
        propertyName: 'kind',
        mapping: { coffee: '#/components/schemas/Coffee', tea: '#/components/schemas/Tea' },
      },
    }),
    'components/schemas/Coffee': entry('components/schemas/Coffee', {
      type: 'object',
      properties: { kind, shots: { type: 'integer' } },
    }),
    'components/schemas/Tea': entry('components/schemas/Tea', {
      type: 'object',
      properties: { kind, leaf: { type: 'string' } },
    }),
  });

  it('stamps the mapping key when kind refs the host property', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: store({ $ref: '#/components/schemas/Drink/properties/kind' }),
      activeDiscriminator: { kind: 1 },
    });

    expect(JSON.stringify(resolved['components/schemas/Drink'])).toContain('"enum":["tea"]');
  });

  it('keeps a const two ref hops away instead of the mapping key', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        ...store({ $ref: '#/components/schemas/Kinds/properties/tea' }),
        'components/schemas/Kinds': entry('components/schemas/Kinds', {
          properties: { tea: { $ref: '#/components/schemas/Green' } },
        }),
        'components/schemas/Green': entry('components/schemas/Green', { const: 'green' }),
      },
      activeDiscriminator: { kind: 1 },
    });

    expect(JSON.stringify(resolved['components/schemas/Drink'])).not.toContain('"enum":[');
  });

  it('stamps the mapping key when a two-hop ref ends in a plain schema', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        ...store({ $ref: '#/components/schemas/Kinds/properties/tea' }),
        'components/schemas/Kinds': entry('components/schemas/Kinds', {
          properties: { tea: { $ref: '#/components/schemas/Plain' } },
        }),
        'components/schemas/Plain': entry('components/schemas/Plain', { type: 'string' }),
      },
      activeDiscriminator: { kind: 1 },
    });

    expect(JSON.stringify(resolved['components/schemas/Drink'])).toContain('"enum":["tea"]');
  });

  it('decodes ~1 in a pointer segment', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        ...store({ $ref: '#/components/schemas/Kinds/properties/a~1b' }),
        'components/schemas/Kinds': entry('components/schemas/Kinds', {
          properties: { 'a/b': { type: 'string' } },
        }),
      },
      activeDiscriminator: { kind: 1 },
    });

    expect(JSON.stringify(resolved['components/schemas/Drink'])).toContain('"enum":["tea"]');
  });

  it('does not loop on a self-referencing ref', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        ...store({ $ref: '#/components/schemas/Loop' }),
        'components/schemas/Loop': entry('components/schemas/Loop', {
          $ref: '#/components/schemas/Loop',
        }),
      },
      activeDiscriminator: { kind: 1 },
    });

    expect(resolved['components/schemas/Drink']).toBeDefined();
  });

  it('points a ref into the rewritten host at an untouched copy of it', () => {
    const original = store({})['components/schemas/Drink'].data;
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        ...store({ $ref: '#/components/schemas/Drink/properties/kind' }),
        'components/schemas/Tea': entry('components/schemas/Tea', {
          allOf: [
            { $ref: '#/components/schemas/Drink' },
            {
              type: 'object',
              properties: {
                kind: { $ref: '#/components/schemas/Drink/properties/kind' },
                leaf: { type: 'string' },
              },
            },
          ],
        }),
      },
      activeDiscriminator: { kind: 1 },
    });

    expect(resolved['components/schemas/__original__Drink']).toEqual(original);
    expect(JSON.stringify(resolved['components/schemas/Drink'])).toContain(
      '"$ref":"#/components/schemas/__original__Drink/properties/kind"',
    );
    expect(JSON.stringify(resolved['components/schemas/Drink'])).not.toContain(
      '"$ref":"#/components/schemas/Drink/properties/kind"',
    );
  });

  it('keeps stamping the mapping key behind a whole-schema alias', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        ...store({ $ref: '#/components/schemas/KindAlias' }),
        'components/schemas/KindAlias': entry('components/schemas/KindAlias', {
          $ref: '#/components/schemas/Kind',
        }),
        'components/schemas/Kind': entry('components/schemas/Kind', {
          type: 'string',
          enum: ['hot', 'cold'],
        }),
      },
      activeDiscriminator: { kind: 1 },
    });

    expect(JSON.stringify(resolved['components/schemas/Drink'])).toContain('"enum":["tea"]');
  });

  it('does not read a schema with keywords next to its $ref as an alias', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        ...store({ $ref: '#/components/schemas/Kinds/properties/tea' }),
        'components/schemas/Kinds': entry('components/schemas/Kinds', {
          properties: { tea: { $ref: '#/components/schemas/Green', enum: ['tea'] } },
        }),
        'components/schemas/Green': entry('components/schemas/Green', { const: 'green' }),
      },
      activeDiscriminator: { kind: 1 },
    });

    expect(JSON.stringify(resolved['components/schemas/Drink'])).toContain('"enum":["tea"]');
  });

  it('adds no copy when no ref points inside a rewritten host', () => {
    const resolved = applyActiveVariantsToStore({
      schemaStore: store({ type: 'string' }),
      activeDiscriminator: { kind: 1 },
    });

    expect(Object.keys(resolved).some((id) => id.includes('__original__'))).toBe(false);
  });

  it('points only the refs a collapsed inline oneOf no longer holds at an untouched copy', () => {
    const shape = {
      type: 'object',
      properties: { kind: { type: 'string' } },
      oneOf: [
        { properties: { a: { type: 'string' } } },
        { properties: { b: { type: 'integer' } } },
      ],
    };
    const resolved = applyActiveVariantsToStore({
      schemaStore: {
        'components/schemas/Shape': entry('components/schemas/Shape', shape),
        'components/schemas/Pointer': entry('components/schemas/Pointer', {
          type: 'object',
          properties: {
            kind: { $ref: '#/components/schemas/Shape/properties/kind' },
            b: { $ref: '#/components/schemas/Shape/oneOf/1/properties/b' },
          },
        }),
      },
    });

    expect(resolved['components/schemas/__original__Shape']).toEqual(shape);
    expect(resolved['components/schemas/Pointer'].properties).toEqual({
      kind: { $ref: '#/components/schemas/Shape/properties/kind' },
      b: { $ref: '#/components/schemas/__original__Shape/oneOf/1/properties/b' },
    });
  });
});
