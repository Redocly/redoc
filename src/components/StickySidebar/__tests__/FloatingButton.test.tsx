import { fireEvent, render, screen } from '@testing-library/react';
import { useAtom } from 'jotai';
import { vi } from 'vitest';

import type { Mock } from 'vitest';

import * as useIsMobile from '../../../hooks/useIsMobile';
import { FloatingButton } from '../FloatingButton.js';
import { TestMemoryRouter } from '../../../testProviders.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtom: vi.fn(),
}));

vi.mock('../../../hooks/useIsMobile');

const useAtomMock = useAtom as Mock;
const useIsMobileMock = vi.spyOn(useIsMobile, 'useIsMobile');

describe('FloatingButton', () => {
  const setIsSidebarOpened = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render button', () => {
    useAtomMock.mockReturnValue([false, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(false);

    render(
      <TestMemoryRouter>
        <FloatingButton />
      </TestMemoryRouter>,
    );
    expect(screen.getByTestId('floating-button')).toBeInTheDocument();
  });

  it('should toggle sidebar on click', () => {
    useAtomMock.mockReturnValue([false, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(false);

    render(
      <TestMemoryRouter>
        <FloatingButton />
      </TestMemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('floating-button'));
    expect(setIsSidebarOpened).toHaveBeenCalledWith(true);
  });

  it('should close sidebar on navigation when is mobile', () => {
    useAtomMock.mockReturnValue([true, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(true);

    const { rerender } = render(
      <TestMemoryRouter initialEntries={['/']}>
        <FloatingButton />
      </TestMemoryRouter>,
    );

    expect(setIsSidebarOpened).toHaveBeenCalledWith(false);

    rerender(
      <TestMemoryRouter initialEntries={['/new-path']}>
        <FloatingButton />
      </TestMemoryRouter>,
    );

    expect(setIsSidebarOpened).toHaveBeenCalledWith(false);
  });

  it('should not close sidebar on navigation when is not mobile', () => {
    useAtomMock.mockReturnValue([true, setIsSidebarOpened]);
    useIsMobileMock.mockReturnValue(false);

    const { rerender } = render(
      <TestMemoryRouter initialEntries={['/']}>
        <FloatingButton />
      </TestMemoryRouter>,
    );

    rerender(
      <TestMemoryRouter initialEntries={['/new-path']}>
        <FloatingButton />
      </TestMemoryRouter>,
    );

    expect(setIsSidebarOpened).not.toHaveBeenCalled();
  });
});
