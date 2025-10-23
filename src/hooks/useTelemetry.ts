import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type {
  ChangeLayoutTypeMessage,
  CopyCodeSnippetClickedMessage,
  DownloadDefinitionClickedMessage,
  ExamplesSwitcherClickedMessage,
  ExpandCollapseAllClickedMessage,
  SelectLanguageClickedMessage,
  EventPayload,
  SearchInputResetButtonClickedMessage,
  SearchOpenedMessage,
  SearchResultClickedMessage,
} from '@redocly/redoc-opentelemetry';
import type { Options, OpenAPIParser } from '../services/index.js';
import type { OpenAPISecurityScheme } from '../types/open-api.js';

import { redocTelemetry } from '../services/telemetry.js';
import { disableTelemetryAtom, layoutAtom, routerAtom } from '../jotai/app.js';
import { statusTelemetryAtom, telemetryAtom } from '../jotai/telemetry.js';

export function useInitialTelemetry({
  options,
  parser,
  typeOfUsage,
}: {
  options: Options;
  parser: OpenAPIParser;
  typeOfUsage: 'html' | 'cli' | 'react' | 'docker';
}): void {
  const telemetryData = useAtomValue(telemetryAtom);
  const setTelemetryStatus = useSetAtom(statusTelemetryAtom);
  const disableTelemetry = useAtomValue(disableTelemetryAtom);
  const router = useAtomValue(routerAtom);
  const layout = useAtomValue(layoutAtom);
  const securitySchemes = Object.values(
    parser.definition?.components?.securitySchemes || {},
  ) as OpenAPISecurityScheme[];
  const authorizations = securitySchemes.map((scheme) => scheme.type);

  useEffect(() => {
    if (disableTelemetry) return;
    if (telemetryData.status === 'ready' && telemetryData.data) {
      redocTelemetry.sendEvent('redoc_ce.initial', {
        layout,
        options,
        authorizations,
        typeOfUsage: router === 'memory' ? 'cli' : typeOfUsage,
        router,
        performanceMetrics: telemetryData.data.performanceMetrics,
        extensions: telemetryData.data.extensions,
        requestBodies: telemetryData.data.requestBodies,
        operationsCount: telemetryData.data.operationsCount,
      });
      setTelemetryStatus('sent');
    }
  }, [
    telemetryData,
    router,
    layout,
    authorizations,
    options,
    typeOfUsage,
    disableTelemetry,
    setTelemetryStatus,
  ]);
}

export function useTelemetry() {
  const disableTelemetry = useAtomValue(disableTelemetryAtom);

  if (disableTelemetry) {
    return {
      sendDownloadDefinitionClickedMessage: () => {},
      sendExpandCollapseAllClickedMessage: () => {},
      sendSelectLanguageClickedMessage: () => {},
      sendExamplesSwitcherClickedMessage: () => {},
      sendCopyCodeSnippetClickedMessage: () => {},
      sendChangeLayoutButtonClickedMessage: () => {},
      sendSearchResultClickedMessage: () => {},
      sendSearchInputResetButtonClickedMessage: () => {},
      sendSearchOpenedMessage: () => {},
    };
  }

  return {
    sendDownloadDefinitionClickedMessage: (
      data?: EventPayload<DownloadDefinitionClickedMessage['type']>,
    ) => redocTelemetry.sendEvent('redoc_ce.download_definition.clicked', data),
    sendExpandCollapseAllClickedMessage: (
      data: EventPayload<ExpandCollapseAllClickedMessage['type']>,
    ) => redocTelemetry.sendEvent('redoc_ce.expand_collapse_all.clicked', data),
    sendSelectLanguageClickedMessage: (data: EventPayload<SelectLanguageClickedMessage['type']>) =>
      redocTelemetry.sendEvent('redoc_ce.select_language.clicked', data),
    sendExamplesSwitcherClickedMessage: (
      data: EventPayload<ExamplesSwitcherClickedMessage['type']>,
    ) => redocTelemetry.sendEvent('redoc_ce.examples_switcher.clicked', data),
    sendCopyCodeSnippetClickedMessage: (
      data: EventPayload<CopyCodeSnippetClickedMessage['type']>,
    ) => redocTelemetry.sendEvent('redoc_ce.copy_code_snippet.clicked', data),
    sendChangeLayoutButtonClickedMessage: (data: EventPayload<ChangeLayoutTypeMessage['type']>) =>
      redocTelemetry.sendEvent('redoc_ce.layout_type.clicked', data),
    sendSearchInputResetButtonClickedMessage: (
      data?: EventPayload<SearchInputResetButtonClickedMessage['type']>,
    ) => redocTelemetry.sendEvent('redoc_ce.search_input_reset_button.clicked', data),
    sendSearchOpenedMessage: (data: EventPayload<SearchOpenedMessage['type']>) =>
      redocTelemetry.sendEvent('redoc_ce.search.opened', data),
    sendSearchResultClickedMessage: (data: EventPayload<SearchResultClickedMessage['type']>) =>
      redocTelemetry.sendEvent('redoc_ce.search.result.clicked', data),
  };
}
