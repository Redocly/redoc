import type { ApiItem, ApiStore } from '../../types/store.js';

/** One operation of the documented API, flattened out of the navigation tree. */
export type ApiOperationSummary = {
  /** Upper-case HTTP method, or the entity kind for items such as `x-mcp` tools. */
  method: string;
  title: string;
  /** Documentation URL, already in the host's URL space. */
  url: string;
  path?: string;
  /** Tag or group the operation is listed under. */
  section?: string;
  deprecated?: boolean;
};

export type AgentToolResult = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

/** Hints an agent uses to decide whether a tool is safe to call unattended. */
export type AgentToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  /** The tool changes something outside the page, so an agent should confirm before calling it. */
  consequentialHint?: boolean;
};

/** A tool an agent can read and call, in the shape both WebMCP and MCP accept. */
export type AgentTool = {
  name: string;
  title: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: AgentToolAnnotations;
  execute: (
    input: Record<string, unknown>,
    options?: { signal?: AbortSignal },
  ) => Promise<AgentToolResult>;
};

export type ApiDocsAgentToolsParams = {
  items: ApiItem[];
  store: ApiStore;
  /** Rewrites an item link into the host's URL space; identity when omitted. */
  resolveDocUrl?: (link: string) => string;
  /** Full reference text for one operation; without it `get_api_operation` returns the summary. */
  getOperationDetail?: (
    operation: ApiOperationSummary,
    options?: { signal?: AbortSignal },
  ) => Promise<string | undefined>;
};

export type AgentToolOutcome = 'answered' | 'rejected' | 'failed';

/** How a host records use of the tools. */
export type AgentToolsTelemetry = {
  registered: (toolCount: number) => void;
  called: (toolName: string, outcome: AgentToolOutcome) => void;
};
