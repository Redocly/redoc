import { collectOperations, filterOperations, findOperation } from './operations.js';
import { agentErrorResult, agentJsonResult, agentTextResult } from './results.js';
import { summarizeSecurity } from './security.js';

import type { AgentTool, ApiDocsAgentToolsParams } from './types.js';

export { collectOperations } from './operations.js';
export {
  MAX_AGENT_RESULT_CHARS,
  agentErrorResult,
  agentJsonResult,
  agentTextResult,
} from './results.js';
export { registerAgentTools } from './webmcp.js';
export { createSpecSliceOperationDetail } from './spec-slice-detail.js';
export type {
  AgentTool,
  AgentToolAnnotations,
  AgentToolOutcome,
  AgentToolResult,
  AgentToolsTelemetry,
  ApiDocsAgentToolsParams,
  ApiOperationSummary,
} from './types.js';

const DEFAULT_OPERATION_LIMIT = 100;
const MAX_OPERATION_LIMIT = 500;

function clampLimit(value: unknown, fallback: number, max: number): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
}

/**
 * Tools describing the API rendered on the current page. A host supplies how its URLs are shaped
 * and where operation detail comes from; everything else is read from the item tree and store.
 */
export function buildApiDocsAgentTools({
  items,
  store,
  resolveDocUrl,
  getOperationDetail,
}: ApiDocsAgentToolsParams): AgentTool[] {
  const operations = collectOperations(items, resolveDocUrl);

  return [
    {
      name: 'list_api_operations',
      title: 'List API operations',
      description:
        'List the operations of the API documented on this page, with their method, path and documentation URL. Optionally filter by a keyword.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Keyword to filter by summary, path or method' },
          limit: {
            type: 'integer',
            description: `Maximum number of operations, ${DEFAULT_OPERATION_LIMIT} by default`,
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async (input) => {
        const query = typeof input.query === 'string' ? input.query : '';
        const matched = filterOperations(operations, query);

        return agentJsonResult({
          specType: store.specType,
          operationCount: matched.length,
          operations: matched.slice(
            0,
            clampLimit(input.limit, DEFAULT_OPERATION_LIMIT, MAX_OPERATION_LIMIT),
          ),
        });
      },
    },
    {
      name: 'get_api_operation',
      title: 'Get an API operation',
      description:
        'Return the full reference for one operation of the API on this page: parameters, request body, responses and examples. Identify it by method and path, or by its documentation URL.',
      inputSchema: {
        type: 'object',
        properties: {
          method: { type: 'string', description: 'HTTP method, for example GET' },
          path: { type: 'string', description: 'Operation path, for example /museum-hours' },
          url: { type: 'string', description: 'Documentation URL of the operation' },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async (input, options) => {
        const url = typeof input.url === 'string' ? input.url : undefined;
        const method = typeof input.method === 'string' ? input.method : undefined;
        const path = typeof input.path === 'string' ? input.path : undefined;

        if (!url && !method && !path) {
          return agentErrorResult(
            'Identify the operation by method and path, or by its documentation URL.',
          );
        }

        const match = findOperation(operations, { url, method, path });
        if (!match) {
          return agentErrorResult(
            'No such operation on this page. Call list_api_operations to see what is available.',
          );
        }

        const header = `# ${match.method} ${match.path ?? match.title}\n\nDocumentation: ${match.url}\n`;
        const detail = await getOperationDetail?.(match, options);

        return agentTextResult(
          detail ? `${header}\n${detail}` : `${header}\n${JSON.stringify(match, null, 2)}`,
        );
      },
    },
    {
      name: 'get_api_authentication',
      title: 'Get API authentication',
      description:
        'Return the servers and authentication schemes of the API on this page: scheme types, OAuth flows and scopes. Credentials are never included.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: async () => agentJsonResult(summarizeSecurity(store)),
    },
  ];
}
