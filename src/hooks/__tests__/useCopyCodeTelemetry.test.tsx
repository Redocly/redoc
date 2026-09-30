import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import type { ReactNode } from 'react';

import { TelemetryContext } from '../../contexts/telemetry.js';
import { useCopyCodeTelemetry } from '../useCopyCodeTelemetry.js';

type MockTelemetry = {
  sendCopyCodeSnippetClickedMessage: ReturnType<typeof vi.fn>;
};

function makeMockTelemetry(): MockTelemetry {
  return { sendCopyCodeSnippetClickedMessage: vi.fn() };
}

function wrapWith(telemetry: MockTelemetry) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <TelemetryContext.Provider value={telemetry as never}>{children}</TelemetryContext.Provider>
    );
  };
}

describe('useCopyCodeTelemetry', () => {
  let telemetry: MockTelemetry;

  beforeEach(() => {
    telemetry = makeMockTelemetry();
  });

  it('produces a handler that fires sendCopyCodeSnippetClickedMessage with snippetType + language', () => {
    const { result } = renderHook(() => useCopyCodeTelemetry('request'), {
      wrapper: wrapWith(telemetry),
    });

    result.current('xml')();

    expect(telemetry.sendCopyCodeSnippetClickedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendCopyCodeSnippetClickedMessage).toHaveBeenCalledWith([
      {
        id: 'copyCodeSnippetButton',
        object: 'button',
        uri: 'urn:redocly:redoc:ui:button:copyCodeSnippetButton',
        snippetType: 'request',
        language: 'xml',
      },
    ]);
  });

  it('reports a spec-authored x-codeSamples lang as other', () => {
    const { result } = renderHook(() => useCopyCodeTelemetry('request'), {
      wrapper: wrapWith(telemetry),
    });

    result.current('Acme Payments SDK')();

    expect(telemetry.sendCopyCodeSnippetClickedMessage.mock.calls[0][0][0]).toMatchObject({
      language: 'other',
    });
  });

  it('omits language key when not provided', () => {
    const { result } = renderHook(() => useCopyCodeTelemetry('response'), {
      wrapper: wrapWith(telemetry),
    });

    result.current()();

    expect(telemetry.sendCopyCodeSnippetClickedMessage).toHaveBeenCalledWith([
      {
        id: 'copyCodeSnippetButton',
        object: 'button',
        uri: 'urn:redocly:redoc:ui:button:copyCodeSnippetButton',
        snippetType: 'response',
      },
    ]);
  });

  it('produces different handlers per language but reuses one telemetry instance', () => {
    const { result } = renderHook(() => useCopyCodeTelemetry('response'), {
      wrapper: wrapWith(telemetry),
    });

    result.current('xml')();
    result.current('json')();
    result.current()();

    expect(telemetry.sendCopyCodeSnippetClickedMessage).toHaveBeenCalledTimes(3);
    expect(telemetry.sendCopyCodeSnippetClickedMessage.mock.calls[0][0][0]).toMatchObject({
      snippetType: 'response',
      language: 'xml',
    });
    expect(telemetry.sendCopyCodeSnippetClickedMessage.mock.calls[1][0][0]).toMatchObject({
      snippetType: 'response',
      language: 'json',
    });
    expect(telemetry.sendCopyCodeSnippetClickedMessage.mock.calls[2][0][0]).not.toHaveProperty(
      'language',
    );
  });

  it('memoizes the factory while snippetType is stable', () => {
    const { result, rerender } = renderHook(
      ({ type }: { type: 'request' | 'response' }) => useCopyCodeTelemetry(type),
      {
        wrapper: wrapWith(telemetry),
        initialProps: { type: 'request' as const },
      },
    );

    const first = result.current;
    rerender({ type: 'request' });
    expect(result.current).toBe(first);

    rerender({ type: 'response' });
    expect(result.current).not.toBe(first);
  });
});
