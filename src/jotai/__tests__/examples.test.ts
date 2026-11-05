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
  generatedSamplesMaxDepth,
  specType = 'openapi',
  specVersion,
  convertedFrom,
}: {
  schemaStore: Record<string, SchemaEntry>;
  itemId?: string;
  activeDiscriminator?: Record<string, number>;
  activeOneOf?: Record<string, number>;
  onlyRequiredInSamples?: boolean;
  generatedSamplesMaxDepth?: number;
  specType?: 'openapi' | 'asyncapi';
  specVersion?: string;
  convertedFrom?: string;
}) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: {
      schemaStore,
      exampleStore: {},
      securitySchemeStore: {},
      specVersion,
      convertedFrom,
    },
    options: normalizeOptions({
      specType,
      downloadUrls: [],
      metadata: {},
      basePath: '',
      onlyRequiredInSamples,
      generatedSamplesMaxDepth,
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
  it('carries the document OpenAPI version', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      specVersion: '3.1.0',
    });
    expect(store.get(itemSpecForSamplerAtom('')).openapi).toBe('3.1.0');
  });

  it('keeps OpenAPI 3.0.0 for an AsyncAPI document', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      specType: 'asyncapi',
      specVersion: '2.6.0',
    });
    expect(store.get(itemSpecForSamplerAtom('')).openapi).toBe('3.0.0');
  });

  it('keeps OpenAPI 3.0.0 for a document converted from Swagger 2.0', () => {
    const store = setupStore({
      schemaStore: makeNestedDiscriminatorStore(),
      specVersion: '3.2.0',
      convertedFrom: '2.0',
    });
    expect(store.get(itemSpecForSamplerAtom('')).openapi).toBe('3.0.0');
  });

  it('falls back to OpenAPI 3.0.0 when the store has no version', () => {
    const store = setupStore({ schemaStore: makeNestedDiscriminatorStore() });
    expect(store.get(itemSpecForSamplerAtom('')).openapi).toBe('3.0.0');
  });

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

  describe('a back-reference to a host that only declares the variants', () => {
    const espressoWithRefill = schema('components/schemas/Espresso', {
      type: 'object',
      properties: {
        kind: { type: 'string' },
        style: { type: 'string' },
        shots: { type: 'integer' },
        refill: ref('Beverage'),
      },
    });

    it('samples the back-reference inside a nested variant as an object', () => {
      const store = { ...beverageStore, 'components/schemas/Espresso': espressoWithRefill };

      expect(
        sample(store, 'components/schemas/Beverage', { kind: 0, '&d=0/style': 1 }),
      ).toMatchObject({
        kind: 'coffee',
        style: 'espresso',
        refill: { kind: 'coffee', style: 'espresso', shots: 0 },
      });
    });

    it('samples the back-reference of an untyped host as an object', () => {
      const store = {
        'components/schemas/Beverage': schema('components/schemas/Beverage', {
          oneOf: [ref('Coffee'), ref('Tea')],
          discriminator: { propertyName: 'kind', mapping: mapping('Coffee', 'Tea') },
        }),
        'components/schemas/Coffee': schema('components/schemas/Coffee', {
          type: 'object',
          properties: { kind: { type: 'string' }, refill: ref('Beverage') },
        }),
        'components/schemas/Tea': schema('components/schemas/Tea', {
          type: 'object',
          properties: { kind: { type: 'string' } },
        }),
      };

      expect(sample(store, 'components/schemas/Beverage', { kind: 0 })).toMatchObject({
        kind: 'coffee',
        refill: { kind: 'coffee' },
      });
    });
  });

  describe('back-references to a host that has nothing to sample', () => {
    const untypedStore = (beverage: Record<string, unknown> = {}) => ({
      'components/schemas/Beverage': schema('components/schemas/Beverage', {
        ...beverage,
        oneOf: [ref('Coffee'), ref('Tea')],
        discriminator: { propertyName: 'kind', mapping: mapping('Coffee', 'Tea') },
      }),
      'components/schemas/Coffee': schema('components/schemas/Coffee', {
        type: 'object',
        properties: { kind: { type: 'string' }, refill: ref('Beverage') },
      }),
      'components/schemas/Tea': schema('components/schemas/Tea', {
        type: 'object',
        properties: { kind: { type: 'string' } },
      }),
      'components/schemas/Order': schema('components/schemas/Order', {
        type: 'array',
        items: ref('Beverage'),
      }),
    });

    it('samples the back-reference of a host that only adds required as an object', () => {
      expect(
        sample(untypedStore({ required: ['kind'] }), 'components/schemas/Beverage', { kind: 0 }),
      ).toMatchObject({ kind: 'coffee', refill: { kind: 'coffee' } });
    });

    it('keeps the back-reference of a host reached through array items', () => {
      expect(sample(untypedStore(), 'components/schemas/Order', { kind: 0 })).toEqual([
        { kind: 'coffee', refill: {} },
      ]);
    });
  });

  describe('a discriminator without mapping', () => {
    const paymentMethodStore = (card: Record<string, unknown>) => ({
      'components/schemas/PaymentMethod': schema('components/schemas/PaymentMethod', {
        oneOf: [ref('Card'), ref('BankTransfer')],
        discriminator: { propertyName: 'type' },
      }),
      'components/schemas/Card': schema('components/schemas/Card', card),
      'components/schemas/BankTransfer': schema('components/schemas/BankTransfer', {
        type: 'object',
        properties: { type: { type: 'string' }, iban: { type: 'string' } },
      }),
    });

    it('stamps the schema name of the selected variant', () => {
      const store = paymentMethodStore({
        type: 'object',
        properties: { type: { type: 'string' }, last4: { type: 'string' } },
      });

      expect(sample(store, 'components/schemas/PaymentMethod', { type: 1 })).toEqual({
        type: 'BankTransfer',
        iban: 'string',
      });
    });

    it('keeps the value a variant pins with const', () => {
      const store = paymentMethodStore({
        type: 'object',
        properties: { type: { const: 'card' }, last4: { type: 'string' } },
      });

      expect(sample(store, 'components/schemas/PaymentMethod', { type: 0 })).toEqual({
        type: 'card',
        last4: 'string',
      });
    });
  });

  describe('nested discriminators that share a property name', () => {
    const animalStore = (animalMapping: Record<string, string>) => ({
      'components/schemas/Animal': schema('components/schemas/Animal', {
        oneOf: [ref('Dog'), ref('Cat')],
        discriminator: { propertyName: 'type', mapping: animalMapping },
      }),
      'components/schemas/Dog': schema('components/schemas/Dog', {
        oneOf: [ref('Lab'), ref('Poodle')],
        discriminator: {
          propertyName: 'type',
          mapping: { lab: ref('Lab').$ref, poodle: ref('Poodle').$ref },
        },
      }),
      'components/schemas/Lab': schema('components/schemas/Lab', {
        type: 'object',
        properties: { type: { type: 'string' }, retrieves: { type: 'boolean' } },
      }),
      'components/schemas/Poodle': schema('components/schemas/Poodle', {
        type: 'object',
        properties: { type: { type: 'string' }, curls: { type: 'integer' } },
      }),
      'components/schemas/Cat': schema('components/schemas/Cat', {
        type: 'object',
        properties: { type: { type: 'string' }, indoor: { type: 'boolean' } },
      }),
    });

    it('never pairs one variant value with another variant fields', () => {
      const store = animalStore({
        lab: ref('Dog').$ref,
        poodle: ref('Dog').$ref,
        cat: ref('Cat').$ref,
      });

      expect(sample(store, 'components/schemas/Animal', { type: 0, '&d=0/type': 1 })).toEqual({
        type: 'lab',
        retrieves: true,
      });
    });

    it('keeps the value an inner variant pins when no level has a mapping', () => {
      const store = {
        'components/schemas/Animal': schema('components/schemas/Animal', {
          oneOf: [ref('Dog'), ref('Cat')],
          discriminator: { propertyName: 'type' },
        }),
        'components/schemas/Dog': schema('components/schemas/Dog', {
          oneOf: [ref('Lab'), ref('Poodle')],
          discriminator: { propertyName: 'type' },
        }),
        'components/schemas/Lab': schema('components/schemas/Lab', {
          type: 'object',
          properties: { type: { const: 'lab' }, retrieves: { type: 'boolean' } },
        }),
        'components/schemas/Poodle': schema('components/schemas/Poodle', {
          type: 'object',
          properties: { type: { const: 'poodle' }, curls: { type: 'integer' } },
        }),
        'components/schemas/Cat': schema('components/schemas/Cat', {
          type: 'object',
          properties: { type: { const: 'cat' } },
        }),
      };

      expect(sample(store, 'components/schemas/Animal', { type: 0, '&d=0/type': 1 })).toEqual({
        type: 'poodle',
        curls: 0,
      });
    });

    it('stamps the inner value when the outer value names no inner variant', () => {
      const store = animalStore({ dog: ref('Dog').$ref, cat: ref('Cat').$ref });

      expect(sample(store, 'components/schemas/Animal', { type: 0, '&d=0/type': 1 })).toEqual({
        type: 'poodle',
        curls: 0,
      });
    });
  });
});

describe('generatedExampleAtom keywords next to a $ref', () => {
  const rangeId = 'components/schemas/Range';
  const numberId = 'components/schemas/Number';

  function makeRangeStore(): Record<string, SchemaEntry> {
    return {
      [rangeId]: {
        id: rangeId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          properties: {
            min: { $ref: `#/${numberId}`, minimum: 0, example: 10 },
            max: { $ref: `#/${numberId}`, minimum: 51, examples: [55] },
          },
        },
      },
      [numberId]: { id: numberId, kind: schemaKind.JSON_SCHEMA, data: { type: 'number' } },
    };
  }

  function sampleRange(specVersion: string, convertedFrom?: string): unknown {
    const store = setupStore({ schemaStore: makeRangeStore(), specVersion, convertedFrom });
    return store.get(generatedExampleAtom(buildExampleAtomKey(rangeId, 'response')));
  }

  it.each(['3.1.0', '3.2.0'])('applies them in OpenAPI %s', (version) => {
    expect(sampleRange(version)).toEqual({ min: 10, max: 55 });
  });

  it('ignores them in OpenAPI 3.0', () => {
    expect(sampleRange('3.0.3')).toEqual({ min: 0, max: 0 });
  });

  it('ignores them in a document converted from Swagger 2.0', () => {
    expect(sampleRange('3.2.0', '2.0')).toEqual({ min: 0, max: 0 });
  });
});

describe('generatedExampleAtom variant property referencing part of the host', () => {
  const drinkId = 'components/schemas/Drink';
  const coffeeId = 'components/schemas/Coffee';
  const teaId = 'components/schemas/Tea';
  const schema = (id: string, data: Record<string, unknown>): SchemaEntry => ({
    id,
    kind: schemaKind.JSON_SCHEMA,
    data,
  });

  function makeDrinkStore(kindRef: string, extraKind: Record<string, unknown> = {}) {
    return {
      [drinkId]: schema(drinkId, {
        type: 'object',
        required: ['kind'],
        properties: { kind: { type: 'string' }, leaf: { type: 'string' } },
        discriminator: {
          propertyName: 'kind',
          mapping: { coffee: `#/${coffeeId}`, tea: `#/${teaId}` },
        },
        oneOf: [{ $ref: `#/${coffeeId}` }, { $ref: `#/${teaId}` }],
      }),
      [coffeeId]: schema(coffeeId, {
        type: 'object',
        required: ['kind', 'shots'],
        properties: { kind: { $ref: kindRef, ...extraKind }, shots: { type: 'integer' } },
      }),
      [teaId]: schema(teaId, {
        type: 'object',
        required: ['kind', 'leaf'],
        properties: { kind: { $ref: kindRef, ...extraKind }, leaf: { type: 'string' } },
      }),
    };
  }

  const sample = (
    schemaStore: Record<string, SchemaEntry>,
    activeDiscriminator: Record<string, number>,
    specVersion = '3.1.0',
  ) =>
    setupStore({ schemaStore, itemId: ITEM_ID, activeDiscriminator, specVersion }).get(
      generatedExampleAtom(buildExampleAtomKey(drinkId, 'request', 'application/json', ITEM_ID)),
    );

  it('samples both variants when kind refs the host property', () => {
    const store = makeDrinkStore(`#/${drinkId}/properties/kind`);
    expect(sample(store, { kind: 0 })).toEqual({ kind: 'coffee', shots: 0, leaf: 'string' });
    expect(sample(store, { kind: 1 })).toEqual({ kind: 'tea', leaf: 'string' });
  });

  it.each([
    ['3.1.0', 'oolong'],
    ['3.0.3', 'string'],
  ])('follows the sampler sibling rule for OpenAPI %s', (version, leaf) => {
    const base = makeDrinkStore(`#/${drinkId}/properties/kind`);
    const store = {
      ...base,
      [teaId]: schema(teaId, {
        type: 'object',
        required: ['kind', 'leaf'],
        properties: {
          kind: { $ref: `#/${drinkId}/properties/kind` },
          leaf: { $ref: `#/${drinkId}/properties/leaf`, example: 'oolong' },
        },
      }),
    };
    expect(sample(store, { kind: 1 }, version)).toEqual({ kind: 'tea', leaf });
  });

  it('samples a recursive host property referenced from a variant', () => {
    const base = makeDrinkStore(`#/${drinkId}/properties/kind`);
    const tree = {
      type: 'object',
      required: ['name', 'child'],
      properties: { name: { type: 'string' }, child: { $ref: `#/${drinkId}/properties/tree` } },
    };
    const drink = base[drinkId].data;
    const store = {
      ...base,
      [drinkId]: schema(drinkId, {
        ...drink,
        properties: { ...(drink.properties as Record<string, unknown>), tree },
      }),
      [teaId]: schema(teaId, {
        type: 'object',
        required: ['kind', 'tree'],
        properties: { kind: { type: 'string' }, tree: { $ref: `#/${drinkId}/properties/tree` } },
      }),
    };
    expect(sample(store, { kind: 1 })).toEqual({
      kind: 'tea',
      leaf: 'string',
      tree: { name: 'string', child: { name: 'string', child: {} } },
    });
  });

  it('keeps the depth limit along a chain of hosts that refs point into', () => {
    const store: Record<string, SchemaEntry> = {};
    const hostCount = 18;
    for (let i = 0; i < hostCount; i++) {
      const id = `components/schemas/H${i}`;
      const next = i + 1 < hostCount && { $ref: `#/components/schemas/H${i + 1}` };
      store[id] = schema(id, {
        type: 'object',
        properties: { kind: { type: 'string' }, ...(next && { a: next, b: next }) },
        discriminator: { propertyName: 'kind' },
        oneOf: [{ $ref: `#/${id}X` }, { $ref: `#/${id}Y` }],
      });
      for (const v of ['X', 'Y']) {
        store[`${id}${v}`] = schema(`${id}${v}`, {
          type: 'object',
          properties: { kind: { $ref: `#/${id}/properties/kind` } },
        });
      }
    }
    const example = setupStore({ schemaStore: store, specVersion: '3.1.0' }).get(
      generatedExampleAtom(
        buildExampleAtomKey('components/schemas/H0', 'request', 'application/json'),
      ),
    );

    expect(JSON.stringify(example).length).toBeLessThan(20_000);
  });

  it('follows a pointer through the host allOf', () => {
    const base = makeDrinkStore(`#/${drinkId}/allOf/0/properties/kind`);
    const { properties: _p, ...drink } = base[drinkId].data;
    const store = {
      ...base,
      [drinkId]: schema(drinkId, {
        ...drink,
        allOf: [{ properties: { kind: { type: 'string' } } }],
      }),
    };
    expect(sample(store, { kind: 1 })).toEqual({ kind: 'tea', leaf: 'string' });
  });

  it('keeps a const two ref hops away over the mapping key', () => {
    const store = {
      ...makeDrinkStore('#/components/schemas/Kinds/properties/tea'),
      'components/schemas/Kinds': schema('components/schemas/Kinds', {
        properties: { tea: { $ref: '#/components/schemas/Green' } },
      }),
      'components/schemas/Green': schema('components/schemas/Green', { const: 'green' }),
    };
    expect(sample(store, { kind: 1 })).toEqual({ kind: 'green', leaf: 'string' });
  });

  it('leaves a ref with siblings into an inline anyOf host to the sampler', () => {
    const baseId = 'components/schemas/Base';
    const orderId = 'components/schemas/Order';
    const store = {
      [baseId]: schema(baseId, {
        type: 'object',
        properties: {
          createdAt: { type: 'string', format: 'date-time' },
          count: { type: 'integer', minimum: 60 },
        },
        anyOf: [{ required: ['createdAt'] }, { required: ['count'] }],
      }),
      [orderId]: schema(orderId, {
        type: 'object',
        required: ['createdAt', 'count'],
        properties: {
          createdAt: { $ref: `#/${baseId}/properties/createdAt`, description: 'Created' },
          count: { $ref: `#/${baseId}/properties/count`, description: 'Count' },
        },
      }),
    };
    const example = setupStore({ schemaStore: store, specVersion: '3.1.0' }).get(
      generatedExampleAtom(buildExampleAtomKey(orderId, 'request', 'application/json')),
    );
    expect(example).toEqual({ createdAt: expect.stringMatching(/^\d{4}-/), count: 60 });
  });

  it('samples a variant that inherits the host through allOf and refs a host property', () => {
    const petId = 'components/schemas/Pet';
    const catId = 'components/schemas/Cat';
    const dogId = 'components/schemas/Dog';
    const store = {
      [petId]: schema(petId, {
        type: 'object',
        required: ['petType'],
        properties: { petType: { type: 'string' }, name: { type: 'string' } },
        discriminator: {
          propertyName: 'petType',
          mapping: { cat: `#/${catId}`, dog: `#/${dogId}` },
        },
      }),
      [catId]: schema(catId, {
        allOf: [
          { $ref: `#/${petId}` },
          {
            type: 'object',
            properties: {
              petType: { $ref: `#/${petId}/properties/petType` },
              meow: { type: 'boolean' },
            },
          },
        ],
      }),
      [dogId]: schema(dogId, {
        allOf: [
          { $ref: `#/${petId}` },
          { type: 'object', properties: { bark: { type: 'boolean' } } },
        ],
      }),
    };
    const sample = (activeDiscriminator: Record<string, number>) =>
      setupStore({ schemaStore: store, itemId: ITEM_ID, activeDiscriminator }).get(
        generatedExampleAtom(buildExampleAtomKey(petId, 'request', 'application/json', ITEM_ID)),
      );
    expect(sample({ petType: 0 })).toEqual({ petType: 'cat', name: 'string', meow: true });
    expect(sample({ petType: 1 })).toEqual({ petType: 'dog', name: 'string', bark: true });
  });
});

describe('generatedExampleAtom host keywords no pointer reaches into', () => {
  const ids = {
    drink: 'components/schemas/Drink',
    tea: 'components/schemas/Tea',
    coffee: 'components/schemas/Coffee',
    base: 'components/schemas/Base',
  };
  const schema = (id: string, data: Record<string, unknown>): SchemaEntry => ({
    id,
    kind: schemaKind.JSON_SCHEMA,
    data,
  });
  const drinkStore = (host: Record<string, unknown> = {}) => ({
    [ids.drink]: schema(ids.drink, {
      type: 'object',
      properties: { kind: { type: 'string' } },
      discriminator: {
        propertyName: 'kind',
        mapping: { coffee: `#/${ids.coffee}`, tea: `#/${ids.tea}` },
      },
      oneOf: [{ $ref: `#/${ids.coffee}` }, { $ref: `#/${ids.tea}` }],
      ...host,
    }),
    [ids.coffee]: schema(ids.coffee, {
      type: 'object',
      properties: { shots: { type: 'integer' } },
    }),
    [ids.tea]: schema(ids.tea, { type: 'object', properties: { leaf: { type: 'string' } } }),
    [ids.base]: schema(ids.base, { type: 'object', properties: { id: { type: 'string' } } }),
  });
  const sample = (
    schemaStore: Record<string, SchemaEntry>,
    schemaId: string,
    options: { specVersion?: string; generatedSamplesMaxDepth?: number } = {},
  ) =>
    setupStore({ schemaStore, itemId: ITEM_ID, activeDiscriminator: { kind: 1 }, ...options }).get(
      generatedExampleAtom(buildExampleAtomKey(schemaId, 'request', 'application/json', ITEM_ID)),
    );

  it('keeps the selected variant next to a host $ref in OpenAPI 3.0', () => {
    const store = drinkStore({ $ref: `#/${ids.base}` });
    expect(sample(store, ids.drink, { specVersion: '3.0.3' })).toEqual({
      id: 'string',
      kind: 'tea',
      leaf: 'string',
    });
  });

  it('keeps the selected variant over a host const', () => {
    const store = drinkStore({ const: { kind: 'x' } });
    expect(sample(store, ids.drink)).toEqual({ kind: 'tea', leaf: 'string' });
  });

  it('keeps the selected option over a primitive host enum', () => {
    const store = {
      'components/schemas/Code': schema('components/schemas/Code', {
        type: 'string',
        enum: ['A1', 'B2'],
        anyOf: [{ $ref: '#/components/schemas/F1' }, { $ref: '#/components/schemas/F2' }],
      }),
      'components/schemas/F1': schema('components/schemas/F1', { type: 'string', example: 'Z9' }),
      'components/schemas/F2': schema('components/schemas/F2', { type: 'string', example: 'QQ' }),
    };
    expect(sample(store, 'components/schemas/Code')).toBe('Z9');
  });

  it('stops host properties at the sample depth limit', () => {
    const wrapId = 'components/schemas/Wrap';
    const store = {
      ...drinkStore({
        properties: { kind: { type: 'string' }, deep: { $ref: '#/components/schemas/Deep' } },
      }),
      'components/schemas/Deep': schema('components/schemas/Deep', {
        type: 'object',
        properties: { name: { type: 'string' } },
      }),
      [wrapId]: schema(wrapId, {
        type: 'object',
        properties: {
          d1: { type: 'object', properties: { d2: { $ref: `#/${ids.drink}` } } },
        },
      }),
    };
    expect(sample(store, wrapId, { generatedSamplesMaxDepth: 3 })).toEqual({ d1: { d2: {} } });
  });
});

describe('generatedExampleAtom inline oneOf next to host keywords', () => {
  const hostId = 'components/schemas/Shape';
  const pointerId = 'components/schemas/ShapeKind';
  const optionPointerId = 'components/schemas/ShapeB';

  function makeShapeStore(): Record<string, SchemaEntry> {
    return {
      [hostId]: {
        id: hostId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          required: ['kind'],
          properties: { kind: { type: 'string', enum: ['a'] } },
          oneOf: [
            { required: ['a'], properties: { a: { type: 'string' } } },
            { properties: { b: { type: 'string' } } },
          ],
        },
      },
      [pointerId]: {
        id: pointerId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          properties: { kind: { $ref: `#/${hostId}/properties/kind` } },
        },
      },
      [optionPointerId]: {
        id: optionPointerId,
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          properties: { b: { $ref: `#/${hostId}/oneOf/1/properties/b` } },
        },
      },
    };
  }

  const sample = (
    schemaId: string,
    activeOneOf?: Record<string, number>,
    onlyRequiredInSamples?: boolean,
  ) =>
    setupStore({
      schemaStore: makeShapeStore(),
      itemId: ITEM_ID,
      activeOneOf,
      onlyRequiredInSamples,
    }).get(
      generatedExampleAtom(buildExampleAtomKey(schemaId, 'request', 'application/json', ITEM_ID)),
    );

  it('keeps the host properties next to the selected variant properties', () => {
    expect(sample(hostId)).toEqual({ kind: 'a', a: 'string' });
    expect(sample(hostId, { 'One of:': 1 })).toEqual({ kind: 'a', b: 'string' });
  });

  it('keeps the host required names next to the variant required names', () => {
    expect(sample(hostId, undefined, true)).toEqual({ kind: 'a', a: 'string' });
  });

  it('resolves a pointer into a host property from another schema', () => {
    expect(sample(pointerId)).toEqual({ kind: 'a' });
  });

  it('resolves a pointer into an option from another schema', () => {
    expect(sample(optionPointerId)).toEqual({ b: 'string' });
    expect(sample(optionPointerId, { 'One of:': 1 })).toEqual({ b: 'string' });
  });
});

describe('generatedExampleAtom inline oneOf of refs next to host keywords', () => {
  const bodyId = 'components/schemas/Adoption';
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const schema = (id: string, data: Record<string, unknown>): SchemaEntry => ({
    id,
    kind: schemaKind.JSON_SCHEMA,
    data,
  });

  function makePetStore(pet: Record<string, unknown> = {}): Record<string, SchemaEntry> {
    return {
      [bodyId]: schema(bodyId, {
        type: 'object',
        properties: {
          pet: {
            type: 'object',
            properties: { id: { type: 'integer' } },
            oneOf: [ref('Cat'), ref('Dog')],
            ...pet,
          },
        },
      }),
      'components/schemas/Cat': schema('components/schemas/Cat', {
        type: 'object',
        properties: { meow: { type: 'string' } },
      }),
      'components/schemas/Dog': schema('components/schemas/Dog', {
        type: 'object',
        properties: { bark: { type: 'string' } },
      }),
    };
  }

  const sample = (
    specVersion: string | undefined,
    activeOneOf?: Record<string, number>,
    pet?: Record<string, unknown>,
  ) =>
    setupStore({ schemaStore: makePetStore(pet), itemId: ITEM_ID, activeOneOf, specVersion }).get(
      generatedExampleAtom(buildExampleAtomKey(bodyId, 'request', 'application/json', ITEM_ID)),
    );

  it('keeps the host properties next to the selected $ref in OpenAPI 3.0', () => {
    expect(sample('3.0.3')).toEqual({ pet: { id: 0, meow: 'string' } });
    expect(sample('3.0.3', { 'pet/One of:': 1 })).toEqual({ pet: { id: 0, bark: 'string' } });
  });

  it('keeps the host properties in a document sampled without an OpenAPI 3.1 version', () => {
    expect(sample(undefined)).toEqual({ pet: { id: 0, meow: 'string' } });
  });

  it('keeps the OpenAPI 3.1 sample, where keywords next to $ref already apply', () => {
    expect(JSON.stringify(sample('3.1.0'))).toBe('{"pet":{"meow":"string","id":0}}');
  });

  it("returns the host's own example in OpenAPI 3.0 as in 3.1", () => {
    const pet = { example: { id: 7, meow: 'purr' } };
    expect(sample('3.0.3', undefined, pet)).toEqual({ pet: { id: 7, meow: 'purr' } });
    expect(sample('3.1.0', undefined, pet)).toEqual({ pet: { id: 7, meow: 'purr' } });
  });

  it('keeps the depth limit along a chain of such hosts in OpenAPI 3.0', () => {
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Leaf': schema('components/schemas/Leaf', {
        type: 'object',
        properties: { leaf: { type: 'string' } },
      }),
    };
    for (let i = 0; i < 30; i++) {
      const option = {
        type: 'object',
        properties: { id: { type: 'integer' } },
        oneOf: [ref(i + 1 < 30 ? `Host${i + 1}` : 'Leaf'), ref('Leaf')],
      };
      store[`components/schemas/Host${i}`] = schema(`components/schemas/Host${i}`, {
        type: 'object',
        properties: { a: option, b: option },
      });
    }
    const leafless = { a: {}, b: {} };
    const level = { id: 0, a: leafless, b: leafless };

    expect(
      setupStore({ schemaStore: store, specVersion: '3.0.3', generatedSamplesMaxDepth: 3 }).get(
        generatedExampleAtom(buildExampleAtomKey('components/schemas/Host0', 'response')),
      ),
    ).toEqual({ a: level, b: level });
  });
});
