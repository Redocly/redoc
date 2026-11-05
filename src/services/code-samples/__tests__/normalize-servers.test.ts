import { afterEach, describe, expect, it } from 'vitest';

import { normalizeServers, resolveServerUrl } from '../normalize-servers.js';

const jsdom = (globalThis as unknown as { jsdom: { reconfigure(opts: { url: string }): void } })
  .jsdom;

afterEach(() => {
  jsdom.reconfigure({ url: 'http://localhost:3000/' });
});

describe('resolveServerUrl', () => {
  it('resolves a relative server against the directory of an absolute spec URL', () => {
    expect(resolveServerUrl('/v1', 'https://specs.example.com/apis/petstore.yaml')).toBe(
      'https://specs.example.com/v1',
    );
    expect(resolveServerUrl('v1', 'https://specs.example.com/apis/petstore.yaml')).toBe(
      'https://specs.example.com/apis/v1',
    );
  });

  it('uses the directory of a relative spec path and ignores its query and hash', () => {
    expect(resolveServerUrl('v1', 'apis/petstore.yaml?version=2#top')).toBe('apis/v1');
  });

  it('resolves against the page directory when the page is an .html file and no spec URL is set', () => {
    jsdom.reconfigure({ url: 'https://docs.example.com/reference/index.html' });

    expect(resolveServerUrl('v1')).toBe('https://docs.example.com/reference/v1');
  });

  it('resolves against the page URL without its query and hash', () => {
    jsdom.reconfigure({ url: 'https://docs.example.com/reference/?tab=1#op' });

    expect(resolveServerUrl('v1')).toBe('https://docs.example.com/reference/v1');
  });

  it('passes an absolute server URL through', () => {
    expect(resolveServerUrl('https://api.example.com/v1', 'apis/petstore.yaml')).toBe(
      'https://api.example.com/v1',
    );
  });
});

describe('normalizeServers', () => {
  it('yields one server resolved from the root when the definition declares none', () => {
    jsdom.reconfigure({ url: 'https://docs.example.com/reference/' });

    expect(normalizeServers(undefined, [])).toEqual([
      { url: 'https://docs.example.com', description: '' },
    ]);
  });

  it('resolves every server and keeps its other fields', () => {
    expect(
      normalizeServers('https://specs.example.com/apis/petstore.yaml', [
        { url: '/v1', description: 'Production', variables: { a: { default: 'b' } } },
        { url: 'https://sandbox.example.com' },
      ]),
    ).toEqual([
      {
        url: 'https://specs.example.com/v1',
        description: 'Production',
        variables: { a: { default: 'b' } },
      },
      { url: 'https://sandbox.example.com', description: '' },
    ]);
  });
});
