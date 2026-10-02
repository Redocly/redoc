import { describe, it, expect } from 'vitest';
import { schemaKind } from '../../../types/common.js';

import {
  applyActiveVariantsToSchema,
  applyActiveVariantsToStore,
  applyDiscriminatorValue,
  collectNestedVariantAxes,
  findEffectiveDiscriminator,
  findSchemaVariantAxis,
  hoistActiveVariantSchemaForSampling,
  resolveActiveVariantIndex,
  resolveActiveVariantSchemaId,
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
    expect(
      findEffectiveDiscriminator({ allOf: [{ $ref: '#/a' }] } as Record<string, unknown>, store),
    ).toBeUndefined();
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

describe('resolveActiveVariantSchemaId', () => {
  const store: Record<string, SchemaEntry> = {
    body: entry('body', {
      oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
    }),
    'components/schemas/Cat': entry('components/schemas/Cat', { title: 'Cat' }),
    'components/schemas/Dog': entry('components/schemas/Dog', { title: 'Dog' }),
  };

  it('returns the input id when the schema has no variant axis', () => {
    const plainStore: Record<string, SchemaEntry> = {
      plain: entry('plain', { type: 'object' }),
    };
    expect(resolveActiveVariantSchemaId('plain', plainStore)).toBe('plain');
  });

  it('returns the first variant id when no selection is made', () => {
    expect(resolveActiveVariantSchemaId('body', store)).toBe('components/schemas/Cat');
  });

  it('returns the variant id at the selected index', () => {
    expect(resolveActiveVariantSchemaId('body', store, undefined, { 'One of:': 1 })).toBe(
      'components/schemas/Dog',
    );
  });

  it('accepts a single nested oneOf key as fallback for root oneOf resolution', () => {
    expect(resolveActiveVariantSchemaId('body', store, undefined, { 'payload/One of:': 1 })).toBe(
      'components/schemas/Dog',
    );
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

  it('resolveActiveVariantSchemaId still returns body id (does NOT drill into nested oneOf)', () => {
    const store = makeNestedTaxStore();
    expect(resolveActiveVariantSchemaId('body', store)).toBe('body');
    expect(resolveActiveVariantSchemaId('body', store, undefined, { 'tax/One of:': 1 })).toBe(
      'body',
    );
  });

  it('hoistActiveVariantSchemaForSampling returns undefined for a body that has no root variant axis', () => {
    const store = makeNestedTaxStore();
    expect(hoistActiveVariantSchemaForSampling('body', store)).toBeUndefined();
  });

  it('applyActiveVariantsToStore preserves the body schema unchanged', () => {
    const store = makeNestedTaxStore();
    const resolved = applyActiveVariantsToStore(store);
    expect(resolved.body).toStrictEqual(store.body.data);
  });
});

describe('hoistActiveVariantSchemaForSampling', () => {
  it('reports the selected mapping key so the sampler can stamp it', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: { method: { type: 'string' } },
        discriminator: {
          propertyName: 'method',
          mapping: {
            ApplePay: '#/components/schemas/ApplePay',
            Fallback: '#/components/schemas/UnknownWallet',
          },
          defaultMapping: '#/components/schemas/UnknownWallet',
        },
      }),
      'components/schemas/ApplePay': entry('components/schemas/ApplePay', { title: 'ApplePay' }),
      'components/schemas/UnknownWallet': entry('components/schemas/UnknownWallet', {
        title: 'UnknownWallet',
      }),
    };

    // options are [ApplePay, Fallback, Default mapping]; pick Fallback
    const hoisted = hoistActiveVariantSchemaForSampling('body', store, { method: 1 });

    expect(hoisted?.variantSchemaId).toBe('components/schemas/UnknownWallet');
    expect(hoisted?.mappingKey).toBe('Fallback');

    // 'Default mapping' points at the same schema but carries no outgoing value
    const asDefault = hoistActiveVariantSchemaForSampling('body', store, { method: 2 });
    expect(asDefault?.variantSchemaId).toBe('components/schemas/UnknownWallet');
    expect(asDefault?.mappingKey).toBeUndefined();
  });

  it('reads from activeOneOf for plain oneOf bodies', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { title: 'Dog' }),
    };

    const result = hoistActiveVariantSchemaForSampling('body', store, undefined, {
      'One of:': 1,
    });
    expect(result?.variantSchemaId).toBe('components/schemas/Dog');
  });

  it('reads from activeOneOf for plain anyOf bodies', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        anyOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { title: 'Dog' }),
    };

    const result = hoistActiveVariantSchemaForSampling('body', store, undefined, {
      'Any of:': 1,
    });
    expect(result?.variantSchemaId).toBe('components/schemas/Dog');
  });

  it('reads from activeDiscriminator for discriminator bodies', () => {
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
      'components/schemas/Cat': entry('components/schemas/Cat', { title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { title: 'Dog' }),
    };

    const result = hoistActiveVariantSchemaForSampling('body', store, { kind: 1 });
    expect(result?.variantSchemaId).toBe('components/schemas/Dog');
  });

  it('keeps root oneOf sibling properties when variants are $ref ids', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: { common: { type: 'string' } },
        required: ['common'],
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', {
        type: 'object',
        title: 'Cat',
        properties: { meow: { type: 'string' } },
      }),
      'components/schemas/Dog': entry('components/schemas/Dog', {
        type: 'object',
        title: 'Dog',
        properties: { bark: { type: 'string' } },
      }),
    };

    const result = hoistActiveVariantSchemaForSampling('body', store);

    expect(result?.variantSchemaId).toBe('components/schemas/Cat');
    expect(result?.schema).toEqual({
      type: 'object',
      title: 'Cat',
      properties: { meow: { type: 'string' } },
      allOf: [{ type: 'object', properties: { common: { type: 'string' } }, required: ['common'] }],
    });
  });

  it('keeps root anyOf sibling properties when variants are $ref ids', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        type: 'object',
        properties: { common: { type: 'string' } },
        required: ['common'],
        anyOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', {
        type: 'object',
        title: 'Cat',
        properties: { meow: { type: 'string' } },
      }),
      'components/schemas/Dog': entry('components/schemas/Dog', {
        type: 'object',
        title: 'Dog',
        properties: { bark: { type: 'string' } },
      }),
    };

    const result = hoistActiveVariantSchemaForSampling('body', store);

    expect(result?.variantSchemaId).toBe('components/schemas/Cat');
    expect(result?.schema).toEqual({
      type: 'object',
      title: 'Cat',
      properties: { meow: { type: 'string' } },
      allOf: [{ type: 'object', properties: { common: { type: 'string' } }, required: ['common'] }],
    });
  });

  it('hoists the first anyOf variant when variants are wrapped in allOf', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        allOf: [
          { type: 'object', properties: { common: { type: 'string' } } },
          {
            anyOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
          },
        ],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', {
        type: 'object',
        title: 'Cat',
        properties: { meow: { type: 'string' } },
      }),
      'components/schemas/Dog': entry('components/schemas/Dog', {
        type: 'object',
        title: 'Dog',
        properties: { bark: { type: 'string' } },
      }),
    };

    const result = hoistActiveVariantSchemaForSampling('body', store);

    expect(result?.variantSchemaId).toBe('components/schemas/Cat');
    expect(result?.schema).toEqual({
      type: 'object',
      title: 'Cat',
      properties: { meow: { type: 'string' } },
      allOf: [{ type: 'object', properties: { common: { type: 'string' } } }],
    });
  });
});

describe('applyActiveVariantsToStore', () => {
  it('returns the original data for schemas with no variant axis', () => {
    const store: Record<string, SchemaEntry> = {
      plain: entry('plain', { type: 'object', properties: { x: { type: 'string' } } }),
    };

    const resolved = applyActiveVariantsToStore(store);

    expect(resolved.plain).toStrictEqual(store.plain.data);
  });

  it('does not throw when an entry has no data (e.g. stripped by the platform)', () => {
    const store: Record<string, SchemaEntry> = {
      plain: entry('plain', { type: 'object' }),
      restricted: { id: 'restricted', kind: schemaKind.JSON_SCHEMA } as unknown as SchemaEntry,
    };

    expect(() => applyActiveVariantsToStore(store)).not.toThrow();
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

    const resolved = applyActiveVariantsToStore(store, { kind: 1 });

    // The inlined variant is wrapped in allOf with an `enum` chunk so the
    // sampler emits the mapping key for the discriminator property. The first
    // allOf entry is the variant body itself. The host's top-level `type` is
    // preserved so the sampler's circular-$ref fallback samples back-references
    // into the host as `{}` (legacy parity), not `null`.
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
    const kittySelected = applyActiveVariantsToStore(store, { defType: 0 }, {});
    expect(kittySelected.body.allOf).toContainEqual({
      properties: { defType: { enum: ['kitty'] } },
    });

    const defaultSelected = applyActiveVariantsToStore(store, { defType: 2 }, {});
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

    const resolved = applyActiveVariantsToStore(store, { vehicleType: 1 }, {});

    expect(resolved['components/schemas/Vehicle'].properties).toHaveProperty('doors');
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

    const resolved = applyActiveVariantsToStore(store, {}, { 'One of:': 1 });

    expect(resolved['components/schemas/Vehicle'].properties).toHaveProperty('gears');
  });

  it('rewrites root oneOf schemas to the selected variant body', () => {
    const store: Record<string, SchemaEntry> = {
      body: entry('body', {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      }),
      'components/schemas/Cat': entry('components/schemas/Cat', { type: 'object', title: 'Cat' }),
      'components/schemas/Dog': entry('components/schemas/Dog', { type: 'object', title: 'Dog' }),
    };

    const resolved = applyActiveVariantsToStore(store, undefined, { 'One of:': 1 });

    expect(resolved.body).toEqual({ type: 'object', title: 'Dog' });
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

    applyActiveVariantsToStore(store, undefined, { 'One of:': 1 });

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

    const resolved = applyActiveVariantsToStore(store);

    const hostResolved = resolved['components/schemas/GatewayAccount'] as Record<string, unknown>;
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

    const resolved = applyActiveVariantsToStore(store);
    const bodyResolved = resolved.body as Record<string, unknown>;
    const allOf = bodyResolved.allOf as Array<Record<string, unknown>>;

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

    const resolved = applyActiveVariantsToStore(store, undefined, { 'Any of:': 1 });

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

    const resolved = applyActiveVariantsToStore(store);

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

    const resolved = applyActiveVariantsToStore(store);
    const bodyResolved = resolved.body as Record<string, unknown>;
    const allOf = bodyResolved.allOf as Array<Record<string, unknown>>;

    expect(allOf[0]).not.toHaveProperty('$ref');
    expect(allOf[0]).toMatchObject({
      type: 'object',
      properties: { kind: { type: 'string' } },
    });
    expect(allOf[0]).not.toHaveProperty('anyOf');
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

    const resolved = applyActiveVariantsToStore(store, undefined, {
      'One of:': 1,
      'Any of:': 1,
    });

    expect(resolved.body).toEqual({ type: 'object', title: 'Dog' });
  });
});

describe('applyDiscriminatorValue', () => {
  function hostStore(discExtras: Record<string, unknown> = {}): Record<string, SchemaEntry> {
    return {
      'components/schemas/Wallet': entry('components/schemas/Wallet', {
        type: 'object',
        properties: { method: { type: 'string' } },
        discriminator: {
          propertyName: 'method',
          mapping: {
            ApplePay: '#/components/schemas/ApplePay',
            GooglePay: '#/components/schemas/GooglePay',
          },
          ...discExtras,
        },
      }),
      'components/schemas/ApplePay': entry('components/schemas/ApplePay', {}),
      'components/schemas/GooglePay': entry('components/schemas/GooglePay', {}),
      'components/schemas/UnknownWallet': entry('components/schemas/UnknownWallet', {}),
    };
  }

  it('stamps the mapping key when the variant matches a regular mapping entry', () => {
    const sample: Record<string, unknown> = { method: 'string' };
    applyDiscriminatorValue(sample, 'components/schemas/ApplePay', hostStore());
    expect(sample.method).toBe('ApplePay');
  });

  it('leaves the sample untouched when the variant matches no mapping entry', () => {
    const sample: Record<string, unknown> = { method: 'string' };
    applyDiscriminatorValue(sample, 'components/schemas/UnknownWallet', hostStore());
    expect(sample.method).toBe('string');
  });

  it('leaves the sample untouched when the variant is the defaultMapping target (OAS 3.2)', () => {
    const sample: Record<string, unknown> = { method: 'string' };
    const store = hostStore({ defaultMapping: '#/components/schemas/UnknownWallet' });
    applyDiscriminatorValue(sample, 'components/schemas/UnknownWallet', store);
    expect(sample.method).toBe('string');
  });

  it('does NOT stamp a regular mapping key when the variant ALSO appears as defaultMapping target', () => {
    // Same schema is reachable both via a regular mapping key and defaultMapping.
    // Without a selected mapping key the caller is the "Default mapping" option,
    // which has no canonical outgoing value — so nothing is stamped. The
    // selected-key case is covered by the two tests below.
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Wallet': entry('components/schemas/Wallet', {
        type: 'object',
        properties: { method: { type: 'string' } },
        discriminator: {
          propertyName: 'method',
          mapping: {
            ApplePay: '#/components/schemas/ApplePay',
            Fallback: '#/components/schemas/UnknownWallet',
          },
          defaultMapping: '#/components/schemas/UnknownWallet',
        },
      }),
      'components/schemas/ApplePay': entry('components/schemas/ApplePay', {}),
      'components/schemas/UnknownWallet': entry('components/schemas/UnknownWallet', {}),
    };

    const sample: Record<string, unknown> = { method: 'string' };
    applyDiscriminatorValue(sample, 'components/schemas/UnknownWallet', store);
    expect(sample.method).toBe('string');
  });

  it('stamps the selected mapping key even when that schema is also the defaultMapping target', () => {
    const store = hostStore({
      mapping: {
        ApplePay: '#/components/schemas/ApplePay',
        Fallback: '#/components/schemas/UnknownWallet',
      },
      defaultMapping: '#/components/schemas/UnknownWallet',
    });

    const sample: Record<string, unknown> = { method: 'string' };
    applyDiscriminatorValue(sample, 'components/schemas/UnknownWallet', store, 'Fallback');
    expect(sample.method).toBe('Fallback');
  });

  it('leaves the placeholder when the selected key does not map to the sampled variant', () => {
    const sample: Record<string, unknown> = { method: 'string' };
    applyDiscriminatorValue(sample, 'components/schemas/GooglePay', hostStore(), 'ApplePay');
    expect(sample.method).toBe('string');
  });

  it('does nothing when the host propertyName is not in the sample', () => {
    const sample: Record<string, unknown> = { other: 'x' };
    applyDiscriminatorValue(sample, 'components/schemas/ApplePay', hostStore());
    expect(sample).toEqual({ other: 'x' });
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
    const collapsed = applyActiveVariantsToSchema(bodyWithNestedOneOf(), {});

    expect((collapsed.properties as Record<string, unknown>).metadata).toEqual({
      description: 'Arbitrary metadata',
      type: 'null',
    });
  });

  it('collapses a nested inline oneOf to the selected branch', () => {
    const collapsed = applyActiveVariantsToSchema(bodyWithNestedOneOf(), {}, undefined, {
      'metadata/One of:': 1,
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

    const collapsed = applyActiveVariantsToSchema(schema, {}, undefined, {
      'events[]/One of:': 1,
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

    const collapsed = applyActiveVariantsToSchema(schema, {});

    expect((collapsed.properties as Record<string, unknown>).actor).toEqual({ type: 'null' });
  });

  it('does not descend into $ref nodes (their store entries are collapsed separately)', () => {
    const schema = {
      type: 'object',
      properties: { pet: { $ref: '#/components/schemas/Pet' } },
    };

    const collapsed = applyActiveVariantsToSchema(schema, {}, undefined, { 'pet/One of:': 1 });

    expect(collapsed).toEqual(schema);
  });

  it('leaves discriminator nodes to the store-level rewrite', () => {
    const store = makeStore();
    const host = store['components/schemas/MenuItem'].data;

    const collapsed = applyActiveVariantsToSchema({ ...host }, store, undefined, {
      'itemType/One of:': 1,
    });

    expect(collapsed).toEqual(host);
  });

  it('does not mutate the input schema', () => {
    const schema = bodyWithNestedOneOf();

    applyActiveVariantsToSchema(schema, {}, undefined, { 'metadata/One of:': 1 });

    expect(schema).toEqual(bodyWithNestedOneOf());
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

    const resolved = applyActiveVariantsToStore(store, undefined, { 'actor/One of:': 1 });

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
    const resolved = applyActiveVariantsToStore(accountsStore(), {
      'InvestmentDetails/Items[]/Type': 1,
    });

    expect(collapsedItems(resolved)).toEqual({
      allOf: [
        { $ref: '#/components/schemas/BankAccountDetail' },
        { properties: { Type: { enum: ['BankAccountDetail'] } } },
      ],
    });
  });

  it('collapses to the first mapping option with its value stamped when nothing is selected', () => {
    const resolved = applyActiveVariantsToStore(accountsStore());

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

    const resolved = applyActiveVariantsToStore(store, { 'InvestmentDetails/Items[]/Type': 1 });

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
    const resolved = applyActiveVariantsToStore(store, { 'InvestmentDetails/Items[]/Type': 1 });

    expect(collapsedItems(resolved)).toEqual({
      allOf: [{ $ref: '#/components/schemas/BankAccountDetail' }],
    });
  });

  it('collapses a mapping-less inline discriminator over $ref variants without stamping', () => {
    const store = accountsStore({
      oneOf: [
        { $ref: '#/components/schemas/HoldingAccountDetail' },
        { $ref: '#/components/schemas/BankAccountDetail' },
      ],
      discriminator: { propertyName: 'Type' },
    });

    const resolved = applyActiveVariantsToStore(store, { 'InvestmentDetails/Items[]/Type': 1 });

    expect(collapsedItems(resolved)).toEqual({
      allOf: [{ $ref: '#/components/schemas/BankAccountDetail' }],
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

    const resolved = applyActiveVariantsToStore(store, { 'InvestmentDetails/Items[]/Type': 1 });

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

    const resolved = applyActiveVariantsToStore(store);

    // Option 0 maps to the host itself: pass 1 keeps the entry as-is, and the
    // nested collapse must not turn the root into a self-$ref wrapper.
    expect(resolved['components/schemas/OneOfDiscA']).toEqual(selfListed);
  });
});

describe('hoistActiveVariantSchemaForSampling (oneOf nested in a oneOf variant)', () => {
  const store: Record<string, SchemaEntry> = {
    'components/schemas/OtpVerified': entry('components/schemas/OtpVerified', {
      type: 'object',
      properties: { message: { type: 'string' } },
    }),
    'components/schemas/OtpFailed': entry('components/schemas/OtpFailed', {
      type: 'object',
      properties: { sessionId: { type: 'string' } },
    }),
    'components/schemas/Answers': entry('components/schemas/Answers', { type: 'object' }),
    'components/schemas/Otp': entry('components/schemas/Otp', {
      oneOf: [
        { $ref: '#/components/schemas/OtpVerified' },
        { $ref: '#/components/schemas/OtpFailed' },
      ],
    }),
    body: entry('body', {
      oneOf: [{ $ref: '#/components/schemas/Otp' }, { $ref: '#/components/schemas/Answers' }],
    }),
  };

  it('hoists the active leaf, not the parent sibling at the nested index', () => {
    const result = hoistActiveVariantSchemaForSampling('body', store, undefined, {
      '&oneof=0/One of:': 1,
    });
    expect(result?.variantSchemaId).toBe('components/schemas/OtpFailed');
  });

  it('hoists the parent variant when the nested options are inline', () => {
    const inlineStore = {
      ...store,
      'components/schemas/Otp': entry('components/schemas/Otp', {
        oneOf: [{ type: 'object' }, { type: 'string' }],
      }),
    };
    const result = hoistActiveVariantSchemaForSampling('body', inlineStore, undefined, {
      '&oneof=0/One of:': 1,
    });
    expect(result?.variantSchemaId).toBe('components/schemas/Otp');
  });
});
