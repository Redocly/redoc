import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../adapters/build.js', () => ({
  buildItems: vi.fn(() => new Promise<never>(() => {})),
  buildNavItems: vi.fn(),
}));

vi.mock('../utils/loadAndBundleSpec.js', () => ({
  loadAndBundleDefinition: vi.fn(async (doc: unknown) => doc),
}));

const { RedocStandalone } = await import('../RedocStandalone.js');

const definition = { openapi: '3.1.0', info: { title: 'Probe', version: '1.0.0' }, paths: {} };

describe('RedocStandalone loading state', () => {
  it('shows the indicator while the definition resolves', async () => {
    render(<RedocStandalone spec={definition} />);

    expect(await screen.findByText('Loading...')).toBeVisible();
  });

  it('hideLoading suppresses it', async () => {
    render(<RedocStandalone spec={definition} options={{ hideLoading: true }} />);

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());
  });

  it('accepts the string form an html attribute produces', async () => {
    render(
      <RedocStandalone
        spec={definition}
        options={{ hideLoading: 'true' } as unknown as { hideLoading: boolean }}
      />,
    );

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());
  });

  it('children win over the indicator', async () => {
    render(
      <RedocStandalone spec={definition}>
        <p>custom placeholder</p>
      </RedocStandalone>,
    );

    expect(await screen.findByText('custom placeholder')).toBeVisible();
    expect(screen.queryByText('Loading...')).toBeNull();
  });
});
