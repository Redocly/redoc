import { describe, it, expect } from 'vitest';

import type { AsyncApiOperation } from '../../../../../types/asyncapi.js';
import type { ApiDocsOptions } from '../../../../../types/options.js';

import { buildOperationItem } from '../item.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

function makeOperation(overrides: Partial<AsyncApiOperation> = {}): AsyncApiOperation {
  return {
    action: 'send',
    channel: undefined,
    ...overrides,
  } as AsyncApiOperation;
}

describe('buildOperationItem — label/seo fallback', () => {
  it('falls back the label and seo.title to summary, not the raw operationId, when there is no title', () => {
    const item = buildOperationItem({
      operationId: 'doThing',
      operation: makeOperation({ summary: 'Do the thing' }),
      linkParts: ['docs', 'x'],
      document: {} as never,
      options: {} as ApiDocsOptions,
      processContent: false,
    });

    expect(item.label).toBe('Do the thing');
    expect(item.metadata?.seo?.title).toBe('Do the thing');
  });

  it('falls back seo.description to summary when there is no description', () => {
    const item = buildOperationItem({
      operationId: 'doThing',
      operation: makeOperation({ summary: 'Do the thing' }),
      linkParts: ['docs', 'x'],
      document: {} as never,
      options: {} as ApiDocsOptions,
      processContent: false,
    });

    expect(item.metadata?.seo?.description).toBe('Do the thing');
  });

  // The host pre-parses markdown descriptions into a Markdoc AST before items are built, and
  // `asString` yields nothing for an AST — such pages used to ship no meta description at all.
  it('reduces an already-parsed description AST to the first paragraph of plain text', () => {
    const item = buildOperationItem({
      operationId: 'doThing',
      operation: makeOperation({
        summary: 'Do the thing',
        description: markdocParser(
          'Sends a **ride request**.\n\nSecond paragraph is not part of the meta description.',
        ) as unknown as string,
      }),
      linkParts: ['docs', 'x'],
      document: {} as never,
      options: {} as ApiDocsOptions,
      processContent: false,
    });

    expect(item.metadata?.seo?.description).toBe('Sends a ride request.');
  });

  it('reduces a raw markdown description too, when the host parses lazily', () => {
    const item = buildOperationItem({
      operationId: 'doThing',
      operation: makeOperation({
        summary: 'Do the thing',
        description: 'Sends a **ride request**.\n\nSecond paragraph.',
      }),
      linkParts: ['docs', 'x'],
      document: {} as never,
      options: { markdownParser: markdocParser } as ApiDocsOptions,
      processContent: false,
    });

    expect(item.metadata?.seo?.description).toBe('Sends a ride request.');
  });

  it('prefers title over summary, and description over summary, when both are present', () => {
    const item = buildOperationItem({
      operationId: 'doThing',
      operation: makeOperation({
        title: 'Do The Thing',
        summary: 'Do the thing',
        description: 'A longer explanation of doing the thing.',
      }),
      linkParts: ['docs', 'x'],
      document: {} as never,
      options: {} as ApiDocsOptions,
      processContent: false,
    });

    expect(item.label).toBe('Do The Thing');
    expect(item.metadata?.seo).toEqual({
      title: 'Do The Thing',
      description: 'A longer explanation of doing the thing.',
    });
  });

  it('falls back to the raw operationId only when there is neither title nor summary', () => {
    const item = buildOperationItem({
      operationId: 'doThing',
      operation: makeOperation(),
      linkParts: ['docs', 'x'],
      document: {} as never,
      options: {} as ApiDocsOptions,
      processContent: false,
    });

    expect(item.label).toBe('doThing');
    expect(item.metadata?.seo).toEqual({ title: 'doThing' });
  });
});
