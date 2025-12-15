import { renderHook } from '@testing-library/react';
import { useLocation } from 'react-router-dom';

import { vi, type Mock, type MockedFunction } from 'vitest';

import { useAutoScroll } from '../useAutoScroll.js';

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

vi.mock('lodash.throttle', () => ({
  default: (fn) => fn,
}));

vi.mock('@redocly/theme', async () => {
  const actual = await vi.importActual('@redocly/theme');
  return {
    ...actual,
    IS_BROWSER: true,
    useActiveSectionId: vi.fn(() => '/test'),
  };
});

describe('useAutoScroll', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    (useAutoScroll as unknown as { initialPageLoad: boolean }).initialPageLoad = true;

    window.history.replaceState = vi.fn();
    window.scrollTo = vi.fn();

    document.getElementById = vi.fn() as MockedFunction<typeof document.getElementById>;
    document.querySelector = vi.fn() as MockedFunction<typeof document.querySelector>;

    Object.defineProperty(window, 'location', {
      value: { pathname: '', hash: '' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('should processing without toLowerCase', () => {
    const mockLocation = {
      pathname: '/test',
      hash: '#TestHash',
      state: null,
      key: '',
      search: '',
    };
    (useLocation as Mock).mockReturnValue(mockLocation);

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
    (useLocation as Mock).mockReturnValue(mockLocation);

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
    (useLocation as Mock).mockReturnValue(mockLocation);

    renderHook(() => useAutoScroll('/'));

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('should scroll element into view when found', () => {
    const mockElement = { scrollIntoView: vi.fn() };
    const mockLocation = {
      pathname: '/test',
      hash: '#TestHash',
      state: null,
      key: '',
      search: '',
    };
    (useLocation as Mock).mockReturnValue(mockLocation);
    (document.getElementById as Mock).mockReturnValue(mockElement);

    renderHook(() => useAutoScroll('/'));

    expect(mockElement.scrollIntoView).toHaveBeenCalled();
  });
});
