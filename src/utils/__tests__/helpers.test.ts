import { mapWithLast, appendToMdHeading } from '../helpers';

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

    test('appendToMdHeading heading exists not last', () => {
      const val = appendToMdHeading(
        '# Authentication\n Hello\n# Next heading',
        'Authentication',
        '<test>',
      );
      expect(val).toEqual('# Authentication\n Hello\n\n<test>\n\n# Next heading');
    });

    test('appendToMdHeading heading exists last', () => {
      const val = appendToMdHeading('# Authentication\n Hello', 'Authentication', '<test>');
      expect(val).toEqual('# Authentication\n Hello\n\n<test>\n');
    });

    test('appendToMdHeading empty string', () => {
      const val = appendToMdHeading('', 'Authentication', '<test>');
      expect(val).toEqual('# Authentication\n\n<test>');
    });
  });
});
