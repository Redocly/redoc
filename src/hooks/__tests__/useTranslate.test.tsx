import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useThemeHooks } from '@redocly/theme/core/openapi';

import { useTranslate } from '../useTranslate.js';

vi.mock('@redocly/theme/core/openapi', () => ({
  useThemeHooks: vi.fn(),
}));

/**
 * Fixture mirroring what's registered in the locale bundles
 * (see packages/portal/src/constants/l10n/langs/en.ts).
 */
const REGISTERED_KEYS: readonly string[] = [
  'openapi.info.title',
  'openapi.info.contact.url',
  'openapi.info.contact.name',
  'openapi.info.license',
  'openapi.info.termsOfService',
  'openapi.key',
  'openapi.value',
  'openapi.variables',
  'openapi.mcp.title',
  'openapi.languages.title',
  'openapi.actions.show',
  'graphql.queries',
  'graphql.mutations',
  'graphql.variables',
  'graphql.info.title',
  'asyncapi.info.title',
  'asyncapi.info.contact.url',
  'asyncapi.key',
  'asyncapi.value',
  'codeSnippet.copy.tooltipText',
  'search.navbar.label',
];

describe('useTranslate', () => {
  const translateMock = vi.fn((key: string, options?: unknown) => {
    if (typeof options === 'string') return options;
    if (options && typeof options === 'object' && 'defaultValue' in options) {
      return (options as { defaultValue: string }).defaultValue;
    }
    return key;
  });

  beforeEach(() => {
    translateMock.mockClear();
    vi.mocked(useThemeHooks).mockReturnValue({
      useTranslate: () => ({ translate: translateMock }),
      useTranslationKeys: () => REGISTERED_KEYS,
    } as unknown as ReturnType<typeof useThemeHooks>);
  });

  it('pass-through when specType is undefined', () => {
    const { result } = renderHook(() => useTranslate());
    result.current('some.key', 'fallback');
    expect(translateMock).toHaveBeenCalledWith('some.key', 'fallback');
  });

  it.each([
    ['info.title', 'Overview'],
    ['info.contact.url', 'URL'],
    ['key', 'Key'],
    ['value', 'Value'],
    ['mcp.title', 'MCP server'],
    ['languages.title', 'Languages'],
  ])('prefixes known bare key %s under specType=openapi', (key, defaultValue) => {
    const { result } = renderHook(() => useTranslate('openapi'));
    result.current(key, defaultValue);
    expect(translateMock).toHaveBeenCalledWith(`openapi.${key}`, defaultValue);
  });

  it.each([
    ['queries', 'Queries'],
    ['mutations', 'Mutations'],
    ['variables', 'Variables'],
  ])('prefixes known bare key %s under specType=graphql', (key, defaultValue) => {
    const { result } = renderHook(() => useTranslate('graphql'));
    result.current(key, defaultValue);
    expect(translateMock).toHaveBeenCalledWith(`graphql.${key}`, defaultValue);
  });

  it('prefixes known bare key under specType=asyncapi', () => {
    const { result } = renderHook(() => useTranslate('asyncapi'));
    result.current('info.title', 'Overview');
    expect(translateMock).toHaveBeenCalledWith('asyncapi.info.title', 'Overview');
  });

  it.each([
    ['unknown.bare.key', 'Fallback'],
    ['totally.custom.namespace.key', 'Custom'],
    ['my.app.title', 'My App'],
  ])('pass-through unknown bare key %s under specType=openapi', (key, defaultValue) => {
    const { result } = renderHook(() => useTranslate('openapi'));
    result.current(key, defaultValue);
    expect(translateMock).toHaveBeenCalledWith(key, defaultValue);
  });

  it('pass-through for already-prefixed openapi.* key under specType=openapi', () => {
    const { result } = renderHook(() => useTranslate('openapi'));
    result.current('openapi.actions.show', 'Show');
    expect(translateMock).toHaveBeenCalledWith('openapi.actions.show', 'Show');
  });

  it('pass-through for already-prefixed graphql.* key under specType=openapi', () => {
    const { result } = renderHook(() => useTranslate('openapi'));
    result.current('graphql.queries', 'Queries');
    expect(translateMock).toHaveBeenCalledWith('graphql.queries', 'Queries');
  });

  it('pass-through for shared codeSnippet.* key under specType=openapi (no prefix added)', () => {
    const { result } = renderHook(() => useTranslate('openapi'));
    result.current('codeSnippet.copy.tooltipText', 'Copy to clipboard');
    expect(translateMock).toHaveBeenCalledWith('codeSnippet.copy.tooltipText', 'Copy to clipboard');
  });

  it('pass-through for shared search.* key under specType=graphql (no prefix added)', () => {
    const { result } = renderHook(() => useTranslate('graphql'));
    result.current('search.navbar.label', 'Search');
    expect(translateMock).toHaveBeenCalledWith('search.navbar.label', 'Search');
  });

  it('returns default string when key is empty', () => {
    const { result } = renderHook(() => useTranslate('openapi'));
    expect(result.current('', 'fallback')).toBe('fallback');
    expect(translateMock).not.toHaveBeenCalled();
  });

  it('returns empty string when key is empty and no default', () => {
    const { result } = renderHook(() => useTranslate('openapi'));
    expect(result.current('')).toBe('');
    expect(translateMock).not.toHaveBeenCalled();
  });

  it('returns options.defaultValue when key is empty and options is an object', () => {
    const { result } = renderHook(() => useTranslate('openapi'));
    expect(result.current('', { defaultValue: 'from object' })).toBe('from object');
    expect(translateMock).not.toHaveBeenCalled();
  });
});
