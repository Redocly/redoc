export const SUPPORTED_MCP_TYPES = ['tools', 'resources', 'prompts'] as const;
export type McpCollectionType = (typeof SUPPORTED_MCP_TYPES)[number];

export const MCP_SERVER_EXPERIMENTAL_CAPABILITIES = 'experimental';

export const PAGE_ACTIONS_MCP = ['mcp-cursor' as const, 'mcp-vscode' as const];
