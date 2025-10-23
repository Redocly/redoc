import { queryString } from '../queryString';

describe('QueryString', () => {
  describe('parse', () => {
    it('should parse an empty query string', () => {
      const result = queryString.parse('');
      expect(result).toEqual({});
    });

    it('should parse a query string with a single key-value pair', () => {
      const result = queryString.parse('?key=value');
      expect(result).toEqual({ key: 'value' });
    });

    it('should parse a query string with multiple key-value pairs', () => {
      const result = queryString.parse('key1=value1&key2=value2');
      expect(result).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should decode special characters in keys and values', () => {
      const result = queryString.parse('?key%21=value%2B');
      expect(result).toEqual({ 'key!': 'value+' });
    });

    it('should parse a matrix array value', () => {
      const result = queryString.parse('key=value1&key=value2');
      expect(result).toEqual({ key: ['value1', 'value2'] });
    });

    it('should parse an array value with comma separator', () => {
      const result = queryString.parse('key=value1,value2,value3');
      expect(result).toEqual({ key: ['value1', 'value2', 'value3'] });
    });

    it('should parse an array value with pipe separator', () => {
      const result = queryString.parse('key=value1|value2');
      expect(result).toEqual({ key: ['value1', 'value2'] });
    });
  });

  describe('stringify', () => {
    it('should stringify an empty object', () => {
      const result = queryString.stringify({});
      expect(result).toBe('');
    });

    it('should stringify a single key-value pair', () => {
      const result = queryString.stringify({ key: 'value' });
      expect(result).toBe('key=value');
    });

    it('should stringify multiple key-value pairs', () => {
      const result = queryString.stringify({ key1: 'value1', key2: 'value2' });
      expect(result).toBe('key1=value1&key2=value2');
    });

    it('should stringify an array value', () => {
      const result = queryString.stringify({ key: ['value1', 'value2'] });
      expect(result).toBe('key=value1&key=value2');
    });

    it('should sort key-value pairs if options.sort is true', () => {
      const result = queryString.stringify({ key2: 'value2', key1: 'value1' }, { sort: true });
      expect(result).toBe('key1=value1&key2=value2');
    });

    it('should not sort key-value pairs if options.sort is false', () => {
      const result = queryString.stringify({ key2: 'value2', key1: 'value1' }, { sort: false });
      expect(result).toBe('key2=value2&key1=value1');
    });
  });
});
