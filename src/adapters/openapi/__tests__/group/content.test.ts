import { describe, it, expect } from 'vitest';

import type { ContainerNode, GroupItemNode, MarkdocNode } from '../../../../types/content.js';
import type { OperationInfo } from '../../../../types/openapi.js';

import { contentType, nodeTypes, panelKind } from '../../../../types/common.js';
import { buildGroupContent } from '../../group/content.js';
import { markdocParser } from '../../../../components/markdoc/markdocParser.js';

const petsOperation: OperationInfo = {
  pointer: '/paths/~1pets/get',
  pathName: '/pets',
  httpVerb: 'get',
  isWebhook: false,
  isAdditionalOperation: false,
  tags: ['Pets'],
};

const SCHEMA_DEF_DESCRIPTION = '{% schemaDefinition schemaRef="#/components/schemas/Pet" /%}';

const PROSE_THEN_SCHEMA_DESCRIPTION =
  'Some prose paragraph.\n{% schemaDefinition schemaRef="#/components/schemas/Pet" /%}';

const MULTIPLE_SCHEMAS_DESCRIPTION =
  '{% schemaDefinition schemaRef="#/components/schemas/Pet" /%}\n{% schemaDefinition schemaRef="#/components/schemas/Order" /%}';

const SPEC_BASE_PATH = '/api';

describe('buildGroupContent', () => {
  it('builds content with correct contentType and header label', () => {
    const result = buildGroupContent({
      tag: { name: 'Pets' },
      tagName: 'Pets',
      description: markdocParser('Pets description', { sanitize: false }),
      operations: [petsOperation],
      tagSlug: `${SPEC_BASE_PATH}/pets`,
      basePath: SPEC_BASE_PATH,
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;

    expect(result.contentType).toBe(contentType.GROUP);
    expect(container.children[0]).toMatchObject({
      nodeType: nodeTypes.HEADER,
      level: 2,
      label: 'Pets',
    });
  });

  it('uses headerLabel when provided for header title', () => {
    const result = buildGroupContent({
      tag: { name: 'menu_model', 'x-displayName': 'The MenuItem Model' },
      tagName: 'menu_model',
      headerLabel: 'The MenuItem Model',
      description: markdocParser('Menu model description', { sanitize: false }),
      operations: [],
      tagSlug: `${SPEC_BASE_PATH}/menu-model`,
      basePath: SPEC_BASE_PATH,
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;

    expect(container.children[0]).toMatchObject({
      nodeType: nodeTypes.HEADER,
      level: 2,
      label: 'The MenuItem Model',
    });
    expect(result.meta?.name).toBe('menu_model');
  });

  it('adds a GROUP_ITEM_PANEL for regular operations', () => {
    const operation: OperationInfo = {
      pointer: '/paths/~1pets/get',
      pathName: '/pets',
      httpVerb: 'get',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: ['Pets'],
      summary: 'List pets',
    };

    const result = buildGroupContent({
      tag: { name: 'Pets' },
      tagName: 'Pets',
      operations: [operation],
      tagSlug: `${SPEC_BASE_PATH}/pets`,
      basePath: SPEC_BASE_PATH,
      description: markdocParser('Pets description', { sanitize: false }),
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;

    expect(
      container.panels?.some((p) => p.children.some((item) => item.kind === 'group-items')),
    ).toBe(true);
  });

  it('hoists child-tag sub-groups to the front of the panel with an empty title', () => {
    const result = buildGroupContent({
      tag: { name: 'Pets' },
      tagName: 'Pets',
      operations: [petsOperation],
      childTags: [
        { displayName: 'Cats', summary: 'Cat sub-group', slug: `${SPEC_BASE_PATH}/cats` },
      ],
      tagSlug: `${SPEC_BASE_PATH}/pets`,
      basePath: SPEC_BASE_PATH,
      description: markdocParser('Pets description', { sanitize: false }),
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;
    const groupPanel = container.panels?.[0] as GroupItemNode;

    // Child-tag sub-groups come first (titleless), before the Operations group.
    expect(groupPanel.children[0]).toMatchObject({ kind: panelKind.GROUP_ITEMS, title: '' });
    expect(groupPanel.children[0].items[0]).toMatchObject({
      title: 'Cats',
      childTag: true,
    });
    expect(groupPanel.children[1]).toMatchObject({ title: 'Operations' });
  });

  it('orders deprecated operations after regular ones in the operations panel', () => {
    const deprecatedFirst: OperationInfo = {
      pointer: '/paths/~1pets/post',
      pathName: '/pets',
      httpVerb: 'post',
      isWebhook: false,
      isAdditionalOperation: false,
      tags: ['Pets'],
      deprecated: true,
    };

    const result = buildGroupContent({
      tag: { name: 'Pets' },
      tagName: 'Pets',
      // deprecated operation is defined first in the spec, regular one second
      operations: [deprecatedFirst, petsOperation],
      tagSlug: `${SPEC_BASE_PATH}/pets`,
      basePath: SPEC_BASE_PATH,
      description: markdocParser('Pets description', { sanitize: false }),
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;
    const operationsGroup = (container.panels?.[0] as GroupItemNode | undefined)?.children.find(
      (child) => child.title === 'Operations',
    );

    // The deprecated operation must sink to the bottom, matching the nav order.
    expect(operationsGroup?.items.map((item) => item.deprecated)).toEqual([false, true]);
  });

  it('hoists a pure schemaDefinition description out of the container as a sibling', () => {
    const result = buildGroupContent({
      tag: { name: 'menu_model', 'x-displayName': 'The MenuItem Model' },
      tagName: 'menu_model',
      headerLabel: 'The MenuItem Model',
      description: markdocParser(SCHEMA_DEF_DESCRIPTION, { sanitize: false }),
      operations: [],
      tagSlug: `${SPEC_BASE_PATH}/menu-model`,
      basePath: SPEC_BASE_PATH,
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;

    // Container should only have the header — no markdoc prose inside
    expect(container.children).toHaveLength(1);
    expect(container.children[0]).toMatchObject({ nodeType: nodeTypes.HEADER });

    // container, then the schemaDefinition sibling.
    const schemaNode = result.children[1] as MarkdocNode;
    expect(schemaNode.nodeType).toBe(nodeTypes.MARKDOC);
    expect(Array.isArray(schemaNode.content)).toBe(true);
    const nodes = schemaNode.content as Array<{ type: string; tag: string }>;
    expect(nodes[0]).toMatchObject({ type: 'tag', tag: 'schemaDefinition' });
  });

  it('hoists prose and schemaDefinition as siblings in their original order', () => {
    const result = buildGroupContent({
      tag: { name: 'mixed_tag' },
      tagName: 'mixed_tag',
      description: markdocParser(PROSE_THEN_SCHEMA_DESCRIPTION, { sanitize: false }),
      operations: [],
      tagSlug: `${SPEC_BASE_PATH}/mixed-tag`,
      basePath: SPEC_BASE_PATH,
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;

    // Container has only the header — prose is hoisted out so order is preserved.
    expect(container.children).toHaveLength(1);
    expect(container.children[0]).toMatchObject({ nodeType: nodeTypes.HEADER });

    // Prose sibling, then schemaDefinition sibling.
    const proseSibling = result.children[1] as ContainerNode;
    expect(proseSibling.nodeType).toBe(nodeTypes.CONTAINER);
    expect(proseSibling.panels).toEqual([]);
    expect(proseSibling.children[0]).toMatchObject({ nodeType: nodeTypes.MARKDOC });

    const schemaNode = result.children[2] as MarkdocNode;
    expect(schemaNode.nodeType).toBe(nodeTypes.MARKDOC);
    const nodes = schemaNode.content as Array<{ type: string; tag: string }>;
    expect(nodes[0]).toMatchObject({ type: 'tag', tag: 'schemaDefinition' });
  });

  it('hoists multiple schemaDefinitions as separate sibling nodes', () => {
    const result = buildGroupContent({
      tag: { name: 'multi_schema_tag' },
      tagName: 'multi_schema_tag',
      description: markdocParser(MULTIPLE_SCHEMAS_DESCRIPTION, { sanitize: false }),
      operations: [],
      tagSlug: `${SPEC_BASE_PATH}/multi-schema-tag`,
      basePath: SPEC_BASE_PATH,
      markdownSanitize: { sanitize: false, unstable_hooks: {} },
    });

    const container = result.children[0] as ContainerNode;

    // Container only has the header
    expect(container.children).toHaveLength(1);

    // Two separate schema sibling nodes.
    for (let i = 1; i <= 2; i++) {
      const schemaNode = result.children[i] as MarkdocNode;
      expect(schemaNode.nodeType).toBe(nodeTypes.MARKDOC);
      const nodes = schemaNode.content as Array<{ type: string; tag: string }>;
      expect(nodes).toHaveLength(1);
      expect(nodes[0]).toMatchObject({ type: 'tag', tag: 'schemaDefinition' });
    }
  });
});
