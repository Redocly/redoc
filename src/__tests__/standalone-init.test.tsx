import { createRoot } from 'react-dom/client';

import { AppStore } from '../services/AppStore';
import { destroy, init } from '../standalone';

jest.mock('react-dom/client', () => {
  const client = jest.requireActual('react-dom/client');
  return { ...client, createRoot: jest.fn(client.createRoot) };
});

describe('Standalone', () => {
  const spec = { openapi: '3.0.0', info: { title: 'Test', version: '1.0.0' }, paths: {} };

  beforeEach(() => {
    jest.mocked(createRoot).mockClear();
  });

  test('destroy should unmount what init rendered', async () => {
    const element = document.createElement('div');
    const dispose = jest.spyOn(AppStore.prototype, 'dispose');

    await new Promise<void>(loaded => init(spec, { disableSearch: true }, element, () => loaded()));
    destroy(element);

    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('init should reuse the root of the element', () => {
    const element = document.createElement('div');

    init(spec, {}, element);
    init(spec, {}, element);
    destroy(element);

    expect(createRoot).toHaveBeenCalledTimes(1);
  });
});
