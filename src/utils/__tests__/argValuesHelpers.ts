import {
  argValueToBoolean,
  argValueToExpandLevel,
  argValueToInt,
  argValueToNumber,
} from '../argValuesHelpers';

describe('argValuesHelpers tests', () => {
  describe('argValueToBoolean function test', () => {
    it('should return true when passing boolean value', () => {
      const result = argValueToBoolean(true);
      expect(result).toBe(true);
    });

    it('should return false value when nothing passing', () => {
      const result = argValueToBoolean();
      expect(result).toBe(false);
    });

    it('should return true whe passing some string', () => {
      const result = argValueToBoolean('test');
      expect(result).toBe(true);
    });

    it('should return false whe passing some `false` string', () => {
      const result = argValueToBoolean('false');
      expect(result).toBe(false);
    });
  });

  describe('argValueToExpandLevel function test', () => {
    it('should return Infinity when passing `all`', () => {
      const result = argValueToExpandLevel('all');
      expect(result).toBe(Infinity);
    });

    it('should return undefined when call without arguments', () => {
      const result = argValueToExpandLevel();
      expect(result).toBe(undefined);
    });
  });

  describe('argValueToInt function test', () => {
    it('should convert string number to number', () => {
      const result = argValueToInt('22');
      expect(result).toBe(22);
    });

    it('should Math.ceil number', () => {
      const result = argValueToInt(22.4);
      expect(result).toBe(23);
    });
  });

  describe('argValueToNumber function test', () => {
    it('should return exact number', () => {
      const result = argValueToNumber(22);
      expect(result).toBe(22);
    });

    it('should parse string to number', () => {
      const result = argValueToNumber('22');
      expect(result).toBe(22);
    });

    it('should return default value', () => {
      expect(argValueToNumber(undefined)).toBe(0);
      expect(argValueToNumber(undefined, 2)).toBe(2);
    });
  });
});
