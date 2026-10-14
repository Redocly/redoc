import { describe, it, expect, vi } from 'vitest';

import type { TFunction } from '../../hooks/useTranslate.js';

import { resolveText } from '../resolveText.js';

/** Mock translate that returns the registered translation if present, else falls back to the defaultValue. */
function makeTranslate(registered: Record<string, string> = {}): TFunction {
  return vi.fn((key?: string, options?: unknown): string => {
    if (key && registered[key]) return registered[key];
    if (typeof options === 'string') return options;
    if (options && typeof options === 'object' && 'defaultValue' in options) {
      return (options as { defaultValue: string }).defaultValue;
    }
    return key ?? '';
  }) as unknown as TFunction;
}

describe('resolveText', () => {
  it('returns "" when both args are undefined', () => {
    expect(resolveText(makeTranslate(), undefined, undefined)).toBe('');
  });

  it('returns the text verbatim and does NOT call translate when only text is provided', () => {
    const translate = makeTranslate({ 'openapi.info.title': 'Overview' });
    const result = resolveText(translate, undefined, 'Petstore API');
    expect(result).toBe('Petstore API');
    expect(translate).not.toHaveBeenCalled();
  });

  it('translates translationKey when set and falls back to text as defaultValue', () => {
    const translate = makeTranslate({ 'openapi.info.title': 'Overview' });
    const result = resolveText(translate, 'openapi.info.title', 'Overview');
    expect(result).toBe('Overview');
    expect(translate).toHaveBeenCalledWith('openapi.info.title', 'Overview');
  });

  it('returns the translated value even if it differs from the literal text', () => {
    const translate = makeTranslate({ 'openapi.info.title': 'Übersicht' });
    const result = resolveText(translate, 'openapi.info.title', 'Overview');
    expect(result).toBe('Übersicht');
  });

  it('falls back to text when translationKey is set but unregistered', () => {
    const translate = makeTranslate({});
    const result = resolveText(translate, 'openapi.info.title', 'Overview');
    expect(result).toBe('Overview');
    expect(translate).toHaveBeenCalledWith('openapi.info.title', 'Overview');
  });

  it('falls back to the key itself when translationKey is set, unregistered, and no text', () => {
    const translate = makeTranslate({});
    const result = resolveText(translate, 'openapi.info.title', undefined);
    expect(result).toBe('openapi.info.title');
    expect(translate).toHaveBeenCalledWith('openapi.info.title', 'openapi.info.title');
  });
});
