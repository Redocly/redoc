import { urlParse, getUrlDirname } from '../url';

describe('url utils', () => {
  describe('urlParse', () => {
    it('should parse valid URLs', () => {
      const result = urlParse('https://example.com/path');
      expect(result).toBeInstanceOf(URL);
      expect(result?.href).toBe('https://example.com/path');
    });

    it('should parse URLs with query parameters', () => {
      const result = urlParse('https://api.example.com/v1/users?id=123&name=test');
      expect(result).toBeInstanceOf(URL);
      expect(result?.searchParams.get('id')).toBe('123');
      expect(result?.searchParams.get('name')).toBe('test');
    });

    it('should parse URLs with fragments', () => {
      const result = urlParse('https://example.com/page#section1');
      expect(result).toBeInstanceOf(URL);
      expect(result?.hash).toBe('#section1');
    });

    it('should handle slashesDenoteHost parameter when true', () => {
      const result = urlParse('//example.com/api', true);
      expect(result).toBeInstanceOf(URL);
      expect(result?.hostname).toBe('example.com');
      expect(result?.pathname).toBe('/api');
    });

    it('should handle URLs with ports', () => {
      const result = urlParse('https://example.com:8080/api');
      expect(result).toBeInstanceOf(URL);
      expect(result?.port).toBe('8080');
    });

    it('should handle URLs with authentication', () => {
      const result = urlParse('https://user:pass@example.com/api');
      expect(result).toBeInstanceOf(URL);
      expect(result?.username).toBe('user');
      expect(result?.password).toBe('pass');
    });

    it('should return null for invalid URLs', () => {
      const result = urlParse('not-a-valid-url');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = urlParse('');
      expect(result).toBeNull();
    });

    it('should return null for malformed URLs', () => {
      const result = urlParse('http://');
      expect(result).toBeNull();
    });

    it('should handle URLs with special characters', () => {
      const result = urlParse('https://example.com/path with spaces');
      expect(result).toBeInstanceOf(URL);
      expect(result?.pathname).toBe('/path%20with%20spaces');
    });

    it('should handle URLs with unicode characters', () => {
      const result = urlParse('https://example.com/测试');
      expect(result).toBeInstanceOf(URL);
      expect(result?.pathname).toBe('/%E6%B5%8B%E8%AF%95');
    });
  });

  describe('getUrlDirname', () => {
    it('should return directory path for URLs ending with slash', () => {
      const result = getUrlDirname('https://example.com/api/');
      expect(result).toBe('https://example.com/api/');
    });

    it('should return directory path for URLs not ending with slash', () => {
      const result = getUrlDirname('https://example.com/api/users');
      expect(result).toBe('https://example.com/api/');
    });

    it('should return root path for URLs with no path segments', () => {
      const result = getUrlDirname('https://example.com');
      expect(result).toBe('https://example.com/');
    });

    it('should return root path for URLs with single path segment', () => {
      const result = getUrlDirname('https://example.com/api');
      expect(result).toBe('https://example.com/');
    });

    it('should handle URLs with query parameters', () => {
      const result = getUrlDirname('https://example.com/api/users?id=123');
      expect(result).toBe('https://example.com/api/');
    });

    it('should handle URLs with fragments', () => {
      const result = getUrlDirname('https://example.com/api/users#section');
      expect(result).toBe('https://example.com/api/');
    });

    it('should handle URLs with ports', () => {
      const result = getUrlDirname('https://example.com:8080/api/users');
      expect(result).toBe('https://example.com:8080/api/');
    });

    it('should handle URLs with multiple consecutive slashes', () => {
      const result = getUrlDirname('https://example.com/api//users');
      expect(result).toBe('https://example.com/api//');
    });

    it('should handle URLs with trailing slashes in path', () => {
      const result = getUrlDirname('https://example.com/api/users/');
      expect(result).toBe('https://example.com/api/users/');
    });

    it('should return undefined for invalid URLs', () => {
      const result = getUrlDirname('not-a-valid-url');
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = getUrlDirname('');
      expect(result).toBeUndefined();
    });

    it('should handle URLs with special characters in path', () => {
      const result = getUrlDirname('https://example.com/api/users with spaces');
      expect(result).toBe('https://example.com/api/');
    });

    it('should handle URLs with unicode characters in path', () => {
      const result = getUrlDirname('https://example.com/api/测试/users');
      expect(result).toBe('https://example.com/api/%E6%B5%8B%E8%AF%95/');
    });

    it('should return undefined for relative URLs', () => {
      const result = getUrlDirname('/api/users/profile');
      expect(result).toBeUndefined();
    });

    it('should return undefined for relative URLs with single segment', () => {
      const result = getUrlDirname('/api');
      expect(result).toBeUndefined();
    });

    it('should return undefined for relative URLs ending with slash', () => {
      const result = getUrlDirname('/api/users/');
      expect(result).toBeUndefined();
    });
  });
});
