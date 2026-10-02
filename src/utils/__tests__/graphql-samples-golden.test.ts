import { describe, expect, it } from 'vitest';

import type { ApiStore } from '../../types/store.js';

import {
  createGraphqlTypeLookup,
  generateOperationExample,
  generateOperationResponseExample,
  generateOperationVariablesExample,
  getOperationFromStore,
  getTypeExample,
} from '../graphql-samples.js';
import { buildGraphqlStoreFromSdl } from '../../adapters/graphql/buildStoreFromSdl.js';
import { readFixture } from '../../adapters/__tests__/utils.js';

const GOLDEN_SDL = `
  schema {
    query: RootQuery
    mutation: RootMutation
    subscription: RootSubscription
  }

  scalar DateTime

  interface Node {
    id: ID!
  }

  type User implements Node {
    id: ID!
    name: String
    balance: Float!
    isActive: Boolean
    createdAt: DateTime
    status: Status
    pet: Pet
    matrix: [[Int!]]!
    friends(first: Int = 10, after: String): FriendsConnection!
  }

  type FriendsConnection {
    edges: [FriendEdge!]
    nodes: [User]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type FriendEdge {
    node: User!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Dog {
    name: String!
    barkVolume: Int
  }

  type Cat {
    name: String!
    lives: Int
  }

  union Pet = Dog | Cat

  enum Status {
    ACTIVE
    INACTIVE
  }

  input UserFilter {
    name: String = "any"
    statuses: [Status!]
    joinedAfter: DateTime
  }

  type RootQuery {
    user(id: ID!): User
    users(filter: UserFilter, first: Int, after: String, before: String, last: Int): [User!]!
    pet(name: String!): Pet
    status: Status
  }

  type RootMutation {
    updateUser(id: ID!, name: String, status: Status, filter: UserFilter): User
  }

  type RootSubscription {
    userChanged(id: ID!): User!
  }
`;

type OperationRef = { type: 'query' | 'mutation' | 'subscription'; name: string };

const GOLDEN_OPERATIONS: OperationRef[] = [
  { type: 'query', name: 'user' },
  { type: 'query', name: 'users' },
  { type: 'query', name: 'pet' },
  { type: 'query', name: 'status' },
  { type: 'mutation', name: 'updateUser' },
  { type: 'subscription', name: 'userChanged' },
];

const GITHUB_OPERATIONS: OperationRef[] = [
  { type: 'query', name: 'codeOfConduct' },
  { type: 'query', name: 'meta' },
  { type: 'query', name: 'node' },
  { type: 'query', name: 'rateLimit' },
  { type: 'mutation', name: 'addComment' },
  { type: 'mutation', name: 'deleteIssue' },
];

function generateOperationSamples(store: ApiStore, { type, name }: OperationRef, depth: number) {
  const operation = getOperationFromStore(store, type, name);
  expect(operation, `operation ${type}.${name} not found`).toBeDefined();
  if (!operation) return {};
  const lookup = createGraphqlTypeLookup(store.schemaStore);
  return {
    querySingleLine: generateOperationExample(type, operation, lookup, depth, false),
    queryMultiline: generateOperationExample(type, operation, lookup, depth, true),
    variables: generateOperationVariablesExample(operation.args ?? [], lookup, depth),
    response: generateOperationResponseExample(operation.type.display, lookup, depth),
  };
}

function generateTypeSample(store: ApiStore, typeName: string, depth: number) {
  const lookup = createGraphqlTypeLookup(store.schemaStore);
  expect(lookup(typeName), `type ${typeName} not found`).toBeDefined();
  return getTypeExample(typeName, lookup, depth);
}

describe('graphql sample generation goldens', () => {
  it('reproduces operation samples for the golden schema', async () => {
    const store = buildGraphqlStoreFromSdl(GOLDEN_SDL);
    const samples: Record<string, unknown> = {};
    for (const operation of GOLDEN_OPERATIONS) {
      for (const depth of [1, 2, 3]) {
        samples[`${operation.type}.${operation.name}@depth${depth}`] = generateOperationSamples(
          store,
          operation,
          depth,
        );
      }
    }
    await expect(JSON.stringify(samples, null, 2)).toMatchFileSnapshot(
      '__snapshots__/graphql-samples-golden-operations.snap',
    );
  });

  it('reproduces type samples for the golden schema', async () => {
    const store = buildGraphqlStoreFromSdl(GOLDEN_SDL);
    const samples: Record<string, unknown> = {};
    for (const typeName of [
      'User',
      'Pet',
      'Status',
      'UserFilter',
      'DateTime',
      'FriendsConnection',
    ]) {
      for (const depth of [1, 2]) {
        samples[`${typeName}@depth${depth}`] = generateTypeSample(store, typeName, depth);
      }
    }
    await expect(JSON.stringify(samples, null, 2)).toMatchFileSnapshot(
      '__snapshots__/graphql-samples-golden-types.snap',
    );
  });

  it('reproduces operation samples for the github schema', async () => {
    const store = buildGraphqlStoreFromSdl(readFixture('graphql/schema.graphql'));
    const samples: Record<string, unknown> = {};
    for (const operation of GITHUB_OPERATIONS) {
      samples[`${operation.type}.${operation.name}`] = generateOperationSamples(
        store,
        operation,
        1,
      );
    }
    await expect(JSON.stringify(samples, null, 2)).toMatchFileSnapshot(
      '__snapshots__/graphql-samples-golden-github.snap',
    );
  });
});
