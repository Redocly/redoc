import { HistoryService } from '../HistoryService';

describe('History service', () => {
  test('should be an instance', () => {
    expect(typeof HistoryService).not.toBe('function');
    expect(HistoryService.subscribe).toBeDefined();
  });

  test('History subscribe', () => {
    const fn = jest.fn();
    HistoryService.subscribe(fn);
    HistoryService.emit();
    expect(fn).toHaveBeenCalled();
  });

  test('History subscribe should return unsubsribe function', () => {
    const fn = jest.fn();
    const unsubscribe = HistoryService.subscribe(fn);
    HistoryService.emit();
    expect(fn).toHaveBeenCalled();
    unsubscribe();
    HistoryService.emit();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
