import { render, screen } from '@testing-library/react';
import * as Jotai from 'jotai';
import { vi } from 'vitest';

import { ServerList } from '../ServerList.js';
import { normalizeOptions } from '../../../services/index.js';

import type { OpenAPIServer } from '../../../types/index.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('ServerList component', () => {
  vi.spyOn(Jotai, 'useAtomValue').mockReturnValue(normalizeOptions({}));
  const servers = [
    {
      url: 'http://petstore.swagger.io/v2',
      description: 'Default server',
      name: 'Default',
    },
    {
      url: 'http://petstore.swagger.io/sandbox',
      description: 'Sandbox server',
    },
    {
      url: 'http://petstore.swagger.io/stage',
      name: 'Stage server',
    },
  ];
  const translateMock = vi.fn().mockImplementation((_, defaultValue) => defaultValue);
  it('should render copy button', () => {
    render(<ServerList servers={servers} path="/pet" translate={translateMock} />);

    expect(screen.getAllByTestId('copy-button').length).toBe(3);
  });

  it('should render server description tooltip', () => {
    render(<ServerList servers={servers} path="/pet" translate={translateMock} />);

    expect(screen.getAllByTestId('server-item-description-tooltip').length).toBe(1);
  });

  it('should render server name', () => {
    render(<ServerList servers={servers} path="/pet" translate={translateMock} />);

    expect(screen.getAllByTestId('server-panel-item-name')[0]).toHaveTextContent('Default');
    expect(screen.getAllByTestId('server-panel-item-name')[1]).toHaveTextContent('Sandbox server');
    expect(screen.getAllByTestId('server-panel-item-name')[2]).toHaveTextContent('Stage server');
  });

  describe('Server variables', () => {
    const serversWithVariables: OpenAPIServer[] = [
      {
        url: 'http://petstore.swagger.io/{version}',
        description: 'Default server with variables',
        name: 'Default',
        variables: {
          version: {
            default: 'v2',
            description: 'API version',
            enum: ['v1', 'v2'],
          },
        },
      },
      {
        url: 'http://petstore.swagger.io/{sandbox}/{version}',
        description: 'Sandbox server with variables',
        variables: {
          sandbox: {
            default: 'dev',
            description: 'Sandbox name',
          },
          version: {
            default: 'v2',
            description: 'API version',
            enum: ['v1', 'v2'],
          },
        },
      },
    ];

    it('should render view nested with one variable', () => {
      render(
        <ServerList servers={[serversWithVariables[0]]} path="/pet" translate={translateMock} />,
      );

      expect(screen.getByText('Show 1 variable')).toBeInTheDocument();
    });

    it('should render view nested with multiple variables', () => {
      render(
        <ServerList servers={[serversWithVariables[1]]} path="/pet" translate={translateMock} />,
      );

      expect(screen.getByText('Show 2 variables')).toBeInTheDocument();
    });
  });
});
