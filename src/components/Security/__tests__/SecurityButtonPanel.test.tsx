import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { SecurityRequirements } from '../types.js';

import { TelemetryContext } from '../../../contexts/telemetry.js';
import { SecurityButtonPanel } from '../SecurityButtonPanel.js';

vi.mock('@redocly/theme/icons/SecurityIcon/SecurityIcon', () => ({
  SecurityIcon: () => <span data-testid="security-icon" />,
}));
vi.mock('@redocly/theme/icons/WarningFilledIcon/WarningFilledIcon', () => ({
  WarningFilledIcon: () => <span data-testid="warning-filled-icon" />,
}));
vi.mock('@redocly/theme/components/Tooltip/Tooltip', () => ({
  Tooltip: ({ tip, children }: { tip: string; children: React.ReactNode }) => (
    <span data-testid="tooltip" data-tip={tip}>
      {children}
    </span>
  ),
}));
vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({
    header,
    children,
  }: {
    header: (() => React.ReactNode) | React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="panel">
      <div data-testid="panel-header">{typeof header === 'function' ? header() : header}</div>
      <div data-testid="panel-body">{children}</div>
    </div>
  ),
}));
vi.mock('@redocly/theme/components/Button/Button', () => ({
  Button: ({
    children,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  } & Record<string, unknown>) => (
    <button onClick={onClick} {...(rest as React.HTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  ),
}));
vi.mock('@redocly/theme/components/Typography/Typography', () => ({
  Typography: () => null,
}));
vi.mock('../SecurityModal.js', () => ({
  SecurityModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="security-modal">
      <button data-testid="security-modal-close" onClick={onClose}>
        close
      </button>
    </div>
  ),
}));
vi.mock('../../../hooks/useBodyScrollLock.js', () => ({
  useBodyScrollLock: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

describe('SecurityButtonPanel', () => {
  it('renders a Deprecated tooltip + warning icon only next to deprecated schemes', () => {
    const requirements: SecurityRequirements = [
      {
        schemes: [
          { name: 'modernAuth', type: 'apiKey' },
          { name: 'legacyAuth', type: 'apiKey', deprecated: true },
        ],
      },
    ];
    render(<SecurityButtonPanel requirements={requirements} />);
    const tooltips = screen.getAllByTestId('tooltip');
    expect(tooltips).toHaveLength(1);
    expect(tooltips[0]).toHaveAttribute('data-tip', 'Deprecated');
    expect(screen.getAllByTestId('warning-filled-icon')).toHaveLength(1);
  });
});

describe('SecurityButtonPanel telemetry', () => {
  type MockTelemetry = {
    sendViewSecurityDetailsClickedMessage: ReturnType<typeof vi.fn>;
    sendViewSecurityDetailsClosedMessage: ReturnType<typeof vi.fn>;
  };

  function renderPanel(requirements: SecurityRequirements, telemetry: MockTelemetry) {
    return render(
      <TelemetryContext.Provider value={telemetry as never}>
        <SecurityButtonPanel requirements={requirements} />
      </TelemetryContext.Provider>,
    );
  }

  let telemetry: MockTelemetry;

  beforeEach(() => {
    telemetry = {
      sendViewSecurityDetailsClickedMessage: vi.fn(),
      sendViewSecurityDetailsClosedMessage: vi.fn(),
    };
  });

  it('fires sendViewSecurityDetailsClickedMessage with derived counts on open', () => {
    const requirements: SecurityRequirements = [
      {
        schemes: [
          { name: 'api-key', type: 'apiKey' },
          { name: 'oauth', type: 'oauth2' },
        ],
      },
      { schemes: [{ name: 'basic', type: 'http', scheme: 'basic' }] },
    ];

    renderPanel(requirements, telemetry);
    fireEvent.click(screen.getByText('View security details'));

    expect(telemetry.sendViewSecurityDetailsClickedMessage).toHaveBeenCalledTimes(1);
    const payload = telemetry.sendViewSecurityDetailsClickedMessage.mock.calls[0][0][0];
    expect(payload).toMatchObject({
      id: 'redocSecurityButton',
      object: 'button',
      uri: 'urn:redocly:redoc:ui:button:redocSecurityButton',
      schemeTypes: { apiKey: 1, oauth2: 1, httpBasic: 1 },
      schemesCount: 3,
      isCombined: true,
      alternativesCount: 2,
    });
    expect(payload).not.toHaveProperty('securityTypes');
    expect(payload).not.toHaveProperty('oauth2Flows');
  });

  it('counts OAuth2 flows and splits HTTP schemes by name', () => {
    const requirements: SecurityRequirements = [
      {
        schemes: [
          {
            name: 'oauth',
            type: 'oauth2',
            flows: { clientCredentials: { tokenUrl: 'x', scopes: {} } },
          },
          { name: 'bearer', type: 'http', scheme: 'bearer' },
          { name: 'digest', type: 'http', scheme: 'digest' },
          { name: 'odd', type: undefined },
        ],
      },
    ];

    renderPanel(requirements, telemetry);
    fireEvent.click(screen.getByText('View security details'));

    expect(telemetry.sendViewSecurityDetailsClickedMessage.mock.calls[0][0][0]).toMatchObject({
      schemeTypes: { oauth2: 1, httpBearer: 1, httpOther: 1, unknown: 1 },
      oauth2Flows: { clientCredentials: 1 },
      alternativesCount: 1,
    });
  });

  it('fires sendViewSecurityDetailsClosedMessage on modal close with timeInModalMs >= 0', () => {
    const requirements: SecurityRequirements = [{ schemes: [{ name: 'api-key', type: 'apiKey' }] }];

    renderPanel(requirements, telemetry);
    fireEvent.click(screen.getByText('View security details'));
    fireEvent.click(screen.getByTestId('security-modal-close'));

    expect(telemetry.sendViewSecurityDetailsClosedMessage).toHaveBeenCalledTimes(1);
    const payload = telemetry.sendViewSecurityDetailsClosedMessage.mock.calls[0][0][0];
    expect(payload).toMatchObject({
      id: 'redocSecurityButtonClose',
      object: 'button',
      uri: 'urn:redocly:redoc:ui:button:redocSecurityButtonClose',
      schemeTypes: { apiKey: 1 },
      schemesCount: 1,
      isCombined: false,
      alternativesCount: 1,
    });
    expect(typeof payload.timeInModalMs).toBe('number');
    expect(payload.timeInModalMs).toBeGreaterThanOrEqual(0);
  });

  it('reports schemesCount and isCombined=false for a single scheme', () => {
    const requirements: SecurityRequirements = [{ schemes: [{ name: 'api-key', type: 'apiKey' }] }];

    renderPanel(requirements, telemetry);
    fireEvent.click(screen.getByText('View security details'));

    expect(telemetry.sendViewSecurityDetailsClickedMessage.mock.calls[0][0][0]).toMatchObject({
      schemesCount: 1,
      isCombined: false,
      schemeTypes: { apiKey: 1 },
    });
  });
});
