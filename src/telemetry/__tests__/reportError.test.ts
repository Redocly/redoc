import { afterEach, describe, expect, it, vi } from 'vitest';

import { collectReportedErrors, reportError, setErrorSender } from '../reportError.js';

describe('reportError', () => {
  afterEach(() => {
    setErrorSender(undefined);
    vi.restoreAllMocks();
  });

  it('logs, then sends what was reported before the sender mounted and what comes after', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const before = reportError(
      'buildItem',
      new TypeError('n is not iterable'),
      'Could not build "A"',
    );
    expect(before.message).toBe('n is not iterable');
    expect(consoleError).toHaveBeenCalledWith('[api-docs] %s:', 'Could not build "A"', before);

    const send = vi.fn();
    setErrorSender(send);
    expect(send).toHaveBeenCalledWith({ id: 'buildItem', error: before });

    const after = reportError('allOfMerge', 'boom');
    expect(after).toBeInstanceOf(Error);
    expect(send).toHaveBeenLastCalledWith({ id: 'allOfMerge', error: after });
  });

  it('unmounting a sender leaves a newer one mounted', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const first = vi.fn();
    const second = vi.fn();
    const unmountFirst = setErrorSender(first);
    setErrorSender(second);
    unmountFirst();
    reportError('allOfMerge', new Error('x'));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('unmounting the newest sender hands reports back to the older one', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const first = vi.fn();
    const second = vi.fn();
    setErrorSender(first);
    const unmountSecond = setErrorSender(second);
    unmountSecond();
    reportError('allOfMerge', new Error('x'));
    expect(second).not.toHaveBeenCalled();
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('collects into the open batch instead of sending', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const send = vi.fn();
    setErrorSender(send);
    const stop = collectReportedErrors();
    const error = reportError('buildDocument', new Error('x'));
    expect(stop()).toEqual([{ id: 'buildDocument', error }]);
    expect(send).not.toHaveBeenCalled();

    reportError('buildDocument', new Error('y'));
    expect(send).toHaveBeenCalledTimes(1);
  });
});
