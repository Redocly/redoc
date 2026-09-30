import { buildASTSchema, parse as parseGraphQL } from 'graphql';
import { describe, it, expect } from 'vitest';

import type { GraphQLInterfaceType } from 'graphql';
import type { ContainerNode, ItemContentNode } from '../../../../../types/content.js';
import type { MarkdownSanitizeOptions } from '../../../../utils/markdoc.js';

import { contentType, itemVariant, nodeTypes } from '../../../../../types/common.js';
import { graphqlContext } from '../../../buildContext.js';
import { graphqlTestContext } from '../../../__tests__/graphqlTestContext.js';
import { buildInterfaceContent } from '../content.js';

const schema = buildASTSchema(
  parseGraphQL(`
    type Query { _empty: Boolean }
    interface Node { id: ID! }
    type User implements Node { id: ID!, name: String! }
    type Post implements Node { id: ID!, title: String! }
  `),
);

const emptySchema = buildASTSchema(
  parseGraphQL(`
    type Query { _empty: Boolean }
    interface Orphan { id: ID! }
  `),
);

const hierarchySchema = buildASTSchema(
  parseGraphQL(`
    type Query { _empty: Boolean }
    interface Node { id: ID! }
    interface Entity implements Node { id: ID!, createdAt: String! }
  `),
);

const markdownSanitize: MarkdownSanitizeOptions = {
  sanitize: false,
  unstable_hooks: {},
};

describe('buildInterfaceContent', () => {
  it('should include implemented-by node with implementing type names', () => {
    const interfaceType = schema.getType('Node') as GraphQLInterfaceType;
    const result = graphqlContext.run(graphqlTestContext(schema), () =>
      buildInterfaceContent(interfaceType, markdownSanitize),
    );

    expect(result.contentType).toBe(contentType.ITEM);
    expect(result.itemVariant).toBe(itemVariant.INTERFACE);

    const container = result.children[0] as ContainerNode;
    const implementedByNode = container.children.find(
      (n): n is ItemContentNode =>
        n.nodeType === nodeTypes.ITEM && (n as ItemContentNode).variant === 'implemented-by',
    );

    expect(implementedByNode).toBeDefined();
    expect(implementedByNode?.label).toBe('Implemented by');
    expect(implementedByNode?.graphqlTypeNames).toEqual(expect.arrayContaining(['User', 'Post']));
    expect(implementedByNode?.graphqlTypeNames).toHaveLength(2);
  });

  it('should not include implemented-by node when no types implement the interface', () => {
    const interfaceType = emptySchema.getType('Orphan') as GraphQLInterfaceType;
    const result = graphqlContext.run(graphqlTestContext(emptySchema), () =>
      buildInterfaceContent(interfaceType, markdownSanitize),
    );

    const container = result.children[0] as ContainerNode;
    const implementedByNode = container.children.find(
      (n): n is ItemContentNode =>
        n.nodeType === nodeTypes.ITEM && (n as ItemContentNode).variant === 'implemented-by',
    );

    expect(implementedByNode).toBeUndefined();
  });

  it('should include an implements node when the interface implements another interface', () => {
    const interfaceType = hierarchySchema.getType('Entity') as GraphQLInterfaceType;
    const result = graphqlContext.run(graphqlTestContext(hierarchySchema), () =>
      buildInterfaceContent(interfaceType, markdownSanitize),
    );

    const container = result.children[0] as ContainerNode;
    const implementsNode = container.children.find(
      (n): n is ItemContentNode =>
        n.nodeType === nodeTypes.ITEM && (n as ItemContentNode).variant === 'implements',
    );

    expect(implementsNode).toBeDefined();
    expect(implementsNode?.label).toBe('Implements interfaces');
    expect(implementsNode?.graphqlInterfaceNames).toEqual(['Node']);
  });

  it('should not include an implements node when the interface implements nothing', () => {
    const interfaceType = hierarchySchema.getType('Node') as GraphQLInterfaceType;
    const result = graphqlContext.run(graphqlTestContext(hierarchySchema), () =>
      buildInterfaceContent(interfaceType, markdownSanitize),
    );

    const container = result.children[0] as ContainerNode;
    const implementsNode = container.children.find(
      (n): n is ItemContentNode =>
        n.nodeType === nodeTypes.ITEM && (n as ItemContentNode).variant === 'implements',
    );

    expect(implementsNode).toBeUndefined();
  });

  it('should include fields and header nodes', () => {
    const interfaceType = schema.getType('Node') as GraphQLInterfaceType;
    const result = graphqlContext.run(graphqlTestContext(schema), () =>
      buildInterfaceContent(interfaceType, markdownSanitize),
    );

    const container = result.children[0] as ContainerNode;

    expect(container.children[0]).toMatchObject({
      nodeType: nodeTypes.HEADER,
      level: 2,
      label: 'Node',
    });

    const fieldsNode = container.children.find(
      (n): n is ItemContentNode =>
        n.nodeType === nodeTypes.ITEM && (n as ItemContentNode).variant === 'graphql-fields',
    );
    expect(fieldsNode).toBeDefined();
    expect(fieldsNode?.label).toBe('Fields');
  });
});
