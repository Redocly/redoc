import { describe, it, expect } from 'vitest';

import type { ApiItem } from '../../../../../types/store.js';
import type { OpenAPIDefinition } from '../../../../../types/openapi.js';

import { processOpenApiDocument } from '../../../index.js';
import { collectAllItems } from '../../../../__tests__/utils.js';
import { normalizeOptions } from '../../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';
import { addMcpItems } from '../item.js';
import { openApiContext } from '../../../buildContext.js';
import { createBuildContext } from '../../../build/context.js';
import { createStoreContext, toRecord } from '../../../../helpers.js';

function hasHttpVerb(item: ApiItem): item is ApiItem & { httpVerb: string } {
  return 'httpVerb' in item && typeof item.httpVerb === 'string';
}

const defaultOptions = {
  ...normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
  }),
  markdownParser: markdocParser,
};

function makeDocument(xMcp: OpenAPIDefinition['x-mcp']): OpenAPIDefinition {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1' },
    paths: {},
    'x-mcp': xMcp,
  } as OpenAPIDefinition;
}

describe('addMcpItems (unit)', () => {
  it('creates sidebar items for MCP tools under their default tag', () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      servers: [{ url: 'http://localhost/mcp' }],
      tools: [
        { name: 'echo', description: 'Echoes back', inputSchema: { type: 'object' } },
        { name: 'add', description: 'Adds numbers', inputSchema: { type: 'object' } },
      ],
      resources: [],
      prompts: [],
    });

    const storeCtx = createStoreContext(toRecord(document));
    const context = createBuildContext({
      document,
      options: defaultOptions,
      basePath: '/docs',
      storeCtx,
    });

    const result: ApiItem[] = [];
    openApiContext.run(context, () => {
      addMcpItems({ tagName: 'Tools', tagSlug: '/docs/tools', result });
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ type: 'link', label: 'echo', httpVerb: 'tool' });
    expect(result[1]).toMatchObject({ type: 'link', label: 'add', httpVerb: 'tool' });
    expect(result[0].routeSlug).toContain('echo');
  });

  it('uses title as label when available', () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: {},
      servers: [],
      tools: [
        {
          name: 'echo',
          title: 'Echo Tool',
          description: 'Echoes',
          inputSchema: { type: 'object' },
        },
      ],
      resources: [],
      prompts: [],
    });

    const storeCtx = createStoreContext(toRecord(document));
    const context = createBuildContext({
      document,
      options: defaultOptions,
      basePath: '/docs',
      storeCtx,
    });

    const result: ApiItem[] = [];
    openApiContext.run(context, () => {
      addMcpItems({ tagName: 'Tools', tagSlug: '/docs/tools', result });
    });

    expect(result[0].label).toBe('Echo Tool');
  });

  it('assigns MCP entities to explicit tags', () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: {},
      servers: [],
      tools: [
        { name: 'echo', tags: ['Utilities'], inputSchema: { type: 'object' } },
        { name: 'add', tags: ['Math'], inputSchema: { type: 'object' } },
      ],
      resources: [],
      prompts: [],
    });

    const storeCtx = createStoreContext(toRecord(document));
    const context = createBuildContext({
      document,
      options: defaultOptions,
      basePath: '/docs',
      storeCtx,
    });

    const utilitiesResult: ApiItem[] = [];
    const mathResult: ApiItem[] = [];
    const toolsResult: ApiItem[] = [];

    openApiContext.run(context, () => {
      addMcpItems({ tagName: 'Utilities', tagSlug: '/docs/utilities', result: utilitiesResult });
      addMcpItems({ tagName: 'Math', tagSlug: '/docs/math', result: mathResult });
      addMcpItems({ tagName: 'Tools', tagSlug: '/docs/tools', result: toolsResult });
    });

    expect(utilitiesResult).toHaveLength(1);
    expect(utilitiesResult[0].label).toBe('echo');
    expect(mathResult).toHaveLength(1);
    expect(mathResult[0].label).toBe('add');
    expect(toolsResult).toHaveLength(0);
  });

  it('creates items for resources and prompts with correct httpVerb', () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: {},
      servers: [],
      tools: [],
      resources: [{ name: 'readme', uri: 'docs://readme', mimeType: 'text/plain' }],
      prompts: [{ name: 'greet', description: 'Greets user', arguments: [] }],
    });

    const storeCtx = createStoreContext(toRecord(document));
    const context = createBuildContext({
      document,
      options: defaultOptions,
      basePath: '/docs',
      storeCtx,
    });

    const resourceResult: ApiItem[] = [];
    const promptResult: ApiItem[] = [];

    openApiContext.run(context, () => {
      addMcpItems({ tagName: 'Resources', tagSlug: '/docs/resources', result: resourceResult });
      addMcpItems({ tagName: 'Prompts', tagSlug: '/docs/prompts', result: promptResult });
    });

    expect(resourceResult).toHaveLength(1);
    expect(resourceResult[0]).toMatchObject({ label: 'readme', httpVerb: 'rsrc' });
    expect(promptResult).toHaveLength(1);
    expect(promptResult[0]).toMatchObject({ label: 'greet', httpVerb: 'prompt' });
  });

  it('returns nothing for tag with no matching MCP entities', () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: {},
      servers: [],
      tools: [{ name: 'echo', inputSchema: { type: 'object' } }],
      resources: [],
      prompts: [],
    });

    const storeCtx = createStoreContext(toRecord(document));
    const context = createBuildContext({
      document,
      options: defaultOptions,
      basePath: '/docs',
      storeCtx,
    });

    const result: ApiItem[] = [];
    openApiContext.run(context, () => {
      addMcpItems({ tagName: 'Unrelated', tagSlug: '/docs/unrelated', result });
    });

    expect(result).toHaveLength(0);
  });

  it('returns nothing when document has no x-mcp', () => {
    const document: OpenAPIDefinition = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      paths: {},
    } as OpenAPIDefinition;

    const storeCtx = createStoreContext(toRecord(document));
    const context = createBuildContext({
      document,
      options: defaultOptions,
      basePath: '/docs',
      storeCtx,
    });

    const result: ApiItem[] = [];
    openApiContext.run(context, () => {
      addMcpItems({ tagName: 'Tools', tagSlug: '/docs/tools', result });
    });

    expect(result).toHaveLength(0);
  });
});

describe('buildOpenApiItems with x-mcp (integration)', () => {
  it('creates MCP sidebar groups with tool/resource/prompt items', async () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: { tools: {}, resources: { subscribe: true }, prompts: {} },
      servers: [{ url: 'http://localhost:3001/mcp' }],
      tools: [
        { name: 'echo', description: 'Echoes', inputSchema: { type: 'object' } },
        { name: 'add', description: 'Adds', inputSchema: { type: 'object' } },
      ],
      resources: [{ name: 'readme', uri: 'docs://readme', mimeType: 'text/plain' }],
      prompts: [{ name: 'greet', description: 'Greets', arguments: [] }],
    });

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/docs',
      options: defaultOptions,
    });

    const flat = collectAllItems(items);

    const toolItems = flat.filter(hasHttpVerb).filter((i) => i.httpVerb === 'tool');
    expect(toolItems).toHaveLength(2);
    expect(toolItems.map((i) => i.label)).toEqual(['echo', 'add']);

    const resourceItems = flat.filter(hasHttpVerb).filter((i) => i.httpVerb === 'rsrc');
    expect(resourceItems).toHaveLength(1);
    expect(resourceItems[0].label).toBe('readme');

    const promptItems = flat.filter(hasHttpVerb).filter((i) => i.httpVerb === 'prompt');
    expect(promptItems).toHaveLength(1);
    expect(promptItems[0].label).toBe('greet');
  });

  it('populates group panels with MCP items', async () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: {},
      servers: [],
      tools: [
        { name: 'echo', inputSchema: { type: 'object' } },
        { name: 'add', inputSchema: { type: 'object' } },
      ],
      resources: [{ name: 'readme', uri: 'docs://readme', mimeType: 'text/plain' }],
      prompts: [{ name: 'greet', description: 'Greets', arguments: [] }],
    });

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/docs',
      options: defaultOptions,
    });

    const toolsGroup = items.find((i) => i.type === 'group' && i.label === 'Tools');
    const toolsPanels = toolsGroup?.content?.children[0]?.panels ?? [];
    expect(toolsPanels).toHaveLength(1);
    expect(toolsPanels[0].children[0]).toMatchObject({
      kind: 'group-items',
      title: 'MCP Tools',
      items: expect.arrayContaining([
        expect.objectContaining({ title: 'echo', prefix: { name: 'tool', color: 'tool' } }),
        expect.objectContaining({ title: 'add', prefix: { name: 'tool', color: 'tool' } }),
      ]),
    });

    const resourcesGroup = items.find((i) => i.type === 'group' && i.label === 'Resources');
    const resourcesPanels = resourcesGroup?.content?.children[0]?.panels ?? [];
    expect(resourcesPanels).toHaveLength(1);
    expect(resourcesPanels[0].children[0]).toMatchObject({
      kind: 'group-items',
      title: 'MCP Resources',
      items: [
        expect.objectContaining({ title: 'readme', prefix: { name: 'rsrc', color: 'rsrc' } }),
      ],
    });

    const promptsGroup = items.find((i) => i.type === 'group' && i.label === 'Prompts');
    const promptsPanels = promptsGroup?.content?.children[0]?.panels ?? [];
    expect(promptsPanels).toHaveLength(1);
    expect(promptsPanels[0].children[0]).toMatchObject({
      kind: 'group-items',
      title: 'MCP Prompts',
      items: [
        expect.objectContaining({ title: 'greet', prefix: { name: 'prompt', color: 'prompt' } }),
      ],
    });
  });

  it('creates auto-generated tag groups (Tools, Resources, Prompts)', async () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: {},
      servers: [],
      tools: [{ name: 'echo', inputSchema: { type: 'object' } }],
      resources: [{ name: 'readme', uri: 'docs://readme', mimeType: 'text/plain' }],
      prompts: [{ name: 'greet', description: 'Greets', arguments: [] }],
    });

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/docs',
      options: defaultOptions,
    });

    const groupLabels = items.filter((i) => i.type === 'group').map((i) => i.label);
    expect(groupLabels).toContain('Tools');
    expect(groupLabels).toContain('Resources');
    expect(groupLabels).toContain('Prompts');
  });

  it('places MCP entities under explicit tags alongside operations', async () => {
    const document: OpenAPIDefinition = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      tags: [{ name: 'Events' }],
      paths: {
        '/events': {
          get: {
            tags: ['Events'],
            operationId: 'listEvents',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      'x-mcp': {
        protocolVersion: '2024-11-05',
        capabilities: {},
        servers: [],
        tools: [
          {
            name: 'events/search',
            tags: ['Events'],
            description: 'Search events',
            inputSchema: { type: 'object' },
          },
        ],
        resources: [],
        prompts: [],
      },
    } as OpenAPIDefinition;

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/docs',
      options: defaultOptions,
    });

    const eventsGroup = items.find((i) => i.type === 'group' && i.label === 'Events');
    const children = (eventsGroup?.items ?? []) as ApiItem[];
    const operationChild = children.filter(hasHttpVerb).find((i) => i.httpVerb === 'get');
    const mcpChild = children.filter(hasHttpVerb).find((i) => i.httpVerb === 'tool');

    expect(eventsGroup).toBeDefined();
    expect(operationChild).toBeDefined();
    expect(mcpChild).toMatchObject({ label: 'events/search', httpVerb: 'tool' });
  });

  it('appends default MCP groups when document has explicit top-level tags', async () => {
    const document: OpenAPIDefinition = {
      openapi: '3.1.0',
      info: { title: 'Test', version: '1' },
      tags: [{ name: 'Events' }],
      paths: {
        '/events': {
          get: {
            tags: ['Events'],
            operationId: 'listEvents',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      'x-mcp': {
        protocolVersion: '2024-11-05',
        capabilities: {},
        servers: [],
        tools: [
          { name: 'events/search', tags: ['Events'], inputSchema: { type: 'object' } },
          { name: 'echo', inputSchema: { type: 'object' } },
        ],
        resources: [{ name: 'readme', uri: 'docs://readme', mimeType: 'text/plain' }],
        prompts: [],
      },
    } as OpenAPIDefinition;

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/docs',
      options: defaultOptions,
    });

    const flat = collectAllItems(items);
    const groupLabels = items.filter((i) => i.type === 'group').map((i) => i.label);

    expect(groupLabels).toContain('Events');
    expect(groupLabels).toContain('Tools');
    expect(groupLabels).toContain('Resources');

    const echoItem = flat
      .filter(hasHttpVerb)
      .find((i) => i.httpVerb === 'tool' && i.label === 'echo');
    expect(echoItem).toBeDefined();

    const readmeItem = flat
      .filter(hasHttpVerb)
      .find((i) => i.httpVerb === 'rsrc' && i.label === 'readme');
    expect(readmeItem).toBeDefined();
  });

  it('generates markdoc content with the correct MCP tag', async () => {
    const document = makeDocument({
      protocolVersion: '2024-11-05',
      capabilities: {},
      servers: [],
      tools: [{ name: 'echo', inputSchema: { type: 'object' } }],
      resources: [],
      prompts: [],
    });

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/docs',
      options: defaultOptions,
    });

    const flat = collectAllItems(items);
    const toolItem = flat.filter(hasHttpVerb).find((i) => i.httpVerb === 'tool');

    expect(toolItem?.content?.contentType).toBe('item');
    expect(toolItem?.content?.children).toHaveLength(2);

    const headerContainer = toolItem?.content?.children[0];
    expect(headerContainer?.nodeType).toBe('container');

    const markdocNode = toolItem?.content?.children[1];
    expect(markdocNode?.nodeType).toBe('markdoc');
  });
});
