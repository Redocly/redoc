import { describe, expect, it } from 'vitest';
import { createStore } from 'jotai';
import { schemaKind } from '../../types/common.js';

import type { SchemaEntry } from '../../types/store.js';

import { buildExampleAtomKey, generatedExampleAtom, itemSpecForSamplerAtom } from '../examples.js';
import { globalStoreAtom } from '../store.js';
import { itemStoreAtom } from '../itemStore.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';

const ITEM_ID = 'op-createTrip';
const OTHER_ITEM_ID = 'op-otherOperation';

const bodyId = 'components/schemas/CreateTripRequest';
const filterId = 'components/schemas/TripFilter';
const dateFilterId = 'components/schemas/DateFilter';
const priceFilterId = 'components/schemas/PriceFilter';

function makeNestedDiscriminatorStore(): Record<string, SchemaEntry> {
  return {
    [bodyId]: {
      id: bodyId,
      kind: schemaKind.JSON_SCHEMA,
      data: {
        type: 'object',
        required: ['tripFilters'],
        properties: {
          tripFilters: {
            type: 'array',
            items: { $ref: `#/${filterId}` },
          },
        },
      },
    },
    [filterId]: {
      id: filterId,
      kind: schemaKind.JSON_SCHEMA,
      data: {
        type: 'object',
        required: ['filterType'],
        discriminator: {
          propertyName: 'filterType',
          mapping: {
            DATE: `#/${dateFilterId}`,
            PRICE: `#/${priceFilterId}`,
          },
        },
        oneOf: [{ $ref: `#/${dateFilterId}` }, { $ref: `#/${priceFilterId}` }],
      },
    },
    [dateFilterId]: {
      id: dateFilterId,
      kind: schemaKind.JSON_SCHEMA,
      data: {
        type: 'object',
        required: ['filterType', 'from', 'to'],
        properties: {
          filterType: { type: 'string', default: 'DATE' },
          from: { type: 'string', format: 'date' },
          to: { type: 'string', format: 'date' },
        },
      },
    },
    [priceFilterId]: {
      id: priceFilterId,
      kind: schemaKind.JSON_SCHEMA,
      data: {
        type: 'object',
        required: ['filterType', 'maxPrice'],
        properties: {
          filterType: { type: 'string', default: 'PRICE' },
          maxPrice: { type: 'number' },
        },
      },
    },
  };
}

function setupStore({
  schemaStore,
  itemId,
  activeDiscriminator,
  activeOneOf,
  onlyRequiredInSamples,
}: {
  schemaStore: Record<string, SchemaEntry>;
  itemId?: string;
  activeDiscriminator?: Record<string, number>;
  activeOneOf?: Record<string, number>;
  onlyRequiredInSamples?: boolean;
}) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: { schemaStore, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
      onlyRequiredInSamples,
    }),
  });
  if (itemId && (activeDiscriminator || activeOneOf)) {
    jotaiStore.set(itemStoreAtom(itemId), {
      activeDiscriminator: activeDiscriminator ?? {},
      activeOneOf: activeOneOf ?? {},
    });
  }
  return jotaiStore;
}

describe('buildExampleAtomKey', () => {
  it('includes itemId so two items get distinct keys', () => {
    const a = buildExampleAtomKey('s1', 'request', 'application/json', 'item-a');
    const b = buildExampleAtomKey('s1', 'request', 'application/json', 'item-b');
    expect(a).not.toBe(b);
  });

  it('produces a stable key for the same inputs', () => {
    const a = buildExampleAtomKey('s1', 'response', 'application/json', 'item-x');
    const b = buildExampleAtomKey('s1', 'response', 'application/json', 'item-x');
    expect(a).toBe(b);
  });

  it('treats empty itemId as the default bucket', () => {
    const explicit = buildExampleAtomKey('s1', undefined, undefined, '');
    const omitted = buildExampleAtomKey('s1');
    expect(explicit).toBe(omitted);
    expect(JSON.parse(explicit)).toMatchObject({ itemId: '', schemaId: 's1' });
  });

  it('returns an empty key for an empty schemaId so the atom short-circuits', () => {
    expect(buildExampleAtomKey('')).toBe('');
    expect(buildExampleAtomKey('', 'request', 'application/json', 'item-a')).toBe('');
  });

  it('survives itemIds that contain the legacy "::" separator without collision', () => {
    const a = buildExampleAtomKey('s1', 'request', 'application/json', 'op::a');
    const b = buildExampleAtomKey('s1', 'request', 'application/json', 'op::b');
    expect(a).not.toBe(b);
    expect(JSON.parse(a)).toMatchObject({ itemId: 'op::a' });
    expect(JSON.parse(b)).toMatchObject({ itemId: 'op::b' });
  });
});

describe('itemSpecForSamplerAtom', () => {
  it('returns the default-variant stub when itemId is empty', () => {
    const store = setupStore({ schemaStore: makeNestedDiscriminatorStore() });
    const spec = store.get(itemSpecForSamplerAtom('')) as {
      components: { schemas: Record<string, unknown> };
    };
    expect(spec.components.schemas).toHaveProperty('CreateTripRequest');
    expect(spec.components.schemas).toHaveProperty('TripFilter');
  });

  it('reuses the default-variant stub when no selections are set for the item', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      itemId: ITEM_ID,
    });
    const itemSpec = store.get(itemSpecForSamplerAtom(ITEM_ID));
    const defaultSpec = store.get(itemSpecForSamplerAtom(''));
    expect(itemSpec).toBe(defaultSpec);
  });

  it('produces an item-scoped stub when selections exist', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      itemId: ITEM_ID,
      activeDiscriminator: { 'tripFilters[]/filterType': 1 },
    });
    const itemSpec = store.get(itemSpecForSamplerAtom(ITEM_ID));
    const defaultSpec = store.get(itemSpecForSamplerAtom(''));
    expect(itemSpec).not.toBe(defaultSpec);
  });

  it('isolates two items so selections in one do not leak into the other', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      itemId: ITEM_ID,
      activeDiscriminator: { 'tripFilters[]/filterType': 1 },
    });
    store.set(itemStoreAtom(OTHER_ITEM_ID), {
      activeDiscriminator: { 'tripFilters[]/filterType': 0 },
    });

    const specA = store.get(itemSpecForSamplerAtom(ITEM_ID));
    const specB = store.get(itemSpecForSamplerAtom(OTHER_ITEM_ID));
    expect(specA).not.toBe(specB);
  });
});

describe('generatedExampleAtom (per-item)', () => {
  it('samples the first nested variant by default', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      itemId: ITEM_ID,
    });
    const key = buildExampleAtomKey(bodyId, 'request', 'application/json', ITEM_ID);
    const sample = store.get(generatedExampleAtom(key)) as {
      tripFilters: Array<Record<string, unknown>>;
    };
    expect(sample.tripFilters[0].filterType).toBe('DATE');
  });

  it('samples the user-selected nested discriminator variant for this item', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      itemId: ITEM_ID,
      activeDiscriminator: { 'tripFilters[]/filterType': 1 },
    });
    const key = buildExampleAtomKey(bodyId, 'request', 'application/json', ITEM_ID);
    const sample = store.get(generatedExampleAtom(key)) as {
      tripFilters: Array<Record<string, unknown>>;
    };
    expect(sample.tripFilters[0].filterType).toBe('PRICE');
    expect(sample.tripFilters[0]).toHaveProperty('maxPrice');
  });

  it('keeps two items independent: changing one does not affect the other', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      itemId: ITEM_ID,
      activeDiscriminator: { 'tripFilters[]/filterType': 1 },
    });
    const keyA = buildExampleAtomKey(bodyId, 'request', 'application/json', ITEM_ID);
    const keyB = buildExampleAtomKey(bodyId, 'request', 'application/json', OTHER_ITEM_ID);

    const sampleA = store.get(generatedExampleAtom(keyA)) as {
      tripFilters: Array<Record<string, unknown>>;
    };
    const sampleB = store.get(generatedExampleAtom(keyB)) as {
      tripFilters: Array<Record<string, unknown>>;
    };

    expect(sampleA.tripFilters[0].filterType).toBe('PRICE');
    expect(sampleB.tripFilters[0].filterType).toBe('DATE');
  });

  it('returns undefined for empty paramKey instead of throwing', () => {
    const store = setupStore({ schemaStore: makeNestedDiscriminatorStore() });
    expect(store.get(generatedExampleAtom(''))).toBeUndefined();
  });

  it('returns undefined for a malformed (non-JSON) paramKey', () => {
    const store = setupStore({ schemaStore: makeNestedDiscriminatorStore() });
    expect(store.get(generatedExampleAtom('not-a-json-key'))).toBeUndefined();
  });
});

describe('generatedExampleAtom (streaming media types)', () => {
  const streamBodyId = 'components/schemas/StreamingBody';
  const userCreatedId = 'components/schemas/UserCreated';
  const userUpdatedId = 'components/schemas/UserUpdated';
  const userDeletedId = 'components/schemas/UserDeleted';

  function makeStreamingOneOfStore(): Record<string, SchemaEntry> {
    return {
      [streamBodyId]: {
        id: streamBodyId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          oneOf: [
            { $ref: `#/${userCreatedId}` },
            { $ref: `#/${userUpdatedId}` },
            { $ref: `#/${userDeletedId}` },
          ],
        },
      },
      [userCreatedId]: {
        id: userCreatedId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          required: ['type'],
          properties: {
            type: { type: 'string', enum: ['user_created'] },
            userId: { type: 'string', example: 'user_123' },
          },
        },
      },
      [userUpdatedId]: {
        id: userUpdatedId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          required: ['type'],
          properties: {
            type: { type: 'string', enum: ['user_updated'] },
            userId: { type: 'string', example: 'user_123' },
          },
        },
      },
      [userDeletedId]: {
        id: userDeletedId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          required: ['type'],
          properties: {
            type: { type: 'string', enum: ['user_deleted'] },
            userId: { type: 'string', example: 'user_123' },
          },
        },
      },
    };
  }

  it('fans a oneOf body out into one chunk per variant for JSONL', () => {
    const store = setupStore({
      schemaStore: makeStreamingOneOfStore(),
      itemId: ITEM_ID,
    });
    const key = buildExampleAtomKey(streamBodyId, 'response', 'application/jsonl', ITEM_ID);
    const sample = store.get(generatedExampleAtom(key));

    expect(typeof sample).toBe('string');
    const lines = (sample as string).split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain('"type":"user_created"');
    expect(lines[1]).toContain('"type":"user_updated"');
    expect(lines[2]).toContain('"type":"user_deleted"');
  });

  it('preserves the fan-out even when the item has unrelated variant selections', () => {
    const store = setupStore({
      schemaStore: makeStreamingOneOfStore(),
      itemId: ITEM_ID,
      // A selection that targets a different schema must not collapse the streaming fan-out.
      activeOneOf: { 'unrelated-axis': 1 },
    });
    const key = buildExampleAtomKey(streamBodyId, 'response', 'application/json-seq', ITEM_ID);
    const sample = store.get(generatedExampleAtom(key));

    expect(typeof sample).toBe('string');
    expect(sample).toContain('"type":"user_created"');
    expect(sample).toContain('"type":"user_updated"');
    expect(sample).toContain('"type":"user_deleted"');
  });

  it('falls back to a single sample when the body has no oneOf', () => {
    const noOneOfBodyId = 'components/schemas/PlainStreamBody';
    const store = setupStore({
      schemaStore: {
        [noOneOfBodyId]: {
          id: noOneOfBodyId,
          kind: schemaKind.JSON_SCHEMA,
          data: {
            type: 'object',
            properties: { id: { type: 'string', example: 'evt_1' } },
          },
        },
      },
      itemId: ITEM_ID,
    });
    const key = buildExampleAtomKey(noOneOfBodyId, 'response', 'application/jsonl', ITEM_ID);
    const sample = store.get(generatedExampleAtom(key));

    expect(typeof sample).toBe('string');
    // No oneOf → convertSampleToString repeats the single sample three times.
    const lines = (sample as string).split('\n');
    expect(lines).toHaveLength(3);
    expect(lines.every((line) => line === lines[0])).toBe(true);
  });
});

describe('generatedExampleAtom (onlyRequiredInSamples)', () => {
  const messageId = 'components/schemas/Message';
  const schemaStore: Record<string, SchemaEntry> = {
    [messageId]: {
      id: messageId,
      kind: schemaKind.JSON_SCHEMA,
      data: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', example: 'msg_1' },
          note: { type: 'string', example: 'optional' },
          secret: { type: 'string', writeOnly: true, example: 'hidden' },
          createdAt: { type: 'string', readOnly: true, example: '2024-01-01' },
        },
      },
    },
  };

  it('drops optional properties for a sample without a context', () => {
    const store = setupStore({ schemaStore, onlyRequiredInSamples: true });
    const key = buildExampleAtomKey(messageId, undefined, 'application/json', ITEM_ID);

    expect(store.get(generatedExampleAtom(key))).toEqual({ id: 'msg_1' });
  });

  it('keeps readOnly and writeOnly properties for a sample without a context', () => {
    const store = setupStore({ schemaStore });
    const key = buildExampleAtomKey(messageId, undefined, 'application/json', ITEM_ID);

    expect(store.get(generatedExampleAtom(key))).toEqual({
      id: 'msg_1',
      note: 'optional',
      secret: 'hidden',
      createdAt: '2024-01-01',
    });
  });

  it('keeps optional properties for a response sample', () => {
    const store = setupStore({ schemaStore, onlyRequiredInSamples: true });
    const key = buildExampleAtomKey(messageId, 'response', 'application/json', ITEM_ID);

    expect(store.get(generatedExampleAtom(key))).toEqual({
      id: 'msg_1',
      note: 'optional',
      createdAt: '2024-01-01',
    });
  });
});

describe('generatedExampleAtom discriminator host keywords', () => {
  const schema = (id: string, data: Record<string, unknown>): SchemaEntry => ({
    id,
    kind: schemaKind.JSON_SCHEMA,
    data,
  });
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const mapping = (...names: string[]) =>
    Object.fromEntries(names.map((name) => [name.toLowerCase(), ref(name).$ref]));
  const sample = (
    schemaStore: Record<string, SchemaEntry>,
    schemaId: string,
    activeDiscriminator: Record<string, number>,
    onlyRequiredInSamples?: boolean,
  ) =>
    setupStore({ schemaStore, itemId: ITEM_ID, activeDiscriminator, onlyRequiredInSamples }).get(
      generatedExampleAtom(buildExampleAtomKey(schemaId, 'request', 'application/json', ITEM_ID)),
    );

  const paymentStore = {
    'components/schemas/Payment': schema('components/schemas/Payment', {
      type: 'object',
      required: ['amount'],
      properties: { method: { type: 'string' }, amount: { type: 'number', example: 4.2 } },
      oneOf: [ref('Card')],
      discriminator: { propertyName: 'method', mapping: mapping('Card') },
    }),
    'components/schemas/Card': schema('components/schemas/Card', {
      type: 'object',
      properties: { last4: { type: 'string' }, related: ref('Payment') },
    }),
  };

  it('keeps the host fields for a variant that references the host below a property', () => {
    expect(sample(paymentStore, 'components/schemas/Payment', { method: 0 })).toEqual({
      method: 'card',
      amount: 4.2,
      last4: 'string',
      related: { method: 'string', amount: 4.2 },
    });
  });

  it('keeps required host fields and drops optional variant fields with only-required samples', () => {
    expect(sample(paymentStore, 'components/schemas/Payment', { method: 0 }, true)).toEqual({
      amount: 4.2,
    });
  });

  it('does not carry a host example into a variant that inherits the host', () => {
    const store = {
      'components/schemas/Pet': schema('components/schemas/Pet', {
        type: 'object',
        properties: { petType: { type: 'string' }, name: { type: 'string' } },
        example: { petType: 'cat', name: 'Tom', huntingSkill: 'lazy' },
        default: { petType: 'cat' },
        oneOf: [ref('Cat'), ref('Dog')],
        discriminator: { propertyName: 'petType', mapping: mapping('Cat', 'Dog') },
      }),
      'components/schemas/Cat': schema('components/schemas/Cat', {
        allOf: [ref('Pet'), { properties: { huntingSkill: { type: 'string' } } }],
      }),
      'components/schemas/Dog': schema('components/schemas/Dog', {
        allOf: [ref('Pet'), { properties: { packSize: { type: 'integer' } } }],
      }),
    };

    expect(sample(store, 'components/schemas/Pet', { petType: 1 })).toEqual({
      petType: 'dog',
      name: 'string',
      packSize: 0,
    });
  });

  const beverageStore = {
    'components/schemas/Order': schema('components/schemas/Order', {
      type: 'object',
      properties: { drink: ref('Beverage') },
    }),
    'components/schemas/Beverage': schema('components/schemas/Beverage', {
      type: 'object',
      oneOf: [ref('Coffee'), ref('Tea')],
      discriminator: { propertyName: 'kind', mapping: mapping('Coffee', 'Tea') },
    }),
    'components/schemas/Coffee': schema('components/schemas/Coffee', {
      type: 'object',
      oneOf: [ref('Latte'), ref('Espresso')],
      discriminator: { propertyName: 'style', mapping: mapping('Latte', 'Espresso') },
    }),
    'components/schemas/Tea': schema('components/schemas/Tea', {
      type: 'object',
      properties: { kind: { type: 'string' } },
    }),
    'components/schemas/Latte': schema('components/schemas/Latte', {
      type: 'object',
      properties: { kind: { type: 'string' }, style: { type: 'string' }, milk: { type: 'string' } },
    }),
    'components/schemas/Espresso': schema('components/schemas/Espresso', {
      type: 'object',
      properties: {
        kind: { type: 'string' },
        style: { type: 'string' },
        shots: { type: 'integer' },
      },
    }),
  };

  it('stamps every mapping key on the path of a nested discriminator variant', () => {
    expect(
      sample(beverageStore, 'components/schemas/Beverage', { kind: 0, '&d=0/style': 1 }),
    ).toEqual({ kind: 'coffee', style: 'espresso', shots: 0 });
  });

  it('follows a nested discriminator pick made below a property', () => {
    expect(
      sample(beverageStore, 'components/schemas/Order', {
        'drink/kind': 0,
        'drink&d=0/style': 1,
      }),
    ).toEqual({ drink: { kind: 'coffee', style: 'espresso', shots: 0 } });
  });
});
