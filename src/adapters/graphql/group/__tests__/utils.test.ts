import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect } from 'vitest';

import type { ApiItem } from '../../../../types/store.js';
import type { ContainerNode } from '../../../../types/content.js';

import { itemVariant, contentType, nodeTypes } from '../../../../types/common.js';
import { graphqlTestContext } from '../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../buildContext.js';
import { createGroup } from '../utils.js';
import { getBadges } from '../../utils/getBadges.js';

const schema = buildASTSchema(
  parseGraphQL(`
    type Query {
      getUser(id: ID!): User
      listUsers: [User]
      searchUsers(name: String!, role: String!): [User]
    }
    type Mutation {
      createUser(name: String!, email: String!): User
      deleteUser(id: ID!): Boolean
    }
    type User {
      id: ID!
      name: String!
    }
  `),
);

describe('createGroup', () => {
  it('calls buildGroupPanels and builds the group structure', () => {
    const items: ApiItem[] = [
      {
        type: 'link',
        label: 'getUser',
        link: '/api/queries/__typename',
        routeSlug: '/api/queries/__typename',
        content: null,
      },
    ];
    const group = graphqlContext.run(graphqlTestContext(schema), () =>
      createGroup({
        typeGroup: itemVariant.QUERY,
        items,
      }),
    );
    const container = group.content?.children[0] as ContainerNode;

    expect(group.label).toBe('Queries');
    expect(group.content?.contentType).toBe(contentType.GROUP);
    expect(container.nodeType).toBe(nodeTypes.CONTAINER);
    expect(container.children[0]).toMatchObject({
      nodeType: nodeTypes.HEADER,
      level: 2,
      label: 'Queries',
    });
    expect(container.panels?.[0].children[0]?.kind).toBe('group-items');
  });
});

describe('getBadges', () => {
  it('returns arg name for one arg, (...args) for many, undefined for none', () => {
    const fields = schema.getQueryType()?.getFields();

    expect(getBadges(schema, 'getUser', itemVariant.QUERY)).toEqual([
      { name: fields?.['getUser']?.args?.[0]?.name },
    ]);
    expect(getBadges(schema, 'searchUsers', itemVariant.QUERY)).toEqual([{ name: '(...args)' }]);
    expect(getBadges(schema, 'listUsers', itemVariant.QUERY)).toBeUndefined();
  });
});
