import { areArraysEqual } from '../areArraysEqual.js';

describe('areArraysEqual', () => {
  it('should return true for two empty arrays', () => {
    expect(areArraysEqual([], [])).toBe(true);
  });

  it('should return true for two identical arrays of primitives', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('should return false for arrays of different lengths', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2])).toBe(false);
  });

  it('should return false for arrays with the same length but different values', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('should return true for two identical arrays of strings', () => {
    expect(areArraysEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
  });

  it('should return false for arrays with different types', () => {
    expect(areArraysEqual([1, '2', 3], [1, 2, 3])).toBe(false);
  });

  it('should handle arrays with undefined and null values correctly', () => {
    expect(areArraysEqual([undefined, null], [undefined, null])).toBe(true);
    expect(areArraysEqual([undefined, null], [null, undefined])).toBe(false);
  });

  it('should handle arrays with objects and arrays by reference equality', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1 };
    expect(areArraysEqual([obj1], [obj1])).toBe(true);
    expect(areArraysEqual([obj1], [obj2])).toBe(false);
    expect(areArraysEqual([[1, 2]], [[1, 2]])).toBe(false);
  });
});
