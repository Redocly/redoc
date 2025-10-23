import {
  isSameMime,
  normalizeMimeType,
  unescapeServerVariables,
  arrayMergeStrategy,
} from '../utils';

describe('services utils', () => {
  test('isSameMime should equal mime', () => {
    expect(isSameMime('application/json;charset', 'application/json;charset=UTF-8')).toBeTruthy();
    expect(isSameMime('app/json;charset', 'application/json;charset=UTF-8')).toBeFalsy();
    expect(isSameMime('app/json;charset', '')).toBeFalsy();
  });

  test('normalizeMimeType should return correct value', () => {
    expect(normalizeMimeType('application/json;charset')).toBe('application/json');
    expect(normalizeMimeType('')).toBeUndefined();
    expect(normalizeMimeType('application')).toBe('application');
  });

  test('unescapeServerVariables should return string with escaped brackets', () => {
    expect(unescapeServerVariables('https://%7BsomeVar%7D/dev/echo/case-11_1')).toBe(
      'https://{someVar}/dev/echo/case-11_1',
    );
    expect(unescapeServerVariables('https://{someVar}/dev/echo/case-11_1')).toBe(
      'https://{someVar}/dev/echo/case-11_1',
    );
    expect(unescapeServerVariables('https://api./{someVar}/dev/echo/case-11_1')).toBe(
      'https://api.{someVar}/dev/echo/case-11_1',
    );
  });

  test('arrayMergeStrategy should leave the second array value if two arrays of primitives provided', () => {
    expect(arrayMergeStrategy(['test1'], ['test2'])).toEqual(['test2']);
  });

  test('arrayMergeStrategy should leave the second array value if two arrays of primitives with different length provided', () => {
    expect(arrayMergeStrategy(['test1', 'test2'], ['test3'])).toEqual(['test3']);
  });

  test('arrayMergeStrategy should merge two arrays of arrays into one', () => {
    expect(arrayMergeStrategy([['test1']], [['test2']])).toEqual([['test1'], ['test2']]);
  });

  test('arrayMergeStrategy should merge two arrays of objects into one', () => {
    expect(arrayMergeStrategy([{ id: 0, name: 'test1' }], [{ name: 'test2' }])).toEqual([
      { id: 0, name: 'test2' },
    ]);
  });

  test('arrayMergeStrategy should merge two arrays of objects even if the first array is empty', () => {
    expect(arrayMergeStrategy([], [{ name: 'test1' }])).toEqual([{ name: 'test1' }]);
  });

  test('arrayMergeStrategy should merge two arrays of of objects of a different length', () => {
    expect(
      arrayMergeStrategy([{ id: 0, name: 'test1' }], [{ name: 'test2' }, { id: 1, name: 'test3' }]),
    ).toEqual([
      { id: 0, name: 'test2' },
      { id: 1, name: 'test3' },
    ]);
  });
});
