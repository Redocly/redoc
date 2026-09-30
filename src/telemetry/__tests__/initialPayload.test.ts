import { describe, expect, it } from 'vitest';

import type { ApiItem, ApiStore } from '../../types/store.js';

import {
  buildInitialPayload,
  countItems,
  isLocalhost,
  nonDefaultOptions,
  openApiSecurityShape,
  scanDocument,
  securityShape,
} from '../initialPayload.js';

const item = (
  variant: string,
  extra: Record<string, unknown> = {},
  children?: unknown[],
): ApiItem =>
  ({
    type: 'link',
    label: 'x',
    link: '/x',
    content: { contentType: 'item', itemVariant: variant, children: [], ...extra },
    ...(children ? { items: children } : {}),
  }) as unknown as ApiItem;

describe('isLocalhost', () => {
  it('flags loopback, private and empty hosts', () => {
    for (const host of [
      '',
      'localhost',
      'LOCALHOST',
      'my-mac.local',
      '127.0.0.1',
      '10.1.2.3',
      '192.168.0.9',
      '172.16.5.5',
      '172.31.0.1',
      '::1',
      '[::1]',
      '0.0.0.0',
    ]) {
      expect(isLocalhost(host)).toBe(true);
    }
  });

  it('accepts public hosts', () => {
    for (const host of ['docs.example.com', '172.32.0.1', '11.0.0.1', 'localhost.example.com']) {
      expect(isLocalhost(host)).toBe(false);
    }
  });
});

describe('nonDefaultOptions', () => {
  it('keeps primitives, coerces attribute strings and hides everything else', () => {
    expect(
      nonDefaultOptions({
        hideDownloadButtons: true,
        jsonSamplesExpandLevel: '3',
        expandResponses: 'false',
        layout: 'stacked',
        theme: { colors: {} },
        onDeepLinkClick: () => undefined,
        scrollYOffset: 'nav',
        specType: 'openapi',
        metadata: { title: 'Acme' },
        downloadUrls: [{ url: 'https://x' }],
        info: { title: 'secret' },
        undefinedValue: undefined,
      }),
    ).toEqual({
      hideDownloadButtons: true,
      jsonSamplesExpandLevel: 3,
      expandResponses: false,
      layout: 'stacked',
      theme: true,
      onDeepLinkClick: true,
      scrollYOffset: true,
    });
  });

  it('returns undefined when nothing was set', () => {
    expect(nonDefaultOptions(undefined)).toBeUndefined();
    expect(nonDefaultOptions({ specType: 'openapi' })).toBeUndefined();
  });
});

describe('countItems', () => {
  it('walks nested items and counts variants, groups, webhooks and deprecations', () => {
    const items = [
      item('httpItem', { meta: { deprecated: true } }),
      {
        type: 'group',
        label: 'Pets',
        content: { contentType: 'group', children: [] },
        items: [item('httpItem'), item('httpItem', { meta: { isWebhook: true } }), item('schema')],
      } as unknown as ApiItem,
      item('query'),
    ];
    expect(countItems(items)).toMatchObject({
      operations: 4,
      groups: 1,
      webhooks: 1,
      deprecated: 1,
      byVariant: { httpItem: 3, schema: 1, query: 1 },
    });
  });
});

describe('securityShape', () => {
  it('counts scheme types with the HTTP split and OAuth2 flows', () => {
    const store: ApiStore['securitySchemeStore'] = {
      basic: { id: 'basic', type: 'http', scheme: 'basic' },
      bearer: { id: 'bearer', type: 'http', scheme: 'Bearer' },
      digest: { id: 'digest', type: 'http', scheme: 'digest' },
      key: { id: 'key', type: 'apiKey' },
      oauth: {
        id: 'oauth',
        type: 'oauth2',
        flows: { clientCredentials: { tokenUrl: 'x', scopes: {} }, implicit: { scopes: {} } },
      },
    };
    expect(securityShape(store)).toEqual({
      securitySchemes: 5,
      schemeTypes: { httpBasic: 1, httpBearer: 1, httpOther: 1, apiKey: 1, oauth2: 1 },
      oauth2Flows: { clientCredentials: 1, implicit: 1 },
    });
  });
});

const openapi = {
  openapi: '3.1.0',
  info: { title: 'Pets', 'x-logo': { url: 'x' } },
  'x-tagGroups': [],
  security: [{ key: [] }],
  servers: [{ url: 'https://api.example.com' }],
  paths: {
    '/pets': {
      get: { 'x-codeSamples': [], callbacks: { onEvent: {}, onOther: {} } },
      post: { security: [{}, { key: [] }] },
      delete: { security: [{ key: [], oauth: ['a'] }, { basic: [] }] },
    },
  },
};

describe('scanDocument', () => {
  it('reports extension usage, callbacks and the spec version without values', () => {
    expect(scanDocument(openapi)).toMatchObject({
      specVersion: '3.1',
      extensionsCount: 3,
      redocExtensions: { logo: true, tagGroups: true },
      hasCodeSamples: true,
      callbacks: 2,
      servers: 1,
      hasBindings: false,
      hasReply: false,
    });
  });

  it('normalises AsyncAPI server protocols into flags', () => {
    const scan = scanDocument({
      asyncapi: '3.0.0',
      servers: { prod: { protocol: 'kafka-secure' }, dev: { protocol: 'carrier' } },
      channels: { a: { bindings: {} } },
      operations: { send: { reply: {} } },
    });
    expect(scan).toMatchObject({
      specVersion: '3.0',
      protocols: { kafkaSecure: true, other: true },
      hasBindings: true,
      hasReply: true,
      servers: 2,
    });
  });
});

describe('openApiSecurityShape', () => {
  it('classifies the effective security of every operation', () => {
    expect(openApiSecurityShape(openapi)).toEqual({
      hasGlobalSecurity: true,
      securedOperations: 3,
      optionalSecurityOperations: 1,
      combinedSecurityOperations: 1,
      alternativeSecurityOperations: 2,
    });
  });
});

describe('buildInitialPayload', () => {
  it('assembles the load event from the store, the document and the shell context', () => {
    const apiStore = {
      specType: 'openapi',
      schemaStore: { Pet: {}, Owner: {} },
      exampleStore: {},
      securitySchemeStore: { key: { id: 'key', type: 'apiKey' } },
    } as unknown as ApiStore;
    const payload = buildInitialPayload({
      uri: 'urn:redocly:redoc:ui:page',
      layout: 'three-panel',
      typeOfUsage: 'html',
      items: [item('httpItem'), item('httpItem')],
      apiStore,
      definition: openapi,
      hostname: 'docs.example.com',
      landedOn: 'operation',
      buildTimings: { resolveSpecMs: 120, buildItemsMs: 40 },
      options: { hideDownloadButtons: true },
    });
    expect(payload).toMatchObject({
      id: 'redocInitial',
      object: 'initial',
      uri: 'urn:redocly:redoc:ui:page',
      typeOfUsage: 'html',
      operationsCount: 2,
      schemasCount: 2,
      specVersion: '3.1',
      hasCodeSamples: true,
      resolveSpecMs: 120,
      buildItemsMs: 40,
      isLocalhost: false,
      landedOn: 'operation',
      options: { hideDownloadButtons: true },
      shape: {
        tags: 0,
        callbacks: 2,
        servers: 1,
        securitySchemes: 1,
        schemeTypes: { apiKey: 1 },
        hasGlobalSecurity: true,
      },
    });
    expect(JSON.stringify(payload)).not.toContain('Pets');
  });
});
