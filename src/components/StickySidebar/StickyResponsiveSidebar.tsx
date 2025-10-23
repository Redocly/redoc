import { memo, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';

import type { PropsWithChildren, ReactElement } from 'react';
import type { Options } from '../../services';

import { useMount, breakpoints } from '@redocly/theme/core/openapi';

import { isSidebarOpenedAtom } from '../../jotai/app.js';
import { SidebarActions } from './SidebarActions.js';
import { styled } from '../../styled-components.js';
import { FloatingButton } from './FloatingButton.js';
import { useLocation } from '../../hooks/useLocation.js';

interface StickySidebarProps {
  className?: string;
  scrollYOffset: Options['scrollYOffset']; // passed directly or via context
  collapsedSidebar: boolean;
}

const StyledStickySidebar = styled.div<{
  open?: boolean;
  collapsedSidebar?: boolean;
  offsetTop: string;
}>`
  overflow: hidden;
  flex-direction: column;
  backface-visibility: hidden;
  height: ${({ offsetTop }) => `calc(100vh - ${offsetTop})`};
  top: 0;
  flex: 0 0 auto;
  position: fixed;
  display: ${({ open }) => (open ? 'flex' : 'none')};
  z-index: 2;
  width: 100%;
  background: var(--sidebar-bg-color);
  border-right: 1px solid var(--sidebar-border-color);

  @media screen and (min-width: ${breakpoints.small}) {
    position: sticky;
    z-index: auto;
    width: ${({ collapsedSidebar }) => (collapsedSidebar ? 'var(--sidebar-width)' : 'auto')};
    display: flex;
  }
  @media print {
    display: none;
  }
`;

function StickyResponsiveSidebarComponent({
  scrollYOffset,
  className,
  children,
  collapsedSidebar,
}: PropsWithChildren<StickySidebarProps>): ReactElement {
  const [offsetTop, setOffsetTop] = useState<string>('0px');
  const stickyElement = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const [isSidebarOpened, setIsSidebarOpened] = useAtom(isSidebarOpenedAtom);

  useEffect(() => {
    if (location.hash) {
      setIsSidebarOpened(false);
    }
  }, [location.pathname, location.hash, setIsSidebarOpened]);

  useMount(() => {
    const top = scrollYOffset();
    // rerender when hydrating from SSR
    // see https://github.com/facebook/react/issues/8017#issuecomment-256351955
    setOffsetTop(`${top}px`);
  });

  return (
    <>
      <StyledStickySidebar
        open={Boolean(isSidebarOpened)}
        className={className}
        offsetTop={offsetTop}
        style={{
          top: offsetTop,
        }}
        ref={stickyElement}
        collapsedSidebar={Boolean(collapsedSidebar)}
      >
        {collapsedSidebar || isSidebarOpened ? children : null}
        <SidebarActions />
      </StyledStickySidebar>
      <FloatingButton />
    </>
  );
}

export const StickyResponsiveSidebar = memo<PropsWithChildren<StickySidebarProps>>(
  StickyResponsiveSidebarComponent,
);
