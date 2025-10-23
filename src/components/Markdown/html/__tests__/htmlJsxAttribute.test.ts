import { getJsxConvertedAttributes } from '../htmlJsxAttribute.js';

describe('getJsxConvertedAttributes', () => {
  test('should convert attribute names according to the mapping', () => {
    const attrs = {
      allowfullscreen: 'true',
      class: 'my-class',
      'http-equiv': 'content-type',
      'xml:lang': 'en',
    };

    const convertedAttrs = getJsxConvertedAttributes(attrs);

    expect(convertedAttrs).toEqual({
      allowFullScreen: 'true',
      className: 'my-class',
      httpEquiv: 'content-type',
      xmlLang: 'en',
    });
  });

  test('should not convert attribute names not present in the mapping', () => {
    const attrs = {
      id: 'my-id',
      name: 'my-name',
    };

    const convertedAttrs = getJsxConvertedAttributes(attrs);

    expect(convertedAttrs).toEqual(attrs);
  });

  test('should handle empty attributes', () => {
    const attrs = {};

    const convertedAttrs = getJsxConvertedAttributes(attrs);

    expect(convertedAttrs).toEqual({});
  });

  test('should convert style attribute to object with custom property', () => {
    const attrs = {
      style: '--custom-color: red; color: red; background-color: blue;',
    };

    const convertedAttrs = getJsxConvertedAttributes(attrs);

    expect(convertedAttrs).toEqual({
      style: {
        '--custom-color': 'red',
        backgroundColor: 'blue',
        color: 'red',
      },
    });
  });

  test('should not crash for malformed style string', () => {
    const attrs = {
      style: 'mistake;color: red; background-color: blue;',
    };

    const convertedAttrs = getJsxConvertedAttributes(attrs);

    expect(convertedAttrs).toEqual({
      style: {
        mistake: '',
        backgroundColor: 'blue',
        color: 'red',
      },
    });
  });

  test('should convert value to defaultValue for input and textarea', () => {
    const attrs = {
      value: 'my-value',
    };

    const convertedAttrs = getJsxConvertedAttributes(attrs, 'input');

    expect(convertedAttrs).toEqual({
      defaultValue: 'my-value',
    });
  });

  test('should convert checked to defaultChecked: true for input', () => {
    const attrs = {
      checked: 'checked',
    };

    const convertedAttrs = getJsxConvertedAttributes(attrs, 'input');

    expect(convertedAttrs).toEqual({
      defaultChecked: true,
    });
  });

  test('should convert checked empty string to defaultChecked: true for input', () => {
    const attrs = {
      checked: '',
    };

    const convertedAttrs = getJsxConvertedAttributes(attrs, 'input');

    expect(convertedAttrs).toEqual({
      defaultChecked: true,
    });
  });
});
