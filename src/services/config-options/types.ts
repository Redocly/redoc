import type { CodeSamplesConfig } from '../code-samples/index.js';
import type { LayoutVariant } from '@redocly/config';
import type { DownloadUrlsConfig } from '../../components/Download/types.js';
import type { ComponentType } from 'react';
import type { Schema, ConfigFunction } from '@markdoc/markdoc/dist/src/types';

export interface Options {
  scrollYOffset: () => number;
  sortRequiredPropsFirst: boolean;
  sanitize: boolean;
  hideDownloadButtons: boolean | null;
  hideSidebar: boolean;
  downloadUrls?: DownloadUrlsConfig;
  onlyRequiredInSamples: boolean;
  generatedSamplesMaxDepth: number;
  showExtensions: string[] | boolean;
  hideSchemaTitles: boolean;
  jsonSamplesExpandLevel: number;
  schemasExpansionLevel: number | undefined;
  maxDisplayedEnumValues: number;
  ignoreNamedSchemas: Set<string>;
  schemaDefinitionsTagName?: string;
  layout: LayoutVariant;
  skipBundle: boolean;
  routingBasePath: string;
  codeSamples: CodeSamplesConfig;
  hidePropertiesPrefix: boolean;
  markdocOptions?: {
    tags: Record<string, Schema>;
    nodes: Record<string, Schema>;
    components: Record<string, ComponentType>;
    variables?: Record<string, any>;
    partials?: Record<string, any>;
    functions?: Record<string, ConfigFunction>;
  };
}
