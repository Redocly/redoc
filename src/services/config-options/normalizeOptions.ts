import { LayoutVariant } from '@redocly/config';

import type { RedocConfig } from '@redocly/config';
import type { Options } from './types.js';

import {
  argValueToBoolean,
  argValueToExpandLevel,
  argValueToInt,
  argValueToNumber,
  normalizePath,
} from '../../utils/index.js';
import { normalizeShowExtensions, normalizeScrollYOffset } from './helpers.js';
import { Languages } from '../code-samples/constants.js';

export function normalizeOptions(raw?: RedocConfig, defaultOptions?: RedocConfig): Options {
  raw = {
    ...defaultOptions,
    ...raw,
  };

  const ignoreNamedSchemas = Array.isArray(raw.ignoreNamedSchemas)
    ? raw.ignoreNamedSchemas
    : raw.ignoreNamedSchemas?.split(',').map((s) => s.trim());

  const normalizedOptions = {
    downloadUrls: raw.downloadUrls,
    schemaDefinitionsTagName: raw.schemaDefinitionsTagName,
    hideSidebar: argValueToBoolean(raw.hideSidebar, false),
    jsonSamplesExpandLevel: argValueToExpandLevel(raw.jsonSamplesExpandLevel, 2) as number,
    generatedSamplesMaxDepth: argValueToInt(raw.generatedSamplesMaxDepth, 8),
    hideDownloadButtons: argValueToBoolean(raw.hideDownloadButtons, false),
    hideLoading: argValueToBoolean(raw.hideLoading, false),
    hideSchemaTitles: argValueToBoolean(raw.hideSchemaTitles, false),
    maxDisplayedEnumValues: argValueToNumber(raw.maxDisplayedEnumValues),
    onlyRequiredInSamples: argValueToBoolean(raw.onlyRequiredInSamples, false),
    routingBasePath: (raw.routingBasePath && normalizePath(raw.routingBasePath)) || '',
    schemasExpansionLevel: argValueToExpandLevel(raw.schemasExpansionLevel),
    sortRequiredPropsFirst: argValueToBoolean(raw.sortRequiredPropsFirst, false),
    showExtensions: normalizeShowExtensions(raw.showExtensions),
    sanitize: argValueToBoolean(raw.sanitize, false),
    skipBundle: argValueToBoolean(raw.skipBundle, false),
    ignoreNamedSchemas: new Set<string>(ignoreNamedSchemas),
    markdocOptions: defaultOptions?.markdocOptions,
    codeSamples: {
      languages: Object.values(Languages).map((lang) => ({ lang })),
    },
    layout: (raw.layout as LayoutVariant) || LayoutVariant.THREE_PANEL,
    scrollYOffset: normalizeScrollYOffset(raw.scrollYOffset),
    hidePropertiesPrefix: argValueToBoolean(raw?.hidePropertiesPrefix, false),
  };

  return normalizedOptions;
}
