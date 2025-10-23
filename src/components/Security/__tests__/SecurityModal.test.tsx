import { render, fireEvent, act } from '@testing-library/react';

import type { ExtendedOpenAPISecurityScheme, SecurityRequirement } from '../../../models';

import { SecurityModal } from '../SecurityModal';

describe('SecurityModal Component', () => {
  const securities = [
    {
      schemes: [
        {
          id: 'B',
          description: 'Test description scheme B',
          type: 'http',
          bearerFormat: 'password',
          scopes: [],
        },
        {
          id: 'C',
          description: 'Test description scheme C',
          type: 'http',
          bearerFormat: 'password',
          scopes: [],
        },
      ] as Partial<ExtendedOpenAPISecurityScheme>,
    },
    {
      schemes: [
        {
          id: 'A',
          description: 'Test description scheme A',
          type: 'apiKey',
          in: 'header',
          name: 'api_key',
          scopes: [],
        },
      ] as Partial<ExtendedOpenAPISecurityScheme>,
    },
    {
      schemes: [
        {
          id: 'D',
          description: 'Test description scheme D',
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://example.com/authorization',
              tokenUrl: 'https://example.com/token',
              scopes: {
                'read:pets': 'read your pets',
                'write:pets': 'modify pets in your account',
              },
            },
          },
          scopes: ['read:pets'],
        },
      ] as Partial<ExtendedOpenAPISecurityScheme>,
    },
  ] as SecurityRequirement[];

  it('renders the SecurityModal with the correct number of SegmentedItems', () => {
    const { getByText } = render(
      <SecurityModal securities={securities as SecurityRequirement[]} onClose={() => {}} />,
    );
    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B and C')).toBeInTheDocument();
  });

  it('renders the SecurityModal with the correct number of SecurityFlows and Dividers', () => {
    const { getByText, getAllByText } = render(
      <SecurityModal securities={securities} onClose={() => {}} />,
    );
    expect(getByText('Test description scheme B')).toBeInTheDocument();
    expect(getByText('Test description scheme C')).toBeInTheDocument();
    expect(getByText('and')).toBeInTheDocument();
    expect(getAllByText('HTTP Authorization Scheme').length).toEqual(2);
    expect(getAllByText('http').length).toEqual(2);
  });

  it('should update active security scheme on click and display relevant information', async () => {
    const { getByText } = render(<SecurityModal securities={securities} onClose={() => {}} />);
    fireEvent.click(getByText('A'));

    await act(async () => {});
    expect(getByText('Test description scheme A')).toBeInTheDocument();
    expect(getByText('Header parameter name:')).toBeInTheDocument();
    expect(getByText('api_key')).toBeInTheDocument();
  });

  it('should display details for OAuth2 scheme D including initial optional scopes toggle', async () => {
    const { getByText, getAllByText } = render(
      <SecurityModal securities={securities} onClose={() => {}} />,
    );
    fireEvent.click(getByText('D'));

    await act(async () => {});

    expect(getByText('Test description scheme D')).toBeInTheDocument();

    expect(getByText('Required scopes')).toBeInTheDocument();
    expect(getByText('Show optional scopes')).toBeInTheDocument();

    const readPetsScopes = getAllByText('read:pets');
    expect(readPetsScopes.length).toBe(1);

    const writePetsScopes = getAllByText('write:pets');
    expect(writePetsScopes.length).toBe(1);
  });

  it('should toggle optional scopes visibility for OAuth2 scheme D', async () => {
    const { getByText, queryByText } = render(
      <SecurityModal securities={securities} onClose={() => {}} />,
    );
    fireEvent.click(getByText('D'));
    await act(async () => {});

    fireEvent.click(getByText('Show optional scopes'));
    await act(async () => {});

    expect(getByText('Hide optional scopes')).toBeInTheDocument();
    expect(queryByText('Show optional scopes')).toBeNull();
  });

  it('calls onClose callback when the Close button is clicked', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(<SecurityModal securities={securities} onClose={onCloseMock} />);

    fireEvent.click(getByTestId('close'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should display required scopes from scopes array if there are no flows', () => {
    const securities = [
      {
        schemes: [
          {
            id: 'D',
            description: 'Test description scheme D',
            type: 'oauth2',
            flows: {},
            scopes: ['read:pets'],
          },
        ],
      },
    ] as SecurityRequirement[];

    const { getByText } = render(<SecurityModal securities={securities} onClose={() => {}} />);
    expect(getByText('read:pets')).toBeInTheDocument();
  });

  it('should exlcude required scopes from optional scopes', async () => {
    const { getByText, getAllByText } = render(
      <SecurityModal securities={securities} onClose={() => {}} />,
    );
    fireEvent.click(getByText('D'));

    await act(async () => {});

    fireEvent.click(getByText('Show optional scopes'));
    await act(async () => {});

    expect(getAllByText('read:pets').length).toBe(1);
    expect(getAllByText('write:pets').length).toBe(1);
  });
});
