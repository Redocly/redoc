import { describe, expect, it } from 'vitest';

import type { GraphqlStoreFieldData, GraphqlTypeData } from '../../types/graphql-store.js';

import { buildGraphqlStoreFromSdl } from '../../adapters/graphql/buildStoreFromSdl.js';
import { createGraphqlTypeLookup } from '../graphql-samples.js';
import {
  countNamedTypeFields,
  graphqlTypeHasExpandableFields,
  isGraphqlFieldExpandable,
} from '../graphql-type-expansion.js';

const store = buildGraphqlStoreFromSdl(`
  scalar DateTime

  type Query {
    scalar: String
    dt: DateTime
    scalarWithArgs(id: ID!): String
    createWithInput(input: PersonInput!): Person
    person: Person
    people: [Person!]!
    color: Color
    search: SearchResult
    node: Node
    leaf: LeafOnly
  }

  type Person {
    id: ID!
    name: String!
    manager: Person
  }

  type LeafOnly {
    a: String
    b: Int
  }

  type Company {
    id: ID!
  }

  interface Node {
    id: ID!
    owner: Person
  }

  input PersonInput {
    name: String!
    manager: PersonInput
  }

  enum Color {
    RED
    GREEN
  }

  union SearchResult = Person | Company
`);

const lookup = createGraphqlTypeLookup(store.schemaStore);

const typeData = (name: string): GraphqlTypeData => {
  const data = lookup(name);
  if (!data) throw new Error(`expected store to contain type "${name}"`);
  return data;
};

const queryFields = typeData('Query').fields ?? [];

const field = (name: string): GraphqlStoreFieldData => {
  const found = queryFields.find((queryField) => queryField.name === name);
  if (!found) throw new Error(`expected Query to define field "${name}"`);
  return found;
};

const firstArg = (fieldName: string): GraphqlStoreFieldData => {
  const arg = field(fieldName).args?.[0];
  if (!arg) throw new Error(`expected Query.${fieldName} to have arguments`);
  return arg;
};

describe('graphql-type-expansion', () => {
  describe('isGraphqlFieldExpandable', () => {
    it('returns false once the field-expand level reaches the max', () => {
      expect(isGraphqlFieldExpandable(field('person'), 1, 1, lookup)).toBe(false);
      expect(isGraphqlFieldExpandable(field('person'), 2, 1, lookup)).toBe(false);
    });

    it('returns true for a field whose named type is a composite (object) type', () => {
      expect(isGraphqlFieldExpandable(field('person'), 0, 1, lookup)).toBe(true);
    });

    it('unwraps list/non-null wrappers via the named type', () => {
      expect(isGraphqlFieldExpandable(field('people'), 0, 1, lookup)).toBe(true);
    });

    it('returns false for a scalar field with no args', () => {
      expect(isGraphqlFieldExpandable(field('scalar'), 0, 1, lookup)).toBe(false);
    });

    it('treats enums as expandable — expanding surfaces the enum values', () => {
      expect(isGraphqlFieldExpandable(field('color'), 0, 1, lookup)).toBe(true);
    });

    it('returns true for a scalar field that has arguments', () => {
      expect(isGraphqlFieldExpandable(field('scalarWithArgs'), 0, 1, lookup)).toBe(true);
    });

    it('handles argument inputs (no args property) by their named type', () => {
      expect(isGraphqlFieldExpandable(firstArg('scalarWithArgs'), 0, 1, lookup)).toBe(false);
      expect(isGraphqlFieldExpandable(firstArg('createWithInput'), 0, 1, lookup)).toBe(true);
    });

    it('treats unknown named types as leaf-like', () => {
      const orphan: GraphqlStoreFieldData = {
        name: 'orphan',
        type: {
          display: 'Missing',
          name: 'Missing',
          isList: false,
          isNonNull: false,
          isListNonNull: false,
        },
      };
      expect(isGraphqlFieldExpandable(orphan, 0, 1, lookup)).toBe(false);
    });
  });

  describe('graphqlTypeHasExpandableFields', () => {
    it('returns false for undefined', () => {
      expect(graphqlTypeHasExpandableFields(undefined, 0, 1, lookup)).toBe(false);
    });

    it('returns false for non-field-bearing kinds (scalar, enum, union)', () => {
      expect(graphqlTypeHasExpandableFields(typeData('DateTime'), 0, 1, lookup)).toBe(false);
      expect(graphqlTypeHasExpandableFields(typeData('Color'), 0, 1, lookup)).toBe(false);
      expect(graphqlTypeHasExpandableFields(typeData('SearchResult'), 0, 1, lookup)).toBe(false);
    });

    it('returns true for an object type with at least one expandable field', () => {
      expect(graphqlTypeHasExpandableFields(typeData('Person'), 0, 1, lookup)).toBe(true);
    });

    it('returns false for an object type whose fields are all leaf scalars', () => {
      expect(graphqlTypeHasExpandableFields(typeData('LeafOnly'), 0, 1, lookup)).toBe(false);
    });

    it('supports interface and input-object types', () => {
      expect(graphqlTypeHasExpandableFields(typeData('Node'), 0, 1, lookup)).toBe(true);
      expect(graphqlTypeHasExpandableFields(typeData('PersonInput'), 0, 1, lookup)).toBe(true);
    });

    it('returns false when the current depth already reaches the max', () => {
      expect(graphqlTypeHasExpandableFields(typeData('Person'), 1, 1, lookup)).toBe(false);
    });
  });

  describe('countNamedTypeFields', () => {
    it('counts the fields of object, interface, and input-object types', () => {
      expect(countNamedTypeFields('Person', lookup)).toBe(3);
      expect(countNamedTypeFields('LeafOnly', lookup)).toBe(2);
      expect(countNamedTypeFields('Node', lookup)).toBe(2);
      expect(countNamedTypeFields('PersonInput', lookup)).toBe(2);
    });

    it('resolves wrapped field types via the base type name', () => {
      expect(countNamedTypeFields(field('people').type.name, lookup)).toBe(3);
    });

    it('returns 0 for scalar, enum, union, and unknown types', () => {
      expect(countNamedTypeFields('String', lookup)).toBe(0);
      expect(countNamedTypeFields('DateTime', lookup)).toBe(0);
      expect(countNamedTypeFields('Color', lookup)).toBe(0);
      expect(countNamedTypeFields('SearchResult', lookup)).toBe(0);
      expect(countNamedTypeFields('Missing', lookup)).toBe(0);
    });
  });
});
