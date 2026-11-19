import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { SecurityNode } from '../../../types/content.js';

import { nodeTypes } from '../../../types/common.js';
import { SecuritySection } from '../SecuritySection.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

afterEach(() => {
  cleanup();
});

const node = {
  nodeType: nodeTypes.SECURITY,
  requirements: [
    { schemes: [{ name: 'A', type: 'apiKey', in: 'header', paramName: 'X-Key' }] },
    {
      schemes: [
        { name: 'B', type: 'http', scheme: 'basic' },
        { name: 'C', type: 'http', scheme: 'bearer' },
      ],
    },
  ],
} as unknown as SecurityNode;

function openModal(): HTMLElement {
  render(<SecuritySection node={node} />);
  fireEvent.click(screen.getByText('View security details'));
  return screen.getByRole('dialog');
}

describe('SecuritySection', () => {
  it('lists the alternative requirements in the modal selector', () => {
    const dialog = openModal();

    const tabs = within(dialog).getAllByRole('tab');

    expect(tabs.map((tab) => tab.textContent)).toEqual(['A', 'B and C']);
  });

  it('switches the scheme detail and shows the "and" divider for a combined requirement', () => {
    const dialog = openModal();
    expect(within(dialog).queryByText('C')).not.toBeInTheDocument();

    fireEvent.click(within(dialog).getByText('B and C'));

    expect(within(dialog).getByText('C')).toBeInTheDocument();
    expect(within(dialog).getByText('and')).toBeInTheDocument();
  });

  it('shows no "and" divider for a requirement with one scheme', () => {
    const dialog = openModal();

    expect(within(dialog).queryByText('and')).not.toBeInTheDocument();
  });

  it('closes the modal from the close button', () => {
    openModal();

    fireEvent.click(screen.getByTestId('close'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal on Escape', () => {
    openModal();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders nothing without requirements', () => {
    const { container } = render(
      <SecuritySection node={{ nodeType: nodeTypes.SECURITY, requirements: [] }} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
