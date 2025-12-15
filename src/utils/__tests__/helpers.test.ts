import {
  appendToMdHeading,
  deleteEmptyArrayItem,
  useSchemaTitle,
  isArrayOfObjects,
  mapWithLast,
  titleize,
  isLastInArray,
  isLastProperty,
  getValueFromMdParsedExtension,
} from '../helpers.js';

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

    describe('titleize', () => {
      test('should return the string with the first letter capitalized', () => {
        expect(titleize('my title')).toEqual('My title');
      });
    });

    describe('isArrayOfObjects', () => {
      test('should return true if the array contains object', () => {
        expect(isArrayOfObjects([{ test: 'string' }])).toEqual(true);
      });
      test('should return false if the array does not include object', () => {
        expect(isArrayOfObjects(['string'])).toEqual(false);
      });
      test('should return false if the array with only null', () => {
        expect(isArrayOfObjects([null])).toEqual(false);
      });
      test('should return false if props is string', () => {
        expect(isArrayOfObjects('[null]')).toEqual(false);
      });
      test('should return true if the array contains at least one object', () => {
        expect(isArrayOfObjects([null, 'string', { test: 'string' }])).toEqual(true);
      });
    });

    describe('deleteEmptyArrayItem', () => {
      test('should delete null and undefined items', () => {
        expect(deleteEmptyArrayItem([null, undefined, 'string'])).toEqual(['string']);
      });

      test('should delete empty items', () => {
        const array = new Array(3);
        array.push('string');
        expect(deleteEmptyArrayItem(array)).toEqual(['string']);
      });
    });

    describe('isLastInArray', () => {
      const array = [1, 2, 3];

      test('should return true for last index', () => {
        expect(isLastInArray(array, array.length - 1)).toEqual(true);
      });
      test('should return false for not last index', () => {
        expect(isLastInArray(array, array.length - 2)).toEqual(false);
      });
    });

    describe('isLastProperty', () => {
      const object = {
        a: 'a',
        b: 'b',
        c: 'c',
      };

      test('should return true for last key', () => {
        expect(isLastProperty(object, 'c')).toEqual(true);
      });
      test('should return false for not last key', () => {
        expect(isLastProperty(object, 'b')).toEqual(false);
      });
    });
  });

  describe('useSchemaTitle', () => {
    test('should return the title if it is defined', () => {
      expect(useSchemaTitle('#/components/schemas/Call', 'Pet')).toEqual('Pet');
    });
    test('should return the def name if title is undefined', () => {
      expect(useSchemaTitle('#/components/schemas/Call')).toEqual('Call');
    });
    test('should return the empty string', () => {
      expect(useSchemaTitle('#/test/path/Call')).toEqual('');
    });
  });

  describe('getValueFromMdParsedExtension', () => {
    it('should return undefined when no value exists', () => {
      const item = {};
      expect(getValueFromMdParsedExtension(item, 'description')).toBeUndefined();
    });

    it('should return regular value when no parsed markdown exists', () => {
      const item = {
        description: 'regular text',
      };
      expect(getValueFromMdParsedExtension(item, 'description')).toBe('regular text');
    });

    it('should return parsed markdown value when available', () => {
      const item = {
        description: 'original text',
        'x-parsed-md-description': {
          result: 'parsed text',
        },
      };
      expect(getValueFromMdParsedExtension(item, 'description')).toEqual({
        result: 'parsed text',
        raw: 'original text',
      });
    });

    it('should handle x-enumDescriptions specially', () => {
      const item = {
        'x-enumDescriptions': {
          value1: 'desc 1',
          value2: 'desc 2',
          'x-parsed-md-value1': 'desc 1',
          'x-parsed-md-value2': 'desc 2',
        },
      };
      expect(getValueFromMdParsedExtension(item, 'x-enumDescriptions')).toEqual({
        value1: 'desc 1',
        value2: 'desc 2',
      });
    });

    it('should return original x-enumDescriptions if no parsed values exist', () => {
      const originalEnum = {
        value1: 'desc 1',
        value2: 'desc 2',
      };
      const item = {
        'x-enumDescriptions': originalEnum,
      };
      expect(getValueFromMdParsedExtension(item, 'x-enumDescriptions')).toEqual(originalEnum);
    });

    it('should handle summary field', () => {
      const item = {
        summary: 'original summary',
        'x-parsed-md-summary': {
          result: 'parsed summary',
          raw: 'original summary',
        },
      };
      expect(getValueFromMdParsedExtension(item, 'summary')).toEqual({
        result: 'parsed summary',
        raw: 'original summary',
      });
    });

    it('should normalize markdown value with only result property', () => {
      const item = {
        'x-parsed-md-description': {
          result: 'parsed text',
        },
        description: 'original text',
      };
      expect(getValueFromMdParsedExtension(item, 'description')).toEqual({
        result: 'parsed text',
        raw: 'original text',
      });
    });
  });
});
