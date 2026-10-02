import { describe, expect, it } from 'vitest';

import { buildComponentsFromClosure, collectComponentClosure } from '../component-closure.js';

import type { ComponentClosure } from '../component-closure.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const entry of Object.values(value)) deepFreeze(entry);
  }
  return value;
}

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  return value as T;
}

function keptNames(closure: ComponentClosure, bucket: string): string[] {
  return Array.from(closure.keep.get(bucket) ?? []).sort();
}

describe('collectComponentClosure', () => {
  it('walks transitive $refs across arbitrary component buckets', () => {
    const document = deepFreeze({
      components: {
        parameters: {
          Page: { name: 'page', in: 'query', schema: { $ref: '#/components/schemas/PageSize' } },
        },
        schemas: {
          PageSize: { type: 'integer' },
          Unrelated: { type: 'object' },
        },
        responses: {
          List: {
            description: 'ok',
            headers: { 'X-Rate': { $ref: '#/components/headers/Rate' } },
          },
        },
        headers: { Rate: { schema: { $ref: '#/components/schemas/PageSize' } } },
      },
    });
    const seeds = deepFreeze([
      {
        parameters: [{ $ref: '#/components/parameters/Page' }],
        responses: { '200': { $ref: '#/components/responses/List' } },
      },
    ]);

    const closure = collectComponentClosure(document, seeds);

    expect(Array.from(closure.keep.keys()).sort()).toEqual([
      'headers',
      'parameters',
      'responses',
      'schemas',
    ]);
    expect(keptNames(closure, 'parameters')).toEqual(['Page']);
    expect(keptNames(closure, 'responses')).toEqual(['List']);
    expect(keptNames(closure, 'headers')).toEqual(['Rate']);
    expect(keptNames(closure, 'schemas')).toEqual(['PageSize']);
    expect(closure.inlineTargets.size).toBe(0);
  });

  it('decodes JSON-pointer segments in component names', () => {
    const document = deepFreeze({
      components: {
        schemas: {
          'a/b~c': { type: 'object', properties: { next: { $ref: '#/components/schemas/Plain' } } },
          Plain: { type: 'string' },
        },
      },
    });

    const closure = collectComponentClosure(document, [
      deepFreeze({ $ref: '#/components/schemas/a~1b~0c' }),
    ]);

    expect(keptNames(closure, 'schemas')).toEqual(['Plain', 'a/b~c']);
    const components = expectDefined(buildComponentsFromClosure(document, closure.keep));
    expect(Object.keys(components.schemas as Record<string, unknown>)).toEqual(['a/b~c', 'Plain']);
  });

  it('skips refs to missing components without keeping or inlining them', () => {
    const document = deepFreeze({ components: { schemas: { Real: { type: 'object' } } } });
    const seeds = deepFreeze([
      { $ref: '#/components/schemas/Missing' },
      { $ref: '#/components/schemas/Real' },
      { $ref: '#/components/widgets/W' },
    ]);

    const closure = collectComponentClosure(document, seeds);

    expect(keptNames(closure, 'schemas')).toEqual(['Real']);
    expect(keptNames(closure, 'widgets')).toEqual([]);
    expect(closure.inlineTargets.size).toBe(0);

    const missingOnly = collectComponentClosure(document, [
      deepFreeze({ $ref: '#/components/schemas/Missing' }),
    ]);
    expect(buildComponentsFromClosure(document, missingOnly.keep)).toBeUndefined();
  });

  it('keeps security schemes named by security requirements in any seed', () => {
    const document = deepFreeze({
      components: {
        securitySchemes: {
          ApiKey: { type: 'apiKey', name: 'X-Key', in: 'header' },
          OAuth2: {
            type: 'oauth2',
            flows: { clientCredentials: { tokenUrl: 'https://t', scopes: { write: 'w' } } },
          },
          Unused: { type: 'http', scheme: 'basic' },
        },
      },
    });
    const seeds = deepFreeze([
      { operationId: 'createPet', security: [{ OAuth2: ['write'] }, { Ghost: [] }] },
      { openapi: '3.1.0', security: [{ ApiKey: [] }] },
    ]);

    const closure = collectComponentClosure(document, seeds);

    expect(keptNames(closure, 'securitySchemes')).toEqual(['ApiKey', 'OAuth2']);
  });

  it('keeps discriminator mapping targets given as refs and as bare schema names', () => {
    const document = deepFreeze({
      components: {
        schemas: {
          Pet: {
            type: 'object',
            discriminator: {
              propertyName: 'kind',
              mapping: { cat: '#/components/schemas/Cat', dog: 'Dog' },
            },
          },
          Cat: { type: 'object' },
          Dog: { type: 'object' },
          Fish: { type: 'object' },
        },
      },
    });

    const closure = collectComponentClosure(document, [
      deepFreeze({ $ref: '#/components/schemas/Pet' }),
    ]);

    expect(keptNames(closure, 'schemas')).toEqual(['Cat', 'Dog', 'Pet']);
  });

  it('treats x-discriminator like discriminator for mappings and implicit variants', () => {
    const document = deepFreeze({
      components: {
        schemas: {
          Shape: {
            type: 'object',
            'x-discriminator': {
              propertyName: 'kind',
              mapping: { circle: '#/components/schemas/Circle', square: 'Square' },
            },
          },
          Circle: { type: 'object' },
          Square: { type: 'object' },
          Blob: { allOf: [{ $ref: '#/components/schemas/Shape' }] },
          Other: { type: 'object' },
        },
      },
    });

    const closure = collectComponentClosure(document, [
      deepFreeze({ $ref: '#/components/schemas/Shape' }),
    ]);

    expect(keptNames(closure, 'schemas')).toEqual(['Blob', 'Circle', 'Shape', 'Square']);
  });

  it('pulls allOf variants only for kept parents that declare a discriminator', () => {
    const document = deepFreeze({
      components: {
        schemas: {
          Parent: { type: 'object', discriminator: { propertyName: 'kind' } },
          ChildA: { allOf: [{ $ref: '#/components/schemas/Parent' }, { type: 'object' }] },
          PlainParent: { type: 'object' },
          ChildB: { allOf: [{ $ref: '#/components/schemas/PlainParent' }, { type: 'object' }] },
        },
      },
    });
    const seeds = deepFreeze([
      { $ref: '#/components/schemas/Parent' },
      { $ref: '#/components/schemas/PlainParent' },
    ]);

    const closure = collectComponentClosure(document, seeds);

    expect(keptNames(closure, 'schemas')).toEqual(['ChildA', 'Parent', 'PlainParent']);
  });

  it('records non-component internal refs as inline targets and walks them', () => {
    const sharedThing = {
      type: 'object',
      properties: { pet: { $ref: '#/components/schemas/Pet' } },
    };
    const document = deepFreeze({
      'x-shared': { Thing: sharedThing },
      components: { schemas: { Pet: { type: 'object' } } },
    });

    const closure = collectComponentClosure(document, [
      deepFreeze({ schema: { $ref: '#/x-shared/Thing' } }),
    ]);

    expect(closure.inlineTargets.size).toBe(1);
    expect(closure.inlineTargets.get('#/x-shared/Thing')).toBe(sharedThing);
    expect(keptNames(closure, 'schemas')).toEqual(['Pet']);
  });

  it('ignores internal refs that do not resolve', () => {
    const document = deepFreeze({ components: { schemas: { Pet: { type: 'object' } } } });

    const closure = collectComponentClosure(document, [deepFreeze({ $ref: '#/x-missing/Nope' })]);

    expect(closure.inlineTargets.size).toBe(0);
    expect(closure.keep.size).toBe(0);
  });

  it('retainRef suppresses inlining and walking of non-component refs but not component refs', () => {
    const document = deepFreeze({
      'x-shared': { Thing: { schema: { $ref: '#/components/schemas/Inner' } } },
      components: { schemas: { Pet: { type: 'object' }, Inner: { type: 'object' } } },
    });
    const seeds = deepFreeze([
      { a: { $ref: '#/x-shared/Thing' }, b: { $ref: '#/components/schemas/Pet' } },
    ]);

    const retained = collectComponentClosure(document, [...seeds], () => true);
    expect(retained.inlineTargets.size).toBe(0);
    expect(keptNames(retained, 'schemas')).toEqual(['Pet']);

    const unrestricted = collectComponentClosure(document, [...seeds]);
    expect(unrestricted.inlineTargets.has('#/x-shared/Thing')).toBe(true);
    expect(keptNames(unrestricted, 'schemas')).toEqual(['Inner', 'Pet']);
  });

  it('ignores refs pointing to other files', () => {
    const document = deepFreeze({ components: { schemas: { X: { type: 'object' } } } });
    const seeds = deepFreeze([
      { $ref: './shared.yaml#/components/schemas/X' },
      { $ref: 'https://example.com/openapi.yaml#/components/schemas/X' },
    ]);

    const closure = collectComponentClosure(document, seeds);

    expect(closure.keep.size).toBe(0);
    expect(closure.inlineTargets.size).toBe(0);
  });

  it('dedupes repeated component and inline refs', () => {
    const document = deepFreeze({
      'x-defs': { D: { type: 'object' } },
      components: { schemas: { Pet: { type: 'object' } } },
    });
    const seeds = deepFreeze([
      {
        a: { $ref: '#/components/schemas/Pet' },
        b: { $ref: '#/components/schemas/Pet' },
        c: { $ref: '#/x-defs/D' },
        d: { $ref: '#/x-defs/D' },
      },
    ]);

    const closure = collectComponentClosure(document, seeds);

    expect(keptNames(closure, 'schemas')).toEqual(['Pet']);
    expect(closure.inlineTargets.size).toBe(1);
  });

  it('terminates on cyclic and self-referencing schemas', () => {
    const document = deepFreeze({
      components: {
        schemas: {
          A: { type: 'object', properties: { b: { $ref: '#/components/schemas/B' } } },
          B: { type: 'object', properties: { a: { $ref: '#/components/schemas/A' } } },
          Node: {
            type: 'object',
            properties: {
              children: { type: 'array', items: { $ref: '#/components/schemas/Node' } },
            },
          },
        },
      },
    });
    const seeds = deepFreeze([
      { $ref: '#/components/schemas/A' },
      { $ref: '#/components/schemas/Node' },
    ]);

    const closure = collectComponentClosure(document, seeds);

    expect(keptNames(closure, 'schemas')).toEqual(['A', 'B', 'Node']);
  });
});

describe('buildComponentsFromClosure', () => {
  const makeDocument = () =>
    deepFreeze({
      components: {
        schemas: {
          Alpha: { type: 'object' },
          Beta: { type: 'string' },
          Gamma: { type: 'integer' },
        },
        parameters: { P: { name: 'p', in: 'query' } },
        headers: { H: { schema: { type: 'string' } } },
      },
    });

  it('prunes buckets to kept names preserving source order and drops unkept buckets', () => {
    const keep = new Map([
      ['headers', new Set(['H'])],
      ['schemas', new Set(['Gamma', 'Alpha'])],
    ]);

    const components = expectDefined(buildComponentsFromClosure(makeDocument(), keep));

    expect(Object.keys(components)).toEqual(['schemas', 'headers']);
    expect(components.schemas).toEqual({ Alpha: { type: 'object' }, Gamma: { type: 'integer' } });
    expect(Object.keys(components.schemas as Record<string, unknown>)).toEqual(['Alpha', 'Gamma']);
    expect(components.headers).toEqual({ H: { schema: { type: 'string' } } });
    expect(components.parameters).toBeUndefined();
  });

  it('drops kept names and buckets missing from the source components', () => {
    const keep = new Map([
      ['schemas', new Set(['Alpha', 'Ghost'])],
      ['widgets', new Set(['W'])],
    ]);

    const components = expectDefined(buildComponentsFromClosure(makeDocument(), keep));

    expect(components).toEqual({ schemas: { Alpha: { type: 'object' } } });
    expect(
      buildComponentsFromClosure(makeDocument(), new Map([['schemas', new Set(['Ghost'])]])),
    ).toBeUndefined();
  });

  it('returns undefined for empty keep, missing components, and non-record buckets', () => {
    const keep = new Map([['schemas', new Set(['Alpha'])]]);

    expect(buildComponentsFromClosure(makeDocument(), new Map())).toBeUndefined();
    expect(buildComponentsFromClosure(deepFreeze({}), keep)).toBeUndefined();
    expect(buildComponentsFromClosure(deepFreeze({ components: [] }), keep)).toBeUndefined();
    expect(
      buildComponentsFromClosure(deepFreeze({ components: { schemas: 'oops' } }), keep),
    ).toBeUndefined();
  });
});
