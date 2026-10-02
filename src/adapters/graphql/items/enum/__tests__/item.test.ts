import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect, vi } from 'vitest';

import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { graphqlContext } from '../../../buildContext.js';
import { createApiItem } from '../../../utils/createApiItem.js';
import { buildEnumItems } from '../item.js';

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
    type User { id: ID!, role: Role }
    enum Role { ADMIN USER }
    enum Status { ACTIVE INACTIVE }
  `),
);

describe('buildEnumItems', () => {
  it('calls createApiItem for enum types only and returns results', () => {
    const items = graphqlContext.run(graphqlTestContext(schema), () => buildEnumItems());

    expect(vi.mocked(createApiItem)).toHaveBeenCalledTimes(2);
    expect(items.map((i) => i.label)).toEqual(expect.arrayContaining(['Role', 'Status']));
    expect(items.map((i) => i.label)).not.toContain('User');
  });
});
