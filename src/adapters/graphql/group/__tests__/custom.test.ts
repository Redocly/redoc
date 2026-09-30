import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect } from 'vitest';

import type { GraphqlBuildContext as BuildContext, MenuConfig } from '../../../../types/graphql.js';

import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { graphqlContext } from '../../buildContext.js';
import { groupByCustomMenu } from '../custom.js';
import { normalizeMenuConfig } from '../../utils/normalizeMenu.js';

const SCHEMA_SDL = `
  type Query {
    getUser(id: ID!): User
    getPost(id: ID!): Post
    listUsers: [User]
  }

  type Mutation {
    createUser(name: String!): User
  }

  type User {
    id: ID!
    name: String!
  }

  type Post {
    id: ID!
    title: String!
  }

  enum Status {
    ACTIVE
    INACTIVE
  }
`;

function makeContext(menuConfig?: MenuConfig, sdl: string = SCHEMA_SDL): BuildContext {
  return {
    basePath: '/test-api',
    schema: buildASTSchema(parseGraphQL(sdl)),
    menuConfig: normalizeMenuConfig(menuConfig),
    options: normalizeOptions({
      specType: 'graphql',
      downloadUrls: [{ url: 'https://example.com/schema.graphql' }],
      metadata: {},
    }),
  };
}

describe('groupByCustomMenu', () => {
  it('filters items into a custom group and puts the rest into "Other"', () => {
    const context = makeContext({
      groups: [
        {
          name: 'User Queries',
          queries: { includeByName: ['getUser', 'listUsers'] },
        },
      ],
    });

    const result = graphqlContext.run(context, () => groupByCustomMenu());

    const customGroup = result.find((g) => g.label === 'User Queries');
    expect(customGroup).toBeDefined();
    const customLabels = (customGroup?.items ?? []).map((i) => i.label);
    expect(customLabels).toContain('getUser');
    expect(customLabels).toContain('listUsers');
    expect(customLabels).not.toContain('getPost');
    expect(customLabels).not.toContain('createUser');

    const otherGroup = result.find((g) => g.label === 'Other');
    expect(otherGroup).toBeDefined();
  });

  it('throws in strict mode when an item does not belong to any group', () => {
    const context = makeContext({
      requireExactGroups: true,
      groups: [
        {
          name: 'Specific',
          queries: { includeByName: ['getUser'] },
        },
      ],
    });

    expect(() => graphqlContext.run(context, () => groupByCustomMenu())).toThrow(
      /should belong to some group in strict mode/,
    );
  });

  it('does not throw in strict mode when every item belongs to a group', () => {
    const context = makeContext({
      requireExactGroups: true,
      groups: [
        {
          name: 'Everything',
          items: { includeByName: [/.*/] },
        },
      ],
    });

    const result = graphqlContext.run(context, () => groupByCustomMenu());
    expect(result.find((g) => g.label === 'Other')).toBeUndefined();
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Everything');
  });

  it('uses custom otherItemsGroupName for the fallback group', () => {
    const context = makeContext({
      otherItemsGroupName: 'Miscellaneous',
      groups: [
        {
          name: 'Main',
          queries: { includeByName: ['getUser'] },
        },
      ],
    });

    const result = graphqlContext.run(context, () => groupByCustomMenu());
    expect(result.find((g) => g.label === 'Miscellaneous')).toBeDefined();
    expect(result.find((g) => g.label === 'Other')).toBeUndefined();
  });

  it('combines multiple type filters into a single group', () => {
    const context = makeContext({
      groups: [
        {
          name: 'Mixed',
          queries: { includeByName: ['getUser'] },
          mutations: { includeByName: ['createUser'] },
        },
      ],
    });

    const result = graphqlContext.run(context, () => groupByCustomMenu());
    const mixed = result.find((g) => g.label === 'Mixed');
    expect(mixed).toBeDefined();

    const labels = (mixed?.items ?? []).map((i) => i.label);
    expect(labels).toContain('getUser');
    expect(labels).toContain('createUser');
  });

  it('merges `items` with `queries` / `mutations`', () => {
    const context = makeContext({
      groups: [
        {
          name: 'Cross-cutting',
          items: { includeByName: ['getUser', 'createUser'] },
        },
      ],
    });

    const result = graphqlContext.run(context, () => groupByCustomMenu());
    const group = result.find((g) => g.label === 'Cross-cutting');
    expect(group).toBeDefined();
    const labels = (group?.items ?? []).map((i) => i.label);
    expect(labels).toContain('getUser');
    expect(labels).toContain('createUser');
  });

  it('applies `types` to object kinds', () => {
    const context = makeContext({
      groups: [
        {
          name: 'Models',
          types: { includeByName: ['User', 'Post'] },
        },
      ],
    });

    const result = graphqlContext.run(context, () => groupByCustomMenu());
    const models = result.find((g) => g.label === 'Models');
    expect(models).toBeDefined();
    const labels = (models?.items ?? []).map((i) => i.label);
    expect(labels).toContain('User');
    expect(labels).toContain('Post');
    expect(labels).not.toContain('Status');
  });

  it('orders type kinds within a custom group as objects → interfaces → unions → enums → inputs → scalars', () => {
    const richSdl = `
      scalar DateTime
      interface Node { id: ID! }
      type Widget implements Node { id: ID!, color: Color, createdAt: DateTime }
      union Thing = Widget
      enum Color { RED BLUE }
      input WidgetInput { name: String! }
      type Query { widget(input: WidgetInput): Widget, thing: Thing }
    `;
    // No requireExactGroups: the Query operations (widget, thing) belong to no
    // group, which strict mode correctly rejects; they fall into "Other" here.
    const context = makeContext(
      {
        groups: [
          {
            name: 'All Types',
            types: {
              includeByName: ['Widget', 'Node', 'Thing', 'Color', 'WidgetInput', 'DateTime'],
            },
          },
        ],
      },
      richSdl,
    );

    const result = graphqlContext.run(context, () => groupByCustomMenu());
    const labels = (result[0].items ?? []).map((i) => i.label);
    expect(labels).toEqual(['Widget', 'Node', 'Thing', 'Color', 'WidgetInput', 'DateTime']);
  });

  it('does not duplicate items across groups', () => {
    const context = makeContext({
      groups: [
        {
          name: 'Group A',
          queries: { includeByName: ['getUser'] },
        },
        {
          name: 'Group B',
          queries: { includeByName: ['getUser'] },
        },
      ],
    });

    const result = graphqlContext.run(context, () => groupByCustomMenu());
    const groupA = result.find((g) => g.label === 'Group A');
    const groupB = result.find((g) => g.label === 'Group B');
    expect(groupA).toBeDefined();
    expect(groupB).toBeUndefined();

    const groupALabels = (groupA?.items ?? []).map((i) => i.label);
    expect(groupALabels).toContain('getUser');
  });
});
