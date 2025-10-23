import { toLocalStorage, fromLocalStorage } from '../local-storage';

jest.mock('@redocly/theme/core/openapi', () => ({
  IS_BROWSER: true,
}));

describe('local-storage', () => {
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        getItem: jest.fn((key: string) => {
          return mockLocalStorage[key] || null;
        }),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toLocalStorage', () => {
    it('should store value with redoc prefix', () => {
      toLocalStorage('test-key', 'test-value');

      expect(window.localStorage.setItem).toHaveBeenCalledWith('redoc.test-key', 'test-value');
    });
  });

  describe('fromLocalStorage', () => {
    it('should retrieve value with redoc prefix', () => {
      mockLocalStorage['redoc.test-key'] = 'test-value';

      const result = fromLocalStorage('test-key');

      expect(window.localStorage.getItem).toHaveBeenCalledWith('redoc.test-key');
      expect(result).toBe('test-value');
    });

    it('should return empty string when key does not exist', () => {
      const result = fromLocalStorage('non-existent-key');

      expect(result).toBe('');
    });

    it('should return empty string when value is null', () => {
      mockLocalStorage['redoc.test-key'] = null as any;

      const result = fromLocalStorage('test-key');

      expect(result).toBe('');
    });
  });
});
