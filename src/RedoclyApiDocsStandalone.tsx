import { memo, useMemo } from 'react';
import { createMarkdocAdapter } from './components/markdoc/markdocAdapter.js';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';

import type { PropsWithChildren, ReactElement } from 'react';
import type { ApiItem, ApiStore } from './types/store.js';
import type { RawApiDocsOptions } from './types/options.js';
import type { RedocTelemetryConfig } from './telemetry/RedocTelemetry.js';
import type { MarkdownAdapter } from './contexts/markdownAdapter.js';
import type { RawLogo } from './types/common.js';
import type { BuildTimings } from './telemetry/index.js';

import { SidebarLogo } from '@redocly/theme/components/SidebarLogo/SidebarLogo';
import { ThemeDataContext, type ThemeDataTransferObject } from '@redocly/theme/core/openapi';

import { isRecord } from './adapters/helpers.js';
import {
  TelemetryContext,
  nonDefaultOptions,
  useRedocTelemetryInstance,
} from './telemetry/index.js';
import { RedoclyApiDocsComponent } from './RedoclyApiDocs.js';
import { Search } from './components/Search/index.js';
import { SideMenu } from './components/SideMenu/SideMenu.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { StickySidebar } from './components/StickySidebar/StickySidebar.js';
import { getStandaloneLayoutStyle } from './options/standaloneLayoutVars.js';
import { toSidebarLogo } from './utils/logo.js';
import { globalOptionsAtom, storeAtom } from './jotai/store.js';
import { collapsedSidebarAtom } from './jotai/app.js';
import { PrePaintColorModeScript } from './components/PrePaintColorModeScript.js';
import { useRedocRootClassName } from './components/RedocRoot.js';
import { PortalScope } from './components/common/BodyPortal.js';
import { STANDALONE_THEME_CONFIG } from './standaloneThemeConfig.js';
import { compose } from './utils/compose.js';
import { normalizePath } from './utils/url.js';
import { isTelemetryDisabled } from './options/helpers.js';
import { withRouter } from './hoc/withRouter.js';
import { withStoreProvider } from './hoc/withStoreProvider.js';
import { useCodeHighlight } from './hooks/useCodeHighlight.js';
import { useAgentTools } from './hooks/useAgentTools.js';

const ThemeDataProvider = ({ children }: PropsWithChildren): ReactElement => {
  const dataTransferObject = useMemo(
    () =>
      ({
        hooks: {
          useCodeHighlight,
          // useThemeConfig dereferences useCurrentProduct once a config exists.
          ...(STANDALONE_THEME_CONFIG ? { useCurrentProduct: () => undefined } : {}),
        },
        ...(STANDALONE_THEME_CONFIG ? { config: STANDALONE_THEME_CONFIG } : {}),
      }) as ThemeDataTransferObject,
    [],
  );

  return (
    <ThemeDataContext.Provider value={dataTransferObject}>{children}</ThemeDataContext.Provider>
  );
};

type RedoclyApiDocsStandaloneProps = {
  items: ApiItem[];
  store: ApiStore;
  basePath: string;
  options: RawApiDocsOptions;
  logo?: RawLogo;
  telemetryConfig?: Partial<RedocTelemetryConfig>;
  markdownAdapter?: MarkdownAdapter;
  spec?: Record<string, unknown> | string;
  specUrl?: string;
  buildTimings?: BuildTimings;
};

const RedoclyApiDocsStandalone = compose(
  withStoreProvider,
  withRouter,
  memo,
)(({
  items,
  store,
  basePath: rawBasePath = '/',
  options: rawOptions,
  logo,
  telemetryConfig,
  markdownAdapter: markdownAdapterProp,
  spec,
  buildTimings,
}: RedoclyApiDocsStandaloneProps): ReactElement => {
  const basePath = normalizePath(rawBasePath);
  const options = useAtomValue(globalOptionsAtom);
  const apiStore = useAtomValue(storeAtom);
  const disableTelemetry = isTelemetryDisabled(rawOptions?.disableTelemetry);
  const telemetry = useRedocTelemetryInstance({
    ...telemetryConfig,
    ...(disableTelemetry ? { disabled: true } : {}),
  });
  const initialTelemetry = useMemo(
    () => ({ buildTimings, options: nonDefaultOptions(rawOptions, options) }),
    [buildTimings, rawOptions, options],
  );
  const markdownAdapter = useMemo(
    () => markdownAdapterProp ?? createMarkdocAdapter(undefined, options),
    [markdownAdapterProp, options],
  );
  const collapsedSidebar = useAtomValue(collapsedSidebarAtom);

  const rootClassName = useRedocRootClassName();

  useAgentTools(items);

  const sidebarLogo = toSidebarLogo(logo) ?? options.apiLogo ?? apiStore.logo;

  const layoutStyle = useMemo(() => getStandaloneLayoutStyle(options), [options]);

  return (
    <ThemeDataProvider>
      <TelemetryContext.Provider value={telemetry}>
        <PortalScope>
          <StandaloneLayout className={rootClassName} style={layoutStyle} suppressHydrationWarning>
            <PrePaintColorModeScript />
            <StickySidebar className="menu-content" collapsedSidebar={collapsedSidebar}>
              <SidebarLogo dataTestId="logo" {...sidebarLogo} />
              <ErrorBoundary scope="sidebar">
                <Search
                  items={items}
                  store={store}
                  basePath={basePath}
                  document={isRecord(spec) ? spec : undefined}
                />
              </ErrorBoundary>
              <ErrorBoundary scope="sidebar">
                <SideMenu items={items} />
              </ErrorBoundary>
            </StickySidebar>
            <MainContent>
              <RedoclyApiDocsComponent
                items={items}
                basePath={basePath}
                markdownAdapter={markdownAdapter}
                telemetryConfig={telemetryConfig}
                initialTelemetry={initialTelemetry}
              />
            </MainContent>
          </StandaloneLayout>
        </PortalScope>
      </TelemetryContext.Provider>
    </ThemeDataProvider>
  );
});

const StandaloneLayout = styled.div`
  display: flex;
  position: relative;
  min-height: 100vh;
  text-align: left;
  background-color: var(--bg-color);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-regular);
  color: var(--text-color-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  [data-section-id] {
    scroll-margin-top: calc(var(--navbar-stack-height, 0px) + var(--banner-height, 0px));
  }

  [id]:not([data-section-id]):has([data-deep-link-anchor]) {
    scroll-margin-top: calc(
      var(--navbar-stack-height, 0px) + var(--banner-height, 0px) +
        var(--deep-link-scroll-gap, var(--spacing-xl))
    );
  }

  * {
    box-sizing: border-box;
  }
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
`;

export { RedoclyApiDocsStandalone };
export type { RedoclyApiDocsStandaloneProps };
export default RedoclyApiDocsStandalone;
