import { describe, it, expect } from 'vitest';

import type { Node } from '@markdoc/markdoc';
import type { ApiItem } from '../../../types/store.js';
import type { ContentNode, ItemContentNode } from '../../../types/content.js';
import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { processOpenApiDocument } from '../index.js';
import { createCallbackIdFactory } from '../items/operation/content.js';
import { collectAllItems } from '../../__tests__/utils.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';
import { nodeTypes } from '../../../types/common.js';

const options = {
  ...normalizeOptions({
    specType: 'openapi',
    downloadUrls: [],
    metadata: {},
  }),
  markdownParser: markdocParser,
};

function documentWithCallbackDescription(description: string): OpenAPIDefinition {
  return {
    openapi: '3.1.0',
    info: { title: 'T', version: '1' },
    paths: {
      '/jobs': {
        post: {
          operationId: 'createJob',
          responses: { '202': { description: 'accepted' } },
          callbacks: {
            jobCompleted: {
              '{$request.body#/callbackUrl}': {
                post: {
                  summary: 'Job completed callback',
                  description,
                  responses: { '200': { description: 'ok' } },
                },
              },
            },
          },
        },
      },
    },
  } as unknown as OpenAPIDefinition;
}

function documentWithTwoUrlExpressions(): OpenAPIDefinition {
  return {
    openapi: '3.1.0',
    info: { title: 'T', version: '1' },
    paths: {
      '/jobs': {
        post: {
          operationId: 'createJob',
          responses: { '202': { description: 'accepted' } },
          callbacks: {
            jobCompleted: {
              '{$request.body#/primaryUrl}': {
                post: { summary: 'Primary', responses: { '200': { description: 'ok' } } },
              },
              '{$request.body#/backupUrl}': {
                post: { summary: 'Backup', responses: { '200': { description: 'ok' } } },
              },
            },
          },
        },
      },
    },
  } as unknown as OpenAPIDefinition;
}

function collectContentNodes(nodes: ContentNode[] = []): ContentNode[] {
  return nodes.flatMap((node) => [
    node,
    ...collectContentNodes((node as { children?: ContentNode[] }).children),
  ]);
}

async function findCallbackNodes(document: OpenAPIDefinition): Promise<ItemContentNode[]> {
  const { items } = await processOpenApiDocument({
    type: 'openapi',
    document,
    basePath: '/api',
    options,
  });

  return collectAllItems(items as ApiItem[])
    .flatMap((item) => collectContentNodes(item.content?.children as ContentNode[]))
    .filter(
      (node): node is ItemContentNode =>
        node.nodeType === nodeTypes.ITEM && (node as ItemContentNode).variant === 'callback',
    );
}

async function findCallbackNode(document: OpenAPIDefinition): Promise<ItemContentNode> {
  const nodes = await findCallbackNodes(document);
  expect(nodes).toHaveLength(1);
  return nodes[0];
}

/** The single callback's parsed description, narrowed once so the tests can walk it. */
async function findCallbackDescription(document: OpenAPIDefinition): Promise<Node | Node[]> {
  const { callback } = await findCallbackNode(document);
  expect(callback?.description).toBeDefined();
  return callback?.description as Node | Node[];
}

describe('callback description headings', () => {
  it('assigns ids scoped to the callback panel, including headings wrapped in inline markup', async () => {
    const description = await findCallbackDescription(
      documentWithCallbackDescription('Text\n\n#### **Appended query parameters**\n'),
    );

    const [heading, ...rest] = findHeadings(description);
    expect(rest).toHaveLength(0);
    expect(heading.attributes.id).toBe(
      'other/createjob/callbacks/jobcompleted/post/appended-query-parameters',
    );
    expect(heading.attributes.deepLinkHash).toBe(
      '/other/createjob#other/createjob/callbacks/jobcompleted/post/appended-query-parameters',
    );
  });

  it('slugs from the whole inline subtree, not just the first text node', async () => {
    const description = await findCallbackDescription(
      documentWithCallbackDescription('##### Mixed `code` and **bold**\n'),
    );

    const [heading] = findHeadings(description);
    expect(heading.attributes.id).toBe(
      'other/createjob/callbacks/jobcompleted/post/mixed-code-and-bold',
    );
  });

  it('leaves a heading it cannot slug unassigned rather than colliding with the panel anchor', async () => {
    const description = await findCallbackDescription(
      documentWithCallbackDescription('###### ![logo](https://example.com/logo.png)\n'),
    );

    const [heading] = findHeadings(description);
    expect(heading.attributes.id).toBeUndefined();
    expect(heading.attributes.deepLinkHash).toBeUndefined();
  });

  it('leaves a heading-free callback description untouched', async () => {
    const description = await findCallbackDescription(
      documentWithCallbackDescription('Plain **description**.'),
    );

    expect(findHeadings(description)).toHaveLength(0);
  });
});

describe('createCallbackIdFactory', () => {
  it('keeps the bare `<name>/<verb>` for each distinct pair', () => {
    const nextId = createCallbackIdFactory();

    expect(nextId('jobCompleted', 'post')).toBe('jobCompleted/post');
    expect(nextId('jobCompleted', 'put')).toBe('jobCompleted/put');
    expect(nextId('jobFailed', 'post')).toBe('jobFailed/post');
  });

  it('indexes repeats of the same pair, counting per pair', () => {
    const nextId = createCallbackIdFactory();

    expect(nextId('jobCompleted', 'post')).toBe('jobCompleted/post');
    expect(nextId('jobFailed', 'post')).toBe('jobFailed/post');
    expect(nextId('jobCompleted', 'post')).toBe('jobCompleted/post~1');
    expect(nextId('jobCompleted', 'post')).toBe('jobCompleted/post~2');
    expect(nextId('jobFailed', 'post')).toBe('jobFailed/post~1');
  });
});

describe('callback ids', () => {
  it('uses the legacy `<name>/<verb>` shape so links shared from openapi-docs resolve', async () => {
    const node = await findCallbackNode(documentWithCallbackDescription('Text'));

    expect(node.callback?.callbackId).toBe('jobCompleted/post');
  });

  it('disambiguates a name+verb repeated across url expressions, which legacy collided on', async () => {
    const nodes = await findCallbackNodes(documentWithTwoUrlExpressions());

    expect(nodes.map((n) => n.callback?.callbackId)).toEqual([
      'jobCompleted/post',
      'jobCompleted/post~1',
    ]);
  });
});

function findHeadings(ast: Node | Node[]): Node[] {
  const roots = Array.isArray(ast) ? ast : [ast];
  return roots.flatMap((node) => [
    ...(node.type === 'heading' ? [node] : []),
    ...findHeadings(node.children ?? []),
  ]);
}
