import { isHostAllowed } from '../check';

describe('license check', () => {
  test('isHostAllowed should work properly', () => {
    expect(isHostAllowed('', [])).toBe(false);
    expect(isHostAllowed('dummyHost', [])).toBe(false);

    expect(isHostAllowed('localhost', [])).toBe(true);
    expect(isHostAllowed('.localhost', [])).toBe(true);
    expect(isHostAllowed('127.0.0.1', [])).toBe(true);

    expect(isHostAllowed('acme.com', ['acme.com'])).toBe(true);
    expect(isHostAllowed('sub.acme.com', ['acme.com'])).toBe(true);
    expect(isHostAllowed('fakeacme.com', ['acme.com'])).toBe(false);
    expect(isHostAllowed('fakeacme.com', ['.acme.com'])).toBe(false);

    expect(isHostAllowed('acme.com', ['acme*'])).toBe(false);
    expect(isHostAllowed('acme.app.com', ['acme*com'])).toBe(false);
    expect(isHostAllowed('acme.app.com', ['acme*acme.com'])).toBe(false);
    expect(isHostAllowed('start-fakeAcmeVercel.com', ['start*Vercel.com'])).toBe(false);

    expect(isHostAllowed('start-middle-end.vercel.com', ['start*end.vercel.com'])).toBe(true);
    expect(isHostAllowed('start-acme.vercel.com', ['start*.vercel.com'])).toBe(true);
    expect(isHostAllowed('api-acme.vercel.com', ['*acme.vercel.com'])).toBe(true);
  });
});
