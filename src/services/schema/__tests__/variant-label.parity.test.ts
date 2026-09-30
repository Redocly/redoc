import { describe, expect, it } from 'vitest';
import { schemaKind } from '../../../types/common.js';

import type { Document, PropertyType, SchemaNode, SwitcherType } from '../../../types/schema.js';
import type { SchemaEntry } from '../../../types/store.js';

import { schemaProcessor } from '../schemaProcessor.js';
import { deriveVariantLabel } from '../variant-label.js';
import { findSchemaVariantAxis } from '../../code-samples/discriminator.js';

function makeDocument(components: Record<string, unknown>, openapi = '3.1.0'): Document {
  return {
    openapi,
    info: { title: '', version: '1.0' },
    paths: {},
    components: { schemas: components },
  } as Document;
}

function requireSwitcher(property: PropertyType): SwitcherType {
  expect(property.switcher).toBeDefined();
  if (!property.switcher) throw new Error('expected switcher');
  return property.switcher;
}

function labelsOf(property: PropertyType): string[] {
  const switcher = requireSwitcher(property);
  return Object.keys(switcher.options);
}

describe('variant-label parity (middle-panel source)', () => {
  it('fixture 1: openapi-3.yaml /oidc/token — plain oneOf of named refs', () => {
    const doc = makeDocument({
      'Identity Verification': {
        type: 'object',
        properties: { client_id: { type: 'string' } },
      },
      'Fraud Prevention': {
        type: 'object',
        properties: { riskScore: { type: 'number' } },
      },
      'A+ Services': {
        type: 'object',
        properties: { tier: { type: 'string' } },
      },
    });
    const schema = {
      oneOf: [
        { $ref: '#/components/schemas/Identity Verification' },
        { $ref: '#/components/schemas/Fraud Prevention' },
        { $ref: '#/components/schemas/A+ Services' },
      ],
    };

    expect(labelsOf(schemaProcessor(schema, doc))).toEqual([
      'Identity Verification',
      'Fraud Prevention',
      'A+ Services',
    ]);
  });

  it('fixture 2: museum.yml /label-description — plain oneOf of titled refs', () => {
    const doc = makeDocument({
      StaticDataRequest: {
        type: 'object',
        properties: { source: { type: 'string' } },
      },
      CustomDataRequest: {
        type: 'object',
        properties: { fields: { type: 'array', items: { type: 'string' } } },
      },
    });
    const schema = {
      oneOf: [
        { $ref: '#/components/schemas/StaticDataRequest' },
        { $ref: '#/components/schemas/CustomDataRequest' },
      ],
    };

    expect(labelsOf(schemaProcessor(schema, doc))).toEqual([
      'StaticDataRequest',
      'CustomDataRequest',
    ]);
  });

  it('fixture 3: museum.yml /default request body — plain oneOf [Cat, Dog]', () => {
    const doc = makeDocument({
      Cat: { type: 'object', properties: { meow: { type: 'string' } } },
      Dog: { type: 'object', properties: { bark: { type: 'string' } } },
    });
    const schema = {
      oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
    };

    expect(labelsOf(schemaProcessor(schema, doc))).toEqual(['Cat', 'Dog']);
  });

  it('fixture 4: museum.yml /default 200 response — plain oneOf [CatResponse, DogResponse]', () => {
    const doc = makeDocument({
      CatResponse: { type: 'object', properties: { meowId: { type: 'string' } } },
      DogResponse: { type: 'object', properties: { barkId: { type: 'string' } } },
    });
    const schema = {
      oneOf: [
        { $ref: '#/components/schemas/CatResponse' },
        { $ref: '#/components/schemas/DogResponse' },
      ],
    };

    expect(labelsOf(schemaProcessor(schema, doc))).toEqual(['CatResponse', 'DogResponse']);
  });

  it('fixture 5: discriminator with mapping — labels are mapping keys (preserve order)', () => {
    const doc = makeDocument({
      Cat: { type: 'object', properties: { cafeType: { type: 'string' } } },
      Dog: { type: 'object', properties: { cafeType: { type: 'string' } } },
    });
    const schema = {
      type: 'object',
      discriminator: {
        propertyName: 'cafeType',
        mapping: {
          cat: '#/components/schemas/Cat',
          dog: '#/components/schemas/Dog',
        },
      },
      oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
    };

    expect(labelsOf(schemaProcessor(schema, doc))).toEqual(['cat', 'dog']);
  });

  it('fixture 6: discriminator with defaultMapping (OAS 3.2) — appends "Default mapping" last', () => {
    const doc = makeDocument({
      Cat: { type: 'object', properties: { petType: { type: 'string' } } },
      Dog: { type: 'object', properties: { petType: { type: 'string' } } },
      OtherPet: { type: 'object', properties: { petType: { type: 'string' } } },
    });
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

    expect(labelsOf(schemaProcessor(schema, doc))).toEqual(['cat', 'dog', 'Default mapping']);
  });
});

describe('deriveVariantLabel helper — direct parity with middle panel', () => {
  function labelsViaHelper(variants: SchemaNode[], parent: SchemaNode = {}): string[] {
    return variants.map((variant) => deriveVariantLabel(variant, parent).label);
  }

  it('matches "[Identity Verification, Fraud Prevention, A+ Services]" for fixture 1', () => {
    expect(
      labelsViaHelper([
        { 'x-original-ref': '#/components/schemas/Identity Verification' },
        { 'x-original-ref': '#/components/schemas/Fraud Prevention' },
        { 'x-original-ref': '#/components/schemas/A+ Services' },
      ]),
    ).toEqual(['Identity Verification', 'Fraud Prevention', 'A+ Services']);
  });

  it('matches "[StaticDataRequest, CustomDataRequest]" for fixture 2', () => {
    expect(
      labelsViaHelper([
        { 'x-original-ref': '#/components/schemas/StaticDataRequest' },
        { 'x-original-ref': '#/components/schemas/CustomDataRequest' },
      ]),
    ).toEqual(['StaticDataRequest', 'CustomDataRequest']);
  });

  it('matches "[Cat, Dog]" for fixture 3', () => {
    expect(
      labelsViaHelper([
        { 'x-original-ref': '#/components/schemas/Cat' },
        { 'x-original-ref': '#/components/schemas/Dog' },
      ]),
    ).toEqual(['Cat', 'Dog']);
  });

  it('matches "[CatResponse, DogResponse]" for fixture 4', () => {
    expect(
      labelsViaHelper([
        { 'x-original-ref': '#/components/schemas/CatResponse' },
        { 'x-original-ref': '#/components/schemas/DogResponse' },
      ]),
    ).toEqual(['CatResponse', 'DogResponse']);
  });

  it('prefers title over ref-derived name when both are present', () => {
    expect(
      labelsViaHelper([
        { title: 'Coffee Drink', 'x-original-ref': '#/components/schemas/Coffee' },
        { 'x-original-ref': '#/components/schemas/Tea' },
      ]),
    ).toEqual(['Coffee Drink', 'Tea']);
  });

  it('uses the const value as the label for const-only variants', () => {
    expect(labelsViaHelper([{ const: 'cat' }, { const: 'dog' }])).toEqual(['cat', 'dog']);
    expect(labelsViaHelper([{ const: 1 }, { const: 2 }])).toEqual(['1', '2']);
  });

  it('falls back to a type label when neither title nor ref is available', () => {
    expect(labelsViaHelper([{ type: 'string' }, { type: 'integer' }])).toEqual([
      'string',
      'integer',
    ]);
  });
});

describe('variant-label parity (right-panel source via findSchemaVariantAxis)', () => {
  function rightPanelLabels(
    schemaStore: Record<string, SchemaEntry>,
    rootId: string,
  ): string[] | undefined {
    const axis = findSchemaVariantAxis(rootId, schemaStore);
    return axis?.options.map((opt) => opt.label);
  }

  function makeStore(
    entries: Record<string, Record<string, unknown>>,
  ): Record<string, SchemaEntry> {
    return Object.fromEntries(
      Object.entries(entries).map(([id, data]) => [id, { id, kind: schemaKind.JSON_SCHEMA, data }]),
    );
  }

  it('right panel surfaces "[Identity Verification, Fraud Prevention, A+ Services]"', () => {
    const store = makeStore({
      'components/schemas/Identity Verification': {
        type: 'object',
        properties: { client_id: { type: 'string' } },
      },
      'components/schemas/Fraud Prevention': {
        type: 'object',
        properties: { riskScore: { type: 'number' } },
      },
      'components/schemas/A+ Services': {
        type: 'object',
        properties: { tier: { type: 'string' } },
      },
      body: {
        oneOf: [
          { $ref: '#/components/schemas/Identity Verification' },
          { $ref: '#/components/schemas/Fraud Prevention' },
          { $ref: '#/components/schemas/A+ Services' },
        ],
      },
    });
    expect(rightPanelLabels(store, 'body')).toEqual([
      'Identity Verification',
      'Fraud Prevention',
      'A+ Services',
    ]);
  });

  it('right panel surfaces "[StaticDataRequest, CustomDataRequest]"', () => {
    const store = makeStore({
      'components/schemas/StaticDataRequest': { type: 'object' },
      'components/schemas/CustomDataRequest': { type: 'object' },
      body: {
        oneOf: [
          { $ref: '#/components/schemas/StaticDataRequest' },
          { $ref: '#/components/schemas/CustomDataRequest' },
        ],
      },
    });
    expect(rightPanelLabels(store, 'body')).toEqual(['StaticDataRequest', 'CustomDataRequest']);
  });

  it('right panel surfaces "[Cat, Dog]"', () => {
    const store = makeStore({
      'components/schemas/Cat': { type: 'object' },
      'components/schemas/Dog': { type: 'object' },
      body: {
        oneOf: [{ $ref: '#/components/schemas/Cat' }, { $ref: '#/components/schemas/Dog' }],
      },
    });
    expect(rightPanelLabels(store, 'body')).toEqual(['Cat', 'Dog']);
  });

  it('right panel surfaces "[CatResponse, DogResponse]"', () => {
    const store = makeStore({
      'components/schemas/CatResponse': { type: 'object' },
      'components/schemas/DogResponse': { type: 'object' },
      body: {
        oneOf: [
          { $ref: '#/components/schemas/CatResponse' },
          { $ref: '#/components/schemas/DogResponse' },
        ],
      },
    });
    expect(rightPanelLabels(store, 'body')).toEqual(['CatResponse', 'DogResponse']);
  });

  it('right panel surfaces "[cat, dog]" for discriminator with mapping', () => {
    const store = makeStore({
      'components/schemas/Cat': { type: 'object', properties: { cafeType: { type: 'string' } } },
      'components/schemas/Dog': { type: 'object', properties: { cafeType: { type: 'string' } } },
      body: {
        type: 'object',
        discriminator: {
          propertyName: 'cafeType',
          mapping: {
            cat: '#/components/schemas/Cat',
            dog: '#/components/schemas/Dog',
          },
        },
      },
    });
    expect(rightPanelLabels(store, 'body')).toEqual(['cat', 'dog']);
  });

  it('right panel surfaces "[cat, dog, Default mapping]" for OAS 3.2 defaultMapping', () => {
    const store = makeStore({
      'components/schemas/Cat': { type: 'object', properties: { petType: { type: 'string' } } },
      'components/schemas/Dog': { type: 'object', properties: { petType: { type: 'string' } } },
      'components/schemas/OtherPet': {
        type: 'object',
        properties: { petType: { type: 'string' } },
      },
      body: {
        type: 'object',
        discriminator: {
          propertyName: 'petType',
          mapping: {
            cat: '#/components/schemas/Cat',
            dog: '#/components/schemas/Dog',
          },
          defaultMapping: '#/components/schemas/OtherPet',
        },
      },
    });
    expect(rightPanelLabels(store, 'body')).toEqual(['cat', 'dog', 'Default mapping']);
  });
});
