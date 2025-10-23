import { useAtom } from 'jotai';
import { LayoutVariant } from '@redocly/config';
import { useCallback } from 'react';

import { SidebarActions as ThemeSidebarActions } from '@redocly/theme/components/SidebarActions/SidebarActions';
import { ColorModeSwitcher as ThemeColorModeSwitcher } from '@redocly/theme/components/ColorModeSwitcher/ColorModeSwitcher';
import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';
import { breakpoints } from '@redocly/theme/core/openapi';

import { collapsedSidebarAtom, isSidebarOpenedAtom, layoutAtom } from '../../jotai/app.js';
import { styled } from '../../styled-components.js';
import RedoclyLogo from './Logo.js';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { useTelemetry } from '../../hooks/useTelemetry.js';

export const SidebarActions = () => {
  const [layout, setLayout] = useAtom(layoutAtom);
  const [collapsedSidebar, setSidebarCollapsed] = useAtom(collapsedSidebarAtom);
  const [isSidebarOpened, setIsSidebarOpened] = useAtom(isSidebarOpenedAtom);
  const isMobile = useIsMobile();
  const telemetry = useTelemetry();

  const handleChangeCollapseSidebarClick = useCallback(() => {
    if (isSidebarOpened) {
      setIsSidebarOpened(false);
    }
    setSidebarCollapsed(!collapsedSidebar);
  }, [collapsedSidebar, isSidebarOpened, setIsSidebarOpened, setSidebarCollapsed]);

  const handleChangeViewClick = useCallback(() => {
    const newLayout =
      layout === LayoutVariant.STACKED ? LayoutVariant.THREE_PANEL : LayoutVariant.STACKED;
    setLayout(newLayout);
    telemetry.sendChangeLayoutButtonClickedMessage({ layoutType: newLayout });
  }, [setLayout, telemetry, layout]);

  return (
    <Wrapper collapsedSidebar={collapsedSidebar}>
      <RedocAttribution collapsedSidebar={collapsedSidebar}>
        <a target="_blank" rel="noopener noreferrer" href="https://redocly.com/redoc/">
          {collapsedSidebar && <RedoclyLogo />}
          {!collapsedSidebar && (
            <>
              <p>API docs by</p>
              <RedoclyLogo full />
            </>
          )}
        </a>
      </RedocAttribution>
      <Tooltip placement={collapsedSidebar ? 'right' : 'top'} tip="Toggle color mode">
        <ColorModeSwitcher />
      </Tooltip>
      <ThemeSidebarActions
        layout={layout}
        onChangeViewClick={handleChangeViewClick}
        hideCollapseSidebarButton={isMobile}
        collapsedSidebar={collapsedSidebar}
        onChangeCollapseSidebarClick={handleChangeCollapseSidebarClick}
        isApiDocs={!isMobile}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ collapsedSidebar: boolean }>`
  display: flex;
  flex-direction: ${({ collapsedSidebar }) => (collapsedSidebar ? 'column' : 'row')};
  align-items: center;
  justify-content: space-around;
  position: sticky;
  gap: var(--spacing-unit);
  top: calc(100vh);
  padding: var(--spacing-sm) var(--spacing-md);

  span {
    display: inline-flex;
  }
`;

const ColorModeSwitcher = styled(ThemeColorModeSwitcher)`
  --button-icon-padding: var(--spacing-xxs) !important;
  --button-border-width: 1px;
  --button-border-style: solid;
  --button-border-color: var(--border-color-primary) !important;
  --button-bg-color: var(--bg-color) !important;
  --button-bg-color-hover: var(--button-bg-color) !important;
  --button-border-color-hover: var(--button-border-color) !important;
  --button-border-radius: var(--border-radius) !important;
`;

export const RedocAttribution = styled.span<{ collapsedSidebar: boolean }>`
  text-align: center;
  width: ${({ collapsedSidebar }) => (collapsedSidebar ? '24px' : 'auto')};
  height: ${({ collapsedSidebar }) => (collapsedSidebar ? '24px' : 'auto')};
  display: inline-flex;
  justify-content: center;
  bottom: 0;
  background: var(--color-blue-1);
  padding: ${({ collapsedSidebar }) => (collapsedSidebar ? '0px' : '2px 8px')};
  margin-bottom: ${({ collapsedSidebar }) => (collapsedSidebar ? 'var(--spacing-unit);' : '0')};

  border-radius: 21px;
  &:hover {
    background: var(--color-blue-2);
  }
  a,
  a:visited,
  a:hover {
    color: var(--sidebar-text-color) !important;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    height: ${({ collapsedSidebar }) => (collapsedSidebar ? '14px' : '12px')};
  }
  p {
    font-size: calc(var(--font-size-xl) / 2);
    line-height: var(--line-height-sm);
    margin: 0;
    margin-right: 4px;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    position: sticky;
    z-index: auto;
  }
`;
