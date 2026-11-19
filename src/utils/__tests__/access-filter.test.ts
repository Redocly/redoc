import { describe, expect, it } from 'vitest';

import { contentNodeVariant } from '../../types/common.js';
import { accessFilterOf } from '../access-filter.js';

const HIDES_READ_ONLY = { skipReadOnly: true, skipWriteOnly: false };
const HIDES_WRITE_ONLY = { skipReadOnly: false, skipWriteOnly: true };

describe('accessFilterOf', () => {
  it.each([
    ['a regular request body', contentNodeVariant.BODY, undefined, HIDES_READ_ONLY],
    ['a regular response', contentNodeVariant.RESPONSES, undefined, HIDES_WRITE_ONLY],
    ['a webhook or callback request body', contentNodeVariant.BODY, true, HIDES_WRITE_ONLY],
    ['a webhook or callback response', contentNodeVariant.RESPONSES, true, HIDES_READ_ONLY],
    ['a querystring body', contentNodeVariant.QUERYSTRING_BODY, undefined, HIDES_READ_ONLY],
    [
      'a querystring body inside an event',
      contentNodeVariant.QUERYSTRING_BODY,
      true,
      HIDES_READ_ONLY,
    ],
  ])('filters %s', (_, variant, isEvent, expected) => {
    expect(accessFilterOf({ variant, isEvent })).toEqual(expected);
  });
});
