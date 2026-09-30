import { useAtom } from 'jotai';
import { styled } from 'styled-components';
import { LayoutVariant } from '@redocly/config';

import { DEFAULT_COLOR_MODES } from '@redocly/theme/core/constants';

import { Button } from '@redocly/theme/components/Button/Button';
import { ColorModeIcon } from '@redocly/theme/components/ColorModeSwitcher/ColorModeIcon';
import { SidebarActions as ThemeSidebarActions } from '@redocly/theme/components/SidebarActions/SidebarActions';
import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';
import { breakpoints } from '@redocly/theme/core/openapi';

import { collapsedSidebarAtom, colorModeAtom, layoutAtom } from '../../jotai/app.js';
import { RESOURCES, useTelemetry } from '../../telemetry/index.js';
import { RedoclyAttributionLogo } from './RedoclyAttributionLogo.js';

/** Community edition: same controls plus the "API docs by Redocly" attribution. */
export const SidebarActions = (): React.JSX.Element => {
  const [layout, setLayout] = useAtom(layoutAtom);
  const [collapsedSidebar, setSidebarCollapsed] = useAtom(collapsedSidebarAtom);
  const telemetry = useTelemetry();
  const switchLayout = (): void => {
    const next =
      layout === LayoutVariant.STACKED ? LayoutVariant.THREE_PANEL : LayoutVariant.STACKED;
    telemetry.sendChangeLayoutClickedMessage([
      { ...RESOURCES.changeLayoutButton, layoutType: next },
    ]);
    setLayout(next);
  };
  const toggleSidebar = (): void => {
    const collapsed = !collapsedSidebar;
    telemetry.sendSidebarCollapsedMessage([{ ...RESOURCES.sidebarCollapse, collapsed }]);
    setSidebarCollapsed(collapsed);
  };
  const reportAttributionClick = (): void => {
    telemetry.sendLogoClickedMessage([{ ...RESOURCES.redoclyAttribution }]);
  };
  return (
    <Wrapper $collapsedSidebar={collapsedSidebar}>
      <RedocAttribution $collapsedSidebar={collapsedSidebar}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://redocly.com/redoc/"
          onClick={reportAttributionClick}
        >
          {collapsedSidebar ? (
            <RedoclyAttributionLogo />
          ) : (
            <>
              <p>API docs by</p>
              <RedoclyAttributionLogo full />
            </>
          )}
        </a>
      </RedocAttribution>
      <ActionsGroup $collapsedSidebar={collapsedSidebar}>
        <ColorModeSwitcherButton collapsedSidebar={collapsedSidebar} />
        <ThemeSidebarActions
          layout={layout}
          onChangeViewClick={switchLayout}
          collapsedSidebar={collapsedSidebar}
          onChangeCollapseSidebarClick={toggleSidebar}
          isApiDocs={true}
        />
      </ActionsGroup>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $collapsedSidebar: boolean }>`
  display: flex;
  flex-direction: ${({ $collapsedSidebar }) => ($collapsedSidebar ? 'column' : 'row')};
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-unit);
  position: sticky;
  top: calc(100vh);
  padding: var(--spacing-sm) var(--spacing-md);
`;

const ColorModeSwitcherButton = ({
  collapsedSidebar,
}: {
  collapsedSidebar: boolean;
}): React.JSX.Element => {
  const [colorMode, setColorMode] = useAtom(colorModeAtom);
  const telemetry = useTelemetry();
  const switchColorMode = (): void => {
    const next =
      colorMode === DEFAULT_COLOR_MODES.DARK ? DEFAULT_COLOR_MODES.LIGHT : DEFAULT_COLOR_MODES.DARK;
    telemetry.sendColorModeSwitchedMessage([{ ...RESOURCES.colorMode, mode: next }]);
    setColorMode(next);
  };

  return (
    <Tooltip placement={collapsedSidebar ? 'right' : 'top'} tip="Switch color mode">
      <Button
        data-testid="color-mode-switcher"
        onClick={switchColorMode}
        aria-label={colorMode}
        size="small"
        variant="outlined"
        icon={<ColorModeIcon mode={colorMode} />}
      />
    </Tooltip>
  );
};

const ActionsGroup = styled.span<{ $collapsedSidebar: boolean }>`
  display: inline-flex;
  flex-direction: ${({ $collapsedSidebar }) => ($collapsedSidebar ? 'column' : 'row')};
  align-items: center;
  gap: var(--spacing-unit);
`;

const RedocAttribution = styled.span<{ $collapsedSidebar: boolean }>`
  text-align: center;
  width: ${({ $collapsedSidebar }) => ($collapsedSidebar ? '24px' : 'auto')};
  height: ${({ $collapsedSidebar }) => ($collapsedSidebar ? '24px' : 'auto')};
  display: inline-flex;
  justify-content: center;
  bottom: 0;
  background: var(--color-blue-1);
  padding: ${({ $collapsedSidebar }) => ($collapsedSidebar ? '0px' : '2px 8px')};
  margin-bottom: ${({ $collapsedSidebar }) => ($collapsedSidebar ? 'var(--spacing-unit)' : '0')};

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
    height: ${({ $collapsedSidebar }) => ($collapsedSidebar ? '14px' : '12px')};
    user-select: none;
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
