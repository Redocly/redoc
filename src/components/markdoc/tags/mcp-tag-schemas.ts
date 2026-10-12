import type { MarkdocTagSchema } from '@redocly/theme/markdoc/tags/types';

export const mcpTagSchemas: Record<string, MarkdocTagSchema> = {
  mcpTool: {
    render: 'McpTool',
    attributes: {
      name: { type: String },
      id: { type: String },
    },
  },
  mcpResource: {
    render: 'McpResource',
    attributes: {
      name: { type: String },
      id: { type: String },
    },
  },
  mcpPrompt: {
    render: 'McpPrompt',
    attributes: {
      name: { type: String },
      id: { type: String },
    },
  },
};
