import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';

import { breakpoints } from '@redocly/theme/core/openapi';

import { useIsMobile } from '../../hooks/useIsMobile';
import { isSidebarOpenedAtom } from '../../jotai/app.js';
import { AnimatedChevronButton } from './AnimatedChevronButton.js';
import { styled } from '../../styled-components.js';
import { useLocation } from '../../hooks/useLocation.js';

export const FloatingButton = () => {
  const [isSidebarOpened, setIsSidebarOpened] = useAtom(isSidebarOpenedAtom);
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isSidebarOpened && isMobile) {
      setIsSidebarOpened(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMobile]);

  const toggleNavMenu = useCallback(() => {
    setIsSidebarOpened(!isSidebarOpened);
  }, [isSidebarOpened, setIsSidebarOpened]);

  return (
    <FloatingButtonWrapper onClick={toggleNavMenu} data-testid="floating-button">
      <AnimatedChevronButton open={Boolean(isSidebarOpened)} />
    </FloatingButtonWrapper>
  );
};

const FloatingButtonWrapper = styled.div`
  outline: none;
  user-select: none;
  background-color: var(--sidebar-bg-color);
  color: var(--color-primary-base);
  display: none;
  cursor: pointer;
  position: fixed;
  right: 20px;
  z-index: 100;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  @media screen and (max-width: ${breakpoints.small}) {
    display: flex;
  }

  bottom: 44px;

  width: 60px;
  height: 60px;
  padding: 0 20px;
  svg {
    color: var(--color-primary-base);
  }

  @media print {
    display: none;
  }
`;
