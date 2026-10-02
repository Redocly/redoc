import type { EventPayload } from '@redocly/redoc-opentelemetry';

import { transformStringToTelemetryId } from '../utils/string.js';
import { PAGE_URI } from './defaults.js';

type UiResource<O extends string, I extends string> = {
  id: I;
  object: O;
  uri: `urn:redocly:redoc:ui:${O}:${I}`;
};

export function uiResource<O extends string, I extends string>(object: O, id: I): UiResource<O, I> {
  return { id, object, uri: `urn:redocly:redoc:ui:${object}:${id}` };
}

export const RESOURCES = {
  asyncapiDocsChannelLink: uiResource('link', 'asyncapiDocsChannelLink'),
  changeLayoutButton: uiResource('button', 'changeLayoutButton'),
  colorMode: uiResource('button', 'colorMode'),
  connectMcp: uiResource('button', 'connectMcp'),
  copyCodeSnippetButton: uiResource('button', 'copyCodeSnippetButton'),
  definitionLoad: uiResource('definition', 'definitionLoad'),
  downloadDefinition: uiResource('definition', 'downloadDefinition'),
  examplesSwitcherButton: uiResource('button', 'examplesSwitcherButton'),
  expandCollapseAllButton: uiResource('button', 'expandCollapseAllButton'),
  graphqlDocsReferencedInLink: uiResource('link', 'graphqlDocsReferencedInLink'),
  messageLink: uiResource('link', 'messageLink'),
  pageActions: uiResource('button', 'pageActions'),
  redoclyAttribution: uiResource('link', 'redoclyAttribution'),
  redocSecurityButton: uiResource('button', 'redocSecurityButton'),
  redocSecurityButtonClose: uiResource('button', 'redocSecurityButtonClose'),
  requiredScopesButton: uiResource('button', 'requiredScopesButton'),
  responseCodeTab: uiResource('tab', 'responseCodeTab'),
  schemaFieldToggle: uiResource('button', 'schemaFieldToggle'),
  searchDialog: uiResource('search', 'searchDialog'),
  searchInputResetButton: uiResource('button', 'searchInputResetButton'),
  searchQuery: uiResource('search', 'searchQuery'),
  securityOptionalScopesToggle: uiResource('button', 'securityOptionalScopesToggle'),
  selectLanguageButton: uiResource('button', 'selectLanguageButton'),
  serverModalButton: uiResource('button', 'serverModalButton'),
  sidebarCollapse: uiResource('button', 'sidebarCollapse'),
  sidebarItem: uiResource('sidebar', 'sidebarItem'),
  switchExampleButton: uiResource('button', 'switchExampleButton'),
  switchMessageButton: uiResource('button', 'switchMessageButton'),
  switchServersButton: uiResource('button', 'switchServersButton'),
  tryItButton: uiResource('button', 'tryItButton'),
} as const;

/** Item for `downloadDefinition.clicked`: the constant resource when `PAGE_URI` is set, so no host, URL or label is sent; otherwise the resolved download URL. */
export function downloadDefinitionItem(
  label: string | undefined,
  url: string,
): EventPayload<'com.redocly.downloadDefinition.clicked'>[0] {
  if (PAGE_URI !== undefined) return RESOURCES.downloadDefinition;
  return {
    id: transformStringToTelemetryId('definition', window.location.hostname, label || url),
    object: 'definition',
    uri: new URL(url, window.location.origin).href,
  };
}
