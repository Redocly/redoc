import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { ReactNode } from 'react';
import type { GlobalStoreAtom } from '../../../jotai/store.js';
import type { McpPromptArgument } from '../../../types/openapi.js';

import { panelKind } from '../../../types/common.js';
import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { ItemIdContext } from '../../../hooks/useDeepLinkSection.js';
import { createMarkdocAdapter } from '../../markdoc/markdocAdapter.js';
import {
  buildMcpExamplePanel,
  buildPromptArgumentsSchema,
  buildResourceContentPanel,
  sampleSchema,
  useMcpDescriptionAst,
} from '../utils.js';

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

describe('sampleSchema', () => {
  it('generates sample data from an object schema', () => {
    const result = sampleSchema({
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'string' },
      },
    });

    expect(result).toEqual({ a: 0, b: 'string' });
  });

  it('returns empty object on invalid schema', () => {
    expect(sampleSchema(null as never)).toEqual({});
  });
});

describe('buildMcpExamplePanel', () => {
  it('builds a single panel for a schema', () => {
    const panel = buildMcpExamplePanel(
      { type: 'object', properties: { x: { type: 'number' } } },
      'input',
    );

    expect(panel.children).toHaveLength(1);
    expect(panel.children[0].kind).toBe(panelKind.MCP_EXAMPLE);
    expect(panel.children[0].headerTitleTranslationKey).toBe('openapi.mcp.inputExample');
    expect(panel.children[0].data).toEqual({ x: 0 });
  });

  it('uses the provided header title', () => {
    const panel = buildMcpExamplePanel(
      { type: 'object', properties: { result: { type: 'string' } } },
      'output',
    );

    expect(panel.children[0].headerTitleTranslationKey).toBe('openapi.mcp.outputExample');
    expect(panel.children[0].data).toEqual({ result: 'string' });
  });
});

function makeWrapper({ itemId, basePath = '' }: { itemId?: string; basePath?: string } = {}) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: [],
    store: {
      schemaStore: {},
      exampleStore: {},
      securitySchemeStore: {},
    } as GlobalStoreAtom['store'],
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath,
      markdownParser: () => undefined,
    }),
    replayDefinition: null,
  });

  const adapter = createMarkdocAdapter();

  return ({ children }: { children: ReactNode }) =>
    createElement(
      JotaiProvider,
      { store: jotaiStore },
      createElement(
        MarkdownAdapterProvider,
        { value: adapter },
        itemId ? createElement(ItemIdContext.Provider, { value: itemId }, children) : children,
      ),
    );
}

function findHeading(node: unknown): { attributes?: Record<string, unknown> } | undefined {
  if (!node || typeof node !== 'object') return undefined;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findHeading(child);
      if (found) return found;
    }
    return undefined;
  }
  const candidate = node as { type?: string; children?: unknown[] } & ReturnType<
    typeof findHeading
  >;
  if (candidate.type === 'heading') return candidate;
  for (const child of candidate.children ?? []) {
    const found = findHeading(child);
    if (found) return found;
  }
  return undefined;
}

describe('useMcpDescriptionAst', () => {
  it('returns null when the description is empty', () => {
    const { result } = renderHook(() => useMcpDescriptionAst(undefined), {
      wrapper: makeWrapper(),
    });

    expect(result.current).toBeNull();
  });

  it('parses a markdown string into an AST', () => {
    const { result } = renderHook(() => useMcpDescriptionAst('Echoes **back** the `input`'), {
      wrapper: makeWrapper(),
    });

    expect(result.current).not.toBe('Echoes **back** the `input`');
    expect(typeof result.current).toBe('object');
  });

  it('scopes heading ids and deep links to the current item route', () => {
    const { result } = renderHook(() => useMcpDescriptionAst('# Prints\n\nAll the env vars'), {
      wrapper: makeWrapper({ itemId: '/docs/tools/printenv', basePath: '/docs' }),
    });

    const heading = findHeading(result.current);
    expect(heading?.attributes?.id).toBe('tools/printenv/prints');
    expect(heading?.attributes?.deepLinkHash).toBe('/tools/printenv#tools/printenv/prints');
  });

  it('leaves heading ids untouched without an item id in context', () => {
    const { result } = renderHook(() => useMcpDescriptionAst('# Prints\n\nAll the env vars'), {
      wrapper: makeWrapper(),
    });

    const heading = findHeading(result.current);
    expect(heading).toBeDefined();
    expect(heading?.attributes?.id).toBeUndefined();
    expect(heading?.attributes?.deepLinkHash).toBeUndefined();
  });

  it('passes a pre-parsed AST through by reference and still scopes its headings', () => {
    const prebuilt = createMarkdocAdapter().parse('# Prints\n\nAll the env vars');

    const { result } = renderHook(() => useMcpDescriptionAst(prebuilt), {
      wrapper: makeWrapper({ itemId: '/docs/tools/printenv', basePath: '/docs' }),
    });

    expect(result.current).toBe(prebuilt);
    expect(findHeading(result.current)?.attributes?.id).toBe('tools/printenv/prints');
  });

  it('keeps the parsed AST reference stable across rerenders', () => {
    const { result, rerender } = renderHook(
      () => useMcpDescriptionAst('Stable **markdown** text'),
      { wrapper: makeWrapper() },
    );

    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('buildResourceContentPanel', () => {
  it('builds a panel from resource with text content', () => {
    const panel = buildResourceContentPanel({
      name: 'res1',
      uri: 'test://resource/1',
      mimeType: 'text/plain',
      text: 'Hello, world!',
    });

    expect(panel).toEqual({
      children: [
        {
          kind: panelKind.MCP_EXAMPLE,
          headerTitleTranslationKey: 'openapi.mcp.exampleTitle',
          data: 'Hello, world!',
          language: 'text/plain',
        },
      ],
    });
  });

  it('builds a panel from resource with blob content', () => {
    const panel = buildResourceContentPanel({
      name: 'res2',
      uri: 'test://resource/2',
      mimeType: 'application/octet-stream',
      blob: 'UkV2b3VyWQ==',
    });

    expect(panel).toEqual({
      children: [
        {
          kind: panelKind.MCP_EXAMPLE,
          headerTitleTranslationKey: 'openapi.mcp.exampleTitle',
          data: 'UkV2b3VyWQ==',
          language: 'application/octet-stream',
        },
      ],
    });
  });

  it('prefers text over blob when both are present', () => {
    const panel = buildResourceContentPanel({
      name: 'res3',
      uri: 'test://resource/3',
      mimeType: 'text/plain',
      text: 'text content',
      blob: 'blob-data',
    });

    expect(panel).toEqual({
      children: [expect.objectContaining({ data: 'text content' })],
    });
  });

  it('returns null when resource has no text or blob', () => {
    const panel = buildResourceContentPanel({
      name: 'res4',
      uri: 'test://resource/4',
      mimeType: 'text/plain',
    });

    expect(panel).toBeNull();
  });
});
