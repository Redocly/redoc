import { useMemo } from 'react';
import * as Sampler from 'openapi-sampler';

import type { Node } from '@markdoc/markdoc';
import type { McpExampleNode } from '../../types/content.js';
import type { McpPromptArgument, McpResource, OpenAPISchema } from '../../types/openapi.js';

import { panelKind } from '../../types/common.js';
import { resolveMarkdocHeadingIds } from '../../adapters/utils/markdoc.js';
import { useMarkdownAdapter } from '../../contexts/markdownAdapter.js';
import { useHashItemId } from '../../hooks/useDeepLinkSection.js';

export function useMcpDescriptionAst(description: unknown): unknown {
  const adapter = useMarkdownAdapter();
  const itemId = useHashItemId();

  return useMemo(() => {
    if (!description) return null;
    const parsed = adapter.parse(description);
    if (itemId && parsed && typeof parsed === 'object') {
      resolveMarkdocHeadingIds(parsed as Node | Node[], itemId);
    }
    return parsed;
  }, [adapter, description, itemId]);
}

export function sampleSchema(schema: OpenAPISchema): unknown {
  try {
    return Sampler.sample(schema as Record<string, unknown>, { quiet: true });
  } catch {
    return {};
  }
}

export function buildMcpExamplePanel(
  schema: OpenAPISchema,
  example: 'input' | 'output' | 'arguments',
): McpExampleNode {
  return {
    children: [
      {
        kind: panelKind.MCP_EXAMPLE,
        headerTitleTranslationKey:
          example === 'output'
            ? 'openapi.mcp.outputExample'
            : example === 'arguments'
              ? 'openapi.mcp.argumentsExample'
              : 'openapi.mcp.inputExample',
        data: sampleSchema(schema),
      },
    ],
  };
}

export function buildResourceContentPanel(resource: McpResource): McpExampleNode | null {
  const content = resource.text ?? resource.blob;

  if (content === undefined) return null;

  return {
    children: [
      {
        kind: panelKind.MCP_EXAMPLE,
        headerTitleTranslationKey: 'openapi.mcp.exampleTitle',
        data: content,
        language: resource.mimeType,
      },
    ],
  };
}

export function buildPromptArgumentsSchema(args: McpPromptArgument[]): OpenAPISchema | null {
  if (!args.length) return null;

  return {
    type: 'object',
    properties: Object.fromEntries(
      args.map((arg) => [
        arg.name,
        {
          type: 'string',
          example: arg.example ?? 'string',
          description: typeof arg.description === 'string' ? arg.description : undefined,
        },
      ]),
    ),
    required: args.filter((arg) => arg.required).map((arg) => arg.name),
  };
}
