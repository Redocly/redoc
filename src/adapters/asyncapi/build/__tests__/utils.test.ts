import { describe, expect, it } from 'vitest';

import type { AsyncApiDefinition } from '../../../../types/asyncapi.js';

import { findFirstBinding, mapChannelToOperations } from '../utils.js';

describe('findFirstBinding', () => {
  it('returns null for non-object values', () => {
    expect(findFirstBinding(null)).toBeNull();
    expect(findFirstBinding('kafka')).toBeNull();
  });

  it('returns first binding key from nested objects', () => {
    const input = {
      channels: {
        orders: {
          bindings: {
            kafka: { clientId: 'orders-service' },
          },
        },
      },
    };

    expect(findFirstBinding(input)).toBe('kafka');
  });

  it('handles circular references safely', () => {
    const input: Record<string, unknown> = { root: {} };
    (input.root as Record<string, unknown>).self = input;
    input.channel = {
      bindings: {
        amqp: { is: 'queue' },
      },
    };

    expect(findFirstBinding(input)).toBe('amqp');
  });
});

function createAsyncApiDoc(partial: { channels?: unknown; operations?: unknown }): AsyncApiDefinition {
  return {
    asyncapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    channels: partial.channels,
    operations: partial.operations,
  } as AsyncApiDefinition;
}

describe('mapChannelToOperations', () => {
  it('maps operations to channels by $ref and by address', () => {
    const result = mapChannelToOperations(
      createAsyncApiDoc({
        channels: {
          orders: { address: 'orders.created' },
          payments: { address: 'payments.created' },
        },
        operations: {
          publishOrder: { channel: { $ref: '#/channels/orders' } },
          publishPayment: { channel: { address: 'payments.created' } },
        },
      }),
    );

    expect(result).toEqual({
      orders: ['publishOrder'],
      payments: ['publishPayment'],
    });
  });

  it('keeps all channels with empty operation arrays when no matches exist', () => {
    const result = mapChannelToOperations(
      createAsyncApiDoc({
        channels: {
          orders: { address: 'orders.created' },
          invoices: { address: 'invoices.created' },
        },
        operations: {
          unknownRef: { channel: { $ref: '#/channels/missing' } },
          unknownAddress: { channel: { address: 'missing.address' } },
          noChannel: {},
        },
      }),
    );

    expect(result).toEqual({
      orders: [],
      invoices: [],
    });
  });
});
