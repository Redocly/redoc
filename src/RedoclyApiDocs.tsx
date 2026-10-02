import { memo, type ReactElement } from 'react';
import type { LayoutVariant } from '@redocly/config';

import type { ApiItem, ApiStore } from './types/store.js';
import type { RawApiDocsOptions } from './types/options.js';
import type { RouteIndex } from './utils/routing.js';
import { type MarkdownAdapter, MarkdownAdapterProvider } from './contexts/markdownAdapter.js';
import {
  type InitialTelemetryContext,
  type RedocTelemetryConfig,
  TelemetryContext,
  useRedocTelemetryInstance,
} from './telemetry/index.js';

import { GlobalStyle as ThemeCommonStyle } from '@redocly/theme/core/openapi';

import { useApiDocsRoutes } from './hooks/useApiDocsRoutes.js';
import { useVisitedChannelsTracker } from './hooks/useVisitedChannelsTracker.js';
import { useRouterHashBridge } from './hooks/useRouterHashBridge.js';
import { useScrollSpyUrlSync } from './hooks/useScrollSpyUrlSync.js';
import { usePageTelemetry } from './hooks/usePageTelemetry.js';
import { EntryPage } from './pages/EntryPage.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { compose } from './utils/compose.js';
import { withRouter } from './hoc/withRouter.js';
import { withStoreProvider } from './hoc/withStoreProvider.js';

type RedoclyApiDocsInnerProps = {
  items: ApiItem[];
  basePath: string;
  markdownAdapter: MarkdownAdapter;
  telemetryConfig?: Partial<RedocTelemetryConfig>;
  initialTelemetry?: InitialTelemetryContext;
};

type RedoclyApiDocsProps = RedoclyApiDocsInnerProps & {
  store: ApiStore;
  options: RawApiDocsOptions;
  layout?: LayoutVariant;
};

const RedoclyApiDocsComponent = (props: RedoclyApiDocsInnerProps): ReactElement => {
  const { items = [], basePath, markdownAdapter, telemetryConfig, initialTelemetry } = props;
  const { routeIndex } = useApiDocsRoutes(items, basePath);
  const telemetry = useRedocTelemetryInstance(telemetryConfig);
  return (
    <MarkdownAdapterProvider value={markdownAdapter}>
      <TelemetryContext.Provider value={telemetry}>
        <RouterSubscribers routeIndex={routeIndex} initialTelemetry={initialTelemetry} />
        <RedoclyApiDocsBody routeIndex={routeIndex} basePath={basePath} />
      </TelemetryContext.Provider>
    </MarkdownAdapterProvider>
  );
};

/** Mounts the root-level singleton `useLocation()` subscribers so per-item
 *  components never subscribe to the router directly. */
function RouterSubscribers({
  routeIndex,
  initialTelemetry,
}: {
  routeIndex: RouteIndex;
  initialTelemetry?: InitialTelemetryContext;
}): null {
  useVisitedChannelsTracker();
  useRouterHashBridge();
  useScrollSpyUrlSync();
  usePageTelemetry(routeIndex, initialTelemetry);
  return null;
}

const RedoclyApiDocsBody = ({
  routeIndex,
  basePath,
}: {
  routeIndex: RouteIndex;
  basePath: string;
}): ReactElement => {
  return (
    <>
      {/* Outside the boundary: a page crash must not unmount the global styles
          that the surrounding layout (e.g. the standalone sidebar) depends on. */}
      <ThemeCommonStyle />
      <ErrorBoundary>
        <EntryPage routeIndex={routeIndex} basePath={basePath} />
      </ErrorBoundary>
    </>
  );
};

const RedoclyApiDocs = compose(
  withStoreProvider,
  withRouter,
  memo,
)(RedoclyApiDocsComponent);

export { RedoclyApiDocs, RedoclyApiDocsComponent };
export type { RedoclyApiDocsProps };
export default RedoclyApiDocs;
