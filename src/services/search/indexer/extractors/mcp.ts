import type { OperationParameter } from '@redocly/theme/core/openapi';
import type { ApiItem, McpData } from '../../../../types/store.js';
import type { SchemaNode } from '../../../../types/schema.js';
import type { ExtractContext } from './context.js';

import { buildPromptArgumentsSchema } from '../../../../components/Mcp/utils.js';
import {
  MCP_INPUT_SCHEMA_PLACE,
  MCP_OUTPUT_SCHEMA_PLACE,
  MCP_PROMPT_ARGUMENTS_PLACE,
} from '../places.js';
import { describe } from './context.js';

const MCP_VERBS = new Set(['tool', 'rsrc', 'prompt']);

type McpFields = { text: string; parameters: OperationParameter[] };

export function extractMcpFields(
  item: ApiItem,
  document: Record<string, unknown> | undefined,
  ctx: ExtractContext,
): McpFields | undefined {
  const verb = 'httpVerb' in item ? (item.httpVerb as string | undefined) : undefined;
  const name = item.content?.meta?.name;
  if (!verb || !MCP_VERBS.has(verb) || typeof name !== 'string') return undefined;

  const mcp = document?.['x-mcp'] as McpData | undefined;
  const paramsMap: Record<string, OperationParameter> = {};
  const describeText = (value: unknown): string =>
    typeof value === 'string' ? describe(ctx, value) : '';
  const walk = (schema: unknown, place: string, linkType: string): void => {
    if (schema && typeof schema === 'object') {
      ctx.walker.extractSchemaNodeFields(schema as SchemaNode, {
        place,
        paramsMap,
        slug: ctx.slug,
        linkType,
      });
    }
  };

  let text = '';
  if (verb === 'tool') {
    const tool = mcp?.tools?.find((t) => t.name === name);
    if (!tool) return undefined;
    text = describeText(tool.description);
    walk(tool.inputSchema, MCP_INPUT_SCHEMA_PLACE, 'input-schema');
    walk(tool.outputSchema, MCP_OUTPUT_SCHEMA_PLACE, 'output-schema');
  } else if (verb === 'rsrc') {
    const resource = mcp?.resources?.find((r) => r.name === name);
    if (!resource) return undefined;
    text = [describeText(resource.description), resource.uri, resource.mimeType]
      .filter(Boolean)
      .join(' ');
  } else {
    const prompt = mcp?.prompts?.find((p) => p.name === name);
    if (!prompt) return undefined;
    text = describeText(prompt.description);
    walk(
      buildPromptArgumentsSchema(prompt.arguments ?? []),
      MCP_PROMPT_ARGUMENTS_PLACE,
      'arguments',
    );
  }

  return { text, parameters: Object.values(paramsMap) };
}
