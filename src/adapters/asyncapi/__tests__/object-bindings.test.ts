import { describe, it, expect, vi, afterEach } from 'vitest';

import type { AsyncApiDefinition } from '../../../types/asyncapi.js';

import { objectBindings } from '../build/utils.js';

const DOCUMENT = {
  asyncapi: '3.0.0',
  info: { title: 'T', version: '1.0' },
  components: { channelBindings: { users: { kafka: { topic: 'users' } } } },
} as unknown as AsyncApiDefinition;

describe('objectBindings', () => {
  afterEach(() => vi.restoreAllMocks());

  it('keeps object bindings and skips the rest, reporting each skipped one', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const kept = objectBindings(
      { amqp: null, kafka: { groupId: 'g' }, mqtt: 'x' },
      'users',
      DOCUMENT,
    );

    expect(kept).toEqual([['kafka', { groupId: 'g' }]]);
    expect(error).toHaveBeenCalledTimes(2);
    expect(error.mock.calls[0].slice(0, 2)).toEqual([
      '[api-docs] %s:',
      'Could not build the "amqp" binding of "users" from the API description',
    ]);
  });

  it('returns nothing for bindings that are not an object', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(objectBindings(undefined, 'users', DOCUMENT)).toEqual([]);
    expect(objectBindings(42, 'users', DOCUMENT)).toEqual([]);
    expect(error).not.toHaveBeenCalled();
  });

  it('skips extensions without reporting them', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const kept = objectBindings(
      { 'x-note': 'internal', kafka: { groupId: 'g' } },
      'users',
      DOCUMENT,
    );

    expect(kept).toEqual([['kafka', { groupId: 'g' }]]);
    expect(error).not.toHaveBeenCalled();
  });

  it('reads a bindings object given as a $ref', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const kept = objectBindings({ $ref: '#/components/channelBindings/users' }, 'users', DOCUMENT);

    expect(kept).toEqual([['kafka', { topic: 'users' }]]);
    expect(error).not.toHaveBeenCalled();
  });
});
