import { fireEvent, render, screen } from '@testing-library/react';
import { useAtom } from 'jotai';
import { MemoryRouter } from 'react-router-dom';

import * as useIsMobile from '../../../hooks/useIsMobile';
import { FloatingButton } from '../FloatingButton.js';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}));

jest.mock('../../../hooks/useIsMobile');

const useAtomMock = useAtom as jest.Mock;
const useIsMobileMock = jest.spyOn(useIsMobile, 'useIsMobile');

describe('FloatingButton', () => {
  const setIsSidebarOpened = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button', () => {
    useAtomMock.mockReturnValue([false, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(false);

    render(
      <MemoryRouter>
        <FloatingButton />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('floating-button')).toBeInTheDocument();
  });

  it('should toggle sidebar on click', () => {
    useAtomMock.mockReturnValue([false, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(false);

    render(
      <MemoryRouter>
        <FloatingButton />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('floating-button'));
    expect(setIsSidebarOpened).toHaveBeenCalledWith(true);
  });

  it('should close sidebar on navigation when is mobile', () => {
    useAtomMock.mockReturnValue([true, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(true);

    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingButton />
      </MemoryRouter>,
    );

    expect(setIsSidebarOpened).toHaveBeenCalledWith(false);

    rerender(
      <MemoryRouter initialEntries={['/new-path']}>
        <FloatingButton />
      </MemoryRouter>,
    );

    expect(setIsSidebarOpened).toHaveBeenCalledWith(false);
  });

  it('should not close sidebar on navigation when is not mobile', () => {
    useAtomMock.mockReturnValue([true, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(false);

    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <FloatingButton />
      </MemoryRouter>,
    );

    rerender(
      <MemoryRouter initialEntries={['/new-path']}>
        <FloatingButton />
      </MemoryRouter>,
    );

    expect(setIsSidebarOpened).not.toHaveBeenCalled();
  });
});
