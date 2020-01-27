import { history } from '../HistoryService';

describe('History service', () => {
  test('should be an instance', () => {
    expect(typeof history).not.toBe('function');
    expect(history.subscribe).toBeDefined();
  });

  test('History subscribe', () => {
    const fn = jest.fn();
    history.subscribe(fn);
    history.emit();
    expect(fn).toHaveBeenCalled();
  });

  test('History subscribe should return unsubscribe function', () => {
    const fn = jest.fn();
    const unsubscribe = history.subscribe(fn);
    history.emit();
    expect(fn).toHaveBeenCalled();
    unsubscribe();
    history.emit();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('currentId should return correct id', () => {
    window.location.hash = '#testid';
    expect(history.currentId).toEqual('testid');
  });

  test('should return correct link for id', () => {
    expect(history.linkForId('testid')).toEqual('#testid');
  });

  test('should return empty link for empty id', () => {
    expect(history.linkForId('')).toEqual('');
  });
});
