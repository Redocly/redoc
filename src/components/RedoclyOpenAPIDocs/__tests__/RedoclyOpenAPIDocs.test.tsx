import type { Mock } from 'vitest';
import { parseYaml } from '@redocly/openapi-core';
import { readFileSync } from 'fs';
import { render, waitFor } from '@testing-library/react';
import { useSetAtom } from 'jotai';

import type { ReactNode, ComponentType } from 'react';
import type { RedocConfig } from '@redocly/config';
import type { OpenAPIDefinition } from '../../../types/index.js';
import { useTelemetry } from '../../../hooks/index.js';

vi.mock('../../../hooks/useTelemetry');

vi.mock('@redocly/theme/core/openapi', async () => {
  const actual = await vi.importActual('@redocly/theme/core/openapi');
  return {
    ...actual,
    getOperationColor: vi.fn(() => '#007bff'),
    SearchSessionProvider: ({ children }: { children: ReactNode }) => {
      const mockContextValue = {
        searchSessionId: 'test-session-id',
        refreshSearchSessionId: vi.fn(),
      };
      const Provider = (actual as { SearchSessionContext: { Provider: ComponentType<any> } })
        .SearchSessionContext.Provider;
      return <Provider value={mockContextValue}>{children}</Provider>;
    },
  };
});

vi.mock('jotai', async () => {
  const originalJotai = await vi.importActual('jotai');
  return {
    ...(originalJotai as Record<string, unknown>),
    useSetAtom: vi.fn(),
  };
});

import { RedoclyOpenAPIDocs } from '../RedoclyOpenAPIDocs.js';

const contents = readFileSync('./playground/openapi/petstore.yaml', 'utf8');
const definition = parseYaml(contents) as OpenAPIDefinition;

describe('RedoclyOpenAPIDocs', () => {
  const options = {} as RedocConfig;
  const store = { definition, options };
  window.scrollTo = vi.fn();

  const mockTelemetrySend = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useTelemetry as Mock).mockImplementation(() => ({
      sendViewedMessage: mockTelemetrySend,
    }));
    (useSetAtom as Mock).mockReturnValue(vi.fn());
  });

  describe('onLoaded callback', () => {
    it('should call callback on mount', async () => {
      const onLoaded = vi.fn();
      render(<RedoclyOpenAPIDocs store={store} onLoaded={onLoaded} />);

      await waitFor(() => {
        expect(onLoaded).toHaveBeenCalledTimes(1);
      });
    });
  });
});
