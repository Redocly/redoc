import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { RedocTelemetry } from '../telemetry/RedocTelemetry.js';

vi.mock('../RedoclyApiDocsStandalone.js', () => ({
  RedoclyApiDocsStandalone: (): never => {
    throw new TypeError('layout crashed');
  },
}));

const { RedocStandalone } = await import('../RedocStandalone.js');

const definition = { openapi: '3.1.0', info: { title: 'Crash', version: '1.0.0' }, paths: {} };

describe('RedocStandalone root crash', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => {
    consoleError.mockRestore();
    vi.restoreAllMocks();
  });

  it('a crash outside every inner boundary shows the error page and reports errorBoundaryCatch.root', async () => {
    const send = vi
      .spyOn(RedocTelemetry.prototype, 'sendErrorMessage')
      .mockImplementation(() => undefined);
    vi.spyOn(RedocTelemetry.prototype, 'forceFlush').mockResolvedValue();

    render(<RedocStandalone spec={definition} />);

    expect(
      await screen.findByText('Something went wrong rendering the API documentation.'),
    ).toBeVisible();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0][0]).toMatchObject({
      id: 'errorBoundaryCatch.root',
      details: { name: 'TypeError', message: 'layout crashed' },
    });
  });
});
