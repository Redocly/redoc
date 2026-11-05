import { describe, expect, it } from 'vitest';

import type { ApiItem } from '../../../types/store.js';

import { buildApiDocsAgentTools, createSpecSliceOperationDetail } from '../index.js';
import { prepareApiDocs } from '../../../RedocStandalone.js';

const definition = {
  openapi: '3.1.0',
  info: { title: 'Museum API', version: '1.0.0' },
  'x-tagGroups': [{ name: 'Visits', tags: ['Tickets'] }],
  tags: [{ name: 'Tickets' }],
  security: [{ BasicAuth: [] }],
  paths: {
    '/tickets': {
      post: {
        tags: ['Tickets'],
        operationId: 'buyTicket',
        summary: 'Buy a ticket',
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TicketRequest' } },
          },
        },
        responses: { '200': { description: 'OK' } },
      },
    },
  },
  components: {
    schemas: {
      TicketRequest: { type: 'object', properties: { visitDate: { type: 'string' } } },
    },
    securitySchemes: {
      BasicAuth: {
        type: 'http',
        scheme: 'basic',
        'x-defaultUsername': 'demo-user',
        'x-defaultPassword': 'hunter2',
        'x-serverValues': {
          'https://api.museum.example': { 'x-defaultClientSecret': 'hunter2-secret' },
        },
      },
    },
  },
};

const sdl = `
type Query {
  """List the exhibitions"""
  exhibitions: [Exhibition]
}

type Exhibition {
  title: String
}
`;

function findItem(items: ApiItem[], label: string): ApiItem | undefined {
  for (const item of items) {
    if (item.label === label) return item;
    const found = item.items ? findItem(item.items as ApiItem[], label) : undefined;
    if (found) return found;
  }
  return undefined;
}

async function getOperation(
  spec: Record<string, unknown> | string,
  label: string,
  { matchItems = true }: { matchItems?: boolean } = {},
): Promise<string> {
  const hostDefinition = structuredClone(spec);
  const { items, store } = await prepareApiDocs({ spec, basePath: '/' });
  const tool = buildApiDocsAgentTools({
    items,
    store,
    getOperationDetail: createSpecSliceOperationDetail({
      items: matchItems ? items : [],
      specType: store.specType ?? 'openapi',
      definition: hostDefinition,
    }),
  }).find((t) => t.name === 'get_api_operation');
  if (!tool) throw new Error('no get_api_operation tool');

  const result = await tool.execute({ url: findItem(items, label)?.link }, {});
  return result.content[0].text;
}

describe('get_api_operation with spec-slice detail', () => {
  it('returns the YAML slice of an operation nested in the navigation tree', async () => {
    const text = await getOperation(definition, 'Buy a ticket');

    expect(text).toContain('/tickets:');
    expect(text).toContain('post:');
    expect(text).toContain('TicketRequest:');
    expect(text).toContain('visitDate');
  });

  it('falls back to the operation summary when no item matches the URL', async () => {
    const text = await getOperation(definition, 'Buy a ticket', { matchItems: false });

    expect(JSON.parse(text.slice(text.indexOf('{')))).toMatchObject({
      method: 'POST',
      path: '/tickets',
      title: 'Buy a ticket',
    });
  });

  it('never carries stored credentials of the security schemes', async () => {
    const text = await getOperation(definition, 'Buy a ticket');

    expect(text).toContain('BasicAuth:');
    expect(text).not.toContain('x-default');
    expect(text).not.toContain('serverValues');
    expect(text).not.toContain('hunter2');
  });

  it('returns a GraphQL slice for an SDL definition', async () => {
    const text = await getOperation(sdl, 'exhibitions');

    expect(text).toContain('exhibitions: [Exhibition]');
    expect(text).toContain('type Exhibition');
  });
});
