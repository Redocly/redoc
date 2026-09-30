import { describe, expect, it } from 'vitest';

import {
  ASSISTANT_LINK_BASES,
  MAX_ASSISTANT_URL_LENGTH,
  buildFetchSpecPromptLink,
  buildInlinePromptLink,
  describeSliceScope,
} from '../assistant-links.js';

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  return value as T;
}

describe('buildInlinePromptLink', () => {
  it('inlines the yaml into the q parameter when it fits', () => {
    const yaml = 'openapi: 3.1.0\ninfo:\n  title: Pets\n  version: 1.0.0\n';
    const link = expectDefined(buildInlinePromptLink(ASSISTANT_LINK_BASES.claude, yaml));

    expect(link.length).toBeLessThanOrEqual(MAX_ASSISTANT_URL_LENGTH);
    const url = new URL(link);
    expect(url.origin + url.pathname).toBe('https://claude.ai/new');
    expect(url.searchParams.get('q')).toBe(
      `Read the yaml and answer questions based on the content.\n\n${yaml}`,
    );
  });

  it('applies the budget to the final encoded url, inclusive at the boundary', () => {
    const base = ASSISTANT_LINK_BASES.claude;
    const probe = expectDefined(buildInlinePromptLink(base, 'x'));
    const overhead = probe.length - 1;
    const fitting = 'x'.repeat(MAX_ASSISTANT_URL_LENGTH - overhead);

    expect(expectDefined(buildInlinePromptLink(base, fitting)).length).toBe(
      MAX_ASSISTANT_URL_LENGTH,
    );
    expect(buildInlinePromptLink(base, `${fitting}x`)).toBeUndefined();
  });

  it('returns undefined when the encoded url exceeds the budget', () => {
    const yaml = 'a: b\n'.repeat(2000);
    expect(buildInlinePromptLink(ASSISTANT_LINK_BASES.chatgpt, yaml)).toBeUndefined();
  });

  it('uses the GraphQL prompt prefix for graphql content', () => {
    const sdl = 'type Query {\n  menu: [String]\n}\n';
    const link = expectDefined(buildInlinePromptLink(ASSISTANT_LINK_BASES.claude, sdl, 'graphql'));

    expect(new URL(link).searchParams.get('q')).toBe(
      `Read the GraphQL SDL and answer questions based on the content.\n\n${sdl}`,
    );
  });
});

describe('describeSliceScope', () => {
  it('describes each scope kind', () => {
    expect(
      describeSliceScope({
        kind: 'operation',
        pathName: '/pets',
        httpVerb: 'get',
        source: 'paths',
      }),
    ).toBe('the GET /pets operation');
    expect(describeSliceScope({ kind: 'tag', tagName: 'Orders' })).toBe('the "Orders" operations');
    expect(describeSliceScope({ kind: 'schema', name: 'Pet' })).toBe('the Pet schema');
    expect(describeSliceScope({ kind: 'channel', channelId: 'userSignedUp' })).toBe(
      'the "userSignedUp" channel',
    );
    expect(
      describeSliceScope({ kind: 'graphql-operation', operationType: 'query', name: 'menu' }),
    ).toBe('the menu query');
    expect(describeSliceScope({ kind: 'graphql-type', name: 'MenuItem' })).toBe(
      'the MenuItem type',
    );
    expect(describeSliceScope({ kind: 'graphql-directive', name: 'auth' })).toBe(
      'the @auth directive',
    );
    expect(describeSliceScope({ kind: 'async-operation', operationId: 'sendUserSignedUp' })).toBe(
      'the "sendUserSignedUp" operation',
    );
    expect(describeSliceScope({ kind: 'document' })).toBeUndefined();
  });
});

describe('buildFetchSpecPromptLink', () => {
  const specUrl = 'https://api.example.com/openapi.yaml';

  it('builds a scoped fetch prompt for an operation page', () => {
    const link = buildFetchSpecPromptLink(ASSISTANT_LINK_BASES.claude, specUrl, {
      kind: 'operation',
      pathName: '/pets',
      httpVerb: 'get',
      source: 'paths',
    });

    expect(link.length).toBeLessThan(400);
    const url = new URL(link);
    expect(url.origin + url.pathname).toBe('https://claude.ai/new');
    expect(url.searchParams.get('q')).toBe(
      `Read ${specUrl} and answer questions about the GET /pets operation.`,
    );
  });

  it('builds a generic fetch prompt for the document scope', () => {
    const link = buildFetchSpecPromptLink(ASSISTANT_LINK_BASES.chatgpt, specUrl, {
      kind: 'document',
    });

    expect(new URL(link).searchParams.get('q')).toBe(
      `Read ${specUrl} and answer questions based on the content.`,
    );
  });
});
