import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';

import { RequiresScopesModal } from '../RequiresScopesModal.js';

vi.mock('../../../hooks/useModalDismiss.js', () => ({ useModalDismiss: vi.fn() }));
vi.mock('../../../hooks/useTranslate.js', () => ({
  useSpecTranslate: () => (_key: string, fallback: string) => fallback,
}));
vi.mock('@redocly/theme/components/Button/Button', () => ({
  Button: ({
    children,
    icon,
    ...props
  }: { children?: ReactNode; icon?: ReactNode } & Record<string, unknown>) => (
    <button {...props}>{children ?? icon}</button>
  ),
}));
vi.mock('@redocly/theme/icons/CloseIcon/CloseIcon', () => ({ CloseIcon: () => <span /> }));
vi.mock('@redocly/theme/icons/SecurityIcon/SecurityIcon', () => ({ SecurityIcon: () => <span /> }));

afterEach(() => {
  cleanup();
});

describe('RequiresScopesModal', () => {
  it('portals the modal to document.body so its fixed overlay is not trapped by a transformed ancestor', () => {
    const { container } = render(
      <RequiresScopesModal scopes={[['read:user']]} onClose={vi.fn()} />,
    );

    // The modal must NOT render inside the (potentially transformed) content subtree...
    expect(container.querySelector('[data-testid="close"]')).toBeNull();
    // ...it must be portaled out to document.body instead.
    const close = screen.getByTestId('close');
    expect(close).toBeInTheDocument();
    expect(document.body.contains(close)).toBe(true);
  });
});
