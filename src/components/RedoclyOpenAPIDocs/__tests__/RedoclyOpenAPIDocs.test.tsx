import { parseYaml } from '@redocly/openapi-core';
import { readFileSync } from 'fs';
import { render } from '@testing-library/react';

import type { RedocConfig } from '@redocly/config';
import type { OpenAPIDefinition } from '../../../types';

import { useTelemetry } from '../../../hooks';

jest.mock('../../../hooks/useTelemetry');

import { RedoclyOpenAPIDocs } from '../RedoclyOpenAPIDocs';

const contents = readFileSync('./playground/openapi/petstore.yaml', 'utf8');
const definition = parseYaml(contents) as OpenAPIDefinition;

describe('RedoclyOpenAPIDocs', () => {
  const options = {} as RedocConfig;
  const store = { definition, options };
  window.scrollTo = jest.fn();

  const mockTelemetrySend = jest.fn() as Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    (useTelemetry as jest.Mock).mockImplementation(() => ({
      sendTestEvent: mockTelemetrySend,
    }));
  });

  describe('onLoaded callback', () => {
    it('should call callback on mount', () => {
      const onLoaded = jest.fn();
      render(<RedoclyOpenAPIDocs store={store} onLoaded={onLoaded} />);

      expect(onLoaded).toHaveBeenCalledTimes(1);
    });
  });
});
