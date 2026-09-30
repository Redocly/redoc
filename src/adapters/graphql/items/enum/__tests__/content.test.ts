import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect } from 'vitest';

import type { GraphQLEnumType } from 'graphql';
import type { ContainerNode } from '../../../../../types/content.js';
import type { MarkdownSanitizeOptions } from '../../../../utils/markdoc.js';

import { panelKind } from '../../../../../types/common.js';
import { buildEnumContent } from '../content.js';

const schema = buildASTSchema(
  parseGraphQL(`
    type Query { _empty: Boolean }
    type User { id: ID!, role: Role }
    enum Role { ADMIN USER }
  `),
);

const markdownSanitize: MarkdownSanitizeOptions = {
  sanitize: false,
  unstable_hooks: {},
};

describe('buildEnumContent', () => {
  it('should include a "Referenced in" panel resolved by the enum name', () => {
    const enumType = schema.getType('Role') as GraphQLEnumType;
    const result = buildEnumContent(enumType, markdownSanitize);

    const container = result.children[0] as ContainerNode;
    expect(container.panels).toEqual([
      expect.objectContaining({
        title: 'Referenced in',
        children: [
          expect.objectContaining({ kind: panelKind.REFERENCES, graphqlTypeName: 'Role' }),
        ],
      }),
    ]);
  });
});
