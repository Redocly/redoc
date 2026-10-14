import {
  memo,
  useCallback,
  useEffect,
  type MouseEvent,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { styled, css } from 'styled-components';
import { useAtom } from 'jotai';

import { breakpoints } from '@redocly/theme/core/openapi';

import { isSidebarOpenedAtom } from '../../jotai/app.js';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';
import { SidebarActions } from './SidebarActions.js';
import { FloatingButton } from './FloatingButton.js';

type StickySidebarProps = {
  className?: string;
  collapsedSidebar?: boolean;
};

const KEEP_DRAWER_OPEN_ITEM_CLASSES = ['menu-item-type-group', 'menu-item-type-drilldown'];

function StickySidebarComponent({
  className,
  children,
  collapsedSidebar = false,
}: PropsWithChildren<StickySidebarProps>): ReactElement {
  const [isSidebarOpened, setIsSidebarOpened] = useAtom(isSidebarOpenedAtom);

  useEffect(() => {
    if (!isSidebarOpened) return;
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints.small})`);
    const closeOnDesktop = () => {
      if (mediaQuery.matches) setIsSidebarOpened(false);
    };
    closeOnDesktop();
    mediaQuery.addEventListener('change', closeOnDesktop);
    return () => mediaQuery.removeEventListener('change', closeOnDesktop);
  }, [isSidebarOpened, setIsSidebarOpened]);

  useBodyScrollLock(isSidebarOpened);

  const closeDrawerOnLeafClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!isSidebarOpened) return;
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor) return;
      const menuItem = anchor.closest('[data-component-name="Menu/MenuItem"]');
      if (
        menuItem &&
        KEEP_DRAWER_OPEN_ITEM_CLASSES.some((cls) => menuItem.classList.contains(cls))
      ) {
        return;
      }
      setIsSidebarOpened(false);
    },
    [isSidebarOpened, setIsSidebarOpened],
  );

  return (
    <>
      <SidebarWrapper
        className={className}
        $collapsedSidebar={collapsedSidebar}
        $open={isSidebarOpened}
        onClick={closeDrawerOnLeafClick}
      >
        {collapsedSidebar && !isSidebarOpened ? null : children}
        <SidebarActions />
      </SidebarWrapper>
      <FloatingButton />
    </>
  );
}

export const StickySidebar = memo<PropsWithChildren<StickySidebarProps>>(StickySidebarComponent);

const SidebarWrapper = styled.div<{ $collapsedSidebar: boolean; $open: boolean }>`
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  top: var(--navbar-stack-height, 0px);
  height: calc(100vh - var(--navbar-stack-height, 0px));
  height: calc(100dvh - var(--navbar-stack-height, 0px));
  flex-direction: column;
  background: var(--sidebar-bg-color, #fff);
  border-right: 1px solid var(--sidebar-border-color, #e0e0e0);

  [data-component-name='SidebarLogo/SidebarLogo'] {
    padding: var(--spacing-md, 16px) var(--spacing-sm, 12px);
  }

  [data-component-name='SidebarLogo/SidebarLogo'] img {
    /* Keep the logo compact inside the full-width mobile drawer. */
    max-width: min(140px, var(--sidebar-logo-max-width, 285px));
  }

  /* Mobile: full-width drawer toggled by the floating hamburger button. */
  position: fixed;
  z-index: 20;
  width: 100%;
  display: ${({ $open }) => ($open ? 'flex' : 'none')};

  @media screen and (min-width: ${breakpoints.small}) {
    position: sticky;
    z-index: auto;
    display: flex;

    [data-component-name='SidebarLogo/SidebarLogo'] img {
      max-width: var(--sidebar-logo-max-width, 285px);
    }

    ${({ $collapsedSidebar }) =>
      $collapsedSidebar
        ? css`
            width: auto;
          `
        : css`
            width: var(--sidebar-width, 260px);
          `}
  }

  @media print {
    display: none;
  }
`;
