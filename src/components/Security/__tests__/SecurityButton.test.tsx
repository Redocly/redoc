import { fireEvent, render } from '@testing-library/react';

import type { SecurityRequirement } from '../../../models';

import { SecurityButton } from '../SecurityButton';

describe('SecurityButton Component', () => {
  const securities = [
    { schemes: [{ id: 'scheme1' }] },
    { schemes: [{ id: 'scheme2' }, { id: 'scheme3' }] },
  ] as SecurityRequirement[];

  it('should render the button with `View details` text', () => {
    const { getByRole } = render(
      <SecurityButton securities={[securities[0]] as SecurityRequirement[]} onClick={() => {}} />,
    );
    expect(getByRole('button', { name: 'View details' })).toBeInTheDocument();
  });

  it('should render the panel with correct text for a single security scheme', () => {
    const { getByTestId } = render(
      <SecurityButton securities={[securities[0]] as SecurityRequirement[]} onClick={() => {}} />,
    );
    expect(getByTestId('panel-body')).toHaveTextContent('scheme1');
  });

  it('should render the panel with correct text for multiple Authentication Types', () => {
    const schemas = [
      [{ schemes: [{ id: 'A' }] }, { schemes: [{ id: 'B' }] }], // Should render "A or B"
      [{ schemes: [{ id: 'A' }, { id: 'B' }] }], // Should render "A and B"
      [{ schemes: [{ id: 'A' }, { id: 'B' }] }, { schemes: [{ id: 'C' }, { id: 'D' }] }], // Should render "(A and B) or (C and D)"
    ] as [SecurityRequirement[], SecurityRequirement[], SecurityRequirement[]];

    const { getAllByTestId } = render(
      <>
        <SecurityButton securities={schemas[0]} onClick={() => {}} />
        <SecurityButton securities={schemas[1]} onClick={() => {}} />
        <SecurityButton securities={schemas[2]} onClick={() => {}} />
      </>,
    );

    const panelBodies = getAllByTestId('panel-body');
    expect(panelBodies[0]).toHaveTextContent('A or B');
    expect(panelBodies[1]).toHaveTextContent('A and B');
    expect(panelBodies[2]).toHaveTextContent('(A and B) or (C and D)');
  });

  it('calls the onClick callback when the button is clicked', () => {
    const onClickMock = jest.fn();
    const { getByRole } = render(<SecurityButton securities={securities} onClick={onClickMock} />);

    fireEvent.click(getByRole('button', { name: 'View details' }));

    expect(onClickMock).toHaveBeenCalled();
  });
});
