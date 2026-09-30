import { describe, expect, it } from 'vitest';
import { Kind, parse, visit } from 'graphql';

import { extractGraphqlSlice } from '../graphql-slice.js';
import { buildSpecSlice } from '../index.js';
import {
  BUILT_IN_DIRECTIVES,
  BUILT_IN_SCALARS,
} from '../../../adapters/graphql/utils/constants.js';

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  return value as T;
}

function collectDanglingSdlRefs(sdl: string): string[] {
  const doc = parse(sdl);
  const definedTypes = new Set<string>(BUILT_IN_SCALARS);
  const definedDirectives = new Set<string>(BUILT_IN_DIRECTIVES);
  for (const def of doc.definitions) {
    if ('name' in def && def.name && def.kind !== Kind.DIRECTIVE_DEFINITION) {
      definedTypes.add(def.name.value);
    }
    if (def.kind === Kind.DIRECTIVE_DEFINITION) {
      definedDirectives.add(def.name.value);
    }
  }
  const dangling: string[] = [];
  visit(doc, {
    NamedType(node) {
      if (!definedTypes.has(node.name.value)) dangling.push(`type: ${node.name.value}`);
    },
    Directive(node) {
      if (!definedDirectives.has(node.name.value)) {
        dangling.push(`directive: ${node.name.value}`);
      }
    },
  });
  return dangling;
}

function expectValidSlice(sdl: string): string {
  const slice = expectDefined(sdl);
  expect(collectDanglingSdlRefs(slice)).toEqual([]);
  return slice;
}

const CAFE_SDL = `
"""Cafe schema"""
schema {
  query: CafeQuery
  mutation: CafeMutation
}

directive @auth(role: Role!) on FIELD_DEFINITION

directive @internal on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  CUSTOMER
}

scalar Money

"""Root query type"""
type CafeQuery {
  """List the menu"""
  menu(filter: MenuFilter): [MenuItem!]!
  orders: [Order!]! @auth(role: ADMIN)
}

extend type CafeQuery {
  specials: [MenuItem!]
}

type CafeMutation {
  placeOrder(input: OrderInput!): Order
}

input MenuFilter {
  category: MenuCategory
  maxPrice: Money
}

enum MenuCategory {
  DRINKS
  FOOD
}

interface MenuEntry {
  name: String!
}

type MenuItem implements MenuEntry {
  name: String!
  price: Money!
  pairsWith: MenuItem
}

extend type MenuItem {
  seasonal: Boolean
}

type Order @internal {
  items: [MenuItem!]!
  total: Money!
}

input OrderInput {
  itemNames: [String!]!
}

union SearchResult = MenuItem | Order

type Unreferenced {
  nothing: String
}
`;

describe('extractGraphqlSlice — operation scope', () => {
  it('trims the root type to the one field and closes over its types', () => {
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-operation',
          operationType: 'query',
          name: 'menu',
        }),
      ),
    );

    expect(slice).toContain('schema {\n  query: CafeQuery\n}');
    expect(slice).not.toContain('mutation: CafeMutation');
    expect(slice).toContain('menu(filter: MenuFilter): [MenuItem!]!');
    expect(slice).not.toContain('orders');
    expect(slice).not.toContain('specials');
    expect(slice).toContain('input MenuFilter');
    expect(slice).toContain('enum MenuCategory');
    expect(slice).toContain('scalar Money');
    expect(slice).toContain('type MenuItem implements MenuEntry');
    expect(slice).toContain('interface MenuEntry');
    expect(slice).toContain('seasonal: Boolean');
    expect(slice).not.toContain('type Order');
    expect(slice).not.toContain('Unreferenced');
    expect(slice).not.toContain('directive @auth');
    expect(slice).toContain('"""Root query type"""');
    expect(slice).toContain('"""List the menu"""');
    expect(slice).toContain('"""Cafe schema"""');
  });

  it('slices a mutation with its custom root name from the schema block', () => {
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-operation',
          operationType: 'mutation',
          name: 'placeOrder',
        }),
      ),
    );

    expect(slice).toContain('schema {\n  mutation: CafeMutation\n}');
    expect(slice).toContain('placeOrder(input: OrderInput!): Order');
    expect(slice).toContain('input OrderInput');
    expect(slice).toContain('type Order');
    expect(slice).not.toContain('query: CafeQuery');
    expect(slice).not.toContain('menu(filter');
  });

  it('slices a subscription with the default root name', () => {
    const sdl =
      'type Subscription {\n  orderUpdated: String\n  boardUpdated: Int\n}\n\ntype Query {\n  ping: String\n}\n';
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(sdl, {
          kind: 'graphql-operation',
          operationType: 'subscription',
          name: 'orderUpdated',
        }),
      ),
    );

    expect(slice).toBe('type Subscription {\n  orderUpdated: String\n}');
  });

  it('pulls applied directives and their argument types through kept fields', () => {
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-operation',
          operationType: 'query',
          name: 'orders',
        }),
      ),
    );

    expect(slice).toContain('orders: [Order!]! @auth(role: ADMIN)');
    expect(slice).toContain('directive @auth(role: Role!) on FIELD_DEFINITION');
    expect(slice).toContain('enum Role');
    expect(slice).toContain('directive @internal');
    expect(slice).not.toContain('menu(filter');
  });

  it('finds fields declared only in type extensions', () => {
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-operation',
          operationType: 'query',
          name: 'specials',
        }),
      ),
    );

    expect(slice).toContain('specials: [MenuItem!]');
    expect(slice).not.toContain('extend type CafeQuery');
    expect(slice).not.toContain('menu(filter');
  });

  it('resolves default root names without emitting a schema block', () => {
    const sdl = 'type Query {\n  ping: String\n  other: Int\n}\n';
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(sdl, {
          kind: 'graphql-operation',
          operationType: 'query',
          name: 'ping',
        }),
      ),
    );

    expect(slice).toBe('type Query {\n  ping: String\n}');
  });

  it('returns undefined for unknown fields and missing root types', () => {
    expect(
      extractGraphqlSlice(CAFE_SDL, {
        kind: 'graphql-operation',
        operationType: 'query',
        name: 'nope',
      }),
    ).toBeUndefined();
    expect(
      extractGraphqlSlice(CAFE_SDL, {
        kind: 'graphql-operation',
        operationType: 'subscription',
        name: 'menu',
      }),
    ).toBeUndefined();
  });
});

describe('extractGraphqlSlice — type scope', () => {
  it('slices a type with its transitive closure, extensions, and cycles', () => {
    const slice = expectValidSlice(
      expectDefined(extractGraphqlSlice(CAFE_SDL, { kind: 'graphql-type', name: 'MenuItem' })),
    );

    expect(slice).toContain('type MenuItem implements MenuEntry');
    expect(slice).toContain('pairsWith: MenuItem');
    expect(slice).toContain('extend type MenuItem');
    expect(slice).toContain('interface MenuEntry');
    expect(slice).toContain('scalar Money');
    expect(slice).not.toContain('schema {');
    expect(slice).not.toContain('CafeQuery');
  });

  it('slices unions with their members', () => {
    const slice = expectValidSlice(
      expectDefined(extractGraphqlSlice(CAFE_SDL, { kind: 'graphql-type', name: 'SearchResult' })),
    );

    expect(slice).toContain('union SearchResult = MenuItem | Order');
    expect(slice).toContain('type MenuItem');
    expect(slice).toContain('type Order');
    expect(slice).toContain('directive @internal');
  });

  it('terminates on mutually recursive types', () => {
    const sdl = 'type A {\n  b: B\n}\n\ntype B {\n  a: A\n}\n';
    const slice = expectValidSlice(
      expectDefined(extractGraphqlSlice(sdl, { kind: 'graphql-type', name: 'A' })),
    );

    expect(slice).toContain('type A');
    expect(slice).toContain('type B');
  });

  it('returns undefined for unknown type names', () => {
    expect(extractGraphqlSlice(CAFE_SDL, { kind: 'graphql-type', name: 'Ghost' })).toBeUndefined();
    expect(extractGraphqlSlice(CAFE_SDL, { kind: 'graphql-type', name: 'String' })).toBeUndefined();
  });
});

describe('extractGraphqlSlice — group scope', () => {
  it('slices an operation group into one trimmed root with all member fields', () => {
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-group',
          label: 'Queries',
          members: [
            { kind: 'graphql-operation', operationType: 'query', name: 'menu' },
            { kind: 'graphql-operation', operationType: 'query', name: 'orders' },
            { kind: 'graphql-operation', operationType: 'query', name: 'specials' },
          ],
        }),
      ),
    );

    expect(slice).toContain('schema {\n  query: CafeQuery\n}');
    expect(slice.match(/type CafeQuery/g)).toHaveLength(1);
    expect(slice).toContain('menu(filter: MenuFilter): [MenuItem!]!');
    expect(slice).toContain('orders: [Order!]! @auth(role: ADMIN)');
    expect(slice).toContain('specials: [MenuItem!]');
    expect(slice).not.toContain('extend type CafeQuery');
    expect(slice).toContain('directive @auth');
    expect(slice).toContain('type Order');
  });

  it('slices a type group with every member and its closure', () => {
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-group',
          label: 'Enums',
          members: [
            { kind: 'graphql-type', name: 'Role' },
            { kind: 'graphql-type', name: 'MenuCategory' },
          ],
        }),
      ),
    );

    expect(slice).toContain('enum Role');
    expect(slice).toContain('enum MenuCategory');
    expect(slice).not.toContain('MenuItem');
    expect(slice).not.toContain('schema {');
  });

  it('combines mixed members into one slice with a multi-entry schema block', () => {
    const slice = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-group',
          members: [
            { kind: 'graphql-operation', operationType: 'mutation', name: 'placeOrder' },
            { kind: 'graphql-operation', operationType: 'query', name: 'menu' },
            { kind: 'graphql-directive', name: 'internal' },
          ],
        }),
      ),
    );

    expect(slice).toContain('schema {\n  query: CafeQuery\n  mutation: CafeMutation\n}');
    expect(slice).toContain('menu(filter: MenuFilter): [MenuItem!]!');
    expect(slice).toContain('placeOrder(input: OrderInput!): Order');
    expect(slice).toContain('directive @internal');
    expect(slice).not.toContain('orders');
  });

  it('skips unknown members and returns undefined when none resolve', () => {
    const partial = expectValidSlice(
      expectDefined(
        extractGraphqlSlice(CAFE_SDL, {
          kind: 'graphql-group',
          members: [
            { kind: 'graphql-type', name: 'Ghost' },
            { kind: 'graphql-type', name: 'Money' },
          ],
        }),
      ),
    );
    expect(partial).toContain('scalar Money');

    expect(
      extractGraphqlSlice(CAFE_SDL, {
        kind: 'graphql-group',
        members: [
          { kind: 'graphql-type', name: 'Ghost' },
          { kind: 'graphql-operation', operationType: 'query', name: 'nope' },
        ],
      }),
    ).toBeUndefined();
  });
});

describe('extractGraphqlSlice — directive scope', () => {
  it('slices a directive definition with its argument types', () => {
    const slice = expectValidSlice(
      expectDefined(extractGraphqlSlice(CAFE_SDL, { kind: 'graphql-directive', name: 'auth' })),
    );

    expect(slice).toContain('directive @auth(role: Role!) on FIELD_DEFINITION');
    expect(slice).toContain('enum Role');
    expect(slice).not.toContain('MenuItem');
  });

  it('returns undefined for unknown and built-in directives', () => {
    expect(
      extractGraphqlSlice(CAFE_SDL, { kind: 'graphql-directive', name: 'ghost' }),
    ).toBeUndefined();
    expect(
      extractGraphqlSlice(CAFE_SDL, { kind: 'graphql-directive', name: 'deprecated' }),
    ).toBeUndefined();
  });
});

describe('extractGraphqlSlice — invalid input', () => {
  it('returns undefined for unparsable SDL and non-graphql scopes', () => {
    expect(extractGraphqlSlice('type {', { kind: 'graphql-type', name: 'A' })).toBeUndefined();
    expect(extractGraphqlSlice(CAFE_SDL, { kind: 'document' })).toBeUndefined();
    expect(extractGraphqlSlice(CAFE_SDL, { kind: 'schema', name: 'Pet' })).toBeUndefined();
  });
});

describe('buildSpecSlice — graphql', () => {
  it('returns the raw SDL for the document scope without parsing', () => {
    const sdl = '# a comment\ntype Query {\n  ping: String\n}\n';
    return expect(buildSpecSlice('graphql', sdl, { kind: 'document' })).resolves.toBe(sdl);
  });

  it('delegates scoped slices to the slicer', () => {
    return expect(
      buildSpecSlice('graphql', CAFE_SDL, { kind: 'graphql-type', name: 'Order' }),
    ).resolves.toContain('type Order');
  });

  it('returns undefined for non-string definitions', () => {
    return expect(
      buildSpecSlice('graphql', { openapi: '3.1.0' }, { kind: 'document' }),
    ).resolves.toBeUndefined();
  });
});
