import { highlight, mapLang } from '../../utils/highlight';

describe('prism.js helpers', () => {
  test('mapLang should map "json" to "js"', () => {
    expect(mapLang('json')).toBe('js');
  });

  test('mapLang should map to "clike" by default', () => {
    expect(mapLang('non-existring')).toBe('clike');
  });

  test('highlight js code', () => {
    expect(highlight('const t = 10;', 'js')).toMatchSnapshot();
  });

  test('highlight raw text should just return text', () => {
    expect(highlight('Hello world', 'clike')).toBe('Hello world');
  });

  test('highlight should not throw with lang undefined', () => {
    expect(highlight('Hello world', undefined)).toBe('Hello world');
  });
});
