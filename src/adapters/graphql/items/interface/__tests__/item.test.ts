import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildInterfaceItems } from '../item.js';

vi.mock('../../../utils/createApiItem.js', () => ({
  createApiItem: vi.fn(({ name, label }: { name: string; label?: string }) => ({
    type: 'link' as const,
    label: label ?? name,
    link: `/${name}`,
    routeSlug: `/${name}`,
    content: null,
  })),
}));

const schema = buildASTSchema(
  parseGraphQL(`
    type Query { _empty: Boolean }
    interface Node { id: ID! }
    interface Timestamped { createdAt: String! }
    type User implements Node & Timestamped { id: ID!, createdAt: String! }
    enum Role { ADMIN USER }
  `),
);

describe('buildInterfaceItems', () => {
  it('calls createApiItem for interface types only and returns results', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildInterfaceItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalledTimes(2);
    expect(items.map((i) => i.label)).toEqual(expect.arrayContaining(['Node', 'Timestamped']));
    expect(items.map((i) => i.label)).not.toContain('User');
    expect(items.map((i) => i.label)).not.toContain('Role');
  });
});
