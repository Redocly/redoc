import { describe, expect, it } from 'vitest';

import {
  isWithinExpansionLevel,
  isRequiredAutoExpanded,
  REQUIRED_EXPAND_LEVEL,
} from '../expansion.js';

describe('isWithinExpansionLevel', () => {
  it('uses the fallback level when schemasExpansionLevel is not set', () => {
    expect(isWithinExpansionLevel(0, undefined, 1)).toBe(true);
    expect(isWithinExpansionLevel(1, undefined, 1)).toBe(false);
    expect(isWithinExpansionLevel(0, undefined, 0)).toBe(false);
  });

  it('expands up to the configured level when set', () => {
    expect(isWithinExpansionLevel(0, 4, 1)).toBe(true);
    expect(isWithinExpansionLevel(3, 4, 1)).toBe(true);
    expect(isWithinExpansionLevel(4, 4, 1)).toBe(false);
  });

  it('treats an explicit 0 as "expand nothing" (overriding the fallback)', () => {
    expect(isWithinExpansionLevel(0, 0, 1)).toBe(false);
  });

  it("expands every level for the 'all' value (Infinity)", () => {
    expect(isWithinExpansionLevel(0, Infinity, 0)).toBe(true);
    expect(isWithinExpansionLevel(99, Infinity, 0)).toBe(true);
  });
});

describe('isRequiredAutoExpanded', () => {
  it('expands required object/array fields by default (no expansion level set)', () => {
    expect(isRequiredAutoExpanded(0, true, undefined)).toBe(true);
    expect(isRequiredAutoExpanded(REQUIRED_EXPAND_LEVEL, true, undefined)).toBe(true);
  });

  it('does not expand non-required fields', () => {
    expect(isRequiredAutoExpanded(0, false, undefined)).toBe(false);
    expect(isRequiredAutoExpanded(0, undefined, undefined)).toBe(false);
  });

  it('stops expanding required fields past the required-expand depth', () => {
    expect(isRequiredAutoExpanded(REQUIRED_EXPAND_LEVEL + 1, true, undefined)).toBe(false);
  });

  it('defers to the configured schemasExpansionLevel when one is set (depth-only)', () => {
    expect(isRequiredAutoExpanded(0, true, 0)).toBe(false);
    expect(isRequiredAutoExpanded(0, true, 6)).toBe(false);
  });
});
