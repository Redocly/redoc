import markdoc from '@markdoc/markdoc';

import type { Node, Config, RenderableTreeNode, Schema } from '@markdoc/markdoc';
import type { MarkdocTagSchema } from '@redocly/theme/markdoc/tags/types';

import { html } from '@redocly/theme/markdoc/tags/html';
import { MARKDOWN_CLASS_NAME } from '@redocly/theme/core/constants';

import { safeSlugify } from '../../utils/string.js';
import { HEADING_SCOPE_VARIABLE, scopedHeadingAttributes } from '../../adapters/utils/markdoc.js';
import type { HeadingScope } from '../../adapters/utils/markdoc.js';
import { mcpTagSchemas } from './tags/mcp-tag-schemas.js';
import { schemaDefinitionTag } from './tags/schema-definition-tag.js';

/**
 * Server-safe Markdoc config for api-docs descriptions: the built-in tag schemas
 * (html / schemaDefinition / MCP) and node transforms (heading). Deliberately free
 * of React component imports so an embedder can run the description transform
 * server-side — e.g. in a server function — without pulling the theme / jotai /
 * styled-components render layer into a server bundle. The matching render
 * components (Heading, SchemaDefinition, McpTool/McpResource/McpPrompt) are exported
 * separately and wired in by the host's markdown adapter on the client.
 */

export function getMarkdownHeaderId(children: RenderableTreeNode[]): string | undefined {
  const text = collectInnerText(children).trim();
  return text ? `section/${safeSlugify(text)}` : undefined;
}

export const apiDocsMarkdocTags: Record<string, MarkdocTagSchema> = {
  html: html.schema,
  schemaDefinition: schemaDefinitionTag,
  ...mcpTagSchemas,
};

function collectInnerText(nodes: RenderableTreeNode[]): string {
  return nodes
    .map((child) => {
      if (typeof child === 'string') return child;
      if (markdoc.Tag.isTag(child)) return collectInnerText(child.children);
      return '';
    })
    .join('');
}

// Mark header cells with their text so the theme's stacked mobile table layout can label them.
function injectThLabels(children: RenderableTreeNode[]): RenderableTreeNode[] {
  return children.map((child) => {
    if (!markdoc.Tag.isTag(child)) return child;
    if (child.name === 'th') {
      return new markdoc.Tag(
        'th',
        { ...child.attributes, 'data-label': collectInnerText(child.children) },
        child.children,
      );
    }
    return new markdoc.Tag(child.name, child.attributes, injectThLabels(child.children));
  });
}

export const apiDocsMarkdocNodes: Record<string, Schema> = {
  // The theme's markdown table styles target `table.md` inside an `.md-table-wrapper` scroll
  // container (see @redocly/theme Markdown/styles/base-table); markdoc's default transform
  // emits a bare <table>, which renders unstyled. Mirrors the portal's table node
  // (packages/portal/src/markdoc/nodes/table.ts) so standalone tables get the same styling.
  table: {
    transform(node: Node, config: Config) {
      const attributes = node.transformAttributes(config);
      const children = node.transformChildren(config);

      return new markdoc.Tag('div', { className: 'md-table-wrapper' }, [
        new markdoc.Tag(
          'table',
          { ...attributes, className: MARKDOWN_CLASS_NAME },
          injectThLabels(children),
        ),
      ]);
    },
  },
  heading: {
    children: ['inline'],
    attributes: {
      id: { type: String },
      level: { type: Number, required: true, default: 1 },
      deepLinkHash: { type: String },
    },
    transform(node: Node, config: Config) {
      const attributes = node.transformAttributes(config);
      const children = node.transformChildren(config);

      const scope = config.variables?.[HEADING_SCOPE_VARIABLE] as HeadingScope | undefined;
      const fallbackId = getMarkdownHeaderId(children);
      // Headings inside a `{% partial %}` reach the client without build-time ids; the partial
      // tag carries the enclosing item's scope instead.
      const resolved =
        typeof attributes.id === 'string'
          ? { id: attributes.id }
          : fallbackId && scope
            ? scopedHeadingAttributes(fallbackId, scope)
            : { id: fallbackId };

      return new markdoc.Tag(
        'Heading',
        {
          ...attributes,
          ...resolved,
          level: node.attributes.level === 1 ? 2 : node.attributes.level, // only level 1 headings are main headings
        },
        children,
      );
    },
  },
};
