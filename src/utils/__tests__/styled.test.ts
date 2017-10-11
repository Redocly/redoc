import * as react from 'React';
import { transparentizeHex } from '../styled';

describe('transparentizeHex', () => {
  test('simple transparentize', () => {
    const res = transparentizeHex('#000000', 0.5);
    expect(res).toBe('rgba(0, 0, 0, 0.5)');
  });

  test('transparentize hex shorthand', () => {
    const res = transparentizeHex('#123', 0.5);
    expect(res).toBe('rgba(17, 34, 51, 0.5)');
  });

  test('do not transparentize (withot last param)', () => {
    const res = transparentizeHex('#010203');
    expect(res).toBe('rgb(1, 2, 3)');
  });
});
