import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';

import { TelemetryContext } from '../../../contexts/telemetry.js';
import { RequiresScopesButton } from '../RequiresScopesButton.js';

vi.mock('../../../hooks/useBodyScrollLock.js', () => ({ useBodyScrollLock: vi.fn() }));
vi.mock('../RequiresScopesModal.js', () => ({
  RequiresScopesModal: () => <div data-testid="requires-scopes-modal" />,
}));
vi.mock('@redocly/theme/components/Button/Button', () => ({
  Button: ({ children, onClick }: { children?: ReactNode; onClick?: () => void }) => (
    <button data-testid="theme-button" onClick={onClick}>
      {children}
    </button>
  ),
}));
vi.mock('@redocly/theme/icons/SecurityIcon/SecurityIcon', () => ({
  SecurityIcon: () => <span data-testid="security-icon" />,
}));

afterEach(() => {
  cleanup();
});

describe('RequiresScopesButton telemetry', () => {
  it('fires sendRequiredScopesModalOpenedMessage when the button is clicked', () => {
    const telemetry = { sendRequiredScopesModalOpenedMessage: vi.fn() };

    render(
      <TelemetryContext.Provider value={telemetry as never}>
        <RequiresScopesButton directive={{ scopes: [['read:user']] }} />
      </TelemetryContext.Provider>,
    );

    fireEvent.click(screen.getByTestId('theme-button'));

    expect(telemetry.sendRequiredScopesModalOpenedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendRequiredScopesModalOpenedMessage.mock.calls[0][0][0]).toMatchObject({
      id: 'requiredScopesButton',
      object: 'button',
    });
  });
});

describe('RequiresScopesButton rendering gate', () => {
  it('renders nothing without a directive', () => {
    const { container } = render(<RequiresScopesButton directive={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when only parent scopes are present', () => {
    const { container } = render(
      <RequiresScopesButton directive={{ scopes: [], parentScopes: [['admin']] }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the button when the directive carries own scopes', () => {
    render(<RequiresScopesButton directive={{ scopes: [['read:user']] }} />);
    expect(screen.getByTestId('theme-button')).toBeInTheDocument();
  });
});
