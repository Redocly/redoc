import { memo, useRef } from 'react';
import { LayoutVariant } from '@redocly/config';
import { useSetAtom } from 'jotai';

import type { PropsWithChildren, ReactElement } from 'react';
import type { RedoclyOpenAPIDocsProps } from './types.js';

import { ThreePanelLayout } from '@redocly/theme/layouts/ThreePanelLayout';
import { SidebarLogo } from '@redocly/theme/components/SidebarLogo/SidebarLogo';
import { GlobalStyle as ThemeCommonStyle, useMount } from '@redocly/theme/core/openapi';
import { ThemeDataContext, type ThemeDataTransferObject } from '@redocly/theme/core/openapi';

import { StoreProvider } from './Providers.js';
import { RedocWrap } from './styled.js';
import { StickyResponsiveSidebar } from '../StickySidebar/index.js';
import { SideMenu } from '../SideMenu/index.js';
import { Content } from '../Content/index.js';
import { Search } from '../Search/index.js';
import { useContentItems } from '../../hooks/index.js';
import { withRouter } from '../../hoc/withRouter.js';
import { withStore } from '../../hoc/withStore.js';
import { compose } from '../../utils/index.js';
import { highlight } from '../../hooks/highlight.js';
import { ErrorPage } from './Error.js';
import { dataTelemetryAtom } from '../../jotai/telemetry.js';
import { usePerformanceMetrics } from '../../hooks/usePerformanceMetrics.js';
import { useInitialTelemetry } from '../../hooks/useTelemetry.js';
import { ErrorBoundary } from './ErrorBoundary.js';

const ThemeDataProvider = ({ children }: PropsWithChildren) => {
  const dataTransferObject = {
    hooks: {
      useCodeHighlight: () => ({ highlight }),
    },
  } as ThemeDataTransferObject;

  return (
    <ThemeDataContext.Provider value={dataTransferObject}>{children}</ThemeDataContext.Provider>
  );
};

const RedoclyOpenAPIDocsComponent = compose(
  withRouter,
  withStore,
  memo,
)(({
  onLoaded,
  children,
  options,
  layout,
  collapsedSidebar,
  parser,
  withCommonStyles,
  typeOfUsage = 'html',
}: PropsWithChildren<Omit<RedoclyOpenAPIDocsProps, 'store'>>): ReactElement | null => {
  const rootElementRef = useRef<HTMLDivElement>(null);

  const { contentItems, flatItems } = useContentItems({ parser, options });
  const setTelemetry = useSetAtom(dataTelemetryAtom);
  useInitialTelemetry({ parser, options, typeOfUsage });

  usePerformanceMetrics({
    setAtom: (data: Record<string, number>) => {
      setTelemetry({
        performanceMetrics: {
          cls: data.cls,
          lcp: data.lcp,
          fcp: data.fcp,
          ttfb: data.ttfb,
        },
      });
    },
  });

  useMount(() => {
    onLoaded?.();
  });

  const { hideSidebar, scrollYOffset } = options || {};

  const xLogo = parser.definition?.info?.['x-logo'];

  return (
    <>
      {withCommonStyles && <ThemeCommonStyle />}
      <RedocWrap className="redoc-wrap" ref={rootElementRef} $offset={options.scrollYOffset}>
        {!hideSidebar && (
          <StickyResponsiveSidebar
            scrollYOffset={scrollYOffset}
            className="menu-content"
            collapsedSidebar={Boolean(!collapsedSidebar)}
          >
            <SidebarLogo
              imageUrl={xLogo?.url}
              href={xLogo?.href || parser.definition?.info?.contact?.url}
              altText={xLogo?.altText}
              backgroundColor={xLogo?.backgroundColor}
            />
            <Search flatItems={flatItems} parser={parser} />
            <SideMenu items={contentItems} />
          </StickyResponsiveSidebar>
        )}
        <ThreePanelLayout
          className={`${layout}-layout api-content`}
          id="api-content"
          layout={
            layout === LayoutVariant.THREE_PANEL ? LayoutVariant.THREE_PANEL : LayoutVariant.STACKED
          }
          collapsedSidebar={collapsedSidebar}
        >
          <Content items={contentItems} routingBasePath={options.routingBasePath} />
          {children}
        </ThreePanelLayout>
      </RedocWrap>
    </>
  );
});

export function RedoclyOpenAPIDocs({
  onLoaded,
  children,
  store,
  withCommonStyles,
  disableTelemetry: disableTelemetryProps,
  router: routerProps,
  typeOfUsage = 'html',
}: PropsWithChildren<Partial<RedoclyOpenAPIDocsProps>>) {
  const router = routerProps || store?.router || 'hash';
  const disableTelemetry = disableTelemetryProps || store?.disableTelemetry || false;
  return store?.definition ? (
    <ErrorBoundary typeOfUsage={typeOfUsage}>
      <StoreProvider
        {...store}
        router={router}
        disableTelemetry={disableTelemetry}
        typeOfUsage={typeOfUsage}
      >
        <ThemeDataProvider>
          <RedoclyOpenAPIDocsComponent
            onLoaded={onLoaded}
            basePath={store.options?.routingBasePath}
            disableRouter={store.options?.disableRouter}
            withCommonStyles={withCommonStyles}
            router={router}
            typeOfUsage={typeOfUsage}
          >
            {children}
          </RedoclyOpenAPIDocsComponent>
        </ThemeDataProvider>
      </StoreProvider>
    </ErrorBoundary>
  ) : (
    <ErrorPage typeOfUsage={typeOfUsage || 'html'} description="Definition not found" />
  );
}
