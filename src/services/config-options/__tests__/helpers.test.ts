import { describe, it, expect, beforeEach, afterAll, jest } from '@jest/globals';
import {
  normalizeShowExtensions,
  normalizeScrollYOffset,
} from '../helpers.js';
import { querySelector } from '../../../utils/dom.js';
import { isNumeric } from '../../../utils/helpers.js';

jest.mock('../../../utils/dom.js');
jest.mock('../../../utils/helpers.js');

const mockQuerySelector = querySelector as jest.MockedFunction<typeof querySelector>;
const mockIsNumeric = isNumeric as jest.MockedFunction<typeof isNumeric>;

describe('helpers', () => {
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    jest.clearAllMocks();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.warn = originalConsoleWarn;
  });

  describe('normalizeShowExtensions', () => {
    it('should return false for undefined value', () => {
      const result = normalizeShowExtensions(undefined);
      expect(result).toBe(false);
    });

    it('should return true for empty string', () => {
      const result = normalizeShowExtensions('');
      expect(result).toBe(true);
    });

    it('should return true for string "true"', () => {
      const result = normalizeShowExtensions('true');
      expect(result).toBe(true);
    });

    it('should return false for string "false"', () => {
      const result = normalizeShowExtensions('false');
      expect(result).toBe(false);
    });

    it('should return array of extensions for comma-separated string', () => {
      const result = normalizeShowExtensions('x-extension,y-extension, z-extension');
      expect(result).toEqual(['x-extension', 'y-extension', 'z-extension']);
    });

    it('should trim whitespace from extensions', () => {
      const result = normalizeShowExtensions('  x-ext  ,  y-ext  ');
      expect(result).toEqual(['x-ext', 'y-ext']);
    });

    it('should return boolean value as-is when not string', () => {
      const result = normalizeShowExtensions(true);
      expect(result).toBe(true);
    });

    it('should return array value as-is when not string', () => {
      const extensions = ['x-custom', 'y-custom'];
      const result = normalizeShowExtensions(extensions);
      expect(result).toBe(extensions);
    });

    it('should handle single extension without comma', () => {
      const result = normalizeShowExtensions('x-single-extension');
      expect(result).toEqual(['x-single-extension']);
    });

    it('should handle empty extensions in comma-separated string', () => {
      const result = normalizeShowExtensions('x-ext,,y-ext,');
      expect(result).toEqual(['x-ext', 'y-ext']);
    });
  });

  describe('normalizeScrollYOffset', () => {
    beforeEach(() => {
      mockIsNumeric.mockReset();
      mockQuerySelector.mockReset();
    });

    it('should return function that returns element bottom for valid selector', () => {
      const mockElement = {
        getBoundingClientRect: jest.fn().mockReturnValue({ bottom: 100 }),
      } as any;

      mockIsNumeric.mockReturnValue(false);
      mockQuerySelector.mockReturnValue(mockElement);

      const offsetFn = normalizeScrollYOffset('#header');
      const result = offsetFn();

      expect(mockQuerySelector).toHaveBeenCalledWith('#header');
      expect(mockElement.getBoundingClientRect).toHaveBeenCalled();
      expect(result).toBe(100);
    });

    it('should return function that returns 0 and warn for invalid selector', () => {
      mockIsNumeric.mockReturnValue(false);
      mockQuerySelector.mockReturnValue(null);

      const offsetFn = normalizeScrollYOffset('#non-existent');
      const result = offsetFn();

      expect(console.warn).toHaveBeenCalledWith(
        'scrollYOffset value is a selector to non-existing element. Using offset 0 by default',
      );
      expect(result).toBe(0);
    });

    it('should return function that returns number for numeric value', () => {
      const offsetFn = normalizeScrollYOffset(50);
      const result = offsetFn();

      expect(result).toBe(50);
    });

    it('should return function that parses numeric string', () => {
      mockIsNumeric.mockReturnValue(true);

      const offsetFn = normalizeScrollYOffset('75.5');
      const result = offsetFn();

      expect(result).toBe(75.5);
    });

    it('should handle function that returns number', () => {
      const mockFn = jest.fn<() => number>().mockReturnValue(120);

      const offsetFn = normalizeScrollYOffset(mockFn);
      const result = offsetFn();

      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe(120);
    });

    it('should warn when function returns non-number', () => {
      const mockFn = jest.fn<() => unknown>().mockReturnValue('invalid');

      const offsetFn = normalizeScrollYOffset(mockFn as any);
      const result = offsetFn();

      expect(console.warn).toHaveBeenCalledWith(
        'scrollYOffset should return number but returned value "invalid" of type string',
      );
      expect(result).toBe('invalid');
    });

    it('should return function that returns 0 for invalid value types', () => {
      const offsetFn = normalizeScrollYOffset({} as any);
      const result = offsetFn();

      expect(console.warn).toHaveBeenCalledWith(
        'Wrong value for scrollYOffset ReDoc option: should be string, number or function',
      );
      expect(result).toBe(0);
    });

    it('should return function that returns 0 for undefined', () => {
      const offsetFn = normalizeScrollYOffset(undefined);
      const result = offsetFn();

      expect(result).toBe(0);
    });

    it('should handle string that is numeric but not call querySelector', () => {
      mockIsNumeric.mockReturnValue(true);

      const offsetFn = normalizeScrollYOffset('42');
      const result = offsetFn();

      expect(mockQuerySelector).not.toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it('should handle zero numeric value', () => {
      const offsetFn = normalizeScrollYOffset(0);
      const result = offsetFn();

      expect(result).toBe(0);
    });

    it('should handle negative numeric value', () => {
      const offsetFn = normalizeScrollYOffset(-10);
      const result = offsetFn();

      expect(result).toBe(-10);
    });
  });
});
