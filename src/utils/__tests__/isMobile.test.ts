import { isMobile } from '../isMobile';

describe('isMobile', () => {
  it('should return true for mobile user agent', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
    Object.defineProperty(window.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });

    expect(isMobile()).toBe(true);
  });

  it('should return true for tablet user agent when tablet option is provided', () => {
    const userAgent =
      'Mozilla/5.0 (iPad; CPU OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
    Object.defineProperty(window.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });

    expect(isMobile({ tablet: true })).toBe(true);
  });

  it('should return false for tablet user agent when tablet option is not provided', () => {
    const userAgent =
      'Mozilla/5.0 (iPad; CPU OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
    Object.defineProperty(window.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });

    expect(isMobile()).toBe(false);
  });
});
