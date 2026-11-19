import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import type { RouteItem } from '../../utils/routing.js';
import type { MarkdownAdapter } from '../../contexts/markdownAdapter.js';

import { contentType } from '../../types/common.js';
import { RedoclyApiDocsComponent } from '../../RedoclyApiDocs.js';
import { ErrorBoundary } from '../ErrorBoundary.js';
import { TelemetryContext } from '../../contexts/telemetry.js';
import { getPageUri } from '../../telemetry/page.js';
import { RedocTelemetry as RedocTelemetryClass } from '../../telemetry/RedocTelemetry.js';

import type { RedocTelemetry } from '../../telemetry/RedocTelemetry.js';

const fakeMarkdownAdapter: MarkdownAdapter = {
  parse: (s) => s,
  render: () => null as ReactNode,
};

const { useApiDocsRoutesMock } = vi.hoisted(() => ({
  useApiDocsRoutesMock: vi.fn(),
}));

vi.mock('../../hooks/useApiDocsRoutes.js', () => ({
  useApiDocsRoutes: useApiDocsRoutesMock,
}));

vi.mock('../../pages/EntryPage.js', () => ({
  // The boundary test just needs EntryPage to throw on render so the
  // boundary fallback shows; the real signature doesn't matter here.
  EntryPage: () => {
    throw new Error('entry page crashed');
  },
}));

vi.mock('@redocly/theme/core/openapi', async () => {
  const actual = (await vi.importActual('@redocly/theme/core/openapi')) as Record<string, unknown>;
  return {
    ...actual,
    GlobalStyle: () => <div data-testid="global-style" />,
  };
});

function ThrowingChild(): null {
  throw new Error('child crashed');
}

function renderWithTelemetry(sendErrorMessage: () => void): void {
  render(
    <TelemetryContext.Provider value={{ sendErrorMessage } as unknown as RedocTelemetry}>
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    </TelemetryContext.Provider>,
  );
}

function createRoute(path: string): RouteItem {
  return {
    path,
    label: 'Pets',
    content: {
      contentType: contentType.GROUP,
      children: [],
    },
  };
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div data-testid="safe-child">safe render</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('safe-child')).toHaveTextContent('safe render');
  });

  it('renders default fallback with error details when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText('Something went wrong rendering the API documentation.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Error details')).toBeInTheDocument();
    expect(screen.getByText('child crashed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('api-docs-error-page');
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">custom fallback</div>}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('custom-fallback')).toHaveTextContent('custom fallback');
  });

  it('sends the error telemetry event for the caught error', () => {
    const sendErrorMessage = vi.fn();

    renderWithTelemetry(sendErrorMessage);

    expect(sendErrorMessage).toHaveBeenCalledTimes(1);
    const [[[payload]]] = sendErrorMessage.mock.calls;
    expect(payload).toMatchObject({
      id: 'errorBoundaryCatch',
      object: 'error',
      uri: getPageUri(),
      details: { message: 'child crashed', name: 'Error', stackFrames: expect.any(Number) },
    });
    expect(payload.details.stack).toEqual(expect.stringContaining('ThrowingChild'));
  });

  it('a root boundary shows the error page and reports errorBoundaryCatch.root through its own telemetry', () => {
    const contextSend = vi.fn();
    const ownSend = vi
      .spyOn(RedocTelemetryClass.prototype, 'sendErrorMessage')
      .mockImplementation(() => undefined);
    const flush = vi.spyOn(RedocTelemetryClass.prototype, 'forceFlush').mockResolvedValue();

    render(
      <TelemetryContext.Provider
        value={{ sendErrorMessage: contextSend } as unknown as RedocTelemetry}
      >
        <ErrorBoundary scope="root" telemetryConfig={{ typeOfUsage: 'html' }}>
          <ThrowingChild />
        </ErrorBoundary>
      </TelemetryContext.Provider>,
    );

    expect(
      screen.getByText('Something went wrong rendering the API documentation.'),
    ).toBeInTheDocument();
    expect(contextSend).not.toHaveBeenCalled();
    expect(ownSend).toHaveBeenCalledTimes(1);
    expect(ownSend.mock.calls[0][0][0]).toMatchObject({
      id: 'errorBoundaryCatch.root',
      object: 'error',
      typeOfUsage: 'html',
    });
    expect(flush).toHaveBeenCalledTimes(1);
    ownSend.mockRestore();
    flush.mockRestore();
  });

  it('still shows the fallback when the telemetry send throws', () => {
    const sendErrorMessage = vi.fn(() => {
      throw new Error('telemetry exploded');
    });

    renderWithTelemetry(sendErrorMessage);

    expect(sendErrorMessage).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText('Something went wrong rendering the API documentation.'),
    ).toBeInTheDocument();
  });

  it('protects RedoclyApiDocsComponent usage from route render failures', () => {
    const pets = createRoute('/pets');
    useApiDocsRoutesMock.mockReturnValue({
      routes: [pets],
      routeIndex: {
        allRoutes: [pets],
        tagByPath: new Map(),
        itemToParentTag: new Map(),
        routeIndexByPath: new Map([['/pets', 0]]),
        rootPage: pets,
        tags: [],
      },
    });

    render(
      <MemoryRouter initialEntries={['/pets']}>
        <RedoclyApiDocsComponent items={[]} basePath="/" markdownAdapter={fakeMarkdownAdapter} />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('Something went wrong rendering the API documentation.'),
    ).toBeInTheDocument();
    expect(screen.getByText('entry page crashed')).toBeInTheDocument();
    expect(document.querySelectorAll('symbol')).toHaveLength(1);
  });
});
