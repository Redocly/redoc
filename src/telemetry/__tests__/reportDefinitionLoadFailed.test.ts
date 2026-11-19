import { afterEach, describe, expect, it, vi } from 'vitest';

import { DefinitionLoadError } from '../../utils/definitionLoadError.js';
import { RedocTelemetry } from '../RedocTelemetry.js';
import { reportDefinitionLoadFailed } from '../reportDefinitionLoadFailed.js';

function sentItem(error: unknown, specUrl?: string) {
  const send = vi
    .spyOn(RedocTelemetry.prototype, 'sendDefinitionLoadFailedMessage')
    .mockImplementation(() => undefined);
  vi.spyOn(RedocTelemetry.prototype, 'forceFlush').mockResolvedValue();

  reportDefinitionLoadFailed(error, { source: 'url', durationMs: 12, specUrl });

  expect(send).toHaveBeenCalledTimes(1);
  return send.mock.calls[0][0][0];
}

describe('reportDefinitionLoadFailed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends the stage, the HTTP status and the sanitized message', () => {
    const error = new DefinitionLoadError(
      'parse',
      'bad indentation of a mapping entry in "https://docs.example.com/openapi.yaml" (4:11)',
      200,
    );

    expect(sentItem(error)).toMatchObject({
      stage: 'parse',
      httpStatus: 200,
      message: 'bad indentation of a mapping entry in <text>',
    });
  });

  it.each(['openapi.yaml', 'docs/openapi.yaml', '/openapi.yaml'])(
    'removes the relative spec URL %s from the message',
    (specUrl) => {
      const error = new DefinitionLoadError(
        'unsupported',
        `${specUrl} returned an HTML page instead of an API description. Check that your server serves the file at this URL.`,
      );

      const { message } = sentItem(error, specUrl);

      expect(message).not.toContain('openapi.yaml');
      expect(message).toMatch(/^<path> returned an HTML page/);
    },
  );

  it('reports an error that is not a DefinitionLoadError as stage bundle', () => {
    expect(sentItem(new TypeError('boom'))).toMatchObject({ stage: 'bundle', message: 'boom' });
  });
});
