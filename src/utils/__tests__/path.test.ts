import { normalizePath } from '../path.js';

describe('path utils', () => {
  test('normalizePath should return correct path', () => {
    const expectedResult = '/test/path';
    expect(normalizePath('test/path')).toBe(expectedResult);
    expect(normalizePath('test/path/')).toBe(expectedResult);
    expect(normalizePath('/test/path/')).toBe(expectedResult);
    expect(normalizePath('/test/path')).toBe(expectedResult);
  });

  test('normalizePath should handle root path', () => {
    const expectedResult = '/';
    expect(normalizePath('/')).toBe(expectedResult);
    expect(normalizePath('')).toBe(expectedResult);
  });
});
