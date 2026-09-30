import type { ResolvedNavItem } from '@redocly/config';
import type { DocumentNode } from 'graphql';
import type { Node } from '@markdoc/markdoc';
import type {
  ApiSpecType,
  Badge,
  BadgeData,
  ContentType,
  ItemVariant,
  SecuritySchemeIn,
  SecuritySchemeType,
  ServerData,
  SeoData,
  SidebarLogo,
  SchemaKind,
} from './common.js';
import type { McpTool, McpResource, McpPrompt, OpenAPIDefinition } from './openapi.js';
import type { AsyncApiDefinition } from './asyncapi.js';
import type { ApiDocsOptions } from './options.js';
import type { ContentNode } from './content.js';
import type { GraphqlStoreMeta } from './graphql-store.js';

export type AdapterBuildContextInput = {
  options: ApiDocsOptions;
  basePath: string;
};

export type ApiDocAdapterProps = {
  type: ApiSpecType;
  document: OpenAPIDefinition | AsyncApiDefinition | DocumentNode;
  options: ApiDocsOptions;
  basePath: string;
};

export type StoreContext = {
  schemaStore: Record<string, SchemaEntry>;
  exampleStore: Record<string, ExampleEntry>;
  securitySchemeStore: Record<string, SecuritySchemeEntry>;
  hashIndex: Record<string, string>;
  document: Record<string, unknown>;
};

export type ApiItemContent = {
  contentType: ContentType;
  seo?: SeoData;
  itemVariant?: ItemVariant;
  meta?: ItemMeta;
  children: ContentNode[];
  showDivider?: boolean;
};

export type BreadcrumbItem = {
  label: string;
};

export type ItemMeta = {
  sourceId?: string; // is used to identify pointer in pluggable components
  name?: string;
  deprecated?: boolean;
  isWebhook?: boolean;
  hasSamples?: boolean;
  badges?: BadgeData[];
  pointer?: string;
  position?: {
    // Precomputed source position (1-based line/column). Used by formats whose source
    start: { lineNumber: number; column: number };
    end?: { lineNumber: number; column: number };
  };
  protocolTag?: { label: string; color: string };
  breadcrumbs?: BreadcrumbItem[];
  action?: 'send' | 'receive';
  actionLabel?: string;
  channelBindings?: Record<string, unknown>;
  returnType?: string;
};

export type ApiItem = ResolvedNavItem & {
  content: ApiItemContent | null;
  httpVerb?: string;
};

export type SchemaEntry = {
  id: string;
  kind: SchemaKind;
  title?: string;
  data: Record<string, unknown>;
};

export type ExampleEntry = {
  id: string;
  value: unknown;
  key?: string;
  summary?: string;
  description?: string | Node | Node[];
  mediaType?: string;
  externalValue?: string;
};

export type OAuthFlowEntry = {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  deviceAuthorizationUrl?: string;
  scopes?: Record<string, string>;
};

export type OAuthFlowsData = {
  implicit?: { authorizationUrl?: string; refreshUrl?: string; scopes: Record<string, string> };
  password?: { tokenUrl: string; refreshUrl?: string; scopes: Record<string, string> };
  clientCredentials?: {
    tokenUrl: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
  };
  authorizationCode?: {
    authorizationUrl: string;
    tokenUrl: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
    'x-usePkce'?: boolean;
  };
  deviceAuthorization?: {
    deviceAuthorizationUrl: string;
    tokenUrl: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
    'x-defaultClientId'?: string;
  };
};

export type SecuritySchemeCredentials = {
  'x-defaultAccessToken'?: string;
  'x-defaultTokenType'?: string;
  'x-defaultClientId'?: string;
  'x-defaultClientSecret'?: string;
  'x-defaultUsername'?: string;
  'x-defaultPassword'?: string;
  scopes?: string[];
};

export type SecuritySchemeEntry = {
  id: string;
  type: SecuritySchemeType;
  scheme?: string;
  bearerFormat?: string;
  description?: string | Node[] | Node;
  in?: SecuritySchemeIn;
  paramName?: string;
  openIdConnectUrl?: string;
  deprecated?: boolean;
  oauth2MetadataUrl?: string;
  'x-defaultClientId'?: string;
  'x-defaultAccessToken'?: string;
  'x-defaultTokenType'?: string;
  'x-defaultClientSecret'?: string;
  'x-defaultUsername'?: string;
  'x-defaultPassword'?: string;
  serverValues?: Record<string, SecuritySchemeCredentials>;
  flows?: OAuthFlowsData;
};

export type GroupItem = {
  title: string;
  summary?: string;
  prefix?: Badge;
  badges?: Badge[];
  link: string;
  deprecated: boolean;
  childTag?: boolean;
};

export type McpData = {
  tools?: McpTool[];
  resources?: McpResource[];
  prompts?: McpPrompt[];
};

export type ApiStore = {
  schemaStore: Record<string, SchemaEntry>;
  exampleStore: Record<string, ExampleEntry>;
  securitySchemeStore: Record<string, SecuritySchemeEntry>;
  graphqlMeta?: GraphqlStoreMeta;
  servers?: ServerData[];
  mcp?: McpData;
  /** From OpenAPI `info.x-logo`. Rendered by the standalone sidebar. */
  logo?: SidebarLogo;
  specType?: ApiSpecType;
};
