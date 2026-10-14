import { describe, it, expect } from 'vitest';

import type { AsyncApiDefinition } from '../../../types/asyncapi.js';
import type { ApiDocsOptions } from '../../../types/options.js';

import { createStoreContext } from '../../helpers.js';
import { populateAsyncApiStore } from '../store.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';

function run(document: Record<string, unknown>) {
  const ctx = createStoreContext(document);
  return populateAsyncApiStore(document as unknown as AsyncApiDefinition, ctx, {
    markdownParser: markdocParser,
  } as ApiDocsOptions);
}


describe('populateAsyncApiStore — security schemes', () => {
  it('registers each components.securitySchemes entry by its name', () => {
    const store = run({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      components: {
        securitySchemes: {
          userPass: { type: 'userPassword', description: 'Broker user name and password.' },
          apiKey: { type: 'httpApiKey', name: 'X-Api-Key', in: 'header' },
        },
      },
    });

    expect(store.securitySchemeStore.userPass).toMatchObject({
      id: 'userPass',
      type: 'userPassword',
      description: 'Broker user name and password.',
    });
    expect(store.securitySchemeStore.apiKey).toMatchObject({
      id: 'apiKey',
      type: 'httpApiKey',
      in: 'header',
      paramName: 'X-Api-Key',
    });
  });

  it('renames OAuth2 flow availableScopes to scopes and keeps the required scopes', () => {
    const store = run({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      components: {
        securitySchemes: {
          oauth: {
            type: 'oauth2',
            scopes: ['orders:read'],
            flows: {
              clientCredentials: {
                tokenUrl: 'https://auth.example.com/token',
                availableScopes: { 'orders:read': 'Read orders' },
              },
            },
          },
        },
      },
    });

    expect(store.securitySchemeStore.oauth.scopes).toEqual(['orders:read']);
    expect(store.securitySchemeStore.oauth.flows).toEqual({
      clientCredentials: {
        tokenUrl: 'https://auth.example.com/token',
        scopes: { 'orders:read': 'Read orders' },
      },
    });
  });

  it('drops OAuth2 flows missing a URL their type requires', () => {
    const store = run({
      asyncapi: '3.0.0',
      info: { title: 't', version: '1' },
      components: {
        securitySchemes: {
          oauth: {
            type: 'oauth2',
            flows: {
              implicit: { availableScopes: {} },
              password: { availableScopes: {} },
              clientCredentials: { availableScopes: {} },
              authorizationCode: {
                tokenUrl: 'https://auth.example.com/token',
                availableScopes: {},
              },
            },
          },
        },
      },
    });

    expect(store.securitySchemeStore.oauth.flows).toEqual({});
  });

});
