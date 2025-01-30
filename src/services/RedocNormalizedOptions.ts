import defaultTheme, { ResolvedThemeInterface, resolveTheme, ThemeInterface } from '../theme';
import { querySelector } from '../utils/dom';
import { isArray, isNumeric, mergeObjects } from '../utils/helpers';

import { setRedocLabels } from './Labels';
import { SideNavStyleEnum } from './types';
import type { LabelsConfigRaw, MDXComponentMeta } from './types';

export type DownloadUrlsConfig = {
  title?: string;
  url: string;
}[];

export interface RedocRawOptions {
  theme?: ThemeInterface;
  scrollYOffset?: number | string | (() => number);
  hideHostname?: boolean | string;
  expandResponses?: string | 'all';
  requiredPropsFirst?: boolean | string; // remove in next major release
  sortRequiredPropsFirst?: boolean | string;
  sortPropsAlphabetically?: boolean | string;
  sortEnumValuesAlphabetically?: boolean | string;
  sortOperationsAlphabetically?: boolean | string;
  sortTagsAlphabetically?: boolean | string;
  nativeScrollbars?: boolean | string;
  pathInMiddlePanel?: boolean | string;
  untrustedSpec?: boolean | string; // remove in next major release
  sanitize?: boolean | string;
  hideLoading?: boolean | string;
  hideDownloadButton?: boolean | string; // remove in next major release
  hideDownloadButtons?: boolean | string;
  downloadFileName?: string;
  downloadDefinitionUrl?: string;
  downloadUrls?: DownloadUrlsConfig;
  disableSearch?: boolean | string;
  onlyRequiredInSamples?: boolean | string;
  showExtensions?: boolean | string | string[];
  sideNavStyle?: SideNavStyleEnum;
  hideSingleRequestSampleTab?: boolean | string;
  hideRequestPayloadSample?: boolean;
  menuToggle?: boolean | string;
  jsonSampleExpandLevel?: number | string | 'all'; // remove in next major release
  jsonSamplesExpandLevel?: number | string | 'all';
  hideSchemaTitles?: boolean | string;
  simpleOneOfTypeLabel?: boolean | string;
  payloadSampleIdx?: number;
  expandSingleSchemaField?: boolean | string;
  schemaExpansionLevel?: number | string | 'all'; // remove in next major release
  schemasExpansionLevel?: number | string | 'all';
  schemaDefinitionsTagName?: string;
  showObjectSchemaExamples?: boolean | string;
  showSecuritySchemeType?: boolean;
  hideSecuritySection?: boolean;

  unstable_ignoreMimeParameters?: boolean;

  allowedMdComponents?: Record<string, MDXComponentMeta>;

  labels?: LabelsConfigRaw;

  enumSkipQuotes?: boolean | string;

  expandDefaultServerVariables?: boolean;
  maxDisplayedEnumValues?: number;
  ignoreNamedSchemas?: string[] | string;
  hideSchemaPattern?: boolean;
  generatedPayloadSamplesMaxDepth?: number; // remove in next major release
  generatedSamplesMaxDepth?: number;
  nonce?: string;
  hideFab?: boolean;
  minCharacterLengthToInitSearch?: number;
  showWebhookVerb?: boolean;
  hidePropertiesPrefix?: boolean;
}

export function argValueToBoolean(val?: string | boolean, defaultValue?: boolean): boolean {
  if (val === undefined) {
    return defaultValue || false;
  }
  if (typeof val === 'string') {
    return val !== 'false';
  }
  return val;
}

function argValueToNumber(value: number | string | undefined): number | undefined {
  if (typeof value === 'string') {
    return parseInt(value, 10);
  }

  if (typeof value === 'number') {
    return value;
  }
}

function argValueToExpandLevel(value?: number | string | undefined, defaultValue = 0): number {
  if (value === 'all') return Infinity;

  return argValueToNumber(value) || defaultValue;
}

export class RedocNormalizedOptions {
  static normalizeExpandResponses(value: RedocRawOptions['expandResponses']) {
    if (value === 'all') {
      return 'all';
    }
    if (typeof value === 'string') {
      const res = {};
      value.split(',').forEach(code => {
        res[code.trim()] = true;
      });
      return res;
    } else if (value !== undefined) {
      console.warn(
        `expandResponses must be a string but received value "${value}" of type ${typeof value}`,
      );
    }
    return {};
  }

  static normalizeHideHostname(value: RedocRawOptions['hideHostname']): boolean {
    return !!value;
  }

  static normalizeScrollYOffset(value: RedocRawOptions['scrollYOffset']): () => number {
    // just number is not valid selector and leads to crash so checking if isNumeric here
    if (typeof value === 'string' && !isNumeric(value)) {
      const el = querySelector(value);
      if (!el) {
        console.warn(
          'scrollYOffset value is a selector to non-existing element. Using offset 0 by default',
        );
      }
      const bottom = (el && el.getBoundingClientRect().bottom) || 0;
      return () => bottom;
    } else if (typeof value === 'number' || isNumeric(value)) {
      return () => (typeof value === 'number' ? value : parseFloat(value));
    } else if (typeof value === 'function') {
      return () => {
        const res = value();
        if (typeof res !== 'number') {
          console.warn(
            `scrollYOffset should return number but returned value "${res}" of type ${typeof res}`,
          );
        }
        return res;
      };
    } else if (value !== undefined) {
      console.warn(
        'Wrong value for scrollYOffset ReDoc option: should be string, number or function',
      );
    }

    return () => 0;
  }

  static normalizeShowExtensions(value: RedocRawOptions['showExtensions']): string[] | boolean {
    if (typeof value === 'undefined') {
      return false;
    }
    if (value === '') {
      return true;
    }

    if (typeof value !== 'string') {
      return value;
    }

    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value.split(',').map(ext => ext.trim());
    }
  }

  static normalizeSideNavStyle(value: RedocRawOptions['sideNavStyle']): SideNavStyleEnum {
    const defaultValue = SideNavStyleEnum.SummaryOnly;
    if (typeof value !== 'string') {
      return defaultValue;
    }

    switch (value) {
      case defaultValue:
        return value;
      case SideNavStyleEnum.PathOnly:
        return SideNavStyleEnum.PathOnly;
      case SideNavStyleEnum.IdOnly:
        return SideNavStyleEnum.IdOnly;
      default:
        return defaultValue;
    }
  }

  static normalizePayloadSampleIdx(value: RedocRawOptions['payloadSampleIdx']): number {
    if (typeof value === 'number') {
      return Math.max(0, value); // always greater or equal than 0
    }

    if (typeof value === 'string') {
      return isFinite(value) ? parseInt(value, 10) : 0;
    }

    return 0;
  }

  private static normalizeJsonSampleExpandLevel(level?: number | string | 'all'): number {
    if (level === 'all') {
      return +Infinity;
    }
    if (!isNaN(Number(level))) {
      return Math.ceil(Number(level));
    }
    return 2;
  }

  private static normalizeGeneratedPayloadSamplesMaxDepth(
    value?: number | string | undefined,
  ): number {
    if (!isNaN(Number(value))) {
      return Math.max(0, Number(value));
    }

    return 10;
  }

  theme: ResolvedThemeInterface;
  scrollYOffset: () => number;
  hideHostname: boolean;
  expandResponses: { [code: string]: boolean } | 'all';
  sortRequiredPropsFirst: boolean;
  sortPropsAlphabetically: boolean;
  sortEnumValuesAlphabetically: boolean;
  sortOperationsAlphabetically: boolean;
  sortTagsAlphabetically: boolean;
  nativeScrollbars: boolean;
  pathInMiddlePanel: boolean;
  sanitize: boolean;
  hideDownloadButtons: boolean;
  downloadFileName?: string;
  downloadDefinitionUrl?: string;
  downloadUrls?: DownloadUrlsConfig;
  disableSearch: boolean;
  onlyRequiredInSamples: boolean;
  showExtensions: boolean | string[];
  sideNavStyle: SideNavStyleEnum;
  hideSingleRequestSampleTab: boolean;
  hideRequestPayloadSample: boolean;
  menuToggle: boolean;
  jsonSamplesExpandLevel: number;
  enumSkipQuotes: boolean;
  hideSchemaTitles: boolean;
  simpleOneOfTypeLabel: boolean;
  payloadSampleIdx: number;
  expandSingleSchemaField: boolean;
  schemasExpansionLevel: number;
  schemaDefinitionsTagName?: string;
  showObjectSchemaExamples: boolean;
  showSecuritySchemeType?: boolean;
  hideSecuritySection?: boolean;

  /* tslint:disable-next-line */
  unstable_ignoreMimeParameters: boolean;
  allowedMdComponents: Record<string, MDXComponentMeta>;

  expandDefaultServerVariables: boolean;
  maxDisplayedEnumValues?: number;

  ignoreNamedSchemas: Set<string>;
  hideSchemaPattern: boolean;
  generatedSamplesMaxDepth: number;
  hideFab: boolean;
  minCharacterLengthToInitSearch: number;
  showWebhookVerb: boolean;
  hidePropertiesPrefix?: boolean;

  nonce?: string;

  constructor(raw: RedocRawOptions, defaults: RedocRawOptions = {}) {
    raw = { ...defaults, ...raw };
    const hook = raw.theme && raw.theme.extensionsHook;

    // migrate from old theme
    if ((raw.theme as any)?.menu && !raw.theme?.sidebar) {
      console.warn('Theme setting "menu" is deprecated. Rename to "sidebar"');
      raw.theme!.sidebar = (raw.theme as any).menu;
    }

    if ((raw.theme as any)?.codeSample && !raw.theme?.codeBlock) {
      console.warn('Theme setting "codeSample" is deprecated. Rename to "codeBlock"');
      raw.theme!.codeBlock = (raw.theme as any).codeSample;
    }

    this.theme = resolveTheme(
      mergeObjects({} as any, defaultTheme, { ...raw.theme, extensionsHook: undefined }),
    );

    this.theme.extensionsHook = hook as any;

    // do not support dynamic labels changes. Labels should be configured before
    setRedocLabels(raw.labels);

    this.scrollYOffset = RedocNormalizedOptions.normalizeScrollYOffset(raw.scrollYOffset);
    this.hideHostname = RedocNormalizedOptions.normalizeHideHostname(raw.hideHostname);
    this.expandResponses = RedocNormalizedOptions.normalizeExpandResponses(raw.expandResponses);
    this.sortRequiredPropsFirst = argValueToBoolean(
      raw.sortRequiredPropsFirst || raw.requiredPropsFirst,
    );
    this.sortPropsAlphabetically = argValueToBoolean(raw.sortPropsAlphabetically);
    this.sortEnumValuesAlphabetically = argValueToBoolean(raw.sortEnumValuesAlphabetically);
    this.sortOperationsAlphabetically = argValueToBoolean(raw.sortOperationsAlphabetically);
    this.sortTagsAlphabetically = argValueToBoolean(raw.sortTagsAlphabetically);
    this.nativeScrollbars = argValueToBoolean(raw.nativeScrollbars);
    this.pathInMiddlePanel = argValueToBoolean(raw.pathInMiddlePanel);
    this.sanitize = argValueToBoolean(raw.sanitize || raw.untrustedSpec);
    this.hideDownloadButtons = argValueToBoolean(raw.hideDownloadButtons || raw.hideDownloadButton);
    this.downloadFileName = raw.downloadFileName;
    this.downloadDefinitionUrl = raw.downloadDefinitionUrl;
    this.downloadUrls = raw.downloadUrls;
    this.disableSearch = argValueToBoolean(raw.disableSearch);
    this.onlyRequiredInSamples = argValueToBoolean(raw.onlyRequiredInSamples);
    this.showExtensions = RedocNormalizedOptions.normalizeShowExtensions(raw.showExtensions);
    this.sideNavStyle = RedocNormalizedOptions.normalizeSideNavStyle(raw.sideNavStyle);
    this.hideSingleRequestSampleTab = argValueToBoolean(raw.hideSingleRequestSampleTab);
    this.hideRequestPayloadSample = argValueToBoolean(raw.hideRequestPayloadSample);
    this.menuToggle = argValueToBoolean(raw.menuToggle, true);
    this.jsonSamplesExpandLevel = RedocNormalizedOptions.normalizeJsonSampleExpandLevel(
      raw.jsonSamplesExpandLevel || raw.jsonSampleExpandLevel,
    );
    this.enumSkipQuotes = argValueToBoolean(raw.enumSkipQuotes);
    this.hideSchemaTitles = argValueToBoolean(raw.hideSchemaTitles);
    this.simpleOneOfTypeLabel = argValueToBoolean(raw.simpleOneOfTypeLabel);
    this.payloadSampleIdx = RedocNormalizedOptions.normalizePayloadSampleIdx(raw.payloadSampleIdx);
    this.expandSingleSchemaField = argValueToBoolean(raw.expandSingleSchemaField);
    this.schemasExpansionLevel = argValueToExpandLevel(
      raw.schemasExpansionLevel || raw.schemaExpansionLevel,
    );
    this.schemaDefinitionsTagName = raw.schemaDefinitionsTagName;
    this.showObjectSchemaExamples = argValueToBoolean(raw.showObjectSchemaExamples);
    this.showSecuritySchemeType = argValueToBoolean(raw.showSecuritySchemeType);
    this.hideSecuritySection = argValueToBoolean(raw.hideSecuritySection);

    this.unstable_ignoreMimeParameters = argValueToBoolean(raw.unstable_ignoreMimeParameters);

    this.allowedMdComponents = raw.allowedMdComponents || {};

    this.expandDefaultServerVariables = argValueToBoolean(raw.expandDefaultServerVariables);
    this.maxDisplayedEnumValues = argValueToNumber(raw.maxDisplayedEnumValues);
    const ignoreNamedSchemas = isArray(raw.ignoreNamedSchemas)
      ? raw.ignoreNamedSchemas
      : raw.ignoreNamedSchemas?.split(',').map(s => s.trim());
    this.ignoreNamedSchemas = new Set(ignoreNamedSchemas);
    this.hideSchemaPattern = argValueToBoolean(raw.hideSchemaPattern);
    this.generatedSamplesMaxDepth = RedocNormalizedOptions.normalizeGeneratedPayloadSamplesMaxDepth(
      raw.generatedSamplesMaxDepth || raw.generatedPayloadSamplesMaxDepth,
    );
    this.nonce = raw.nonce;
    this.hideFab = argValueToBoolean(raw.hideFab);
    this.minCharacterLengthToInitSearch = argValueToNumber(raw.minCharacterLengthToInitSearch) || 3;
    this.showWebhookVerb = argValueToBoolean(raw.showWebhookVerb);
    this.hidePropertiesPrefix = argValueToBoolean(raw.hidePropertiesPrefix, true);
  }
}
