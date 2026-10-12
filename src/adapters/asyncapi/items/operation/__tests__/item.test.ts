import { describe, it, expect } from 'vitest';

import type { AsyncApiOperation } from '../../../../../types/asyncapi.js';
import type { ApiDocsOptions } from '../../../../../types/options.js';

import { buildOperationItem } from '../item.js';

function makeOperation(overrides: Partial<AsyncApiOperation> = {}): AsyncApiOperation {
  return {
    action: 'send',
    channel: undefined,
    ...overrides,
  } as AsyncApiOperation;
}

describe('buildOperationItem — label fallback', () => {
  it('falls back the label to summary, not the raw operationId, when there is no title', () => {
    const item = buildOperationItem({
      operationId: 'doThing',
      operation: makeOperation({ summary: 'Do the thing' }),
      linkParts: ['docs', 'x'],
      document: {} as never,
      options: {} as ApiDocsOptions,
      processContent: false,
    });

    expect(item.label).toBe('Do the thing');
  });

  it('prefers title over summary when both are present', () => {
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
  });
});
