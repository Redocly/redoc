import { describe, it, expect } from 'vitest';

import type { ApiItem } from '../../../types/store.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { processOpenApiDocument } from '../index.js';
import { collectAllItems } from '../../__tests__/utils.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';

const options = {
  ...normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
  }),
  markdownParser: markdocParser,
};

async function buildItems(document: OpenAPIDefinition): Promise<ApiItem[]> {
  const { items } = await processOpenApiDocument({
    type: 'openapi',
    document,
    basePath: '/api',
    options,
  });
  return items;
}

function findGroup(items: ApiItem[], label: string): ApiItem | undefined {
  return items.find((i) => i.type === 'group' && i.label === label);
}

function groupLabels(items: ApiItem[]): string[] {
  return items.filter((i) => i.type === 'group').map((i) => i.label as string);
}

describe('default webhooks tag rendering', () => {
  it('renders the default webhooks tag at the end of the navigation when a tagless webhook exists', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }],
      paths: {
        '/tasks': {
          post: {
            tags: ['tasks'],
            operationId: 'createTask',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      webhooks: {
        notification: {
          post: { operationId: 'notify', responses: { '200': { description: 'ok' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(groupLabels(items)).toEqual(['tasks', 'webhooks']);
    const webhooksGroup = findGroup(items, 'webhooks');
    const webhooksLinks = collectAllItems(webhooksGroup?.items as ApiItem[]).filter(
      (i) => i.type === 'link',
    );
    expect(webhooksLinks.map((i) => i.label)).toContain('notify');
  });

  it('does not render the default webhooks tag when every webhook has explicit tags', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }],
      webhooks: {
        notification: {
          post: {
            tags: ['tasks'],
            operationId: 'notify',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(findGroup(items, 'webhooks')).toBeUndefined();
    expect(groupLabels(items)).toEqual(['tasks']);

    const tasksGroup = findGroup(items, 'tasks');
    const tasksLinks = collectAllItems(tasksGroup?.items as ApiItem[]).filter(
      (i) => i.type === 'link',
    );
    expect(tasksLinks.map((i) => i.label)).toContain('notify');
  });

  it('does not render the default webhooks tag when the document has no webhooks at all', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }],
      paths: {
        '/tasks': {
          post: {
            tags: ['tasks'],
            operationId: 'createTask',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(findGroup(items, 'webhooks')).toBeUndefined();
  });

  it('puts only tagless webhooks under the default webhooks tag when other webhooks have explicit tags', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }],
      webhooks: {
        tagged: {
          post: {
            tags: ['tasks'],
            operationId: 'tagged',
            responses: { '200': { description: 'ok' } },
          },
        },
        untagged: {
          post: { operationId: 'untagged', responses: { '200': { description: 'ok' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(groupLabels(items)).toEqual(['tasks', 'webhooks']);

    const tasksGroup = findGroup(items, 'tasks');
    const tasksLinks = collectAllItems(tasksGroup?.items as ApiItem[])
      .filter((i) => i.type === 'link')
      .map((i) => i.label);
    expect(tasksLinks).toContain('tagged');
    expect(tasksLinks).not.toContain('untagged');

    const webhooksGroup = findGroup(items, 'webhooks');
    const webhooksLinks = collectAllItems(webhooksGroup?.items as ApiItem[])
      .filter((i) => i.type === 'link')
      .map((i) => i.label);
    expect(webhooksLinks).toContain('untagged');
    expect(webhooksLinks).not.toContain('tagged');
  });

  it('applies the same fallback for x-webhooks: tagless x-webhook lands in the default webhooks tag', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }],
      'x-webhooks': {
        notification: {
          post: { operationId: 'notify', responses: { '200': { description: 'ok' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(groupLabels(items)).toEqual(['tasks', 'webhooks']);
    const webhooksGroup = findGroup(items, 'webhooks');
    const webhooksLinks = collectAllItems(webhooksGroup?.items as ApiItem[]).filter(
      (i) => i.type === 'link',
    );
    expect(webhooksLinks.map((i) => i.label)).toContain('notify');
  });

  it('does not render the default webhooks tag when every x-webhook has explicit tags', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }],
      'x-webhooks': {
        notification: {
          post: {
            tags: ['tasks'],
            operationId: 'notify',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(findGroup(items, 'webhooks')).toBeUndefined();
  });

  it('reuses a user-declared top-level webhooks tag instead of creating a duplicate', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }, { name: 'webhooks', description: 'Custom webhook description' }],
      webhooks: {
        notification: {
          post: { operationId: 'notify', responses: { '200': { description: 'ok' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(groupLabels(items)).toEqual(['tasks', 'webhooks']);
    expect(groupLabels(items).filter((l) => l === 'webhooks')).toHaveLength(1);
  });

  it('drops a user-declared top-level webhooks tag when nothing lands in it (matches openapi-docs)', async () => {
    const document = {
      openapi: '3.1.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'tasks' }, { name: 'webhooks' }],
      paths: {
        '/tasks': {
          post: {
            tags: ['tasks'],
            operationId: 'createTask',
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    } as unknown as OpenAPIDefinition;

    const items = await buildItems(document);

    expect(findGroup(items, 'webhooks')).toBeUndefined();
    expect(groupLabels(items)).toEqual(['tasks']);
  });
});
