import { HistoryService } from '../HistoryService';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

const options = new RedocNormalizedOptions({});

describe('History service', () => {
  function mockWindowLocationForSearch(): void {
    const mockResponse = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse,
        },
        assign: mockResponse,
      },
      writable: true,
    });
  }

  test('should be an instance', () => {
    const history = new HistoryService(options);
    expect(typeof history).not.toBe('function');
    expect(history.subscribe).toBeDefined();
  });

  test('History subscribe', () => {
    const fn = jest.fn();
    const history = new HistoryService(options);
    history.subscribe(fn);
    history.emit();
    expect(fn).toHaveBeenCalled();
  });

  test('History subscribe should return unsubscribe function', () => {
    const fn = jest.fn();
    const history = new HistoryService(options);
    const unsubscribe = history.subscribe(fn);
    history.emit();
    expect(fn).toHaveBeenCalled();
    unsubscribe();
    history.emit();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  describe('History with config property: `userQueryParamToNavigate` false', () => {
    test('currentId should return correct id', () => {
      window.location.hash = '#testid';
      const history = new HistoryService(options);
      expect(history.currentId).toEqual('testid');
    });

    test('should return correct link for id', () => {
      const history = new HistoryService(options);
      expect(history.linkForId('testid')).toEqual('#testid');
    });

    test('should return empty link for empty id', () => {
      const history = new HistoryService(options);
      expect(history.linkForId('')).toEqual('');
    });
  });

  describe('History with config property: `userQueryParamToNavigate` true', () => {
    const overrideOptions = new RedocNormalizedOptions({
      userQueryParamToNavigate: true,
    });

    test('currentId should return correct id', () => {
      mockWindowLocationForSearch();
      window.location.search = '?redoc=testid';
      const history = new HistoryService(overrideOptions);
      expect(history.currentId).toEqual('testid');
    });

    test('should return correct link for id', () => {
      const history = new HistoryService(overrideOptions);
      expect(history.linkForId('testid')).toEqual('?redoc=testid');
    });

    test('should return empty link for empty id', () => {
      const history = new HistoryService(overrideOptions);
      expect(history.linkForId('')).toEqual('');
    });
  });
});
