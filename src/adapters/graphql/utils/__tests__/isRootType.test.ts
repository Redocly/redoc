import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect } from 'vitest';

import { isRootType } from '../isRootType.js';

const schema = buildASTSchema(
  parseGraphQL(`
    type Query { getUser: User }
    type Mutation { createUser: User }
    type Subscription { userAdded: User }
    type User { id: ID! }
  `),
);
const typeMap = schema.getTypeMap();

describe('isRootType', () => {
  it('returns true for the Query, Mutation and Subscription root types', () => {
    expect(isRootType(typeMap.Query, schema)).toBe(true);
    expect(isRootType(typeMap.Mutation, schema)).toBe(true);
    expect(isRootType(typeMap.Subscription, schema)).toBe(true);
  });

  it('returns false for a regular object type', () => {
    expect(isRootType(typeMap.User, schema)).toBe(false);
  });

  it('returns false when the schema declares no matching root type', () => {
    const queryOnly = buildASTSchema(
      parseGraphQL(`type Query { user: User } type User { id: ID! }`),
    );
    const queryOnlyTypeMap = queryOnly.getTypeMap();

    expect(isRootType(queryOnlyTypeMap.User, queryOnly)).toBe(false);
    expect(isRootType(queryOnlyTypeMap.Query, queryOnly)).toBe(true);
  });
});
