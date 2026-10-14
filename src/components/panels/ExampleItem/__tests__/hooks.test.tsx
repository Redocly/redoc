import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import '@testing-library/jest-dom/vitest';
import { schemaKind } from '../../../../types/common.js';

import type { ReactNode } from 'react';
import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { SchemaEntry } from '../../../../types/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { itemStoreAtom } from '../../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import type { PayloadExamplesPanelItem } from '../../../../types/content.js';

import {
  useActiveVariantSchemaId,
  useMediaTypeContent,
  useSchemaVariantSelection,
} from '../hooks.js';

const TEST_ITEM_ID = 'test-item';

function makeOneOfSchemaStore(): Record<string, SchemaEntry> {
  return {
    'components/schemas/Identity Verification': {
      id: 'components/schemas/Identity Verification',
      kind: schemaKind.JSON_SCHEMA,
      title: 'Identity Verification',
      data: { type: 'object', properties: { idType: { type: 'string' } } },
    },
    'components/schemas/Fraud Prevention': {
      id: 'components/schemas/Fraud Prevention',
      kind: schemaKind.JSON_SCHEMA,
      title: 'Fraud Prevention',
      data: { type: 'object', properties: { riskScore: { type: 'number' } } },
    },
    body: {
      id: 'body',
      kind: schemaKind.JSON_SCHEMA,
      data: {
        oneOf: [
          { $ref: '#/components/schemas/Identity Verification' },
          { $ref: '#/components/schemas/Fraud Prevention' },
        ],
      },
    },
  };
}

function makeWrapper(
  schemaStore: GlobalStoreAtom['store']['schemaStore'],
  itemId: string | undefined = TEST_ITEM_ID,
) {
  const jotaiStore = createStore();
  const options = normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
    basePath: '',
  });
  const exampleStore = Object.fromEntries(
    ['cancel-ex', 'fallback-ex', 'media-ex', 'req-ex'].map((id) => [id, { id, value: {} }]),
  );
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: { schemaStore, exampleStore, securitySchemeStore: {} },
    options,
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <JotaiProvider store={jotaiStore}>
        <ItemIdContext.Provider value={itemId}>{children}</ItemIdContext.Provider>
      </JotaiProvider>
    );
  }

  return { jotaiStore, Wrapper };
}

describe('useSchemaVariantSelection driven by getSchemaVariantSelector (oneOf source)', () => {
  it('exposes one option per oneOf $ref — keyed by the stored schema id, labelled by its title', () => {
    const { Wrapper } = makeWrapper(makeOneOfSchemaStore());
    const { result } = renderHook(() => useSchemaVariantSelection('body'), {
      wrapper: Wrapper,
    });

    expect(result.current?.options).toEqual([
      {
        key: 'components/schemas/Identity Verification',
        label: 'Identity Verification',
      },
      {
        key: 'components/schemas/Fraud Prevention',
        label: 'Fraud Prevention',
      },
    ]);
    expect(result.current?.activeIdx).toBe(0);
  });

  it('still returns undefined for plain object schemas (no variants of any kind)', () => {
    const { Wrapper } = makeWrapper({
      plain: {
        id: 'plain',
        kind: schemaKind.JSON_SCHEMA,
        data: { type: 'object', properties: { id: { type: 'string' } } },
      },
    });
    const { result } = renderHook(() => useSchemaVariantSelection('plain'), { wrapper: Wrapper });
    expect(result.current).toBeUndefined();
  });

  it('onSelect writes to activeOneOf[<switcher label>] — same slot as the middle schema panel', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeOneOfSchemaStore());
    const { result } = renderHook(() => useSchemaVariantSelection('body'), {
      wrapper: Wrapper,
    });

    act(() => result.current?.onSelect(1));

    expect(jotaiStore.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf['One of:']).toBe(1);
  });

  it('picks up a selection the middle schema panel wrote at activeOneOf[<switcher label>]', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeOneOfSchemaStore());
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeOneOf: { 'One of:': 1 },
    });

    const { result } = renderHook(() => useSchemaVariantSelection('body'), {
      wrapper: Wrapper,
    });
    expect(result.current?.activeIdx).toBe(1);
  });
});

function makeNestedOneOfSchemaStore(): Record<string, SchemaEntry> {
  return {
    'components/schemas/PnrMetadataWrapper': {
      id: 'components/schemas/PnrMetadataWrapper',
      kind: schemaKind.JSON_SCHEMA,
      title: 'PnrMetadataWrapper',
      data: { type: 'object', properties: { pnrId: { type: 'string' } } },
    },
    'components/schemas/EventMetadataWrapper': {
      id: 'components/schemas/EventMetadataWrapper',
      kind: schemaKind.JSON_SCHEMA,
      title: 'EventMetadataWrapper',
      data: { type: 'object', properties: { eventId: { type: 'string' } } },
    },
    'components/schemas/LegMetadataWrapper': {
      id: 'components/schemas/LegMetadataWrapper',
      kind: schemaKind.JSON_SCHEMA,
      title: 'LegMetadataWrapper',
      data: { type: 'object', properties: { legId: { type: 'string' } } },
    },
    'components/schemas/EntityMetadata': {
      id: 'components/schemas/EntityMetadata',
      kind: schemaKind.JSON_SCHEMA,
      title: 'EntityMetadata',
      data: {
        oneOf: [
          { $ref: '#/components/schemas/PnrMetadataWrapper' },
          { $ref: '#/components/schemas/EventMetadataWrapper' },
          { $ref: '#/components/schemas/LegMetadataWrapper' },
        ],
      },
    },
    body: {
      id: 'body',
      kind: schemaKind.JSON_SCHEMA,
      data: {
        type: 'object',
        required: ['entityMetadata'],
        properties: {
          entityMetadata: { $ref: '#/components/schemas/EntityMetadata' },
          name: { type: 'string' },
        },
      },
    },
  };
}

describe('Sync invariant (nested oneOf at entityMetadata): museum.yml /dublicate-description', () => {
  it('right-panel hook surfaces the nested oneOf as a 3-option switcher', () => {
    const { Wrapper } = makeWrapper(makeNestedOneOfSchemaStore());
    const { result } = renderHook(() => useSchemaVariantSelection('body'), {
      wrapper: Wrapper,
    });

    expect(result.current?.options.map((o) => o.label)).toEqual([
      'PnrMetadataWrapper',
      'EventMetadataWrapper',
      'LegMetadataWrapper',
    ]);
  });

  it.each([
    ['example', { example: { name: 'Trip' } }],
    ['examples', { examples: [{ name: 'Trip' }] }],
  ])(
    'hides the switcher when the body has its own %s: the sample is that example whatever the pick',
    (_keyword, ownExample) => {
      const store = makeNestedOneOfSchemaStore();
      Object.assign(store.body.data, ownExample);
      const { Wrapper } = makeWrapper(store);
      const { result } = renderHook(() => useSchemaVariantSelection('body'), {
        wrapper: Wrapper,
      });

      expect(result.current).toBeUndefined();
    },
  );

  it.each([
    ['an empty examples list', { examples: [] }],
    ['a named examples map', { examples: { trip: { value: { name: 'Trip' } } } }],
  ])('keeps the switcher when the body has %s: the sampler ignores it', (_shape, ownExamples) => {
    const store = makeNestedOneOfSchemaStore();
    Object.assign(store.body.data, ownExamples);
    const { Wrapper } = makeWrapper(store);
    const { result } = renderHook(() => useSchemaVariantSelection('body'), {
      wrapper: Wrapper,
    });

    expect(result.current?.options).toHaveLength(3);
  });

  it('right-panel hook follows middle-panel selection at activeOneOf[entityMetadata/One of:]', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeNestedOneOfSchemaStore());
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeOneOf: { 'entityMetadata/One of:': 1 },
    });

    const { result } = renderHook(() => useSchemaVariantSelection('body'), {
      wrapper: Wrapper,
    });
    expect(result.current?.activeIdx).toBe(1);
  });
});

function makePayloadNode(
  overrides: Partial<PayloadExamplesPanelItem> = {},
): PayloadExamplesPanelItem {
  return {
    kind: 'payload',
    examples: [],
    ...overrides,
  };
}

describe('useMediaTypeContent active-message fallback', () => {
  it('drops example ids whose store entry is missing', () => {
    const { Wrapper } = makeWrapper({});
    const node = makePayloadNode({ exampleIds: ['fallback-ex', 'restricted-ex'] });

    const { result } = renderHook(() => useMediaTypeContent(node), { wrapper: Wrapper });

    expect(result.current.effectiveExampleIds).toEqual(['fallback-ex']);
  });

  it('resolves the first message when none is active, not the channel-wide example aggregate', () => {
    const { Wrapper } = makeWrapper({});

    const node = makePayloadNode({
      schemaId: 'request-ride-schema',
      exampleIds: ['req-ex', 'cancel-ex'],
      messagesByKey: {
        requestRide: { schemaId: 'request-ride-schema', exampleIds: ['req-ex'] },
        cancelRide: { schemaId: 'cancel-ride-schema', exampleIds: ['cancel-ex'] },
      },
    });

    const { result } = renderHook(() => useMediaTypeContent(node), { wrapper: Wrapper });

    expect(result.current.effectiveSchemaId).toBe('request-ride-schema');
    expect(result.current.effectiveExampleIds).toEqual(['req-ex']);
  });

  it('resolves messagesByKey[activeMessageKey] and reacts to runtime switches', () => {
    const { jotaiStore, Wrapper } = makeWrapper({});
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeMessageKey: 'requestRide',
    });

    const node = makePayloadNode({
      schemaId: 'fallback-schema',
      messagesByKey: {
        requestRide: { schemaId: 'request-ride-schema', exampleIds: ['req-ex'] },
        cancelRide: { schemaId: 'cancel-ride-schema', exampleIds: ['cancel-ex'] },
      },
    });

    const { result } = renderHook(() => useMediaTypeContent(node), { wrapper: Wrapper });
    expect(result.current.effectiveSchemaId).toBe('request-ride-schema');

    act(() =>
      jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
        activeMessageKey: 'cancelRide',
      }),
    );

    expect(result.current.effectiveSchemaId).toBe('cancel-ride-schema');
    expect(result.current.effectiveExampleIds).toEqual(['cancel-ex']);
    expect(result.current.isMessageWithoutPayload).toBe(false);
  });

  it('resolves no sample when the active message has no payload instead of keeping another message sample', () => {
    const { jotaiStore, Wrapper } = makeWrapper({});
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeMessageKey: 'ping',
    });

    const node = makePayloadNode({
      schemaId: 'order-ready-schema',
      messagesByKey: {
        orderReady: { schemaId: 'order-ready-schema' },
        ping: {},
      },
    });

    const { result } = renderHook(() => useMediaTypeContent(node), { wrapper: Wrapper });

    expect(result.current.effectiveSchemaId).toBeUndefined();
    expect(result.current.effectiveExampleIds).toBeUndefined();
    expect(result.current.isMessageWithoutPayload).toBe(true);
  });

  it('falls back to node.schemaId when activeMessageKey is set but not present in messagesByKey', () => {
    const { jotaiStore, Wrapper } = makeWrapper({});
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeMessageKey: 'unknownMessage',
    });

    const node = makePayloadNode({
      schemaId: 'fallback-schema',
      exampleIds: ['fallback-ex'],
      messagesByKey: {
        requestRide: { schemaId: 'request-ride-schema', exampleIds: ['req-ex'] },
      },
    });

    const { result } = renderHook(() => useMediaTypeContent(node), { wrapper: Wrapper });

    expect(result.current.effectiveSchemaId).toBe('fallback-schema');
    expect(result.current.effectiveExampleIds).toEqual(['fallback-ex']);
  });

  it('keeps a stable effectiveExampleIds reference across re-renders with unchanged inputs', () => {
    // Regression: an unstable reference (a fresh `.filter()` array every render) re-fires the
    // example-index reset effect in CodeSampleItem/PayloadExampleItem, pinning the request
    // example selector to index 0 so the code sample never switches examples.
    const { Wrapper } = makeWrapper({});
    const node = makePayloadNode({ exampleIds: ['fallback-ex', 'req-ex'] });

    const { result, rerender } = renderHook(() => useMediaTypeContent(node), { wrapper: Wrapper });

    const first = result.current.effectiveExampleIds;
    rerender();
    const second = result.current.effectiveExampleIds;

    expect(second).toBe(first);
    expect(second).toEqual(['fallback-ex', 'req-ex']);
  });

  it('lets mediaTypeSchemas[activeMediaType] win over messagesByKey when both resolve', () => {
    const { jotaiStore, Wrapper } = makeWrapper({});
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeMessageKey: 'requestRide',
    });

    const node = makePayloadNode({
      schemaId: 'fallback-schema',
      mediaTypes: ['application/json'],
      mediaTypeSchemas: {
        'application/json': { schemaId: 'media-schema', exampleIds: ['media-ex'] },
      },
      messagesByKey: {
        requestRide: { schemaId: 'request-ride-schema', exampleIds: ['req-ex'] },
      },
    });

    const { result } = renderHook(() => useMediaTypeContent(node), { wrapper: Wrapper });

    expect(result.current.effectiveSchemaId).toBe('media-schema');
    expect(result.current.effectiveExampleIds).toEqual(['media-ex']);
  });
});

describe('useActiveVariantSchemaId driven by getSchemaVariantSelector (oneOf source)', () => {
  it('keeps the host id for a root-level pick: the sampler rewrites the host to that variant', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeOneOfSchemaStore());
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeOneOf: { 'One of:': 1 },
    });

    const { result } = renderHook(() => useActiveVariantSchemaId('body'), {
      wrapper: Wrapper,
    });
    expect(result.current).toBe('body');
  });

  it('keeps the host id for a discriminator pick so the sample carries the host properties and the mapping value', () => {
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Card': {
        id: 'components/schemas/Card',
        kind: schemaKind.JSON_SCHEMA,
        data: { type: 'object', properties: { last4: { type: 'string' } } },
      },
      body: {
        id: 'body',
        kind: schemaKind.JSON_SCHEMA,
        data: {
          type: 'object',
          required: ['amount'],
          properties: { amount: { type: 'number' } },
          oneOf: [{ $ref: '#/components/schemas/Card' }],
          discriminator: {
            propertyName: 'method',
            mapping: { card: '#/components/schemas/Card' },
          },
        },
      },
    };
    const { jotaiStore, Wrapper } = makeWrapper(store);
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), { activeDiscriminator: { method: 0 } });

    const { result } = renderHook(() => useActiveVariantSchemaId('body'), {
      wrapper: Wrapper,
    });
    expect(result.current).toBe('body');
  });

  it('samples a sibling variant alone when the host inherits the discriminator through allOf', () => {
    const schema = (id: string, data: Record<string, unknown>): SchemaEntry => ({
      id,
      kind: schemaKind.JSON_SCHEMA,
      data,
    });
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Pet': schema('components/schemas/Pet', {
        type: 'object',
        properties: { petType: { type: 'string' } },
        discriminator: {
          propertyName: 'petType',
          mapping: { cat: '#/components/schemas/Cat', dog: '#/components/schemas/Dog' },
        },
      }),
      'components/schemas/Cat': schema('components/schemas/Cat', {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { properties: { huntingSkill: { type: 'string' } } },
        ],
      }),
      'components/schemas/Dog': schema('components/schemas/Dog', {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { properties: { packSize: { type: 'integer' } } },
        ],
      }),
    };
    const { jotaiStore, Wrapper } = makeWrapper(store);
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), { activeDiscriminator: { petType: 1 } });

    const { result } = renderHook(() => useActiveVariantSchemaId('components/schemas/Cat'), {
      wrapper: Wrapper,
    });
    expect(result.current).toBe('components/schemas/Dog');
  });

  it('samples a variant that is a discriminator host itself on its own', () => {
    const schema = (id: string, data: Record<string, unknown>): SchemaEntry => ({
      id,
      kind: schemaKind.JSON_SCHEMA,
      data,
    });
    const store: Record<string, SchemaEntry> = {
      'components/schemas/Error': schema('components/schemas/Error', { type: 'object' }),
      'components/schemas/Pet': schema('components/schemas/Pet', {
        type: 'object',
        discriminator: { propertyName: 'petType', mapping: { cat: '#/components/schemas/Cat' } },
      }),
      'components/schemas/Cat': schema('components/schemas/Cat', {
        allOf: [{ $ref: '#/components/schemas/Pet' }],
      }),
      body: schema('body', {
        oneOf: [{ $ref: '#/components/schemas/Error' }, { $ref: '#/components/schemas/Pet' }],
      }),
    };
    const { jotaiStore, Wrapper } = makeWrapper(store);
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), { activeOneOf: { 'One of:': 1 } });

    const { result } = renderHook(() => useActiveVariantSchemaId('body'), { wrapper: Wrapper });
    expect(result.current).toBe('components/schemas/Pet');
  });

  it('returns the original schema id when there are no variants', () => {
    const { Wrapper } = makeWrapper({
      plain: { id: 'plain', kind: schemaKind.JSON_SCHEMA, data: { type: 'object' } },
    });
    const { result } = renderHook(() => useActiveVariantSchemaId('plain'), {
      wrapper: Wrapper,
    });
    expect(result.current).toBe('plain');
  });
});

function makeOneOfInOneOfSchemaStore(): Record<string, SchemaEntry> {
  const schema = (id: string, data: Record<string, unknown>): SchemaEntry => ({
    id,
    kind: schemaKind.JSON_SCHEMA,
    data,
  });
  return {
    'components/schemas/OtpVerified': schema('components/schemas/OtpVerified', {
      type: 'object',
      properties: { message: { type: 'string' } },
    }),
    'components/schemas/OtpFailed': schema('components/schemas/OtpFailed', {
      type: 'object',
      properties: { choices: { oneOf: [{ type: 'string' }, { type: 'null' }] } },
    }),
    'components/schemas/Answers': schema('components/schemas/Answers', {
      type: 'object',
      properties: { message: { type: 'string' } },
    }),
    'components/schemas/Otp': schema('components/schemas/Otp', {
      oneOf: [
        { $ref: '#/components/schemas/OtpVerified' },
        { $ref: '#/components/schemas/OtpFailed' },
      ],
    }),
    body: schema('body', {
      oneOf: [{ $ref: '#/components/schemas/Otp' }, { $ref: '#/components/schemas/Answers' }],
    }),
  };
}

describe('useSchemaVariantSelection (oneOf nested in a oneOf variant)', () => {
  it('lists every leaf variant, labelled by its parent', () => {
    const { Wrapper } = makeWrapper(makeOneOfInOneOfSchemaStore());
    const { result } = renderHook(() => useSchemaVariantSelection('body'), { wrapper: Wrapper });

    expect(result.current?.options.map((opt) => opt.label)).toEqual([
      'Otp / OtpVerified',
      'Otp / OtpFailed',
      'Answers',
    ]);
  });

  it('picking a nested leaf also switches its parent, at the keys the middle panel reads', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeOneOfInOneOfSchemaStore());
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), { activeOneOf: { 'One of:': 1 } });
    const { result } = renderHook(() => useSchemaVariantSelection('body'), { wrapper: Wrapper });

    act(() => result.current?.onSelect(1));

    expect(jotaiStore.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf).toEqual({
      'One of:': 0,
      '&oneof=0/One of:': 1,
    });
    expect(result.current?.activeIdx).toBe(1);
  });

  it('follows a nested pick made in the middle panel without moving to the parent sibling', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeOneOfInOneOfSchemaStore());
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), { activeOneOf: { '&oneof=0/One of:': 1 } });
    const { result } = renderHook(() => useSchemaVariantSelection('body'), { wrapper: Wrapper });

    expect(result.current?.activeIdx).toBe(1);
  });

  it('ignores a pick made on a field inside a variant', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeOneOfInOneOfSchemaStore());
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeOneOf: { '&oneof=0/One of:': 1, '&oneof=0&oneof=1/choices/One of:': 1 },
    });
    const { result } = renderHook(() => useSchemaVariantSelection('body'), { wrapper: Wrapper });

    expect(result.current?.activeIdx).toBe(1);
  });
});

describe('useActiveVariantSchemaId (oneOf nested in a oneOf variant)', () => {
  it('keeps the host id: the sampler store merges the nested variant into the host', () => {
    const { jotaiStore, Wrapper } = makeWrapper(makeOneOfInOneOfSchemaStore());
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), { activeOneOf: { '&oneof=0/One of:': 1 } });
    const { result } = renderHook(() => useActiveVariantSchemaId('body'), { wrapper: Wrapper });

    expect(result.current).toBe('body');
  });

  it('samples the nested variant alone when the host does not declare the axis', () => {
    const store = makeOneOfInOneOfSchemaStore();
    store['components/schemas/Pet'] = {
      id: 'components/schemas/Pet',
      kind: schemaKind.JSON_SCHEMA,
      data: {
        discriminator: { propertyName: 'kind', mapping: { otp: '#/components/schemas/Otp' } },
      },
    };
    store.body = {
      ...store.body,
      data: { allOf: [{ $ref: '#/components/schemas/Pet' }] },
    };
    const { jotaiStore, Wrapper } = makeWrapper(store);
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), {
      activeDiscriminator: { kind: 0 },
      activeOneOf: { '&d=0/One of:': 1 },
    });
    const { result } = renderHook(() => useActiveVariantSchemaId('body'), { wrapper: Wrapper });

    expect(result.current).toBe('components/schemas/OtpFailed');
  });
});

describe('useActiveVariantSchemaId (nested oneOf with inline options)', () => {
  it('keeps sampling the parent variant — inline options have no schema id to sample', () => {
    const store = makeOneOfInOneOfSchemaStore();
    store['components/schemas/Otp'] = {
      ...store['components/schemas/Otp'],
      data: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    };
    const { jotaiStore, Wrapper } = makeWrapper(store);
    jotaiStore.set(itemStoreAtom(TEST_ITEM_ID), { activeOneOf: { '&oneof=0/One of:': 1 } });
    const { result } = renderHook(() => useActiveVariantSchemaId('body'), { wrapper: Wrapper });

    expect(result.current).toBe('body');
  });
});
