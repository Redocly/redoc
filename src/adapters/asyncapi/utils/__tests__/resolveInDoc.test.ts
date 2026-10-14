import { describe, it, expect } from 'vitest';

import type { AsyncApiDefinition } from '../../../../types/asyncapi.js';

import { resolveInDoc } from '../resolveInDoc.js';

function doc(components: Record<string, unknown>): AsyncApiDefinition {
  return {
    asyncapi: '3.0.0',
    info: { title: 'T', version: '1.0' },
    components,
  } as unknown as AsyncApiDefinition;
}

describe('resolveInDoc', () => {
  it('returns a non-ref value as is', () => {
    const value = { title: 'Inline' };
    expect(resolveInDoc(doc({}), value)).toBe(value);
  });

  it('follows a $ref chain to the first non-ref value', () => {
    const document = {
      ...doc({ messages: { OrderAccepted: { title: 'Order accepted' } } }),
      channels: {
        orderReplies: {
          messages: { orderAccepted: { $ref: '#/components/messages/OrderAccepted' } },
        },
      },
    } as unknown as AsyncApiDefinition;

    expect(
      resolveInDoc(document, { $ref: '#/channels/orderReplies/messages/orderAccepted' }),
    ).toEqual({ title: 'Order accepted' });
  });

  it('returns undefined for a $ref cycle', () => {
    const document = doc({
      messages: {
        a: { $ref: '#/components/messages/b' },
        b: { $ref: '#/components/messages/a' },
      },
    });

    expect(resolveInDoc(document, { $ref: '#/components/messages/a' })).toBeUndefined();
  });

  it('returns undefined for a dangling $ref', () => {
    const document = doc({ messages: { a: { $ref: '#/components/messages/missing' } } });

    expect(resolveInDoc(document, { $ref: '#/components/messages/a' })).toBeUndefined();
  });
});
