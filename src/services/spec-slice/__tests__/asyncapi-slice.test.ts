import { describe, expect, it } from 'vitest';

import { extractAsyncApiSlice, scopeFromAsyncApiPointer } from '../asyncapi-slice.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const entry of Object.values(value)) deepFreeze(entry);
  }
  return value;
}

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  return value as T;
}

function makeChannelsFixture(): Record<string, unknown> {
  return deepFreeze({
    asyncapi: '3.0.0',
    id: 'urn:example:lights',
    info: { title: 'Lights', version: '1.0.0' },
    defaultContentType: 'application/json',
    channels: {
      alpha: { address: 'alpha.topic' },
      beta: { address: 'beta.topic' },
      quiet: { address: 'quiet.topic' },
    },
    operations: {
      sendAlpha: { action: 'send', channel: { $ref: '#/channels/alpha' } },
      receiveAlpha: { action: 'receive', channel: { $ref: '#/channels/alpha' } },
      sendBeta: { action: 'send', channel: { $ref: '#/channels/beta' } },
      detached: { action: 'send' },
    },
  });
}

function makeReplyChainFixture(): Record<string, unknown> {
  return deepFreeze({
    asyncapi: '3.0.0',
    info: { title: 'Chain', version: '1.0.0' },
    channels: {
      first: { address: 'first' },
      second: { address: 'second' },
      third: { address: 'third' },
    },
    operations: {
      askFirst: {
        action: 'send',
        channel: { $ref: '#/channels/first' },
        reply: { channel: { $ref: '#/channels/second' } },
      },
      askSecond: {
        action: 'send',
        channel: { $ref: '#/channels/second' },
        reply: { channel: { $ref: '#/channels/third' } },
      },
    },
  });
}

function makeTagFixture(): Record<string, unknown> {
  return deepFreeze({
    asyncapi: '3.0.0',
    info: { title: 'Tags', version: '1.0.0' },
    channels: {
      taggedChannel: { address: 'tagged', tags: [{ name: 'featured' }] },
      plainChannel: { address: 'plain' },
    },
    operations: {
      sendTagged: { action: 'send', channel: { $ref: '#/channels/taggedChannel' } },
      sendPlain: {
        action: 'send',
        channel: { $ref: '#/channels/plainChannel' },
        tags: [{ name: 'featured' }, { name: 'ops-only' }],
      },
    },
  });
}

describe('scopeFromAsyncApiPointer', () => {
  it('returns undefined for one-token, empty, and other-rooted pointers', () => {
    expect(scopeFromAsyncApiPointer('channels')).toBeUndefined();
    expect(scopeFromAsyncApiPointer('operations')).toBeUndefined();
    expect(scopeFromAsyncApiPointer('')).toBeUndefined();
    expect(scopeFromAsyncApiPointer('components/messages/Light')).toBeUndefined();
    expect(scopeFromAsyncApiPointer('servers/production')).toBeUndefined();
    expect(scopeFromAsyncApiPointer('paths/~1x/get')).toBeUndefined();
  });

  it('decodes escaped tokens and ignores segments past the second token', () => {
    expect(scopeFromAsyncApiPointer('channels/user~1signup')).toEqual({
      kind: 'channel',
      channelId: 'user/signup',
    });
    expect(scopeFromAsyncApiPointer('operations/send~0all')).toEqual({
      kind: 'async-operation',
      operationId: 'send~all',
    });
    expect(scopeFromAsyncApiPointer('channels/alpha/messages/measured')).toEqual({
      kind: 'channel',
      channelId: 'alpha',
    });
  });
});

describe('extractAsyncApiSlice — version gate', () => {
  it('accepts 3.1 documents', () => {
    const document = deepFreeze({
      asyncapi: '3.1.0',
      info: { title: 'V31', version: '1.0.0' },
      channels: { alpha: { address: 'a' } },
    });
    const slice = extractAsyncApiSlice(document, { kind: 'channel', channelId: 'alpha' });
    expect(expectDefined(slice).document.asyncapi).toBe('3.1.0');
  });

  it('rejects 2.x, missing, and non-string asyncapi fields', () => {
    const v2 = deepFreeze({ asyncapi: '2.6.0', channels: { alpha: { address: 'a' } } });
    expect(extractAsyncApiSlice(v2, { kind: 'channel', channelId: 'alpha' })).toBeUndefined();
    expect(extractAsyncApiSlice(v2, { kind: 'tag', tagName: 'any' })).toBeUndefined();
    expect(extractAsyncApiSlice(v2, { kind: 'document' })).toBeUndefined();
    expect(
      extractAsyncApiSlice(deepFreeze({ channels: {} }), { kind: 'document' }),
    ).toBeUndefined();
    expect(extractAsyncApiSlice(deepFreeze({ asyncapi: 3 }), { kind: 'document' })).toBeUndefined();
  });

  it('rejects unknown channel ids', () => {
    expect(
      extractAsyncApiSlice(makeChannelsFixture(), { kind: 'channel', channelId: 'nope' }),
    ).toBeUndefined();
  });
});

describe('extractAsyncApiSlice — channel scope', () => {
  it('keeps only operations whose channel ref targets the sliced channel', () => {
    const slice = extractAsyncApiSlice(makeChannelsFixture(), {
      kind: 'channel',
      channelId: 'alpha',
    });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.channels as object)).toEqual(['alpha']);
    expect(Object.keys(doc.operations as object).sort()).toEqual(['receiveAlpha', 'sendAlpha']);
    const channels = doc.channels as Record<string, Record<string, unknown>>;
    expect(channels.alpha.address).toBe('alpha.topic');
  });

  it('omits the operations map entirely when no operation targets the channel', () => {
    const slice = extractAsyncApiSlice(makeChannelsFixture(), {
      kind: 'channel',
      channelId: 'quiet',
    });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.channels as object)).toEqual(['quiet']);
    expect('operations' in doc).toBe(false);
  });

  it('copies id and defaultContentType when present and skips absent root fields', () => {
    const withExtras = expectDefined(
      extractAsyncApiSlice(makeChannelsFixture(), { kind: 'channel', channelId: 'alpha' }),
    ).document;
    expect(withExtras.id).toBe('urn:example:lights');
    expect(withExtras.defaultContentType).toBe('application/json');

    const bare = expectDefined(
      extractAsyncApiSlice(makeReplyChainFixture(), { kind: 'channel', channelId: 'third' }),
    ).document;
    expect('id' in bare).toBe(false);
    expect('defaultContentType' in bare).toBe(false);
    expect('servers' in bare).toBe(false);
  });
});

describe('extractAsyncApiSlice — async-operation scope', () => {
  it('keeps the operation and its channel but not sibling operations of that channel', () => {
    const slice = extractAsyncApiSlice(makeChannelsFixture(), {
      kind: 'async-operation',
      operationId: 'sendAlpha',
    });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.operations as object)).toEqual(['sendAlpha']);
    expect(Object.keys(doc.channels as object)).toEqual(['alpha']);
  });

  it('keeps an operation whose channel ref points at a missing channel', () => {
    const orphaned = deepFreeze({
      asyncapi: '3.0.0',
      info: { title: 'Orphan', version: '1.0.0' },
      operations: { orphan: { action: 'send', channel: { $ref: '#/channels/ghost' } } },
    });
    const slice = extractAsyncApiSlice(orphaned, {
      kind: 'async-operation',
      operationId: 'orphan',
    });
    const doc = expectDefined(slice).document;

    expect(doc.channels).toEqual({});
    const operations = doc.operations as Record<string, Record<string, unknown>>;
    expect(operations.orphan.channel).toEqual({ $ref: '#/channels/ghost' });
  });

  it('returns undefined for an unknown operation id', () => {
    expect(
      extractAsyncApiSlice(makeChannelsFixture(), {
        kind: 'async-operation',
        operationId: 'nope',
      }),
    ).toBeUndefined();
  });
});

describe('extractAsyncApiSlice — reply channel expansion', () => {
  it('adds reply channels without their operations and does not chain further', () => {
    const slice = extractAsyncApiSlice(makeReplyChainFixture(), {
      kind: 'channel',
      channelId: 'first',
    });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.channels as object).sort()).toEqual(['first', 'second']);
    expect(Object.keys(doc.operations as object)).toEqual(['askFirst']);
  });

  it('expands the reply channel of an async-operation scope', () => {
    const slice = extractAsyncApiSlice(makeReplyChainFixture(), {
      kind: 'async-operation',
      operationId: 'askSecond',
    });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.channels as object).sort()).toEqual(['second', 'third']);
    expect(Object.keys(doc.operations as object)).toEqual(['askSecond']);
  });

  it('expands a reply given as a $ref to components.replies', () => {
    const referenced = deepFreeze({
      asyncapi: '3.0.0',
      info: { title: 'Refs', version: '1.0.0' },
      channels: {
        ask: { address: 'ask' },
        answers: { address: 'answers' },
      },
      operations: {
        ask: {
          action: 'send',
          channel: { $ref: '#/channels/ask' },
          reply: { $ref: '#/components/replies/ok' },
        },
      },
      components: {
        replies: { ok: { channel: { $ref: '#/channels/answers' } } },
      },
    });
    const slice = extractAsyncApiSlice(referenced, { kind: 'channel', channelId: 'ask' });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.channels as object).sort()).toEqual(['answers', 'ask']);
    const components = doc.components as Record<string, Record<string, unknown>>;
    expect(components.replies.ok).toEqual({ channel: { $ref: '#/channels/answers' } });
  });

  it('ignores reply refs to channels missing from the document', () => {
    const ghostReply = deepFreeze({
      asyncapi: '3.0.0',
      info: { title: 'Ghost', version: '1.0.0' },
      channels: { only: { address: 'only' } },
      operations: {
        ping: {
          action: 'send',
          channel: { $ref: '#/channels/only' },
          reply: { channel: { $ref: '#/channels/ghost' } },
        },
      },
    });
    const slice = extractAsyncApiSlice(ghostReply, { kind: 'channel', channelId: 'only' });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.channels as object)).toEqual(['only']);
    const operations = doc.operations as Record<string, Record<string, unknown>>;
    expect(operations.ping.reply).toEqual({ channel: { $ref: '#/channels/ghost' } });
  });
});

describe('extractAsyncApiSlice — tag scope', () => {
  it('selects channels carrying the tag while operation tags do not select', () => {
    const slice = extractAsyncApiSlice(makeTagFixture(), { kind: 'tag', tagName: 'featured' });
    const doc = expectDefined(slice).document;

    expect(Object.keys(doc.channels as object)).toEqual(['taggedChannel']);
    expect(Object.keys(doc.operations as object)).toEqual(['sendTagged']);
  });

  it('returns undefined when no channel carries the tag', () => {
    expect(
      extractAsyncApiSlice(makeTagFixture(), { kind: 'tag', tagName: 'ops-only' }),
    ).toBeUndefined();
    expect(
      extractAsyncApiSlice(makeTagFixture(), { kind: 'tag', tagName: 'absent' }),
    ).toBeUndefined();
  });
});

describe('extractAsyncApiSlice — server refs', () => {
  it('retains #/servers refs verbatim when the document declares servers', () => {
    const withServers = deepFreeze({
      asyncapi: '3.0.0',
      info: { title: 'Servers', version: '1.0.0' },
      servers: { prod: { host: 'mq.example.com', protocol: 'mqtt' } },
      channels: { alpha: { address: 'a', servers: [{ $ref: '#/servers/prod' }] } },
    });
    const slice = extractAsyncApiSlice(withServers, { kind: 'channel', channelId: 'alpha' });
    const doc = expectDefined(slice).document;

    expect(doc.servers).toEqual({ prod: { host: 'mq.example.com', protocol: 'mqtt' } });
    const channels = doc.channels as Record<string, Record<string, unknown>>;
    expect(channels.alpha.servers).toEqual([{ $ref: '#/servers/prod' }]);
  });

  it('keeps server refs unresolved and omits the servers root when the document has none', () => {
    const noServers = deepFreeze({
      asyncapi: '3.0.0',
      info: { title: 'NoServers', version: '1.0.0' },
      channels: { alpha: { address: 'a', servers: [{ $ref: '#/servers/prod' }] } },
    });
    const slice = extractAsyncApiSlice(noServers, { kind: 'channel', channelId: 'alpha' });
    const doc = expectDefined(slice).document;

    expect('servers' in doc).toBe(false);
    const channels = doc.channels as Record<string, Record<string, unknown>>;
    expect(channels.alpha.servers).toEqual([{ $ref: '#/servers/prod' }]);
  });
});

describe('extractAsyncApiSlice — document scope', () => {
  it('clones the whole document and strips platform and circular-ref markers', () => {
    const source = deepFreeze({
      asyncapi: '3.0.0',
      info: { title: 'Doc', version: '1.0.0' },
      channels: {
        alpha: {
          address: 'a',
          messages: { m: { payload: { type: 'string', 'x-circular-ref': '#/x' } } },
        },
        beta: { address: 'b', 'x-original-ref': '#/channels/alpha' },
      },
      operations: { op: { action: 'send', channel: { $ref: '#/channels/alpha' } } },
    });
    const slice = extractAsyncApiSlice(source, { kind: 'document' });
    const doc = expectDefined(slice).document;

    expect(doc).not.toBe(source);
    expect(doc.channels).not.toBe(source.channels);
    const channels = doc.channels as Record<string, Record<string, unknown>>;
    expect(Object.keys(channels).sort()).toEqual(['alpha', 'beta']);
    expect(channels.beta).toEqual({ address: 'b' });
    const messages = channels.alpha.messages as Record<string, Record<string, unknown>>;
    expect(messages.m.payload).toEqual({ type: 'string' });
    expect(doc.operations).toEqual(source.operations);
  });
});
