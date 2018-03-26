const mockMark = jest.fn();
const mockUnmark = jest.fn();

jest.mock('mark.js', () => () => ({
  mark: mockMark,
  unmark: mockUnmark,
}));

import { MarkerService } from '../MarkerService';

describe('Marker service', () => {
  let marker: MarkerService;
  const element = document.createElement('span');

  beforeEach(() => {
    marker = new MarkerService();
    mockMark.mockClear();
    mockUnmark.mockClear();
  });

  test('add element to Map', () => {
    marker.add(element);
    expect(marker.map.size).toBeGreaterThan(0);
  });

  test('delete element from Map', () => {
    marker.add(element);
    marker.delete(element);

    expect(marker.map.size).toEqual(0);
  });

  test('addOnly: should unmark and remove old elements', () => {
    const e1 = document.createElement('span');
    const e2 = document.createElement('span');
    const e3 = document.createElement('span');

    marker.add(e1);
    marker.add(e2);

    marker.addOnly([element, e2, e3]);

    expect(mockUnmark).toHaveBeenCalledTimes(1);
    expect(marker.map.size).toEqual(3);
  });

  test('unmark: should unmark all elements', () => {
    const e1 = document.createElement('span');
    const e2 = document.createElement('span');
    marker.add(e1);
    marker.add(e2);
    marker.add(element);

    marker.unmark();

    expect(mockUnmark).toHaveBeenCalledTimes(3);
    expect(mockMark).not.toHaveBeenCalled();
  });
  test('clearAll: should unmark and remove all elements', () => {
    const e1 = document.createElement('span');
    const e2 = document.createElement('span');
    marker.add(e1);
    marker.add(e2);
    marker.add(element);

    marker.clearAll();

    expect(mockUnmark).toHaveBeenCalledTimes(3);
    expect(mockMark).not.toHaveBeenCalled();
    expect(marker.map.size).toEqual(0);
  });

  test('mark: should unmark and mark again each element', () => {
    const e1 = document.createElement('span');
    const e2 = document.createElement('span');
    marker.add(e1);
    marker.add(e2);
    marker.add(element);

    marker.mark('test');

    expect(mockUnmark).toHaveBeenCalledTimes(3);
    expect(mockMark).toHaveBeenCalledTimes(3);
    expect(mockMark).toHaveBeenCalledWith('test');
    expect(marker.map.size).toEqual(3);
  });

  test('mark: should do nothing if no term provided', () => {
    marker.add(element);
    marker.mark();

    expect(mockMark).not.toHaveBeenCalled();
  });
  test('mark: should save previous marked term and use it if no term is provided', () => {
    marker.add(element);
    marker.mark('test');
    marker.mark();

    expect(mockMark).toHaveBeenLastCalledWith('test');
  });
});
