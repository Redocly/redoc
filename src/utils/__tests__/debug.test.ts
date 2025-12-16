import type { MockInstance } from 'vitest';
import { debugTime } from '../debug.js';

describe('debug', () => {
  let spy: MockInstance;

  beforeEach(() => {
    spy = vi.spyOn(console, 'time');
  });

  afterEach(() => {
    spy.mockRestore();
  });

  describe('debugTime', () => {
    it('should call console.time with the given label in non-production environment', () => {
      process.env.NODE_ENV = 'development';
      debugTime('test');
      expect(spy).toHaveBeenCalledWith('test');
    });

    it('should not call console.time in production environment', () => {
      process.env.NODE_ENV = 'production';
      debugTime('test');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
