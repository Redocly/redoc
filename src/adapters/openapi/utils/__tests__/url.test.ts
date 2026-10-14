import { afterEach, describe, expect, it, vi } from 'vitest';

import { getUrlDirname, urlParse } from '../url.js';

describe('urlParse', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses a valid absolute URL', () => {
    const parsed = urlParse('https://api.example.com/v1/pets');
    expect(parsed?.origin).toBe('https://api.example.com');
    expect(parsed?.pathname).toBe('/v1/pets');
  });

  it('treats protocol-relative URLs as having a host when slashesDenoteHost is true', () => {
    const parsed = urlParse('//api.example.com/path', true);
    expect(parsed?.host).toBe('api.example.com');
    expect(parsed?.pathname).toBe('/path');
  });

  it('returns null for invalid URLs', () => {
    expect(urlParse('not a url at all!!!')).toBeNull();
  });

  it('logs and returns null when URL constructor throws', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const parseSpy = vi.spyOn(URL, 'parse').mockImplementation(() => {
      throw new TypeError('Invalid URL');
    });

    expect(urlParse('https://api.example.com')).toBeNull();
    expect(errorSpy).toHaveBeenCalled();

    parseSpy.mockRestore();
  });
});

describe('getUrlDirname', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns origin plus directory when pathname is a file', () => {
    expect(getUrlDirname('https://api.example.com/v1/openapi.yaml')).toBe(
      'https://api.example.com/v1/',
    );
  });

  it('returns origin plus pathname when pathname already ends with slash', () => {
    expect(getUrlDirname('https://api.example.com/v1/')).toBe('https://api.example.com/v1/');
  });

  it('returns origin root when pathname has no slash', () => {
    expect(getUrlDirname('https://api.example.com')).toBe('https://api.example.com/');
  });

  it('returns undefined and logs for invalid URLs', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(getUrlDirname(':::invalid:::')).toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
