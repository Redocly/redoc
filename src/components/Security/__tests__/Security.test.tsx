import { act, fireEvent, render } from '@testing-library/react';
// import { act } from 'react-dom/test-utils'; // For async act

import type { SecurityRequirement } from '../../../models/index.js';

import { Security } from '../Security.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(() => ({ options: { hideSecuritySection: false } })),
}));
vi.mock('../SecurityModal', async () => ({
  SecurityModal: vi.fn(() => <div>Mocked SecurityModal</div>),
}));

describe('Security Component', () => {
  it('should not renders SecurityButton initially when securities is empty', () => {
    const { queryByText } = render(<Security securities={[]} />);
    expect(queryByText('Security')).not.toBeInTheDocument();
  });

  it('renders SecurityModal when SecurityButton is clicked', async () => {
    const securities = [
      {
        schemes: [
          {
            description:
              'For this sample, you can use the api key `special-key` to test the authorization filters.\n',
            type: 'apiKey',
            name: 'api_key',
            in: 'header',
            id: 'api_key',
            sectionId: 'api_key',
            scopes: ['write:pets', 'read:pets'],
          },
        ],
      },
    ] as SecurityRequirement[];

    const { getByRole, getByText } = render(<Security securities={securities} />);

    fireEvent.click(getByRole('button', { name: 'View details' }));

    await act(async () => {});

    expect(getByText('Mocked SecurityModal')).toBeInTheDocument();
  });
});
