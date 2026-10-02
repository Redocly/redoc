import { describe, it, expect } from 'vitest';

import type {
  ApiItemContent,
  ContainerNode,
  HeaderNode,
  MarkdocNode,
} from '../../../../../types/content.js';

import { nodeTypes } from '../../../../../types/common.js';
import { buildSchemaDefinitionContent } from '../content.js';
import { normalizeOptions } from '../../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

const options = { ...normalizeOptions({}), markdownParser: markdocParser };

function findHeader(content: ApiItemContent): HeaderNode | undefined {
  const container = content.children.find((n) => n.nodeType === nodeTypes.CONTAINER) as
    | ContainerNode
    | undefined;
  return container?.children.find((n) => n.nodeType === nodeTypes.HEADER) as HeaderNode | undefined;
}

function findSchemaDefinitionMarkdoc(content: ApiItemContent): MarkdocNode | undefined {
  return content.children.find((n) => {
    if (n.nodeType !== nodeTypes.MARKDOC) return false;
    const nodes = Array.isArray((n as MarkdocNode).content)
      ? ((n as MarkdocNode).content as { tag?: string }[])
      : [(n as MarkdocNode).content as { tag?: string }];
    return nodes.some((node) => node.tag === 'schemaDefinition');
  }) as MarkdocNode | undefined;
}

describe('buildSchemaDefinitionContent', () => {
  it('should emit a markdoc schemaDefinition tag pointing at the schema with showWriteOnly=true', () => {
    const content = buildSchemaDefinitionContent('Pet', undefined, options);
    const markdoc = findSchemaDefinitionMarkdoc(content) as MarkdocNode;
    expect(markdoc).toBeDefined();

    const nodes = Array.isArray(markdoc.content) ? markdoc.content : [markdoc.content];
    const tag = nodes.find((n) => (n as { tag?: string }).tag === 'schemaDefinition') as
      | { attributes?: Record<string, unknown> }
      | undefined;

    expect(tag?.attributes).toMatchObject({
      schemaRef: '#/components/schemas/Pet',
      showWriteOnly: true,
    });
  });

  it('should fall back to the schema name in the header when title is undefined', () => {
    const content = buildSchemaDefinitionContent('Pet', undefined, options);
    expect(findHeader(content)?.label).toBe('Pet');
    expect(content.seo?.title).toBe('Pet');
  });

  it('should use the provided title in the header when one is given', () => {
    const content = buildSchemaDefinitionContent('Pet', 'A Lovely Pet', options);
    expect(findHeader(content)?.label).toBe('A Lovely Pet');
    expect(content.seo?.title).toBe('A Lovely Pet');
  });
});
