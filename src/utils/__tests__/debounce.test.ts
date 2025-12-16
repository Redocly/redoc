import { debounce } from '../debounce.js';

vi.useFakeTimers();

describe('debounce', () => {
  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Call the debounced function multiple times within the threshold
    debouncedFn('a');
    debouncedFn('b');
    debouncedFn('c');

    // Advance time by 99ms
    vi.advanceTimersByTime(99);

    // The function should not have been called yet
    expect(fn).not.toHaveBeenCalled();

    // Call the function again
    debouncedFn('d');

    // Advance time by another 99ms
    vi.advanceTimersByTime(99);

    // The function should still not have been called yet
    expect(fn).not.toHaveBeenCalled();

    // Advance time by the remaining 1ms
    vi.advanceTimersByTime(1);

    // The function should have been called once with the last value passed to it
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('d');
  });

  it('should call the function immediately when the `leading` option is `true`', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100, true);

    // Call the debounced function multiple times within the threshold
    debouncedFn('a');
    debouncedFn('b');
    debouncedFn('c');

    // The function should have been called immediately with the first value passed to it
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    // Advance time by 99ms
    vi.advanceTimersByTime(99);

    // The function should not have been called again yet
    expect(fn).toHaveBeenCalledTimes(1);

    // Call the function again
    debouncedFn('d');

    // Advance time by another 99ms
    vi.advanceTimersByTime(99);

    // The function should still not have been called yet
    expect(fn).toHaveBeenCalledTimes(1);

    // Advance time by the remaining 1ms
    vi.advanceTimersByTime(1);

    // The function should have been called once more with the last value passed to it
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('d');
  });
});
