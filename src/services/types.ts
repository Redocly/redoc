import type { ReactElement } from 'react';
import type { Node } from '@markdoc/markdoc';
import type {
  OpenAPIDefinition,
  OpenAPIInfo,
  OpenAPIOperation,
  OpenAPIParameter,
  OpenAPISchema,
  OpenAPIServer,
  OpenAPITag,
  Referenced,
} from '../types/index.js';
import type { OperationModel, Sample } from '../models';

export type Normalized<T> = { [P in keyof T]-?: T[P] };

export type ExternalLink = ExternalLinkLink | ExternalLinkSeparator;

export type ExternalLinkLink = {
  label: string;
  link: string;
  target?: string;
  separatorLine?: boolean;
};
export type ExternalLinkSeparator = {
  separator?: string;
  separatorLine?: boolean;
};

export type MenuItemGroupType = 'group' | 'tag' | 'section' | 'schema' | 'mcp';
export type MenuItemType = MenuItemGroupType | 'operation';

/** Generic interface for MenuItems */
export interface IMenuItem {
  id: string;
  href: string;
  name: string;
  description?: string | GenericObject;
  depth: number;
  items: IMenuItem[];
  parent?: IMenuItem;
  deprecated?: boolean;
  type: MenuItemType;
  isSchema?: boolean;
  httpVerb?: string;
  isWebhook?: boolean;
  path?: string;
  definition?: OpenAPIDefinition;
}

export type TagInfo = OpenAPITag & {
  operations: ExtendedOpenAPIOperation[];
  used?: boolean;
  schemaRendersInTag?: boolean;
  isSchema?: boolean;
};

export type ExtendedOpenAPIOperation = {
  pointer: string;
  pathName: string;
  httpVerb: string;
  pathParameters: Array<Referenced<OpenAPIParameter>>;
  pathServers: Array<OpenAPIServer> | undefined;
  isWebhook: boolean;
  defaultSampleName?: string | false;
} & OpenAPIOperation;

export type TagsInfoMap = Record<string, TagInfo>;

export interface TagGroup {
  name: string;
  tags: string[];
}

export type MergedOpenAPISchema = OpenAPISchema & {
  'x-refsStack'?: string[];
  'x-parentRefs'?: string[];
  'x-circular-ref'?: boolean;
  'x-complex'?: boolean;
  absolutePointer?: string;
};

export interface MarkdownHeading {
  id: string;
  name: string;
  level: number;
  items?: MarkdownHeading[];
  description?: string | GenericObject;
  ast?: Node[];
}

export type Unstable_ExternalCodeSample = Sample & {
  get: (source: ExternalSource) => string;
};

export interface ExternalSource {
  sample: Unstable_ExternalCodeSample;
  operation: OperationModel;
  exampleName?: string;
  pathParams?: any;
  properties?: any;
}

export interface HookRawHtml {
  html: string;
}

type HookResult = ReactElement | HookRawHtml | null;

export type HookConfig<T> = (props: T) => HookResult;
export interface HooksConfig {
  AfterApiTitle?: HookConfig<{ info: OpenAPIInfo }>;
  BeforeOperation?: HookConfig<{ operation: OperationModel }>;
  BeforeOperationSummary?: HookConfig<{ operation: OperationModel }>;
  AfterOperationSummary?: HookConfig<{ operation: OperationModel }>;
  AfterOperation?: HookConfig<{ operation: OperationModel }>;
  onInit?: (args: { store: GenericObject }) => void;
  replaceSecurityLink?: (args: { securityRequirementId: string }) => string;
  sanitize?: (raw: string) => string;
  MiddlePanelFooter?: HookConfig<undefined>;
  MiddlePanelHeader?: HookConfig<undefined>;
}

export type ExtendedMenuItem = Omit<IMenuItem, 'type'> & {
  type: MenuItemType | 'spec';
  linkable?: boolean;
  href?: string;
  httpVerb?: string;
  path?: string;
};
