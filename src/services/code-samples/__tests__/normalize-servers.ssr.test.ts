import { afterEach, describe, expect, it, vi } from 'vitest';

import type * as Environments from '../../../utils/environments.js';

import { resolveServerUrl } from '../normalize-servers.js';

vi.mock('../../../utils/environments.js', async (importOriginal) => {
  const actual = await importOriginal<typeof Environments>();
  return { ...actual, IS_BROWSER: false };
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('resolveServerUrl during server rendering', () => {
  it('resolves a relative server against the SSR host when no spec URL is set', () => {
    vi.stubGlobal('SSR_HOSTNAME', 'https://docs.example.com/reference/');

    expect(resolveServerUrl('v1')).toBe('https://docs.example.com/reference/v1');
  });

  it('returns the server URL unchanged without an SSR host', () => {
    expect(resolveServerUrl('/v1')).toBe('/v1');
  });
});
