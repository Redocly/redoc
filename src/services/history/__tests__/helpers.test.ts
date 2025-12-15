import { joinWithSeparator } from '../helpers.js';

describe('History helpers', () => {
  describe('joinWithSeparator', () => {
    test.each`
      base         | path         | expected
      ${'a'}       | ${'b'}       | ${'a/b'}
      ${'a/'}      | ${'/b'}      | ${'a/b'}
      ${'a'}       | ${''}        | ${'a'}
      ${''}        | ${'b'}       | ${'b'}
      ${'a/'}      | ${undefined} | ${'a'}
      ${undefined} | ${'/b'}      | ${'b'}
      ${'/a/'}     | ${'/b/'}     | ${'/a/b/'}
      ${'/'}       | ${'b'}       | ${'/b'}
    `('returns $expected when joining "$base" and "$path"', ({ base, path, expected }) => {
      expect(joinWithSeparator(base, path)).toBe(expected);
    });
  });
});
