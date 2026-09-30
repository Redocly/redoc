import {
  parse as parseGraphQL,
  buildASTSchema,
  getNamedType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
} from 'graphql';
import { describe, it, expect, beforeAll } from 'vitest';

import type { GraphQLNamedType } from 'graphql';
import type { ApiItem, ApiStore } from '../../types/store.js';
import type {
  GraphqlDirectiveData,
  GraphqlTypeData,
  GraphqlTypeDataVariant,
  GraphqlTypeReference,
} from '../../types/graphql-store.js';
import type { ContentNode } from '../../types/content.js';

import { processGraphqlDocument } from '../graphql/index.js';
import { buildGraphqlReferenceMap } from '../../utils/graphql-reference-map.js';
import { graphqlTypeEntryId, graphqlDirectiveEntryId } from '../../types/graphql-store.js';
import { schemaKind } from '../../types/common.js';
import { normalizeOptions } from '../../options/normalizeOptions.js';
import { markdocParser } from '../../components/markdoc/markdocParser.js';
import { readFixture, collectAllItems } from './utils.js';

const BASE_PATH = 'docs/graphql';

function buildOptions() {
  return {
    ...normalizeOptions({ specType: 'graphql' }),
    markdownParser: markdocParser,
  };
}

function process(sdl: string, processContent = true) {
  const document = parseGraphQL(sdl);
  const { items, store } = processGraphqlDocument({
    type: 'graphql',
    document,
    basePath: BASE_PATH,
    options: buildOptions(),
    processContent,
  });
  return { document, schema: buildASTSchema(document), items, store };
}

function getTypeEntryData(store: ApiStore, typeName: string): GraphqlTypeData {
  const entry = store.schemaStore[graphqlTypeEntryId(typeName)];
  expect(entry, `missing schemaStore entry for type "${typeName}"`).toBeDefined();
  return entry.data as GraphqlTypeData;
}

function getDirectiveEntryData(store: ApiStore, name: string): GraphqlDirectiveData {
  const entry = store.schemaStore[graphqlDirectiveEntryId(name)];
  expect(entry, `missing schemaStore entry for directive "${name}"`).toBeDefined();
  return entry.data as GraphqlDirectiveData;
}

function expectedVariant(type: GraphQLNamedType): GraphqlTypeDataVariant {
  if (isObjectType(type)) return 'object';
  if (isInterfaceType(type)) return 'interface';
  if (isInputObjectType(type)) return 'input';
  if (isUnionType(type)) return 'union';
  if (isEnumType(type)) return 'enum';
  if (isScalarType(type)) return 'scalar';
  throw new Error(`unexpected type kind for ${type.name}`);
}

type TypeSummary = {
  variant: GraphqlTypeDataVariant;
  name: string;
  description: string | null;
  fields?: { name: string; display: string; deprecationReason: string | null; argsCount: number }[];
  possibleTypes?: string[];
  enumValues?: string[];
};

function summarizeGraphqlJsType(type: GraphQLNamedType): TypeSummary {
  const base = {
    variant: expectedVariant(type),
    name: type.name,
    description: type.description ?? null,
  };
  if (isObjectType(type) || isInterfaceType(type) || isInputObjectType(type)) {
    return {
      ...base,
      fields: Object.values(type.getFields()).map((field) => ({
        name: field.name,
        display: field.type.toString(),
        deprecationReason: field.deprecationReason ?? null,
        argsCount: 'args' in field ? field.args.length : 0,
      })),
    };
  }
  if (isUnionType(type)) {
    return { ...base, possibleTypes: type.getTypes().map((member) => member.name) };
  }
  if (isEnumType(type)) {
    return { ...base, enumValues: type.getValues().map((value) => value.name) };
  }
  return base;
}

function summarizeStoredType(data: GraphqlTypeData): TypeSummary {
  const base = {
    variant: data.variant,
    name: data.name,
    description: data.description ?? null,
  };
  if (data.variant === 'object' || data.variant === 'interface' || data.variant === 'input') {
    return {
      ...base,
      fields: (data.fields ?? []).map((field) => ({
        name: field.name,
        display: field.type.display,
        deprecationReason: field.deprecationReason ?? null,
        argsCount: field.args?.length ?? 0,
      })),
    };
  }
  if (data.variant === 'union') {
    return { ...base, possibleTypes: data.possibleTypes };
  }
  if (data.variant === 'enum') {
    return { ...base, enumValues: (data.enumValues ?? []).map((value) => value.name) };
  }
  return base;
}

const KITCHEN_SINK_SDL = `
  schema {
    query: RootQuery
    mutation: RootMutation
  }

  directive @requiresScopes(scopes: [[String!]!]!) on OBJECT | FIELD_DEFINITION | ENUM_VALUE

  directive @customThing(reason: String = "because") repeatable on FIELD

  scalar DateTime @specifiedBy(url: "https://example.com/datetime")

  interface Node {
    id: ID!
  }

  type User implements Node @requiresScopes(scopes: [["user:read"]]) {
    id: ID!
    "The user's best friends"
    friends(first: Int = 10, after: String): [User!]!
    matrix: [[Int!]]!
    status: Status
    pet: Pet
    createdAt: DateTime @deprecated(reason: "Use something else")
    secret: String @requiresScopes(scopes: [["admin"]])
  }

  type Dog {
    name: String!
  }

  type Cat {
    name: String!
  }

  union Pet = Dog | Cat

  enum Status {
    ACTIVE
    INACTIVE @deprecated(reason: "gone")
    HIDDEN @requiresScopes(scopes: [["status:hidden"]])
  }

  input UserFilter {
    name: String = "any"
    status: Status!
    tags: [String!]
  }

  type RootQuery {
    user(id: ID!, filter: UserFilter): User
    users: [User!]!
  }

  type RootMutation {
    touch(id: ID!): Boolean
  }
`;

describe('GraphQL store population', () => {
  describe('kitchen-sink schema', () => {
    let store: ApiStore;

    beforeAll(() => {
      ({ store } = process(KITCHEN_SINK_SDL));
    });

    it('registers renamed root operation types in graphqlMeta', () => {
      expect(store.graphqlMeta?.rootTypes).toEqual({
        query: 'RootQuery',
        mutation: 'RootMutation',
        subscription: undefined,
      });
    });

    it('does not carry the raw document', () => {
      expect('graphqlDocument' in store).toBe(false);
      expect(JSON.stringify(store)).not.toContain('"kind":"Document"');
    });

    it('serializes object types with interfaces, scopes and field details', () => {
      const user = getTypeEntryData(store, 'User');

      expect(user.variant).toBe('object');
      expect(user.interfaces).toEqual(['Node']);
      expect(user.requiresScopes).toEqual({ scopes: [['user:read']] });

      const friends = user.fields?.find((field) => field.name === 'friends');
      expect(friends?.type).toEqual({
        display: '[User!]!',
        name: 'User',
        isList: true,
        isNonNull: true,
        isListNonNull: true,
      });
      expect(friends?.description).toBe("The user's best friends");
      expect(friends?.args?.map((arg) => arg.name)).toEqual(['first', 'after']);
      expect(friends?.args?.[0]).toMatchObject({
        name: 'first',
        defaultValue: 10,
        type: { display: 'Int', name: 'Int', isList: false, isNonNull: false },
      });
      expect(friends?.args?.[0].required).toBeUndefined();

      const matrix = user.fields?.find((field) => field.name === 'matrix');
      expect(matrix?.type.display).toBe('[[Int!]]!');
      expect(matrix?.type.name).toBe('Int');

      const createdAt = user.fields?.find((field) => field.name === 'createdAt');
      expect(createdAt?.deprecationReason).toBe('Use something else');

      const secret = user.fields?.find((field) => field.name === 'secret');
      expect(secret?.requiresScopes).toEqual({ scopes: [['admin']] });
    });

    it('serializes root types so operations resolve through the store', () => {
      const rootQuery = getTypeEntryData(store, 'RootQuery');
      const userOperation = rootQuery.fields?.find((field) => field.name === 'user');

      expect(userOperation?.args?.map((arg) => arg.name)).toEqual(['id', 'filter']);
      expect(userOperation?.args?.[0].required).toBe(true);
      expect(userOperation?.type.name).toBe('User');
    });

    it('serializes enums with per-value deprecation and scopes', () => {
      const status = getTypeEntryData(store, 'Status');

      expect(status.variant).toBe('enum');
      expect(status.enumValues?.map((value) => value.name)).toEqual([
        'ACTIVE',
        'INACTIVE',
        'HIDDEN',
      ]);
      expect(status.enumValues?.[1].deprecationReason).toBe('gone');
      expect(status.enumValues?.[2].requiresScopes).toEqual({ scopes: [['status:hidden']] });
    });

    it('serializes unions, inputs and scalars', () => {
      expect(getTypeEntryData(store, 'Pet')).toMatchObject({
        variant: 'union',
        possibleTypes: ['Dog', 'Cat'],
      });

      const filter = getTypeEntryData(store, 'UserFilter');
      expect(filter.variant).toBe('input');
      const nameField = filter.fields?.find((field) => field.name === 'name');
      expect(nameField?.defaultValue).toBe('any');
      expect(nameField?.required).toBeUndefined();
      const statusField = filter.fields?.find((field) => field.name === 'status');
      expect(statusField?.required).toBe(true);

      expect(getTypeEntryData(store, 'DateTime')).toMatchObject({
        variant: 'scalar',
        specifiedByUrl: 'https://example.com/datetime',
      });
    });

    it('serializes directives with args, locations and repeatability', () => {
      const custom = getDirectiveEntryData(store, 'customThing');

      expect(custom.locations).toEqual(['FIELD']);
      expect(custom.isRepeatable).toBe(true);
      expect(custom.args?.[0]).toMatchObject({ name: 'reason', defaultValue: 'because' });
      expect(store.schemaStore[graphqlDirectiveEntryId('deprecated')]).toBeDefined();
    });

    it('derives the reverse-reference map from the store, excluding root-type and argument usages', () => {
      const refs = buildGraphqlReferenceMap(store.schemaStore, store.graphqlMeta?.rootTypes);

      expect(refs['User']).toEqual([{ name: 'User', field: 'friends' }]);
      expect(refs['Pet']).toEqual([{ name: 'User', field: 'pet' }]);
      expect(refs['Dog']).toEqual([{ name: 'Pet' }]);
      expect(refs['Status']).toEqual([
        { name: 'User', field: 'status' },
        { name: 'UserFilter', field: 'status' },
      ]);
      expect(refs['DateTime']).toEqual([{ name: 'User', field: 'createdAt' }]);
      expect(refs['Int']).toEqual([{ name: 'User', field: 'matrix' }]);
    });

    it('skips store population for nav-only builds', () => {
      const { store: navStore } = process(KITCHEN_SINK_SDL, false);
      expect(Object.keys(navStore.schemaStore)).toHaveLength(0);
    });
  });

  describe('github schema fixture', () => {
    let store: ApiStore;
    let items: ApiItem[];
    let schema: ReturnType<typeof buildASTSchema>;

    beforeAll(() => {
      ({ store, items, schema } = process(readFixture('graphql/schema.graphql')));
    });

    it('registers every named type and directive exactly once', () => {
      const namedTypes = Object.values(schema.getTypeMap()).filter(
        (type) => !type.name.startsWith('__'),
      );
      const typeEntries = Object.values(store.schemaStore).filter((entry) =>
        entry.id.startsWith('types/'),
      );
      const directiveEntries = Object.values(store.schemaStore).filter((entry) =>
        entry.id.startsWith('directives/'),
      );

      expect(typeEntries).toHaveLength(namedTypes.length);
      expect(directiveEntries).toHaveLength(schema.getDirectives().length);

      for (const entry of Object.values(store.schemaStore)) {
        expect(entry.kind).toBe(schemaKind.GRAPHQL_TYPE);
      }
    });

    it('matches graphql-js for every serialized type (parity harness)', () => {
      const namedTypes = Object.values(schema.getTypeMap()).filter(
        (type) => !type.name.startsWith('__'),
      );

      for (const type of namedTypes) {
        const data = getTypeEntryData(store, type.name);
        expect(summarizeStoredType(data), `parity mismatch for type "${type.name}"`).toEqual(
          summarizeGraphqlJsType(type),
        );
      }
    });

    it('has no dangling type references anywhere in the store or items', () => {
      const isRegisteredType = (name: string) =>
        Boolean(store.schemaStore[graphqlTypeEntryId(name)]);
      const isRegisteredTypeOrDirective = (name: string) =>
        isRegisteredType(name) || Boolean(store.schemaStore[graphqlDirectiveEntryId(name)]);

      const storeTypeRefs: string[] = [];
      for (const entry of Object.values(store.schemaStore)) {
        const data = entry.data as GraphqlTypeData;
        for (const field of data.fields ?? []) {
          storeTypeRefs.push(field.type.name);
          for (const arg of field.args ?? []) storeTypeRefs.push(arg.type.name);
        }
        storeTypeRefs.push(...(data.possibleTypes ?? []));
        storeTypeRefs.push(...(data.interfaces ?? []));
      }

      const rootTypeRefs = Object.values(store.graphqlMeta?.rootTypes ?? {}).filter(
        (name): name is string => Boolean(name),
      );

      const holdsFieldNameNotTypeName = (node: ContentNode) =>
        'graphqlFieldName' in node && Boolean(node.graphqlFieldName);

      const contentTypeRefs: string[] = [];
      const contentSchemaIds: string[] = [];
      const visitNodes = (nodes: ContentNode[]) => {
        for (const node of nodes) {
          if (
            'graphqlTypeName' in node &&
            typeof node.graphqlTypeName === 'string' &&
            !holdsFieldNameNotTypeName(node)
          ) {
            contentTypeRefs.push(node.graphqlTypeName);
          }
          if (
            'schemaId' in node &&
            typeof node.schemaId === 'string' &&
            node.schemaId.startsWith('types/')
          ) {
            contentSchemaIds.push(node.schemaId);
          }
          if ('children' in node && Array.isArray(node.children)) {
            visitNodes(node.children as ContentNode[]);
          }
        }
      };
      for (const item of collectAllItems(items)) {
        visitNodes(item.content?.children ?? []);
      }

      expect(contentTypeRefs.length + contentSchemaIds.length).toBeGreaterThan(0);
      expect([...new Set(storeTypeRefs)].filter((name) => !isRegisteredType(name))).toEqual([]);
      expect(rootTypeRefs.filter((name) => !isRegisteredType(name))).toEqual([]);
      expect(
        [...new Set(contentTypeRefs)].filter((name) => !isRegisteredTypeOrDirective(name)),
      ).toEqual([]);
      expect([...new Set(contentSchemaIds)].filter((id) => !store.schemaStore[id])).toEqual([]);
    });

    it('derives the same reference map from the store as a schema walk produces', () => {
      const fromStore = buildGraphqlReferenceMap(store.schemaStore, store.graphqlMeta?.rootTypes);

      const fromSchema: Record<string, GraphqlTypeReference[]> = {};
      const addRef = (key: string, ref: GraphqlTypeReference) => {
        (fromSchema[key] ??= []).push(ref);
      };
      const rootTypeNames = new Set(
        [schema.getQueryType(), schema.getMutationType(), schema.getSubscriptionType()]
          .filter((type) => type != null)
          .map((type) => type.name),
      );
      for (const type of Object.values(schema.getTypeMap())) {
        if (type.name.startsWith('__') || rootTypeNames.has(type.name)) continue;
        if (isObjectType(type) || isInterfaceType(type) || isInputObjectType(type)) {
          for (const field of Object.values(type.getFields())) {
            addRef(getNamedType(field.type).name, { name: type.name, field: field.name });
          }
        } else if (isUnionType(type)) {
          for (const member of type.getTypes()) {
            addRef(member.name, { name: type.name });
          }
        }
      }

      expect(fromStore).toEqual(fromSchema);
    });

    it('serializes without AST nodes and within the size budget', () => {
      const serialized = JSON.stringify(store);

      expect(serialized).not.toContain('"kind":"Document"');
      expect(serialized.length).toBeLessThan(2_500_000);
    });
  });
});
