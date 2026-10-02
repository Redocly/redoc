import type { ApiDocsOptions, RawApiDocsOptions } from '../types/options.js';


import { WindowReferenceOptions } from '../constants/openapi.js';
import {
  argValueToBoolean,
  argValueToExpandLevel,
  argValueToInt,
  argValueToNumber,
  normalizeCodeSamples,
  normalizeDownloadUrls,
  normalizeIgnoreNamedSchemas,
  normalizeLayout,
  normalizePath,
  normalizeScrollYOffset,
  normalizeShowExtensions,
} from './helpers.js';
import {
  ASYNCAPI_DEFAULT_JSON_SAMPLES_DEPTH,
  DEFAULT_MAX_DISPLAYED_ENUM_VALUES,
  GENERATED_SAMPLES_MAX_DEPTH_DEFAULT,
  GRAPHQL_DEFAULT_FIELD_EXPAND_LEVEL,
  GRAPHQL_DEFAULT_JSON_SAMPLES_DEPTH,
  GRAPHQL_DEFAULT_SAMPLES_MAX_INLINE_ARGS,
  JSON_SAMPLES_EXPAND_LEVEL_DEFAULT,
  DEFAULT_ROUTING_BASE_PATH,
} from './constants.js';
import { apiSpecType } from '../types/common.js';
import { EDITION_OPTION_OVERRIDES } from './editionOverrides.js';

export function normalizeOptions(rawOptions: RawApiDocsOptions): ApiDocsOptions {
  const options = { ...rawOptions, ...EDITION_OPTION_OVERRIDES };
  const configuredBasePath = options.basePath || options.routingBasePath;
  return {
    specType: options.specType,
    metadata: options.metadata ?? {},
    downloadUrls: normalizeDownloadUrls(options.downloadUrls ?? [], options.specType),
    dynamicRequestValues: options.dynamicRequestValues,
    schemaDefinitionsTagName: options.schemaDefinitionsTagName,
    jsonSamplesExpandLevel:
      argValueToExpandLevel(options.jsonSamplesExpandLevel, JSON_SAMPLES_EXPAND_LEVEL_DEFAULT) ??
      JSON_SAMPLES_EXPAND_LEVEL_DEFAULT,
    generatedSamplesMaxDepth: argValueToInt(
      options.generatedSamplesMaxDepth,
      GENERATED_SAMPLES_MAX_DEPTH_DEFAULT,
    ),
    hideDownloadButtons: argValueToBoolean(options.hideDownloadButtons, false),
    hideLoading: argValueToBoolean(options.hideLoading, false),
    hideSchemaTitles: argValueToBoolean(options.hideSchemaTitles, false),
    hideSchemaPattern: argValueToBoolean(options.hideSchemaPattern, false),
    maxDisplayedEnumValues: argValueToNumber(
      options.maxDisplayedEnumValues,
      DEFAULT_MAX_DISPLAYED_ENUM_VALUES,
    ),
    onlyRequiredInSamples: argValueToBoolean(options.onlyRequiredInSamples, false),
    [WindowReferenceOptions.ON_DEEP_LINK_CLICK]: options.onDeepLinkClick ?? null,
    basePath: configuredBasePath ? normalizePath(configuredBasePath) : DEFAULT_ROUTING_BASE_PATH,
    schemasExpansionLevel: argValueToExpandLevel(options.schemasExpansionLevel),
    sortRequiredPropsFirst: argValueToBoolean(
      options.sortRequiredPropsFirst ?? options.requiredPropsFirst,
      false,
    ),
    scrollYOffset: normalizeScrollYOffset(options.scrollYOffset),
    showExtensions: normalizeShowExtensions(options.showExtensions),
    sanitize: argValueToBoolean(options.sanitize, false),
    skipBundle: argValueToBoolean(options.skipBundle, false),
    ignoreNamedSchemas: new Set(normalizeIgnoreNamedSchemas(options.ignoreNamedSchemas)),
    markdownParser: options.markdownParser,
    codeSamples: normalizeCodeSamples(options.codeSamples),
    layout: normalizeLayout(options.layout),
    events: options.events ?? {},
    hidePropertiesPrefix: argValueToBoolean(options?.hidePropertiesPrefix, false),
    jsonSamplesDepth: argValueToInt(
      options.jsonSamplesDepth,
      options.specType === apiSpecType.ASYNCAPI
        ? ASYNCAPI_DEFAULT_JSON_SAMPLES_DEPTH
        : GRAPHQL_DEFAULT_JSON_SAMPLES_DEPTH,
    ),
    samplesMaxInlineArgs: argValueToInt(
      options.samplesMaxInlineArgs,
      GRAPHQL_DEFAULT_SAMPLES_MAX_INLINE_ARGS,
    ),
    fieldExpandLevel: argValueToInt(options.fieldExpandLevel, GRAPHQL_DEFAULT_FIELD_EXPAND_LEVEL),
    menu: options.menu,
    showBuiltInScalars: options.showBuiltInScalars,
    showBuiltInDirectives: options.showBuiltInDirectives,
    info: options.info,
    markdown: options.markdown,
    apiLogo: options.apiLogo,
    protocol: options.protocol,
  };
}
