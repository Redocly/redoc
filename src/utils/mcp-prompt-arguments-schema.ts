import type { McpPromptArgument, OpenAPISchema } from '../types/openapi.js';

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
