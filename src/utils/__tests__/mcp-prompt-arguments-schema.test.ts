import { describe, expect, it } from 'vitest';

import type { McpPromptArgument } from '../../types/openapi.js';

import { buildPromptArgumentsSchema } from '../mcp-prompt-arguments-schema.js';

describe('buildPromptArgumentsSchema', () => {
  it('returns null for empty arguments array', () => {
    expect(buildPromptArgumentsSchema([])).toBeNull();
  });

  it('builds a schema from a single required argument', () => {
    const args: McpPromptArgument[] = [
      { name: 'topic', description: 'The topic', required: true, example: 'weather' },
    ];

    const result = buildPromptArgumentsSchema(args);

    expect(result).toEqual({
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          example: 'weather',
          description: 'The topic',
        },
      },
      required: ['topic'],
    });
  });

  it('builds a schema with mixed required and optional arguments', () => {
    const args: McpPromptArgument[] = [
      { name: 'query', description: 'Search query', required: true, example: 'cats' },
      { name: 'limit', description: 'Max results', required: false },
    ];

    const result = buildPromptArgumentsSchema(args);

    expect(result).toEqual({
      type: 'object',
      properties: {
        query: { type: 'string', example: 'cats', description: 'Search query' },
        limit: { type: 'string', example: 'string', description: 'Max results' },
      },
      required: ['query'],
    });
  });

  it('uses "string" as default example when none provided', () => {
    const args: McpPromptArgument[] = [
      { name: 'input', description: 'Input value', required: false },
    ];

    const result = buildPromptArgumentsSchema(args);
    expect(result).not.toBeNull();

    const inputProp = result && result.properties && result.properties['input'];
    expect(inputProp).toEqual({
      type: 'string',
      example: 'string',
      description: 'Input value',
    });
  });

  it('excludes description when it is not a string', () => {
    const args: McpPromptArgument[] = [
      { name: 'arg', description: ['node'] as any, required: false },
    ];

    const result = buildPromptArgumentsSchema(args);
    expect(result).not.toBeNull();

    const argProp = result && result.properties && result.properties['arg'];
    expect(argProp).toEqual({
      type: 'string',
      example: 'string',
      description: undefined,
    });
  });
});
