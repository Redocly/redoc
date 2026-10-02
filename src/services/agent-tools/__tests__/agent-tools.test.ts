import { describe, expect, it, vi } from 'vitest';

import type { ApiItem, ApiStore } from '../../../types/store.js';
import type { ApiDocsAgentToolsParams } from '../index.js';

import { MAX_AGENT_RESULT_CHARS, agentTextResult, buildApiDocsAgentTools } from '../index.js';
import {
  collectOperations,
  filterOperations,
  findOperation,
  pathFromPointer,
} from '../operations.js';
import { summarizeSecurity } from '../security.js';

const items = [
  {
    label: 'Operations',
    items: [
      {
        label: 'Get museum hours',
        link: '/museum/get-hours',
        httpVerb: 'get',
        content: { meta: { pointer: '/paths/~1museum-hours/get' } },
      },
      {
        label: 'Buy tickets',
        link: '/museum/buy-tickets',
        httpVerb: 'post',
        content: { meta: { pointer: '/paths/~1tickets/post', deprecated: true } },
      },
    ],
  },
  { label: 'Overview', link: '/museum' },
] as unknown as ApiItem[];

const store = {
  specType: 'openapi',
  servers: [{ url: 'https://api.museum.example/v1', description: 'Production' }],
  securitySchemeStore: {
    MuseumAuth: {
      type: 'http',
      scheme: 'basic',
      'x-defaultUsername': 'demo-user',
      'x-defaultPassword': 'hunter2',
      serverValues: { production: { 'x-defaultClientSecret': 'shh' } },
    },
  },
} as unknown as ApiStore;

function tools(overrides: Partial<ApiDocsAgentToolsParams> = {}) {
  const built = buildApiDocsAgentTools({ items, store, ...overrides });
  return (name: string) => {
    const found = built.find((tool) => tool.name === name);
    if (!found) throw new Error(`no ${name} tool`);
    return found;
  };
}

function jsonOf(text: string | undefined): unknown {
  return JSON.parse(text ?? '');
}

describe('collectOperations', () => {
  it('flattens the navigation tree and reads the path from the pointer', () => {
    expect(collectOperations(items)[0]).toEqual({
      method: 'GET',
      title: 'Get museum hours',
      url: '/museum/get-hours',
      path: '/museum-hours',
      section: 'Operations',
    });
  });

  it('marks deprecated operations and skips pages that document none', () => {
    const operations = collectOperations(items);

    expect(operations).toHaveLength(2);
    expect(operations[1]?.deprecated).toBe(true);
  });

  it('rewrites links into the host URL space', () => {
    expect(collectOperations(items, (link) => `/docs${link}`)[0]?.url).toBe(
      '/docs/museum/get-hours',
    );
  });

  it('collects GraphQL operations, which carry a variant instead of an httpVerb', () => {
    const graphqlItems = [
      {
        label: 'Queries',
        items: [
          { label: 'books', link: '/graphql/books', content: { itemVariant: 'query' } },
          { label: 'addBook', link: '/graphql/add-book', content: { itemVariant: 'mutation' } },
          { label: 'Book', link: '/graphql/book', content: { itemVariant: 'object' } },
        ],
      },
    ] as unknown as ApiItem[];

    expect(collectOperations(graphqlItems)).toEqual([
      { method: 'QUERY', title: 'books', url: '/graphql/books', section: 'Queries' },
      { method: 'MUTATION', title: 'addBook', url: '/graphql/add-book', section: 'Queries' },
    ]);
  });
});

describe('pathFromPointer', () => {
  it.each([
    ['/paths/~1museum-hours/get', '/museum-hours'],
    ['/webhooks/~1events/post', '/events'],
    ['/paths/~1orders~1{id}/get', '/orders/{id}'],
    ['/paths/~1a~0b/get', '/a~b'],
  ])('decodes %s', (pointer, expected) => {
    expect(pathFromPointer(pointer)).toBe(expected);
  });

  it('returns nothing for a pointer that names no path', () => {
    expect(pathFromPointer('/components/schemas/Book')).toBeUndefined();
  });

  it('leaves AsyncAPI channels without a path, because the pointer holds an id not an address', () => {
    expect(pathFromPointer('/channels/ride-requests')).toBeUndefined();
  });
});

describe('findOperation and filterOperations', () => {
  const operations = collectOperations(items);

  it('matches on method and path', () => {
    expect(findOperation(operations, { method: 'get', path: '/museum-hours' })?.title).toBe(
      'Get museum hours',
    );
  });

  it('matches a GraphQL operation by its field name', () => {
    const graphqlOperations = collectOperations([
      { label: 'books', link: '/graphql/books', content: { itemVariant: 'query' } },
    ] as unknown as ApiItem[]);

    expect(findOperation(graphqlOperations, { method: 'query', path: 'books' })?.title).toBe(
      'books',
    );
  });

  it('matches on a documentation URL, including a suffix', () => {
    expect(findOperation(operations, { url: '/museum/buy-tickets' })?.method).toBe('POST');
    expect(findOperation(operations, { url: 'buy-tickets' })?.method).toBe('POST');
  });

  it('returns nothing when given no criteria', () => {
    expect(findOperation(operations, {})).toBeUndefined();
  });

  it('filters across method, path, title and section', () => {
    expect(filterOperations(operations, 'tickets')).toHaveLength(1);
    expect(filterOperations(operations, 'operations')).toHaveLength(2);
    expect(filterOperations(operations, '')).toHaveLength(2);
  });
});

describe('summarizeSecurity', () => {
  it('returns servers and scheme types', () => {
    expect(summarizeSecurity(store)).toEqual({
      servers: [{ url: 'https://api.museum.example/v1', description: 'Production' }],
      securitySchemes: [{ id: 'MuseumAuth', type: 'http', scheme: 'basic' }],
    });
  });

  it('never returns a stored credential', () => {
    const text = JSON.stringify(summarizeSecurity(store));

    expect(text).not.toContain('hunter2');
    expect(text).not.toContain('shh');
    expect(text).not.toContain('x-default');
    expect(text).not.toContain('serverValues');
  });
});

describe('buildApiDocsAgentTools', () => {
  it('builds the three API reference tools', () => {
    expect(buildApiDocsAgentTools({ items, store }).map((tool) => tool.name)).toEqual([
      'list_api_operations',
      'get_api_operation',
      'get_api_authentication',
    ]);
  });

  it('marks every tool read-only', () => {
    expect(
      buildApiDocsAgentTools({ items, store }).every((tool) => tool.annotations?.readOnlyHint),
    ).toBe(true);
  });

  it('lists operations with the spec type and a limit', async () => {
    const result = await tools()('list_api_operations').execute({ limit: 1 });

    expect(jsonOf(result.content[0]?.text)).toMatchObject({
      specType: 'openapi',
      operationCount: 2,
    });
    expect((jsonOf(result.content[0]?.text) as { operations: unknown[] }).operations).toHaveLength(
      1,
    );
  });

  it('asks the host for operation detail and prefixes it with a header', async () => {
    const getOperationDetail = vi.fn(async () => '## Parameters\n\nNone.');

    const result = await tools({ getOperationDetail })('get_api_operation').execute({
      method: 'get',
      path: '/museum-hours',
    });

    expect(getOperationDetail).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', path: '/museum-hours' }),
      undefined,
    );
    expect(result.content[0]?.text).toContain('# GET /museum-hours');
    expect(result.content[0]?.text).toContain('## Parameters');
  });

  it('answers with the summary when the host supplies no detail', async () => {
    const result = await tools()('get_api_operation').execute({
      method: 'get',
      path: '/museum-hours',
    });

    expect(result.isError).toBeUndefined();
    expect(result.content[0]?.text).toContain('Get museum hours');
  });

  it('points the agent at the listing when the operation is unknown', async () => {
    const result = await tools()('get_api_operation').execute({ method: 'put', path: '/nope' });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('list_api_operations');
  });

  it('requires an identifier', async () => {
    expect((await tools()('get_api_operation').execute({})).isError).toBe(true);
  });

  it('returns authentication without credentials', async () => {
    const result = await tools()('get_api_authentication').execute({});

    expect(jsonOf(result.content[0]?.text)).toHaveProperty('securitySchemes');
    expect(result.content[0]?.text).not.toContain('x-default');
  });
});

describe('agentTextResult', () => {
  it('truncates text that would overrun the agent context', () => {
    const result = agentTextResult('x'.repeat(MAX_AGENT_RESULT_CHARS + 500));

    expect(result.content[0]?.text).toContain('[truncated');
  });
});
