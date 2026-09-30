import { describe, expect, it } from 'vitest';

import { replaceServerVariables, serverMatchesUrl } from '../server-variables.js';

describe('replaceServerVariables', () => {
  it('substitutes a variable with its default value', () => {
    expect(
      replaceServerVariables({
        url: 'https://{host}/api',
        variables: { host: { default: 'app.example.com' } },
      }),
    ).toBe('https://app.example.com/api');
  });

  it('substitutes every occurrence of the same variable', () => {
    expect(
      replaceServerVariables({
        url: 'https://{region}.example.com/{region}/api',
        variables: { region: { default: 'eu' } },
      }),
    ).toBe('https://eu.example.com/eu/api');
  });

  it('substitutes multiple variables', () => {
    expect(
      replaceServerVariables({
        url: '{protocol}://{host}/api',
        variables: { protocol: { default: 'https' }, host: { default: 'example.com' } },
      }),
    ).toBe('https://example.com/api');
  });

  it('substitutes an empty-string default (optional basePath)', () => {
    expect(
      replaceServerVariables({
        url: 'https://example.com{basePath}',
        variables: { basePath: { default: '' } },
      }),
    ).toBe('https://example.com');
  });

  it('leaves the placeholder when a variable has no default', () => {
    expect(replaceServerVariables({ url: 'https://{host}/api', variables: { host: {} } })).toBe(
      'https://{host}/api',
    );
  });

  it('returns the url unchanged when there are no variables', () => {
    expect(replaceServerVariables({ url: 'https://example.com/api' })).toBe(
      'https://example.com/api',
    );
  });
});

describe('serverMatchesUrl', () => {
  const templatedServer = {
    url: 'https://{host}/api',
    variables: { host: { default: 'app.example.com' } },
  };

  it('matches the raw (templated) server URL', () => {
    expect(serverMatchesUrl(templatedServer, 'https://{host}/api')).toBe(true);
  });

  it('matches the variable-substituted server URL', () => {
    expect(serverMatchesUrl(templatedServer, 'https://app.example.com/api')).toBe(true);
  });

  it('does not match an unrelated URL', () => {
    expect(serverMatchesUrl(templatedServer, 'https://other.example.com/api')).toBe(false);
  });

  it('does not match when the url is undefined or empty', () => {
    expect(serverMatchesUrl(templatedServer, undefined)).toBe(false);
    expect(serverMatchesUrl(templatedServer, '')).toBe(false);
  });

  it('matches a plain server by exact URL', () => {
    expect(serverMatchesUrl({ url: '/_mock/apis/main' }, '/_mock/apis/main')).toBe(true);
  });
});
