import type { Node } from '@markdoc/markdoc';
import type { MarkdocTagSchema } from '@redocly/theme/markdoc/tags/types';

export const mcpTagSchemas: Record<string, MarkdocTagSchema> = {
  mcpTool: {
    render: 'McpTool',
    attributes: {
      name: { type: String },
      id: { type: String },
    },
    renderForLlms: (node: Node) => `MCP Tool: ${node.attributes.name}`,
  },
  mcpResource: {
    render: 'McpResource',
    attributes: {
      name: { type: String },
      id: { type: String },
    },
    renderForLlms: (node: Node) => `MCP Resource: ${node.attributes.name}`,
  },
  mcpPrompt: {
    render: 'McpPrompt',
    attributes: {
      name: { type: String },
      id: { type: String },
    },
    renderForLlms: (node: Node) => `MCP Prompt: ${node.attributes.name}`,
  },
};
