import type { LayoutVariant } from '@redocly/config';

import type {
  EditionAsyncApiConfig,
  EditionGraphQLConfig,
  EditionRedocConfig,
} from './edition-config.js';
import type { ConfigFunction, Node, Schema } from '@markdoc/markdoc';
import type { MarkdocTagSchema } from '@redocly/theme/markdoc/tags/types';
import type { ComponentType } from 'react';
import type { ApiSpecType, SidebarLogo } from './common.js';
import type { ProtocolVariant } from './asyncapi.js';
import type { GraphQLOptions } from './graphql.js';
import type { Events } from './events.js';
import type { CodeSamplesConfig } from './code-samples-config.js';

export type * from './code-samples-config.js';

export type Operation = {
  id: string;
  path: string;
  httpVerb: string;
  name: string;
};

export type DownloadUrl = {
  title?: string;
  url: string;
};

export type NormalizedDownloadUrl = DownloadUrl & {
  title: string;
};

export type ApiDocsMetadata = {
  title?: string;
  description?: string | Node[] | Node;
  summary?: string;
  version?: string;
  [key: string]: unknown;
};

export type MarkdocOptions = {
  tags: Record<string, MarkdocTagSchema>;
  nodes: Record<string, Schema>;
  components: Record<string, ComponentType<any>>;
  variables?: Record<string, unknown>;
  partials?: Record<string, unknown>;
  functions?: Record<string, ConfigFunction>;
};

/**
 * Turns a raw markdown string into an AST. api-docs core does not bundle a markdown engine — the
 * host supplies the parser (the standalone build supplies a Markdoc-based one; see
 * `markdocParser`). It is the single seam where markdown text becomes an AST.
 */
export type MarkdownParser = (
  markdown: string,
  sanitizeOptions?: {
    sanitize?: ApiDocsOptions['sanitize'];
  },
) => Node | Node[] | undefined;

export type ApiDocsOptions = {
  schemaDefinitionsTagName?: string;
  jsonSamplesExpandLevel: number;
  generatedSamplesMaxDepth: number;
  hideDownloadButtons: boolean;
  hideSchemaTitles: boolean;
  hideSchemaPattern: boolean;
  maxDisplayedEnumValues: number;
  onlyRequiredInSamples: boolean;
  onDeepLinkClick: ((link: string) => void) | undefined | null;
  schemasExpansionLevel?: number;
  sortRequiredPropsFirst: boolean;
  sanitize: boolean;
  showExtensions: string[] | boolean;
  ignoreNamedSchemas: Set<string>;
  markdownParser: MarkdownParser;
  codeSamples?: CodeSamplesConfig;
  events: Events;
  hidePropertiesPrefix: boolean;
  protocol?: ProtocolVariant;
  scrollYOffset: () => number;
  hideLoading: boolean;
  skipBundle: boolean;
  basePath: string;
  specType: ApiSpecType;
  metadata: ApiDocsMetadata;
  downloadUrls?: NormalizedDownloadUrl[];
  layout: LayoutVariant;
  apiLogo?: SidebarLogo;
  jsonSamplesDepth: number;
  samplesMaxInlineArgs: number;
  fieldExpandLevel: number;
} & GraphQLOptions;


export type RawApiDocsOptions = EditionRedocConfig &
  EditionAsyncApiConfig &
  EditionGraphQLConfig & {
    specType: ApiSpecType;
    markdownParser: MarkdownParser;
    basePath?: string;
    hideSchemaPattern?: boolean;
    disableTelemetry?: boolean;
    requiredPropsFirst?: boolean; // alias of `sortRequiredPropsFirst`
    protocol?: ProtocolVariant;
    layout?:
      | EditionRedocConfig['layout']
      | EditionAsyncApiConfig['layout']
      | EditionGraphQLConfig['layout'];
  };

