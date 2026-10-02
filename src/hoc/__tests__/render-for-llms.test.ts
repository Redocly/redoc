import { Ast, type Node } from '@markdoc/markdoc';
import { describe, it, expect } from 'vitest';

import type { MarkdocTagSchema, RenderForLlmsContext } from '@redocly/theme/markdoc/tags/types';

import { mcpTagSchemas } from '../../components/markdoc/tags/mcp-tag-schemas.js';
import { schemaDefinitionTag } from '../../components/markdoc/tags/schema-definition-tag.js';
import { html } from '@redocly/theme/markdoc/tags/html';

/**
 * Mirrors the portal's createRenderTagFn — looks up renderForLlms on the
 * matching tag schema and calls it. Returns undefined when the tag has no
 * renderForLlms (portal falls back to walking children in that case).
 */
function renderTag(
  tags: Record<string, MarkdocTagSchema>,
  node: Node,
  context: RenderForLlmsContext,
): string | undefined {
  if (!node.tag) return undefined;
  return tags[node.tag]?.renderForLlms?.(node, context);
}

const noopContext: RenderForLlmsContext = { getBody: () => '' };

describe('renderForLlms', () => {
  describe('custom tag with renderForLlms controls its LLM output', () => {
    it('self-closing tag renders from attributes only', () => {
      const tags: Record<string, MarkdocTagSchema> = {
        styledLink: {
          render: 'StyledLink',
          attributes: { href: { type: String }, label: { type: String } },
          renderForLlms: (node: Node) => `[${node.attributes.label}](${node.attributes.href})`,
        },
      };

      const node = new Ast.Node(
        'tag',
        { href: 'https://example.com', label: 'Example' },
        [],
        'styledLink',
      );
      expect(renderTag(tags, node, noopContext)).toBe('[Example](https://example.com)');
    });

    it('tag with body uses getBody() to include child content', () => {
      const tags: Record<string, MarkdocTagSchema> = {
        callout: {
          render: 'Callout',
          attributes: { title: { type: String } },
          renderForLlms: (node: Node, { getBody }: RenderForLlmsContext) =>
            [node.attributes.title, getBody()].filter(Boolean).join('\n'),
        },
      };

      const bodyText = 'Important details here.';
      const context: RenderForLlmsContext = { getBody: () => bodyText };
      const node = new Ast.Node('tag', { title: 'Warning' }, [], 'callout');
      expect(renderTag(tags, node, context)).toBe(`Warning\n${bodyText}`);
    });

    it('tag body is excluded by default when renderForLlms does not call getBody', () => {
      const tags: Record<string, MarkdocTagSchema> = {
        summary: {
          render: 'Summary',
          attributes: { text: { type: String } },
          renderForLlms: (node: Node) => String(node.attributes.text),
        },
      };

      const context: RenderForLlmsContext = { getBody: () => 'hidden child content' };
      const node = new Ast.Node('tag', { text: 'visible only' }, [], 'summary');
      expect(renderTag(tags, node, context)).toBe('visible only');
    });
  });

  describe('tags without renderForLlms fall through to default behavior', () => {
    it('returns undefined for a tag with no renderForLlms', () => {
      const tags: Record<string, MarkdocTagSchema> = {
        plainTag: { render: 'PlainTag' },
      };
      const node = new Ast.Node('tag', {}, [], 'plainTag');
      expect(renderTag(tags, node, noopContext)).toBeUndefined();
    });

    it('returns undefined for an unregistered tag', () => {
      const node = new Ast.Node('tag', {}, [], 'unknownTag');
      expect(renderTag({}, node, noopContext)).toBeUndefined();
    });

    it('returns undefined for a non-tag node', () => {
      const node = new Ast.Node('text', { content: 'plain text' });
      expect(renderTag({}, node, noopContext)).toBeUndefined();
    });

    it('html tag (built-in, no renderForLlms) returns undefined', () => {
      const tags: Record<string, MarkdocTagSchema> = { html: html.schema };
      const node = new Ast.Node('tag', { name: 'div' }, [], 'html');
      expect(renderTag(tags, node, noopContext)).toBeUndefined();
    });
  });

  describe('user tags merged with built-in tags', () => {
    it('user-defined renderForLlms works alongside built-in tags', () => {
      const userTags: Record<string, MarkdocTagSchema> = {
        fancyLink: {
          render: 'FancyLink',
          attributes: { url: { type: String }, text: { type: String } },
          renderForLlms: (node: Node) => `[${node.attributes.text}](${node.attributes.url})`,
        },
      };

      const merged = { ...userTags, ...mcpTagSchemas, schemaDefinition: schemaDefinitionTag };

      const userNode = new Ast.Node(
        'tag',
        { url: 'https://docs.example.com', text: 'Docs' },
        [],
        'fancyLink',
      );
      expect(renderTag(merged, userNode, noopContext)).toBe('[Docs](https://docs.example.com)');

      const mcpNode = new Ast.Node('tag', { name: 'echo' }, [], 'mcpTool');
      expect(renderTag(merged, mcpNode, noopContext)).toBe('MCP Tool: echo');
    });
  });

  describe('built-in api-docs tags', () => {
    const builtInCases: Array<{
      tag: string;
      attrs: Record<string, unknown>;
      expected: string;
    }> = [
      { tag: 'mcpTool', attrs: { name: 'echo' }, expected: 'MCP Tool: echo' },
      {
        tag: 'mcpResource',
        attrs: { name: 'logs://recent' },
        expected: 'MCP Resource: logs://recent',
      },
      { tag: 'mcpPrompt', attrs: { name: 'summarize' }, expected: 'MCP Prompt: summarize' },
      {
        tag: 'schemaDefinition',
        attrs: { schemaRef: '#/components/schemas/Pet' },
        expected: 'Schema: #/components/schemas/Pet',
      },
    ];

    const allBuiltIn: Record<string, MarkdocTagSchema> = {
      ...mcpTagSchemas,
      schemaDefinition: schemaDefinitionTag,
    };

    it.each(builtInCases)(
      '$tag → "$expected"',
      ({
        tag,
        attrs,
        expected,
      }: {
        tag: string;
        attrs: Record<string, unknown>;
        expected: string;
      }) => {
        const node = new Ast.Node('tag', attrs, [], tag);
        expect(renderTag(allBuiltIn, node, noopContext)).toBe(expected);
      },
    );

    it('schemaDefinition with no schemaRef returns empty string', () => {
      const node = new Ast.Node('tag', {}, [], 'schemaDefinition');
      expect(renderTag(allBuiltIn, node, noopContext)).toBe('');
    });

    it('every built-in tag with renderForLlms also has a render component', () => {
      for (const [name, schema] of Object.entries(allBuiltIn)) {
        expect(schema.render, `${name} missing render`).toBeDefined();
        expect(schema.renderForLlms, `${name} missing renderForLlms`).toBeDefined();
      }
    });
  });
});
