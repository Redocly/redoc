import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { styled } from 'styled-components';

import { breakpoints } from '@redocly/theme/core/openapi';
import { MenuIcon } from '@redocly/theme/icons/MenuIcon/MenuIcon';
import { CloseIcon } from '@redocly/theme/icons/CloseIcon/CloseIcon';

import { isSidebarOpenedAtom } from '../../jotai/app.js';

export const FloatingButton = (): React.JSX.Element => {
  const [isSidebarOpened, setIsSidebarOpened] = useAtom(isSidebarOpenedAtom);

  const toggleNavMenu = useCallback(() => {
    setIsSidebarOpened(!isSidebarOpened);
  }, [isSidebarOpened, setIsSidebarOpened]);

  return (
    <FloatingButtonWrapper
      type="button"
      onClick={toggleNavMenu}
      aria-label={isSidebarOpened ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isSidebarOpened}
      data-testid="floating-button"
    >
      {isSidebarOpened ? <CloseIcon size="24px" /> : <MenuIcon size="24px" />}
    </FloatingButtonWrapper>
  );
};

const FloatingButtonWrapper = styled.button`
  border: none;
  outline: none;
  user-select: none;
  background-color: var(--sidebar-bg-color, #fff);
  color: var(--color-primary-base, var(--color-blueberry-6));
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: fixed;
  right: 20px;
  bottom: 44px;
  z-index: 100;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  width: 60px;
  height: 60px;
  padding: 0;

  svg path {
    fill: var(--color-primary-base, var(--color-blueberry-6));
  }

  @media screen and (max-width: ${breakpoints.small}) {
    display: flex;
  }

  @media print {
    display: none;
  }
`;
