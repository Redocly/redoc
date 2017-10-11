import { mapWithLast } from '../helpers';

describe('Utils', () => {
  describe('helpers', () => {
    test('mapWithLast', () => {
      const arr = [1, 2, 3];
      const fn = (...args) => args;

      const actual = mapWithLast(arr, fn);
      const expected = [[1, false], [2, false], [3, true]];
      expect(actual).toEqual(expected);
    });

    test('mapWithLast for empty array', () => {
      const arr = [];
      const fn = (...args) => args;

      const actual = mapWithLast(arr, fn);
      const expected = [];
      expect(actual).toEqual(expected);
    });
  });
});
