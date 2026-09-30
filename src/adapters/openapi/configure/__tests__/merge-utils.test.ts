import { describe, it, expect } from 'vitest';

import type { SecurityDetails } from '@redocly/theme/ext/configure';
import type { OpenAPIServer } from '../../../../types/openapi.js';

import {
  updateObjectProperties,
  createSecurityUpdates,
  isDirectRequestValues,
  applyServerVariableDefaults,
  mergeSecurityIntoScheme,
  getEffectiveRequestValues,
  getParamValueMap,
  mergeBodyValue,
  withServerVariableDefaults,
} from '../merge-utils.js';

describe('merge-utils.updateObjectProperties', () => {
  it('updates object with new values for existing properties only', () => {
    const original = {
      name: 'Museum Hours',
      items: [{ date: '2023-10-29', timeOpen: '09:00', timeClose: '18:00' }],
    };
    const updates = {
      location: 'Grand Exhibition Hall',
      name: 'John Doe Prod',
      items: [{ date: '2024-01-13', timeOpen: '08:00', timeClose: '15:00' }],
      artifacts: [{ artifactId: 'prod-artifact-777', artifactNumber: 777 }],
      visitors: [{ visitorId: 'prod-visitor-345-678', visitorNumber: 678 }],
    };
    const expected = {
      name: 'John Doe Prod',
      items: [{ date: '2024-01-13', timeOpen: '08:00', timeClose: '15:00' }],
    };
    expect(updateObjectProperties(original, updates)).toStrictEqual(expected);
  });

  it('returns updates as-is when original is not an object', () => {
    expect(updateObjectProperties('foo', { x: 1 })).toEqual({ x: 1 });
    expect(updateObjectProperties(null, [1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('replaces array of primitives wholesale', () => {
    expect(updateObjectProperties([1, 2, 3], [9, 8])).toEqual([9, 8]);
  });
});

describe('merge-utils.createSecurityUpdates', () => {
  it('creates security updates for http basic scheme (username/password)', () => {
    const scheme = {
      type: 'http',
      scheme: 'basic',
      id: 'MuseumPlaceholderAuth',
      scopes: [],
    };
    const securityValues: Record<string, SecurityDetails> = {
      MuseumPlaceholderAuth: {
        username: 'prod_api_user',
        password: 'Pr0d@P!S3cur3',
        token: { access_token: 'eyJhbGciOiJIUzI1NiI...' },
      },
    };
    expect(createSecurityUpdates(scheme, securityValues)).toStrictEqual({
      scopes: [],
      'x-defaultUsername': 'prod_api_user',
      'x-defaultPassword': 'Pr0d@P!S3cur3',
    });
  });

  it('omits undefined fields so partial overrides do not wipe existing scheme values', () => {
    const scheme = {
      id: 'oauth',
      type: 'oauth2',
      'x-defaultClientId': 'preset-client-id',
    };
    const merged = mergeSecurityIntoScheme(scheme, {
      default: { token: { access_token: 'new-token' } },
    });
    expect(merged['x-defaultAccessToken']).toBe('new-token');
    expect(merged['x-defaultClientId']).toBe('preset-client-id');
  });

  it('uses scheme-specific values when scheme.id matches a key in securityValues', () => {
    const scheme = { id: 'MyApiKey', type: 'apiKey', in: 'header', name: 'X-API-Key' };
    const securityValues: Record<string, SecurityDetails> = {
      MyApiKey: { token: { access_token: 'scheme-specific-token' } },
      default: { token: { access_token: 'default-token' } },
    };
    const result = createSecurityUpdates(scheme, securityValues);
    expect(result['x-defaultAccessToken']).toBe('scheme-specific-token');
  });

  it('falls back to default when scheme.id does not match any key', () => {
    const scheme = { id: 'UnknownScheme', type: 'http', scheme: 'bearer' };
    const securityValues: Record<string, SecurityDetails> = {
      SomeOtherScheme: { token: { access_token: 'other-token' } },
      default: { token: { access_token: 'fallback-token' } },
    };
    expect(createSecurityUpdates(scheme, securityValues)['x-defaultAccessToken']).toBe(
      'fallback-token',
    );
  });

  it('returns empty values when neither scheme.id nor default exists', () => {
    const scheme = { id: 'MissingScheme', type: 'http', scheme: 'bearer' };
    const securityValues: Record<string, SecurityDetails> = {
      Other: { token: { access_token: 'unrelated' } },
    };
    expect(createSecurityUpdates(scheme, securityValues)['x-defaultAccessToken']).toBeUndefined();
  });

  it('drops accessToken/tokenType for oauth2 when no token provided', () => {
    const scheme = { id: 'oauth', type: 'oauth2' };
    const result = createSecurityUpdates(scheme, { default: { client_id: 'cid' } });
    expect(result['x-defaultAccessToken']).toBeUndefined();
    expect(result['x-defaultTokenType']).toBeUndefined();
    expect(result['x-defaultClientId']).toBe('cid');
  });

  it('defaults x-defaultTokenType to "Bearer" when token has access_token but no token_type', () => {
    const scheme = { id: 'bearer', type: 'http', scheme: 'bearer' };
    const result = createSecurityUpdates(scheme, {
      default: { token: { access_token: 'tok' } },
    });
    expect(result['x-defaultAccessToken']).toBe('tok');
    expect(result['x-defaultTokenType']).toBe('Bearer');
  });

  it('defaults x-defaultTokenType to "Bearer" for empty-string token_type (legacy parity)', () => {
    const scheme = { id: 'bearer', type: 'http', scheme: 'bearer' };
    const result = createSecurityUpdates(scheme, {
      default: { token: { access_token: 'tok', token_type: '' } },
    });
    expect(result['x-defaultTokenType']).toBe('Bearer');
  });

  // Mirrors `openapi-docs/src/utils/__tests__/configure-helpers.test.ts` →
  // "configure-helpers createSecurityUpdates › Should create security updates".
  // Functional parity: with http-basic + a token, only username/password are
  // applied, AccessToken/TokenType are dropped, and ClientId/ClientSecret stay
  // unset. (api-docs omits missing keys; legacy includes them with `undefined`
  // — equivalent for downstream property access.)
  it('http-basic with token + username/password mirrors legacy openapi-docs result', () => {
    const scheme = {
      type: 'http',
      scheme: 'basic',
      id: 'MuseumPlaceholderAuth',
      scopes: [] as string[],
      serverValues: {
        'https://api.fake-museum-example.com/{version}': {
          scopes: [],
          'x-defaultUsername': 'prod_api_user',
          'x-defaultPassword': 'Pr0d@P!S3cur3',
        },
      },
    };
    const securityValues: Record<string, SecurityDetails> = {
      MuseumPlaceholderAuth: {
        username: 'prod_api_user',
        password: 'Pr0d@P!S3cur3',
        token: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    };
    const result = createSecurityUpdates(scheme, securityValues);
    expect(result['x-defaultUsername']).toBe('prod_api_user');
    expect(result['x-defaultPassword']).toBe('Pr0d@P!S3cur3');
    expect(result['x-defaultAccessToken']).toBeUndefined();
    expect(result['x-defaultTokenType']).toBeUndefined();
    expect(result['x-defaultClientId']).toBeUndefined();
    expect(result['x-defaultClientSecret']).toBeUndefined();
    expect(result.scopes).toEqual([]);
  });
});

describe('merge-utils.isDirectRequestValues', () => {
  it('returns true for direct request values', () => {
    expect(
      isDirectRequestValues({
        body: { name: 'X' },
        security: { default: { username: 'u', password: 'p' } },
      }),
    ).toBe(true);
  });

  it('returns false for server-keyed request values', () => {
    expect(
      isDirectRequestValues({
        'https://api.example.com': { body: { name: 'X' } },
        'https://dev.api.example.com': { body: { name: 'Y' } },
      }),
    ).toBe(false);
  });

  it('returns true when only serverVariables present', () => {
    expect(isDirectRequestValues({ serverVariables: { version: 'v2' } })).toBe(true);
  });

  it('returns false for null/undefined/non-object', () => {
    expect(isDirectRequestValues(null)).toBe(false);
    expect(isDirectRequestValues(undefined)).toBe(false);
  });
});

describe('merge-utils.applyServerVariableDefaults', () => {
  function makeServers(): OpenAPIServer[] {
    return [
      {
        url: 'https://api.example.com/{version}/{environment}',
        variables: {
          version: { default: 'v1' },
          environment: { default: 'prod' },
        },
      },
      {
        url: 'https://dev.api.example.com/{version}',
        variables: { version: { default: 'v1' } },
      },
    ];
  }

  it('updates server variables for all servers when no targetServerUrl is provided', () => {
    const servers = makeServers();
    applyServerVariableDefaults(servers, { version: 'v2', environment: 'staging' });
    expect(servers[0].variables?.version.default).toBe('v2');
    expect(servers[0].variables?.environment.default).toBe('staging');
    expect(servers[1].variables?.version.default).toBe('v2');
    expect(servers[1].variables?.environment).toBeUndefined();
  });

  it('updates server variables only on target server when targetServerUrl is provided', () => {
    const servers = makeServers();
    applyServerVariableDefaults(
      servers,
      { version: 'v3', environment: 'development' },
      'https://api.example.com/{version}/{environment}',
    );
    expect(servers[0].variables?.version.default).toBe('v3');
    expect(servers[0].variables?.environment.default).toBe('development');
    expect(servers[1].variables?.version.default).toBe('v1');
  });

  it('does not add non-existent server variables', () => {
    const servers = makeServers();
    applyServerVariableDefaults(servers, { nonExistent: 'x', version: 'v2' });
    expect(servers[0].variables?.version.default).toBe('v2');
    expect(servers[0].variables?.nonExistent).toBeUndefined();
  });

  it('handles empty serverVariables object without changing defaults', () => {
    const servers = makeServers();
    applyServerVariableDefaults(servers, {});
    expect(servers[0].variables?.version.default).toBe('v1');
    expect(servers[0].variables?.environment.default).toBe('prod');
  });

  it('handles undefined serverVariables', () => {
    const servers = makeServers();
    applyServerVariableDefaults(servers, undefined);
    expect(servers[0].variables?.version.default).toBe('v1');
  });

  it('preserves enum/description when updating default', () => {
    const servers: OpenAPIServer[] = [
      {
        url: 'https://api.example.com/{version}',
        variables: {
          version: { default: 'v1', enum: ['v1', 'v2', 'v3'], description: 'API version' },
        },
      },
    ];
    applyServerVariableDefaults(servers, { version: 'v2' });
    expect(servers[0].variables?.version.default).toBe('v2');
    expect(servers[0].variables?.version.enum).toEqual(['v1', 'v2', 'v3']);
    expect(servers[0].variables?.version.description).toBe('API version');
  });

  it('handles partial updates leaving other variables intact', () => {
    const servers = makeServers();
    applyServerVariableDefaults(servers, { version: 'v2' });
    expect(servers[0].variables?.version.default).toBe('v2');
    expect(servers[0].variables?.environment.default).toBe('prod');
  });
});

describe('merge-utils.withServerVariableDefaults', () => {
  type Server = {
    url: string;
    variables?: Record<string, { default?: string; enum?: string[]; description?: string }>;
  };

  function makeServers(): Server[] {
    return [
      {
        url: 'https://api.example.com/{version}/{environment}',
        variables: {
          version: { default: 'v1', enum: ['v1', 'v2'] },
          environment: { default: 'prod', description: 'env' },
        },
      },
      {
        url: 'https://dev.api.example.com/{version}',
        variables: { version: { default: 'v1' } },
      },
    ];
  }

  it('returns same array reference when serverVariables empty/undefined', () => {
    const servers = makeServers();
    expect(withServerVariableDefaults(servers, undefined)).toBe(servers);
    expect(withServerVariableDefaults(servers, {})).toBe(servers);
  });

  it('returns new array but reuses entries that did not change (immutability)', () => {
    const servers = makeServers();
    const next = withServerVariableDefaults(servers, { version: 'v2' });
    expect(next).not.toBe(servers);
    expect(next[0].variables?.version.default).toBe('v2');
    expect(servers[0].variables?.version.default).toBe('v1');
    expect(next[0].variables?.version.enum).toEqual(['v1', 'v2']);
    expect(next[1].variables?.version.default).toBe('v2');
  });

  it('only updates the targeted server when targetServerUrl is provided', () => {
    const servers = makeServers();
    const next = withServerVariableDefaults(
      servers,
      { version: 'v2' },
      'https://dev.api.example.com/{version}',
    );
    expect(next[0]).toBe(servers[0]);
    expect(next[1]).not.toBe(servers[1]);
    expect(next[1].variables?.version.default).toBe('v2');
  });

  it('does not add non-existent variables', () => {
    const servers = makeServers();
    const next = withServerVariableDefaults(servers, { nonExistent: 'x', version: 'v2' });
    expect(next[0].variables?.version.default).toBe('v2');
    expect(next[0].variables?.nonExistent).toBeUndefined();
  });

  it('preserves enum/description when updating default', () => {
    const servers = makeServers();
    const next = withServerVariableDefaults(servers, { environment: 'staging' });
    expect(next[0].variables?.environment.default).toBe('staging');
    expect(next[0].variables?.environment.description).toBe('env');
  });
});

describe('merge-utils.mergeSecurityIntoScheme', () => {
  it('merges credentials into the scheme directly when serverUrl is omitted', () => {
    const scheme = { id: 'oauth', type: 'oauth2', scopes: ['read'] };
    const merged = mergeSecurityIntoScheme(scheme, {
      default: { token: { access_token: 'tok', token_type: 'Bearer' }, client_id: 'cid' },
    });
    expect(merged['x-defaultAccessToken']).toBe('tok');
    expect(merged['x-defaultTokenType']).toBe('Bearer');
    expect(merged['x-defaultClientId']).toBe('cid');
  });

  it('writes credentials into serverValues[serverUrl] when serverUrl is provided', () => {
    const scheme = { id: 'oauth', type: 'oauth2' };
    const merged = mergeSecurityIntoScheme(
      scheme,
      { default: { token: { access_token: 'srv-tok' } } },
      'https://prod-server.com',
    );
    expect(merged.serverValues['https://prod-server.com']?.['x-defaultAccessToken']).toBe(
      'srv-tok',
    );
  });
});

describe('merge-utils.getParamValueMap', () => {
  const source = {
    headers: { 'X-Token': 'abc' },
    query: { limit: '10' },
    path: { id: '42' },
    cookie: { sid: 'xyz' },
  };

  it('returns the matching record for each known location', () => {
    expect(getParamValueMap('header', source)).toBe(source.headers);
    expect(getParamValueMap('query', source)).toBe(source.query);
    expect(getParamValueMap('path', source)).toBe(source.path);
    expect(getParamValueMap('cookie', source)).toBe(source.cookie);
  });

  it('returns undefined when the field is missing on source', () => {
    expect(getParamValueMap('header', { query: { a: '1' } })).toBeUndefined();
  });
});

describe('merge-utils.mergeBodyValue', () => {
  it('returns base unchanged when overlay is undefined', () => {
    const base = { name: 'orig' };
    expect(mergeBodyValue(base, undefined)).toBe(base);
  });

  it('recursively merges when both base and overlay are records', () => {
    const base = { name: 'orig', meta: { a: 1, b: 2 } };
    const overlay = { name: 'next', meta: { a: 99 } };
    expect(mergeBodyValue(base, overlay)).toEqual({ name: 'next', meta: { a: 99, b: 2 } });
  });

  it('returns overlay wholesale when base is not a record', () => {
    expect(mergeBodyValue('primitive', { x: 1 })).toEqual({ x: 1 });
    expect(mergeBodyValue(null, [1, 2])).toEqual([1, 2]);
  });

  it('returns overlay wholesale when overlay is not a record', () => {
    expect(mergeBodyValue({ x: 1 }, 'replaced')).toBe('replaced');
    expect(mergeBodyValue({ x: 1 }, [1, 2])).toEqual([1, 2]);
  });

  it('respects updateObjectProperties existing-keys-only rule', () => {
    const base = { name: 'orig' };
    expect(mergeBodyValue(base, { name: 'next', extra: 'ignored' })).toEqual({ name: 'next' });
  });
});

describe('merge-utils.getEffectiveRequestValues', () => {
  it('returns direct request values unchanged', () => {
    const direct = { headers: { 'X-T': 'a' } };
    expect(getEffectiveRequestValues(direct, [{ url: 'https://api.example.com' }])).toBe(direct);
  });

  it('returns the matching server entry first', () => {
    const map = {
      'https://other.com': { headers: { x: '1' } },
      'https://api.example.com': { headers: { x: '2' } },
    };
    expect(getEffectiveRequestValues(map, [{ url: 'https://api.example.com' }])).toBe(
      map['https://api.example.com'],
    );
  });

  it('falls back to first key when no server URL matches', () => {
    const map = { 'https://first.com': { headers: { x: '1' } } };
    expect(getEffectiveRequestValues(map, [{ url: 'https://unknown.com' }])).toBe(
      map['https://first.com'],
    );
  });

  it('returns undefined for empty/undefined inputs', () => {
    expect(getEffectiveRequestValues(undefined, [])).toBeUndefined();
    expect(getEffectiveRequestValues({}, [])).toBeUndefined();
  });
});
