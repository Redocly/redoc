import { describe, expect, it } from 'vitest';

import type { ApiStore } from '../../types/store.js';
import type { GraphqlStoreFieldData } from '../../types/graphql-store.js';

import { buildGraphqlStoreFromSdl } from '../../adapters/graphql/buildStoreFromSdl.js';
import {
  createGraphqlTypeLookup,
  generateOperationExample,
  generateOperationResponseExample,
  generateOperationVariablesExample,
  getOperationFromStore,
  parseTypeNotation,
} from '../graphql-samples.js';

function multilineForSamplesMaxInlineArgs(argCount: number, samplesMaxInlineArgs: number): boolean {
  return argCount > samplesMaxInlineArgs;
}

function setup(sdl: string) {
  const store = buildGraphqlStoreFromSdl(sdl);
  return { store, lookup: createGraphqlTypeLookup(store.schemaStore) };
}

function queryOperation(store: ApiStore, name: string): GraphqlStoreFieldData {
  const operation = getOperationFromStore(store, 'query', name);
  if (!operation) throw new Error(`expected query "${name}" to resolve from the store`);
  return operation;
}

describe('graphql-samples', () => {
  describe('parseTypeNotation', () => {
    it('parses a bare type name', () => {
      expect(parseTypeNotation('User')).toEqual({ kind: 'named', name: 'User' });
    });

    it('parses single list and non-null wrappers', () => {
      expect(parseTypeNotation('[User!]!')).toEqual({
        kind: 'non-null',
        ofType: {
          kind: 'list',
          ofType: { kind: 'non-null', ofType: { kind: 'named', name: 'User' } },
        },
      });
    });

    it('parses arbitrarily nested lists', () => {
      expect(parseTypeNotation('[[Int!]]!')).toEqual({
        kind: 'non-null',
        ofType: {
          kind: 'list',
          ofType: {
            kind: 'list',
            ofType: { kind: 'non-null', ofType: { kind: 'named', name: 'Int' } },
          },
        },
      });
    });
  });

  describe('getOperationFromStore', () => {
    it('resolves operations through renamed root types', () => {
      const { store } = setup(`
        schema { query: RootQ }
        type RootQ { ping: String }
      `);
      expect(getOperationFromStore(store, 'query', 'ping')?.name).toBe('ping');
    });

    it('returns undefined for unknown operations and missing root types', () => {
      const { store } = setup(`
        type Query { ping: String }
      `);
      expect(getOperationFromStore(store, 'query', 'nope')).toBeUndefined();
      expect(getOperationFromStore(store, 'mutation', 'ping')).toBeUndefined();
    });
  });

  describe('generateOperationExample — variable declaration (graphql-docs getVariablesExample parity)', () => {
    const { store, lookup } = setup(`
      scalar S
      type Query {
        two(a: S, b: S): String
      }
    `);
    const operation = queryOperation(store, 'two');

    it('uses single-line variables when multilineArguments is false', () => {
      const out = generateOperationExample('query', operation, lookup, 1, false);
      expect(out).toContain('query two($a: S, $b: S) {');
    });

    it('uses multiline variables when multilineArguments is true', () => {
      const out = generateOperationExample('query', operation, lookup, 1, true);
      expect(out).toContain('query two(\n  $a: S\n  $b: S\n) {');
    });
  });

  describe('samplesMaxInlineArgs semantics (GraphQLQueryItem)', () => {
    const { store, lookup } = setup(`
      scalar S
      type Query {
        many(a: S, b: S, c: S): String
      }
    `);
    const operation = queryOperation(store, 'many');

    it('uses inline variables when arg count is at most samplesMaxInlineArgs', () => {
      const multiline = multilineForSamplesMaxInlineArgs(operation.args?.length ?? 0, 3);
      expect(multiline).toBe(false);
      const out = generateOperationExample('query', operation, lookup, 1, multiline);
      expect(out).toContain('query many($a: S, $b: S, $c: S) {');
    });

    it('uses multiline variables when arg count exceeds samplesMaxInlineArgs', () => {
      const multiline = multilineForSamplesMaxInlineArgs(operation.args?.length ?? 0, 2);
      expect(multiline).toBe(true);
      const out = generateOperationExample('query', operation, lookup, 1, multiline);
      expect(out).toContain('query many(\n  $a: S\n  $b: S\n  $c: S\n) {');
    });
  });

  describe('generateOperationExample — field arguments string (graphql-docs getArgumentsExample parity)', () => {
    const { store, lookup } = setup(`
      type Query {
        root(x: Int, y: Int): Child
      }
      type Child {
        leaf: String
      }
    `);
    const operation = queryOperation(store, 'root');

    it('uses single-line operation arguments when multilineArguments is false', () => {
      const out = generateOperationExample('query', operation, lookup, 1, false);
      expect(out).toContain('root(x: $x, y: $y)');
    });

    it('uses multiline operation arguments when multilineArguments is true', () => {
      const out = generateOperationExample('query', operation, lookup, 1, true);
      expect(out).toContain('root(\n');
      expect(out).toMatch(/x: \$x\n\s+y: \$y\n\s+\)/);
    });
  });

  describe('generateOperationExample — translatable labels', () => {
    it('uses translated "argumentsHere" label inside deeply-nested argument blocks', () => {
      const { store, lookup } = setup(`
        type Query {
          root(x: Int): Child
        }
        type Child {
          leaf(y: Int): String
        }
      `);
      const operation = queryOperation(store, 'root');

      const out = generateOperationExample('query', operation, lookup, 2, false, {
        argumentsHere: 'Argumentos aquí',
      });

      expect(out).toContain('# Argumentos aquí');
      expect(out).not.toContain('# Arguments Here');
    });

    it('uses translated "fragment" label when nesting hits the max expand level', () => {
      const { store, lookup } = setup(`
        type Query {
          item: Widget
        }
        type Widget {
          id: String
          nested: Widget
        }
      `);
      const operation = queryOperation(store, 'item');

      const out = generateOperationExample('query', operation, lookup, 1, false, {
        fragment: 'Fragmento',
      });

      expect(out).toContain('# ...WidgetFragmento');
      expect(out).not.toMatch(/Fragment(?![a-z])/);
    });

    it('falls back to English defaults when labels are omitted or partial', () => {
      const { store, lookup } = setup(`
        type Query {
          root(x: Int): Child
        }
        type Child {
          leaf(y: Int): Child
        }
      `);
      const operation = queryOperation(store, 'root');

      const fullyDefault = generateOperationExample('query', operation, lookup, 2, false);
      expect(fullyDefault).toContain('# Arguments Here');
      expect(fullyDefault).toContain('# ...ChildFragment');

      const onlyOneOverridden = generateOperationExample('query', operation, lookup, 2, false, {
        fragment: 'Fragmento',
      });
      expect(onlyOneOverridden).toContain('# Arguments Here');
      expect(onlyOneOverridden).toContain('# ...ChildFragmento');
    });
  });

  describe('jsonSamplesDepth via expandLevel', () => {
    const { store, lookup } = setup(`
      type Query {
        item: Widget
      }
      type Widget {
        id: String
        nested: Widget
      }
    `);
    const operation = queryOperation(store, 'item');

    it('generateOperationResponseExample respects expandLevel for nesting', () => {
      const shallow = generateOperationResponseExample(operation.type.display, lookup, 1) as {
        data: Record<string, unknown>;
      };
      expect(shallow.data).toMatchObject({ id: 'Example String' });
      expect(shallow.data.nested).toEqual({ __typename: 'Widget' });

      const deeper = generateOperationResponseExample(operation.type.display, lookup, 2) as {
        data: Record<string, unknown>;
      };
      expect(deeper.data.nested).toMatchObject({
        id: 'Example String',
        nested: { __typename: 'Widget' },
      });
    });

    it('generateOperationVariablesExample respects expandLevel for nested input objects', () => {
      const { store: inputStore, lookup: inputLookup } = setup(`
        input Inner {
          code: String
        }
        input Outer {
          inner: Inner
        }
        type Query {
          go(o: Outer): String
        }
      `);
      const op = queryOperation(inputStore, 'go');
      const shallow = generateOperationVariablesExample(op.args ?? [], inputLookup, 1);
      expect(shallow).toEqual({ o: { inner: { __typename: 'Inner' } } });

      const deeper = generateOperationVariablesExample(op.args ?? [], inputLookup, 2);
      expect(deeper).toEqual({ o: { inner: { code: 'Example String' } } });
    });
  });
});
