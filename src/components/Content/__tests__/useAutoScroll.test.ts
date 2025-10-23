import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

import { jest, describe, beforeEach, test, expect, afterEach } from '@jest/globals';

import { useAutoScroll } from '../useAutoScroll';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

jest.mock('@redocly/theme', () => ({
  IS_BROWSER: true,
  useActiveSectionId: jest.fn(() => '/test'),
}));

describe('useAutoScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useAutoScroll as any).initialPageLoad = true;

    window.history.replaceState = jest.fn();
    window.scrollTo = jest.fn();

    document.getElementById = jest.fn() as jest.MockedFunction<typeof document.getElementById>;
    document.querySelector = jest.fn() as jest.MockedFunction<typeof document.querySelector>;

    Object.defineProperty(window, 'location', {
      value: { pathname: '', hash: '' },
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should processing without toLowerCase', () => {
    const mockLocation = {
      pathname: '/test',
      hash: '#TestHash',
      state: null,
      key: '',
      search: '',
    };
    (useLocation as jest.Mock).mockReturnValue(mockLocation);

    renderHook(() => useAutoScroll('/'));

    expect(document.getElementById).toHaveBeenCalledWith('TestHash');
  });

  test('should extract and process legacy hash patterns', () => {
    const mockLocation = {
      pathname: '/test',
      hash: '#tag/TestTag',
      state: null,
      key: '',
      search: '',
    };
    (useLocation as jest.Mock).mockReturnValue(mockLocation);

    renderHook(() => useAutoScroll('/'));

    expect(document.getElementById).toHaveBeenCalledWith('test/testtag');
  });

  test('should scroll to top when on base path without hash', () => {
    const mockLocation = {
      pathname: '/',
      hash: '',
      state: null,
      key: '',
      search: '',
    };
    (useLocation as jest.Mock).mockReturnValue(mockLocation);

    renderHook(() => useAutoScroll('/'));

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('should scroll element into view when found', () => {
    const mockElement = { scrollIntoView: jest.fn() };
    const mockLocation = {
      pathname: '/test',
      hash: '#TestHash',
      state: null,
      key: '',
      search: '',
    };
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (document.getElementById as jest.Mock).mockReturnValue(mockElement);

    renderHook(() => useAutoScroll('/'));

    expect(mockElement.scrollIntoView).toHaveBeenCalled();
  });
});
