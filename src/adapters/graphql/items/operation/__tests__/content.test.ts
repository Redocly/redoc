import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect } from 'vitest';

import type { GraphQLField } from 'graphql';
import type { ContainerNode, ContentNode, ItemContentNode } from '../../../../../types/content.js';

import { itemVariant, nodeTypes } from '../../../../../types/common.js';
import { graphqlContext } from '../../../buildContext.js';
import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { buildOperationContent } from '../content.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

const schema = buildASTSchema(
  parseGraphQL(`
    type Query {
      """Search the catalog (legacy)."""
      oldSearch(query: String!): [Book!]!
        @deprecated(reason: "Use **\`currentSearch\`** instead. See [migration](https://example.com).")
      currentSearch(query: String!): [Book!]!
      """Get a single book by id."""
      getBook(
        id: ID!
        format: String @deprecated(reason: "Use **\`getBookV2.format\`** instead.")
        includeArchived: Boolean = false @deprecated(reason: "Replaced by \`audience\` filter.")
      ): Book
    }
    type Book { id: ID! }
  `),
);

function getQueryField(name: string): GraphQLField<unknown, unknown> {
  const field = schema.getQueryType()?.getFields()[name];
  if (!field) throw new Error(`Query.${name} not found in test schema`);
  return field;
}

function buildContent(fieldName: string): ContentNode[] {
  const field = getQueryField(fieldName);
  const content = graphqlContext.run(graphqlTestContext(schema), () =>
    buildOperationContent(field, 'Query', 'query', itemVariant.QUERY, {
      allowedTags: ['*'],
      markdownParser: markdocParser,
    }),
  );
  const container = content.children[0] as ContainerNode;
  return container.children;
}

describe('buildOperationContent — deprecation rendering', () => {
  it('emits a warning admonition with markdown-parsed reason right after the header', () => {
    const children = buildContent('oldSearch');

    expect(children[0]).toMatchObject({ nodeType: nodeTypes.HEADER, level: 2 });
    expect(children[1]).toMatchObject({
      nodeType: nodeTypes.ADMONITION,
      admonitionType: 'warning',
      name: 'Deprecation reason',
      nameTranslationKey: 'deprecationReason',
    });

    const admonition = children[1] as Extract<ContentNode, { nodeType: 'admonition' }>;
    expect(admonition.content).toBeDefined();
    expect(admonition.content).not.toEqual(
      'Use **`currentSearch`** instead. See [migration](https://example.com).',
    );
  });

  it('places the admonition before the description so it is the most prominent block', () => {
    const children = buildContent('oldSearch');

    const admonitionIndex = children.findIndex((c) => c.nodeType === nodeTypes.ADMONITION);
    const descriptionIndex = children.findIndex((c) => c.nodeType === nodeTypes.MARKDOC);
    expect(admonitionIndex).toBe(1);
    expect(descriptionIndex).toBe(2);

    const trailingHeaders = children.slice(1).filter((c) => c.nodeType === nodeTypes.HEADER);
    expect(trailingHeaders).toEqual([]);
  });

  it('does not emit an admonition for non-deprecated operations', () => {
    const children = buildContent('currentSearch');
    expect(children.some((c) => c.nodeType === nodeTypes.ADMONITION)).toBe(false);
  });
});

describe('buildOperationContent — argument deprecation propagation', () => {
  it('adds deprecationReason to the graphql-args node', () => {
    const children = buildContent('getBook');
    const argsNode = children.find(
      (c): c is ItemContentNode =>
        c.nodeType === nodeTypes.ITEM && (c as ItemContentNode).variant === 'graphql-args',
    );
    expect(argsNode).toBeDefined();
    expect(argsNode?.graphqlSchema).toMatchObject([
      { name: 'id', deprecationReason: undefined },
      {
        name: 'format',
        deprecationReason: 'Use **`getBookV2.format`** instead.',
      },
      {
        name: 'includeArchived',
        deprecationReason: 'Replaced by `audience` filter.',
      },
    ]);
  });
});
