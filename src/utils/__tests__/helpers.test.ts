import slugify from 'slugify';
import { appendToMdHeading, mapWithLast, mergeObjects, safeSlugify, titleize } from '../helpers';

describe('Utils', () => {
  describe('helpers', () => {
    test('mapWithLast', () => {
      const arr = [1, 2, 3];
      const fn = (...args) => args;

      const actual = mapWithLast(arr, fn);
      const expected = [
        [1, false],
        [2, false],
        [3, true],
      ];
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

    test('slugifyIfAvailable returns original value when cannot slugify the value', () => {
      const willBeSlugifed = safeSlugify('some string');
      expect(willBeSlugifed).toEqual('some-string');

      const cannotBeSlugified = '가나다라 마바사';
      // if slugify() fixes this issue, safeSlugify should be removed and replaced with original one.
      expect(slugify(cannotBeSlugified)).toEqual('');
      expect(safeSlugify(cannotBeSlugified)).toEqual('가나다라-마바사');
    });

    describe('mergeObjects', () => {
      test('should merge Objects and all nested Ones', () => {
        const obj1 = { a: { a1: 'A1' }, c: 'C', d: {} };
        const obj2 = { a: { a2: 'A2' }, b: { b1: 'B1' }, d: null };
        const obj3 = { a: { a1: 'A1', a2: 'A2' }, b: { b1: 'B1' }, c: 'C', d: null };
        expect(mergeObjects({}, obj1, obj2)).toEqual(obj3);
      });
      test('should behave like Object.assign on the top level', () => {
        const obj1 = { a: { a1: 'A1' }, c: 'C' };
        const obj2 = { a: undefined, b: { b1: 'B1' } };
        expect(mergeObjects({}, obj1, obj2)).toEqual({ ...obj1, ...obj2 });
      });
      test('should not merge array values, just override', () => {
        const obj1 = { a: ['A', 'B'] };
        const obj2 = { a: ['C'], b: ['D'] };
        expect(mergeObjects({}, obj1, obj2)).toEqual({ a: ['C'], b: ['D'] });
      });
    });

    describe('titleize', () => {
      test('should return the string with the first letter capitalized', () => {
        expect(titleize('my title')).toEqual('My title');
      });
    });
  });
});
