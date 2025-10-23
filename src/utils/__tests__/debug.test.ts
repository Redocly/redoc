import { debugTime } from '../debug';

describe('debug', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(console, 'time');
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
