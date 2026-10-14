import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { OverviewPanelItem } from '../OverviewPanelItem.js';
import { panelKind } from '../../../types/common.js';

vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@redocly/theme/components/Buttons/CopyButton', () => ({ CopyButton: () => null }));
vi.mock('@redocly/theme/components/Buttons/NewTabButton', () => ({ NewTabButton: () => null }));
vi.mock('@redocly/theme/components/Buttons/EmailButton', () => ({ EmailButton: () => null }));
vi.mock('@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon', () => ({ CheckmarkIcon: () => null }));

afterEach(() => {
  cleanup();
});

it('should return null when no renderable items are provided', () => {
  const { container, rerender } = render(<OverviewPanelItem node={{ children: [] } as never} />);
  expect(container.firstChild).toBeNull();

  rerender(
    <OverviewPanelItem
      node={{ children: [{ kind: panelKind.DOWNLOAD, label: 'spec', url: '/spec.yaml' }] } as never}
    />,
  );
  expect(container.firstChild).toBeNull();
});

it('should render website as a link', () => {
  render(
    <OverviewPanelItem
      node={
        {
          children: [
            {
              kind: panelKind.EXTERNAL_LINK,
              label: 'https://example.com',
              url: 'https://example.com',
            },
          ],
        } as never
      }
    />,
  );
  expect(screen.getByRole('link', { name: 'https://example.com' })).toHaveAttribute(
    'href',
    'https://example.com',
  );
});

it('should render contact email as a mailto link and use name as label when provided', () => {
  const { rerender } = render(
    <OverviewPanelItem
      node={
        {
          children: [{ kind: panelKind.EMAIL, label: 'api@example.com', email: 'api@example.com' }],
        } as never
      }
    />,
  );
  expect(screen.getByRole('link', { name: 'api@example.com' })).toHaveAttribute(
    'href',
    'mailto:api@example.com',
  );

  rerender(
    <OverviewPanelItem
      node={
        {
          children: [{ kind: panelKind.EMAIL, label: 'Support Team', email: 'api@example.com' }],
        } as never
      }
    />,
  );
  expect(screen.getByText('Support Team')).toBeInTheDocument();
});

it('should render license as identifier link, plain identifier, or name link depending on available fields', () => {
  const { rerender } = render(
    <OverviewPanelItem
      node={
        {
          children: [
            {
              kind: panelKind.EXTERNAL_LINK,
              title: 'License',
              label: 'MIT',
              url: 'https://spdx.org/licenses/MIT',
            },
          ],
        } as never
      }
    />,
  );
  expect(screen.getByRole('link', { name: 'MIT' })).toHaveAttribute(
    'href',
    'https://spdx.org/licenses/MIT',
  );

  rerender(
    <OverviewPanelItem
      node={
        {
          children: [{ kind: panelKind.ATTRIBUTE, title: 'License', label: 'MIT', value: 'MIT' }],
        } as never
      }
    />,
  );
  expect(screen.getByText('MIT')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'MIT' })).not.toBeInTheDocument();

  rerender(
    <OverviewPanelItem
      node={
        {
          children: [
            {
              kind: panelKind.EXTERNAL_LINK,
              title: 'License',
              label: 'MIT License',
              url: 'https://spdx.org/licenses/MIT',
            },
          ],
        } as never
      }
    />,
  );
  expect(screen.getByRole('link', { name: 'MIT License' })).toHaveAttribute(
    'href',
    'https://spdx.org/licenses/MIT',
  );
});

it('should render terms of service as a link', () => {
  render(
    <OverviewPanelItem
      node={
        {
          children: [
            {
              kind: panelKind.EXTERNAL_LINK,
              label: 'Terms of Service',
              url: 'https://example.com/terms',
            },
          ],
        } as never
      }
    />,
  );
  expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute(
    'href',
    'https://example.com/terms',
  );
});
