import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ReactElement, ReactNode } from 'react';
import type { RedocTelemetry } from '../../telemetry/RedocTelemetry.js';

import { ErrorBoundary } from '../ErrorBoundary.js';
import { ComponentMapper } from '../Mapper.js';
import { LazySection } from '../common/LazySection.js';
import { PanelMapper } from '../panels/PanelMapper.js';
import { TelemetryContext } from '../../contexts/telemetry.js';
import { nodeTypes } from '../../types/common.js';

vi.mock('../panels/ServerItem/ServerPanelItem.js', () => ({
  ServerPanelItem: (): never => {
    throw new TypeError('varValue.enum.map is not a function');
  },
}));
vi.mock('../MarkdownItem.js', () => ({
  MarkdownItem: (): never => {
    throw new TypeError('Cannot read properties of null');
  },
}));

function ThrowingChild(): never {
  throw new TypeError('n is not iterable');
}

function withTelemetry(sendErrorMessage: () => void, children: ReactNode): ReactElement {
  return (
    <TelemetryContext.Provider value={{ sendErrorMessage } as unknown as RedocTelemetry}>
      {children}
    </TelemetryContext.Provider>
  );
}

describe('ErrorBoundary scopes', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleError.mockRestore();
  });

  it('a crashing section renders nothing and the next section still renders', () => {
    const sendErrorMessage = vi.fn();
    render(
      withTelemetry(
        sendErrorMessage,
        <>
          <LazySection sectionId="broken" eager>
            <ThrowingChild />
          </LazySection>
          <LazySection sectionId="fine" eager>
            <p>Fine section</p>
          </LazySection>
        </>,
      ),
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Fine section')).toBeInTheDocument();
    expect(screen.queryByText(/Something went wrong rendering/)).not.toBeInTheDocument();
    expect(sendErrorMessage).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'errorBoundaryCatch.section' }),
    ]);
  });

  it('a crashing right-panel item renders nothing and its sibling still renders', () => {
    const sendErrorMessage = vi.fn();
    render(
      withTelemetry(
        sendErrorMessage,
        <>
          <PanelMapper node={{ nodeType: 'panel', children: [{ kind: 'servers' }] } as never} />
          <p>Sibling</p>
        </>,
      ),
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Sibling')).toBeInTheDocument();
    expect(sendErrorMessage).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'errorBoundaryCatch.node' }),
    ]);
  });

  it('a crashing content node renders nothing and its sibling node still renders', () => {
    const sendErrorMessage = vi.fn();
    render(
      withTelemetry(
        sendErrorMessage,
        <>
          <ComponentMapper type={nodeTypes.MARKDOC} node={{ nodeType: 'markdoc' } as never} />
          <p>Sibling</p>
        </>,
      ),
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Sibling')).toBeInTheDocument();
    expect(sendErrorMessage).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'errorBoundaryCatch.node' }),
    ]);
  });

  it('a crashing sidebar renders nothing', () => {
    const { container } = render(
      withTelemetry(
        vi.fn(),
        <ErrorBoundary scope="sidebar">
          <ThrowingChild />
        </ErrorBoundary>,
      ),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('the page boundary keeps its id', () => {
    const sendErrorMessage = vi.fn();
    render(
      withTelemetry(
        sendErrorMessage,
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>,
      ),
    );

    expect(sendErrorMessage).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'errorBoundaryCatch' }),
    ]);
  });
});
