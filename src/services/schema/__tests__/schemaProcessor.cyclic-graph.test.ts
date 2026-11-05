import type { merge as mergeSchemas } from '@redocly/allof-merge';

import { describe, it, expect, vi } from 'vitest';

import type { Document, SchemaNode } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

const mergeCalls = vi.hoisted(() => ({ count: 0 }));
vi.mock('@redocly/allof-merge', async (importOriginal) => {
  const actual = await importOriginal<{ merge: typeof mergeSchemas }>();
  const merge: typeof mergeSchemas = (...args) => {
    mergeCalls.count++;
    return actual.merge(...args);
  };
  return { ...actual, merge };
});

function makeDocument(components: Record<string, SchemaNode>): Document {
  return {
    openapi: '3.1.0',
    info: { title: '', version: '1.0' },
    paths: {},
    components: { schemas: components },
  } as Document;
}

const refTo = (name: string): SchemaNode => ({ $ref: `#/components/schemas/${name}` });

function processPage(doc: Document, name: string) {
  return schemaProcessor(refTo(name), doc, { rootJsonPointer: `#/components/schemas/${name}` });
}

// Every entity links to every other entity through a property, so every path through
// the graph closes a different cycle.
function denseGraph(size: number): Document {
  const names = Array.from({ length: size }, (_, i) => `Entity${i}`);
  const schemas: Record<string, SchemaNode> = {};
  for (const name of names) {
    const properties: Record<string, SchemaNode> = { id: { type: 'string' } };
    for (const other of names) if (other !== name) properties[other] = refTo(other);
    schemas[name] = { type: 'object', properties };
  }
  return makeDocument(schemas);
}

// Entities linked through discriminator hosts whose inline variant embeds another entity,
// so the whole graph is reachable from every listed variant.
function entityGraph(entities: number, links: number): Document {
  const schemas: Record<string, SchemaNode> = {
    Reference: { type: 'object', properties: { uuid: { type: 'string' } } },
  };
  for (let i = 0; i < entities; i++) {
    const properties: Record<string, SchemaNode> = { id: { type: 'string' } };
    for (let j = 0; j < links; j++) {
      const target = `Entity${(i + j + 1) % entities}`;
      properties[`link${j}`] = refTo(`Entity${i}Link${j}`);
      schemas[`Entity${i}Link${j}`] = {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            inline: `#/components/schemas/${target}Inline`,
            reference: '#/components/schemas/Reference',
          },
        },
        oneOf: [refTo(`${target}Inline`), refTo('Reference')],
      };
    }
    schemas[`Entity${i}`] = { type: 'object', properties };
    schemas[`Entity${i}Inline`] = { type: 'object', properties: { entity: refTo(`Entity${i}`) } };
  }
  return makeDocument(schemas);
}

// A host that lists its variants in `oneOf` while every variant inherits the host through
// `allOf`, so each variant resolves back into the host.
function inheritingVariants(count: number): Record<string, SchemaNode> {
  const names = Array.from({ length: count }, (_, i) => `Variant${i}`);
  const mapping = Object.fromEntries(
    names.map((name) => [name.toLowerCase(), `#/components/schemas/${name}`]),
  );
  const schemas: Record<string, SchemaNode> = {
    Host: {
      type: 'object',
      required: ['type'],
      discriminator: { propertyName: 'type', mapping },
      oneOf: names.map((name) => refTo(name)),
      properties: { type: { type: 'string' } },
    },
  };
  for (const name of names) {
    schemas[name] = {
      allOf: [
        refTo('Host'),
        { type: 'object', properties: { [`${name}Field`]: { type: 'string' } } },
      ],
    };
  }
  return schemas;
}

// The dense graph plus an actor that every entity links to and whose subtype inherits it
// through `allOf`, so an `allOf` cycle closes under every path through the graph.
function denseGraphWithAllOfCycle(size: number): Document {
  const names = Array.from({ length: size }, (_, i) => `Entity${i}`);
  const schemas: Record<string, SchemaNode> = {
    Actor: { type: 'object', properties: { name: { type: 'string' }, person: refTo('Person') } },
    Person: {
      allOf: [refTo('Actor'), { type: 'object', properties: { email: { type: 'string' } } }],
    },
  };
  for (const name of names) {
    const properties: Record<string, SchemaNode> = {
      id: { type: 'string' },
      actor: refTo('Actor'),
    };
    for (const other of names) if (other !== name) properties[other] = refTo(other);
    schemas[name] = { type: 'object', properties };
  }
  return makeDocument(schemas);
}

// A host and a sibling host listing the same inheriting variants, with its own copy of the host's fields.
function sharedHostGraph(activityTypes: number): Record<string, SchemaNode> {
  const activities = Array.from({ length: activityTypes }, (_, i) => `Activity${i}`);
  const discriminator = {
    propertyName: 'kind',
    mapping: {
      person: '#/components/schemas/PersonAccount',
      business: '#/components/schemas/BusinessAccount',
    },
  };
  const accountFields = (): Record<string, SchemaNode> => ({
    id: { type: 'string' },
    kind: { type: 'string', enum: ['person', 'business'] },
    activityLog: { type: 'array', items: refTo('Activity') },
    contacts: { type: 'array', items: refTo('ContactPoint') },
  });
  const schemas: Record<string, SchemaNode> = {
    Account: {
      type: 'object',
      discriminator,
      anyOf: [refTo('PersonAccount'), refTo('BusinessAccount')],
      properties: accountFields(),
    },
    LinkedAccount: {
      type: 'object',
      discriminator,
      anyOf: [refTo('PersonAccount'), refTo('BusinessAccount')],
      properties: { ...accountFields(), role: { type: 'string' } },
    },
    PersonAccount: {
      allOf: [refTo('Account'), { type: 'object', properties: { firstName: { type: 'string' } } }],
    },
    BusinessAccount: {
      allOf: [
        refTo('Account'),
        {
          type: 'object',
          properties: { members: { type: 'array', items: refTo('LinkedAccount') } },
        },
      ],
    },
    ContactPoint: {
      type: 'object',
      properties: { value: { type: 'string' }, owner: refTo('Account') },
    },
    Activity: {
      oneOf: activities.map(refTo),
      discriminator: {
        propertyName: 'activityType',
        mapping: Object.fromEntries(
          activities.map((name) => [name, `#/components/schemas/${name}`]),
        ),
      },
    },
  };
  for (const name of activities) {
    schemas[name] = {
      type: 'object',
      properties: {
        activityType: { type: 'string', enum: [name] },
        participants: { type: 'array', items: refTo('LinkedAccount') },
        initiator: refTo('Account'),
      },
    };
  }
  return schemas;
}

// A host and a variant that redeclare `chain`, whose definitions differ at every level and link
// twice to the next level, so the last level is reached through 2^levels paths.
function branchingLadder(levels: number): Record<string, SchemaNode> {
  const schemas: Record<string, SchemaNode> = {
    Payment: {
      type: 'object',
      discriminator: { propertyName: 'method', mapping: { card: '#/components/schemas/Card' } },
      oneOf: [refTo('Card')],
      properties: { method: { type: 'string' }, chain: refTo('Host0') },
    },
    Card: { type: 'object', properties: { method: { const: 'card' }, chain: refTo('Variant0') } },
  };
  for (const side of ['Host', 'Variant']) {
    for (let level = 0; level <= levels; level++) {
      const next = refTo(`${side}${level + 1}`);
      schemas[`${side}${level}`] = {
        type: 'object',
        properties: {
          note:
            side === 'Host'
              ? { type: 'string', description: `Level ${level}` }
              : { type: 'string' },
          ...(level < levels && { left: next, right: next }),
        },
      };
    }
  }
  return schemas;
}

// A base extended by its subtypes through allOf, whose fields reach a record graph that links back to them.
function inheritedBaseGraph(records: number): Record<string, SchemaNode> {
  const names = Array.from({ length: records }, (_, i) => `Record${i}`);
  const schemas: Record<string, SchemaNode> = {
    Base: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        kind: { type: 'string', enum: ['person', 'business'] },
        history: { type: 'array', items: refTo('Record') },
      },
    },
    Person: {
      allOf: [refTo('Base'), { type: 'object', properties: { firstName: { type: 'string' } } }],
    },
    Business: {
      allOf: [
        refTo('Base'),
        { type: 'object', properties: { registrationNumber: { type: 'string' } } },
      ],
    },
    Account: {
      type: 'object',
      oneOf: [refTo('Base'), refTo('Person'), refTo('Business')],
      discriminator: {
        propertyName: 'kind',
        mapping: {
          person: '#/components/schemas/Person',
          business: '#/components/schemas/Business',
        },
      },
    },
    Record: {
      oneOf: names.map(refTo),
      discriminator: {
        propertyName: 'recordType',
        mapping: Object.fromEntries(names.map((name) => [name, `#/components/schemas/${name}`])),
      },
    },
  };
  for (const name of names) {
    const properties: Record<string, SchemaNode> = {
      recordType: { type: 'string', enum: [name] },
      owner: refTo('Account'),
    };
    for (const other of names) if (other !== name) properties[`related${other}`] = refTo(other);
    schemas[name] = { type: 'object', properties };
  }
  return schemas;
}

describe('schemaProcessor on cyclic schema graphs', () => {
  it('resolves every ref of a dense entity graph once, so the page stays fast', () => {
    const start = performance.now();
    const result = processPage(denseGraph(12), 'Entity0');
    expect(Object.keys(result.properties ?? {})).toHaveLength(12);
    // 12 entities means 12! distinct paths when refs inside cycles are not cached
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it('does not cache a bare alias that resolved to a cycle stub', () => {
    const doc = makeDocument({
      X: { type: 'object', properties: { name: { type: 'string' }, alias: refTo('XAlias') } },
      XAlias: refTo('X'),
      Root: { type: 'object', properties: { x: refTo('X'), y: refTo('XAlias') } },
    });
    const props = processPage(doc, 'Root').properties ?? {};
    expect(props['x']?.properties?.['alias']?.isCircular).toBe(true);
    expect(props['y']?.isCircular).toBeUndefined();
    expect(props['y']?.properties?.['name']?.type).toBe('string');
  });

  it('merges the page once and reuses its listed discriminator variants', () => {
    mergeCalls.count = 0;
    const result = processPage(entityGraph(12, 4), 'Entity0');
    expect(
      result.properties?.['link0']?.switcher?.options['inline']?.properties?.['entity'],
    ).toBeDefined();
    expect(mergeCalls.count).toBe(1);
  });

  it('keeps the inherited fields of a listed variant when the host itself is composed', () => {
    const doc = makeDocument({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
      Pet: {
        allOf: [refTo('Base')],
        discriminator: { propertyName: 'petType', mapping: { cat: '#/components/schemas/Cat' } },
        oneOf: [refTo('Cat')],
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [refTo('Pet'), { type: 'object', properties: { huntingSkill: { type: 'string' } } }],
      },
    });
    const cat = processPage(doc, 'Pet').switcher?.options['cat'];
    expect(Object.keys(cat?.properties ?? {}).sort()).toEqual(['huntingSkill', 'id', 'petType']);
  });

  it('resolves a listed variant on its own when a nested allOf closed on the composed host', () => {
    const doc = makeDocument({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
      Pet: {
        allOf: [refTo('Base')],
        discriminator: { propertyName: 'petType', mapping: { cat: '#/components/schemas/Cat' } },
        oneOf: [refTo('Cat')],
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        type: 'object',
        properties: {
          parent: { allOf: [refTo('Pet')] },
          owner: {
            allOf: [refTo('Pet'), { type: 'object', properties: { note: { type: 'string' } } }],
          },
        },
      },
    });
    const cat = processPage(doc, 'Pet').switcher?.options['cat'];
    expect(cat?.properties?.['parent']?.isCircular).toBe(true);
    expect(cat?.properties?.['owner']?.isCircular).toBe(true);
  });

  it('resolves a listed variant on its own when its list entry is a cycle stub', () => {
    const doc = makeDocument({
      Meta: { type: 'object', properties: { createdAt: { type: 'string' } } },
      Root: {
        type: 'object',
        discriminator: { propertyName: 'kind' },
        oneOf: [refTo('A'), refTo('B')],
        properties: { kind: { type: 'string' }, meta: refTo('Meta') },
      },
      A: { allOf: [refTo('Root'), { type: 'object', properties: { a: { type: 'string' } } }] },
      B: { allOf: [refTo('Root'), { type: 'object', properties: { b: { type: 'string' } } }] },
    });
    const a = processPage(doc, 'Root').switcher?.options['A'];
    expect(a?.isCircular).toBeUndefined();
    expect(a?.properties?.['a']?.type).toBe('string');
    expect(a?.properties?.['kind']?.type).toBe('string');
    expect(a?.properties?.['meta']?.properties?.['createdAt']?.type).toBe('string');
  });

  it('resolves a host whose listed variants inherit it through allOf once', () => {
    const start = performance.now();
    const options =
      processPage(makeDocument(inheritingVariants(14)), 'Host').switcher?.options ?? {};
    expect(Object.keys(options)).toHaveLength(14);
    expect(Object.keys(options['variant13']?.properties ?? {}).sort()).toEqual([
      'Variant13Field',
      'type',
    ]);
    // a variant cached with the host inside doubled the next one: 14 variants took seconds
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it('keeps the refs above an allOf cycle cacheable in a dense entity graph', () => {
    const start = performance.now();
    const result = processPage(denseGraphWithAllOfCycle(9), 'Entity0');
    expect(Object.keys(result.properties ?? {})).toHaveLength(10);
    expect(result.properties?.['actor']?.properties?.['name']?.type).toBe('string');
    // leaving every open ref uncached on an allOf cycle re-expands every path: 9 entities took 20 s
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it('keeps every variant of a plain oneOf host whole when the page resolved one first', () => {
    const schemas = inheritingVariants(3);
    delete schemas['Host'].discriminator;
    schemas['Order'] = {
      type: 'object',
      properties: { first: refTo('Variant0'), second: refTo('Host') },
    };
    const options = processPage(makeDocument(schemas), 'Order').properties?.['second']?.switcher
      ?.options;
    expect(Object.keys(options ?? {})).toEqual(['Variant0', 'Variant1', 'Variant2']);
    for (const [name, option] of Object.entries(options ?? {})) {
      expect(Object.keys(option.properties ?? {}).sort()).toEqual([`${name}Field`, 'type']);
    }
  });

  it('renders a property that points at a variant the page resolved before its host', () => {
    const schemas = inheritingVariants(3);
    schemas['Host'].properties = { type: { type: 'string' }, child: refTo('Variant0') };
    schemas['Order'] = {
      type: 'object',
      properties: { first: refTo('Variant0'), second: refTo('Host') },
    };
    const child = processPage(makeDocument(schemas), 'Order').properties?.['second']?.properties?.[
      'child'
    ];
    expect(child?.isCircular).toBeUndefined();
    expect(Object.keys(child?.properties ?? {}).sort()).toEqual(['Variant0Field', 'child', 'type']);
  });

  it('keeps the fields a sibling host redeclares cheap when they carry the graph', () => {
    const start = performance.now();
    const options =
      processPage(makeDocument(sharedHostGraph(8)), 'Account').switcher?.options ?? {};
    expect(Object.keys(options)).toEqual(['person', 'business']);
    expect(Object.keys(options['business']?.properties ?? {}).sort()).toEqual([
      'activityLog',
      'contacts',
      'id',
      'kind',
      'members',
    ]);
    // the tree is lazy: reach a LinkedAccount option, where the sibling host's copies are merged
    const member =
      options['business']?.properties?.['members']?.items?.[0]?.switcher?.options?.['person'];
    expect(Object.keys(member?.properties ?? {}).sort()).toEqual([
      'activityLog',
      'contacts',
      'firstName',
      'id',
      'kind',
    ]);
    // merging each shared field as a whole subtree walked the activity graph per field and per variant
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it('merges each level of a field a variant redeclares once, however many paths reach it', () => {
    mergeCalls.count = 0;
    const card = processPage(makeDocument(branchingLadder(12)), 'Payment').switcher?.options?.[
      'card'
    ];
    let level = card?.properties?.['chain'];
    for (let i = 0; i < 8; i++) level = level?.properties?.['right'];
    expect(level?.properties?.['note']?.description).toBe('Level 8');
    // every path through the ladder merged its levels again: 2^12 merges
    expect(mergeCalls.count).toBeLessThan(200);
  });

  it('expands a schema outside an allOf cycle target although it was first reached under it', () => {
    const doc = makeDocument({
      Root: { type: 'object', properties: { base: refTo('Base'), other: refTo('Wrapper') } },
      Base: {
        type: 'object',
        properties: { id: { type: 'string' }, link: refTo('Link'), wrapper: refTo('Wrapper') },
      },
      Wrapper: { type: 'object', properties: { link: refTo('Link') } },
      Link: { type: 'object', properties: { sub: refTo('Sub') } },
      Sub: {
        allOf: [refTo('Base'), { type: 'object', properties: { subField: { type: 'string' } } }],
      },
    });
    // under Base, Wrapper reuses the Link result that embeds the Base stub: it must stay out of
    // the cache that Root.other reads
    const other = processPage(doc, 'Root').properties?.['other'];
    const sub = other?.properties?.['link']?.properties?.['sub'];
    expect(sub?.isCircular).toBeUndefined();
    expect(Object.keys(sub?.properties ?? {}).sort()).toEqual([
      'id',
      'link',
      'subField',
      'wrapper',
    ]);
  });

  it('keeps a ref that its own $ref siblings reach again out of the cache while it embeds an allOf stub', () => {
    const doc = makeDocument({
      Root: { type: 'object', properties: { base: refTo('Base'), other: refTo('Link') } },
      Base: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          link: { ...refTo('Link'), properties: { again: refTo('Link') } },
        },
      },
      Link: { type: 'object', properties: { sub: refTo('Sub') } },
      Sub: {
        allOf: [refTo('Base'), { type: 'object', properties: { subField: { type: 'string' } } }],
      },
    });
    const sub = processPage(doc, 'Root').properties?.['other']?.properties?.['sub'];
    expect(sub?.isCircular).toBeUndefined();
    expect(Object.keys(sub?.properties ?? {}).sort()).toEqual(['id', 'link', 'subField']);
  });

  it('expands the fields of a variant outside the schema that was open where the page resolved it before', () => {
    const doc = makeDocument({
      Root: {
        type: 'object',
        properties: {
          links: { type: 'array', items: refTo('Linked') },
          initiator: refTo('Account'),
        },
      },
      Account: {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: { business: '#/components/schemas/Business' },
        },
        oneOf: [refTo('Business')],
        properties: { kind: { type: 'string' } },
      },
      Linked: {
        type: 'object',
        properties: { account: refTo('Account'), business: refTo('Business') },
      },
      Business: {
        allOf: [
          refTo('Account'),
          { type: 'object', properties: { members: { type: 'array', items: refTo('Linked') } } },
        ],
      },
    });
    // under Linked, Business resolves a second time with Account from the cache, so that result
    // depends on no open allOf target, yet it embeds the Linked stub
    const business = processPage(doc, 'Root').properties?.['initiator']?.switcher?.options?.[
      'business'
    ];
    const member = business?.properties?.['members']?.items?.[0];
    expect(member?.isCircular).toBeUndefined();
    expect(Object.keys(member?.properties ?? {})).toEqual(['account', 'business']);
  });

  it('expands an item outside its own list although the page resolved the list inside the item first', () => {
    const doc = makeDocument({
      Root: { type: 'object', properties: { first: refTo('Item'), plan: refTo('Plan') } },
      Plan: { type: 'object', properties: { items: refTo('ItemList') } },
      ItemList: { type: 'object', properties: { data: { type: 'array', items: refTo('Item') } } },
      Item: {
        type: 'object',
        properties: { name: { type: 'string' }, children: refTo('ItemList') },
      },
    });
    // under Item, ItemList is cached with the Item stub in data[]; under Plan, Item is no cycle
    const items = processPage(doc, 'Root').properties?.['plan']?.properties?.['items'];
    const item = items?.properties?.['data']?.items?.[0];
    expect(item?.isCircular).toBeUndefined();
    expect(Object.keys(item?.properties ?? {}).sort()).toEqual(['children', 'name']);
  });

  it('keeps the subtype a parent field points to under its own name where a sibling subtype reaches it', () => {
    const doc = makeDocument({
      Root: { type: 'object', properties: { data: refTo('Document') } },
      Resource: {
        type: 'object',
        properties: {
          owner: refTo('Account'),
          members: { type: 'array', items: refTo('Account') },
        },
      },
      Account: {
        allOf: [refTo('Resource'), { type: 'object', properties: { email: { type: 'string' } } }],
      },
      Document: {
        allOf: [refTo('Resource'), { type: 'object', properties: { title: { type: 'string' } } }],
      },
    });
    // Account merges the stub of the open Resource, which does not turn Account into a Resource
    const data = processPage(doc, 'Root').properties?.['data'];
    expect(data?.properties?.['owner']?.schemaName).toBe('Account');
    expect(data?.properties?.['members']?.schemaName).toBe('Account');
  });

  it('keeps the keywords of an allOf wrapper around a schema that is open', () => {
    const doc = makeDocument({
      Root: { type: 'object', properties: { folder: refTo('Folder') } },
      Node: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          parent: { description: 'The parent node', readOnly: true, allOf: [refTo('Node')] },
        },
      },
      Folder: {
        allOf: [refTo('Node'), { type: 'object', properties: { files: { type: 'string' } } }],
      },
    });
    const parent = processPage(doc, 'Root').properties?.['folder']?.properties?.['parent'];
    expect(parent?.accessMode).toBe('read-only');
    expect(parent?.description).toBe('The parent node');
  });

  it('keeps the $ref siblings of a field whose cycle stub is reused where its target is not open', () => {
    const doc = makeDocument({
      Entity: {
        allOf: [{ type: 'object', properties: { owner: refTo('User'), team: refTo('Team') } }],
      },
      User: { type: 'object', description: 'A user', properties: { manager: refTo('Employee') } },
      Team: { type: 'object', properties: { lead: refTo('Employee') } },
      Employee: {
        allOf: [
          refTo('Entity'),
          {
            type: 'object',
            properties: {
              account: { ...refTo('User'), description: 'Login account', readOnly: true },
            },
          },
        ],
      },
    });
    // under owner, Employee is cached with the User stub in account; under team, User is not open
    const entity = processPage(doc, 'Entity');
    const employees = [
      entity.properties?.['owner']?.properties?.['manager'],
      entity.properties?.['team']?.properties?.['lead'],
    ];
    for (const employee of employees) {
      const account = employee?.properties?.['account'];
      expect(account?.accessMode).toBe('read-only');
      expect(account?.description).toBe('Login account');
    }
  });

  it('drops a result that embeds stubs of two open allOf targets when the inner one closes', () => {
    const doc = makeDocument({
      Root: { type: 'object', properties: { a: refTo('A') } },
      A: { type: 'object', properties: { b: refTo('B'), again: refTo('Shared') } },
      B: { type: 'object', properties: { bField: { type: 'string' }, shared: refTo('Shared') } },
      Shared: { type: 'object', properties: { underB: refTo('SubB'), underA: refTo('SubA') } },
      SubB: { allOf: [refTo('B'), { type: 'object', properties: { subB: { type: 'string' } } }] },
      SubA: { allOf: [refTo('A'), { type: 'object', properties: { subA: { type: 'string' } } }] },
    });
    const again = processPage(doc, 'Root').properties?.['a']?.properties?.['again'];
    const underB = again?.properties?.['underB'];
    expect(underB?.isCircular).toBeUndefined();
    expect(Object.keys(underB?.properties ?? {}).sort()).toEqual(['bField', 'shared', 'subB']);
  });

  it('drops the results scoped to an allOf target when it closes, so a later frame of it resolves them again', () => {
    const doc = makeDocument({
      Root: { type: 'object', properties: { first: refTo('A'), second: refTo('T') } },
      A: { type: 'object', properties: { aField: { type: 'string' }, t: refTo('T') } },
      T: { type: 'object', properties: { s: refTo('S') } },
      S: { type: 'object', properties: { underT: refTo('SubT'), underA: refTo('SubA') } },
      SubT: { allOf: [refTo('T'), { type: 'object', properties: { subT: { type: 'string' } } }] },
      SubA: { allOf: [refTo('A'), { type: 'object', properties: { subA: { type: 'string' } } }] },
    });
    const second = processPage(doc, 'Root').properties?.['second'];
    const underA = second?.properties?.['s']?.properties?.['underA'];
    expect(underA?.isCircular).toBeUndefined();
    expect(Object.keys(underA?.properties ?? {}).sort()).toEqual(['aField', 'subA', 't']);
  });

  it('resolves the page of a schema that its subtypes extend once per open frame', () => {
    const start = performance.now();
    const result = processPage(makeDocument(inheritedBaseGraph(7)), 'Person');
    expect(Object.keys(result.properties ?? {}).sort()).toEqual([
      'firstName',
      'history',
      'id',
      'kind',
    ]);
    const records = result.properties?.['history']?.items?.[0]?.switcher?.options ?? {};
    expect(Object.keys(records)).toHaveLength(7);
    // with the page root as the allOf cycle target, nothing under it was cached: 7 records took 26 s
    expect(performance.now() - start).toBeLessThan(1000);
  });
});
