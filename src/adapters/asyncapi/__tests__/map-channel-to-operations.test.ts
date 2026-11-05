import { describe, it, expect } from 'vitest';

import type { AsyncApiDefinition } from '../../../types/asyncapi.js';

import { mapChannelToOperations } from '../build/utils.js';

describe('mapChannelToOperations', () => {
  it('skips a channel or an operation that is not an object and maps the rest', () => {
    const document = {
      asyncapi: '3.0.0',
      info: { title: 'T', version: '1.0' },
      channels: { empty: null, users: { address: 'users' } },
      operations: {
        missing: null,
        byAddress: { action: 'send', channel: { address: 'users' } },
        byRef: { action: 'receive', channel: { $ref: '#/channels/users' } },
      },
    } as unknown as AsyncApiDefinition;

    expect(mapChannelToOperations(document)).toEqual({
      empty: [],
      users: ['byAddress', 'byRef'],
    });
  });
});
