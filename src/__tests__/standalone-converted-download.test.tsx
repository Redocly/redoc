import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';

vi.mock('../adapters/build.js', () => ({
  buildItems: vi.fn(async () => ({ items: [], store: {} })),
}));

vi.mock('../RedoclyApiDocsStandalone.js', () => ({
  RedoclyApiDocsStandalone: () => null,
}));

vi.mock('../utils/loadAndBundleSpec.js', () => ({
  loadAndBundleDefinition: vi.fn(async () => ({
    asyncapi: '2.6.0',
    info: { title: 'Lights', version: '1.0.0' },
    channels: { lights: { subscribe: { message: { payload: { type: 'string' } } } } },
  })),
}));

const { RedocStandalone } = await import('../RedocStandalone.js');

describe('RedocStandalone converted download', () => {
  it('releases the converted download file when it unmounts', async () => {
    URL.createObjectURL ??= () => '';
    URL.revokeObjectURL ??= () => undefined;
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:converted');
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const onLoaded = vi.fn();

    const { unmount } = render(
      <RedocStandalone specUrl="/specs/lights.yaml" onLoaded={onLoaded} />,
    );
    await waitFor(() => expect(onLoaded).toHaveBeenCalledWith());
    expect(revoke).not.toHaveBeenCalled();

    unmount();

    expect(revoke).toHaveBeenCalledWith('blob:converted');
  });
});
