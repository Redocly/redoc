import { jsonToTextPlain } from '../jsonToTextPlain';

describe('Utils', () => {
  test('jsonToTextPlain', () => {
    const json = {
      key: 'value',
      anotherKey: 'anotherValue',
    };

    const actual = jsonToTextPlain(json);
    const expected = '"key": "value"\n' + '"anotherKey": "anotherValue"\n';
    expect(actual).toEqual(expected);
  });
});
