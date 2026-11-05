import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeBadges } from '../normalize-badges.js';

describe('normalizeBadges', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('keeps a valid list without reporting', () => {
    const badges = [{ name: 'a', position: 'before' as const }, { name: 'b' }];
    expect(normalizeBadges(badges)).toEqual(badges);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('returns undefined for an absent value without reporting', () => {
    expect(normalizeBadges(undefined)).toBeUndefined();
    expect(normalizeBadges([])).toBeUndefined();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('drops and reports a single badge object', () => {
    const value = { name: 'x-deprecated', position: 'before' };
    expect(normalizeBadges(value)).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][1]).toContain('x-badges');
  });

  it('reports the same invalid object each time it is read, so a rebuild reports it too', () => {
    const value = { name: 'x-deprecated' };
    normalizeBadges(value);
    normalizeBadges(value);
    expect(errorSpy).toHaveBeenCalledTimes(2);
  });

  it('drops and reports a non-object value', () => {
    expect(normalizeBadges('badge')).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('copies only name, color and position so spec objects never reach the store', () => {
    const cyclic: Record<string, unknown> = { name: 'beta', color: 'red', extra: {} };
    (cyclic.extra as Record<string, unknown>).self = cyclic;
    const [badge] = normalizeBadges([cyclic]) ?? [];
    expect(badge).not.toBe(cyclic);
    expect(JSON.parse(JSON.stringify(badge))).toEqual({ name: 'beta', color: 'red' });
  });

  it('drops and reports entries with an invalid color or position', () => {
    expect(
      normalizeBadges([{ name: 'ok' }, { name: 'c', color: {} }, { name: 'p', position: 'top' }]),
    ).toEqual([{ name: 'ok' }]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps valid entries of a list and reports the invalid ones', () => {
    expect(normalizeBadges([{ name: 'ok' }, { position: 'after' }, 'str', null])).toEqual([
      { name: 'ok' },
    ]);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
