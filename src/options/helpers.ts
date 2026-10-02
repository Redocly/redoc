import { LayoutVariant, type RedocConfig } from '@redocly/config';

import type { ApiSpecType } from '../types/common.js';
import type { RawApiDocsOptions } from '../types/options.js';
import type { CodeSamplesConfig } from '../types/code-samples-config.js';

import { apiSpecType } from '../types/common.js';
import { DEFAULT_LAYOUT } from './constants.js';
import { DEFAULT_LANGUAGES, getLangKey } from '../utils/languages.js';

export function argValueToBoolean(val?: string | boolean, defaultValue?: boolean): boolean {
  if (val === undefined) {
    return defaultValue ?? false;
  }
  if (typeof val === 'string') {
    return val !== 'false';
  }
  return val;
}

export function argValueToNumber(value: number | string | undefined, defaultValue = 0): number {
  if (typeof value === 'string') {
    return parseInt(value, 10);
  }
  if (typeof value === 'number') {
    return value;
  }
  return defaultValue;
}

export function argValueToInt(value: number | string | undefined, defaultValue = 0): number {
  if (typeof value === 'string') {
    return parseInt(value, 10);
  }
  if (typeof value === 'number') {
    return Math.ceil(value);
  }
  return defaultValue;
}

export function argValueToExpandLevel(
  value?: number | string | undefined,
  defaultValue?: number,
): number | undefined {
  if (value === undefined) return defaultValue;
  if (value === 'all') return Infinity;
  return argValueToInt(value, defaultValue);
}

export function normalizePath(path: string): string {
  let p = path;
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  if (!p.startsWith('/')) {
    p = '/' + p;
  }
  return p;
}

export function normalizeShowExtensions(value: RedocConfig['showExtensions']): string[] | boolean {
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
      return value
        .split(',')
        .map((ext) => ext.trim())
        .filter(Boolean);
  }
}

function isNumeric(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value);
}

/**
 * Normalize scrollYOffset for OpenAPI options. Safe for SSR: no DOM (querySelector).
 * In browser, openapi-docs version also supports CSS selector strings.
 */
export function normalizeScrollYOffset(value: RedocConfig['scrollYOffset']): () => number {
  if (typeof value === 'number') {
    return () => value;
  }
  if (typeof value === 'string' && isNumeric(value)) {
    return () => parseFloat(value);
  }
  if (typeof value === 'function') {
    return () => {
      const res = value();
      return typeof res === 'number' ? res : 0;
    };
  }
  return () => 0;
}

export function normalizeCodeSamples(value?: RedocConfig['codeSamples']): CodeSamplesConfig {
  const config = typeof value === 'object' && value !== null ? value : {};
  const configured =
    config.languages ??
    DEFAULT_LANGUAGES.map(({ label }): { lang: string; label?: string } => ({ lang: label }));
  return {
    ...config,
    languages: configured.map((entry) => ({
      ...entry,
      key: getLangKey(entry),
      label: entry.label ?? entry.lang,
    })),
  };
}

export function normalizeIgnoreNamedSchemas(
  value: RawApiDocsOptions['ignoreNamedSchemas'],
): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return value.split(',').map((s) => s.trim());
  }
  return [];
}

export function normalizeDownloadUrls(
  downloadUrls: { title?: string; url: string }[],
  type: ApiSpecType,
): { title: string; url: string }[] {
  return downloadUrls.map((url) => ({
    ...url,
    title: url.title ?? getFileNameFromUrl(url.url, type),
  }));
}

function getFileNameFromUrl(url: string, type: ApiSpecType): string {
  const filename = url
    .split('?')[0]
    .split(/[\\/]/) // handle backslash for Windows system
    .pop();

  if (filename && ['yaml', 'json', 'gql', 'graphql'].some((ext) => filename.includes(ext))) {
    return filename;
  }

  switch (type) {
    case apiSpecType.OPENAPI:
      return 'openapi.yaml';
    case apiSpecType.ASYNCAPI:
      return 'asyncapi.yaml';
    case apiSpecType.GRAPHQL:
      return 'graphql.gql';
    default:
      return 'description.json';
  }
}

export function normalizeLayout(layout: RawApiDocsOptions['layout']): LayoutVariant {
  if (layout === undefined) {
    return DEFAULT_LAYOUT;
  }
  if (layout === LayoutVariant.STACKED) {
    return LayoutVariant.STACKED;
  }
  return LayoutVariant.THREE_PANEL;
}
