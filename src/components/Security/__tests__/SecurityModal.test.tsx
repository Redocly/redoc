import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { SecurityRequirements } from '../types.js';

import { SecurityModal } from '../SecurityModal.js';

vi.mock('../SecurityFlowDetail.js', () => ({
  SecurityFlowDetail: ({ scheme }: { scheme: { name: string } }) => <p>{scheme.name}</p>,
}));

const requirements: SecurityRequirements = [
  { schemes: [{ name: 'bearerToken', type: 'http' }] },
  {
    schemes: [
      { name: 'apiKeyHeader', type: 'httpApiKey' },
      { name: 'basicAuth', type: 'http' },
    ],
  },
];

afterEach(() => {
  cleanup();
});

describe('SecurityModal', () => {
  it('shows one tab per alternative and joins the schemes of a requirement with "and"', () => {
    render(<SecurityModal requirements={requirements} onClose={vi.fn()} />);

    expect(screen.getByText('bearerToken', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByText('and')).toBeNull();

    fireEvent.click(screen.getByText('apiKeyHeader and basicAuth'));

    expect(screen.getByText('apiKeyHeader', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('basicAuth', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('and')).toBeInTheDocument();
    expect(screen.queryByText('bearerToken', { selector: 'p' })).toBeNull();
  });

  it('tells apart alternatives that name the same scheme by their scopes', () => {
    render(
      <SecurityModal
        requirements={[
          { schemes: [{ name: 'oauth', type: 'oauth2', scopes: ['read'] }] },
          { schemes: [{ name: 'oauth', type: 'oauth2', scopes: ['write'] }] },
        ]}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('oauth (read)')).toBeInTheDocument();
    expect(screen.getByText('oauth (write)')).toBeInTheDocument();
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<SecurityModal requirements={requirements} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
