import { render, screen } from '@testing-library/react';
import * as Jotai from 'jotai';
import { describe, it, expect, jest } from '@jest/globals';

import { ServerList } from '../ServerList';
import { normalizeOptions } from '../../../services';

import type { OpenAPIServer } from '../../../types';

jest.mock('jotai', () => ({
  ...(jest.requireActual('jotai') as object),
  useAtomValue: jest.fn(),
}));

describe('ServerList component', () => {
  jest.spyOn(Jotai, 'useAtomValue').mockReturnValue(normalizeOptions({}));
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
  const translateMock = jest.fn().mockImplementation((_, defaultValue) => defaultValue);
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
