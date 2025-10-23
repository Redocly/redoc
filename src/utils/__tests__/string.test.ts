import slugify from 'slugify';

import { strikethroughText, safeSlugify } from '../string';

describe('string utils', () => {
  it('strikethroughText', () => {
    expect(strikethroughText('text')).toEqual('t̵e̵x̵t̵');
  });

  test('slugifyIfAvailable returns original value when cannot slugify the value', () => {
    const willBeSlugifed = safeSlugify('some string');
    expect(willBeSlugifed).toEqual('some-string');

    const cannotBeSlugified = '가나다라 마바사';
    // if slugify() fixes this issue, safeSlugify should be removed and replaced with original one.
    expect(slugify(cannotBeSlugified)).toEqual('');
    expect(safeSlugify(cannotBeSlugified)).toEqual('가나다라-마바사');
  });
});
