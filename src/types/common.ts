import type { Node } from '@markdoc/markdoc';
import type {
  ConfigureRequestValues,
  ConfigureServerRequestValues,
} from '@redocly/theme/ext/configure';

export type { ConfigureRequestValues, ConfigureServerRequestValues };

export type ObjectValues<T> = T[keyof T];

export type OpenAPIRef = {
  $ref: string;
  'x-refsStack'?: string[];
  summary?: string;
  description?: string | Node[] | Node;
};

export type Referenced<T> = T | OpenAPIRef;

export type SeoData = {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
};

export type ExternalDocsData = {
  url: string;
  description?: string | Node[] | Node;
};

export type BadgeData = {
  name: string;
  color?: string;
  position?: 'before' | 'after';
  icon?: string;
  description?: string;
};

export type Badge = {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
};

export type ServerData = {
  url: string;
  name?: string;
  description?: string;

  variables?: Record<
    string,
    { enum?: string[]; default: string; description?: string | Node[] | Node; examples?: string[] }
  >;
};

export const apiSpecType = {
  OPENAPI: 'openapi',
  ASYNCAPI: 'asyncapi',
  GRAPHQL: 'graphql',
} as const;

export type ApiSpecType = ObjectValues<typeof apiSpecType>;

export const tagKind = {
  NAV: 'nav',
  BADGE: 'badge',
  AUDIENCE: 'audience',
} as const;

export type TagKind = ObjectValues<typeof tagKind>;

export const contentType = {
  OVERVIEW: 'overview',
  GROUP: 'group',
  ITEM: 'item',
} as const;

export type ContentType = ObjectValues<typeof contentType>;

export const itemVariant = {
  HTTP_ITEM: 'httpItem',
  SCHEMA: 'schema',
  CHANNEL: 'channel',
  CHANNEL_OPERATION: 'channelOperation',
  MESSAGE: 'message',
  QUERY: 'query',
  MUTATION: 'mutation',
  SUBSCRIPTION: 'subscription',
  DIRECTIVE: 'directive',
  OBJECT: 'object',
  INTERFACE: 'interface',
  INPUT: 'input',
  UNION: 'union',
  ENUM: 'enum',
  SCALAR: 'scalar',
  MARKDOWN: 'markdown',
} as const;

export type ItemVariant = ObjectValues<typeof itemVariant>;

export const securitySchemeType = {
  API_KEY: 'apiKey',
  HTTP: 'http',
  OAUTH2: 'oauth2',
  OPEN_ID_CONNECT: 'openIdConnect',
  MUTUAL_TLS: 'mutualTLS',
} as const;

export type SecuritySchemeType = ObjectValues<typeof securitySchemeType>;

export const securitySchemeIn = {
  QUERY: 'query',
  HEADER: 'header',
  COOKIE: 'cookie',
  QUERYSTRING: 'querystring',
} as const;

export type SecuritySchemeIn = ObjectValues<typeof securitySchemeIn>;

export const nodeTypes = {
  CONTAINER: 'container',
  HEADER: 'header',
  EMPTY_MESSAGE: 'empty-message',
  ITEM: 'item-content',
  SECURITY: 'security',
  MARKDOC: 'markdoc',
  ADMONITION: 'admonition',
  OVERVIEW_SECTION_WRAPPER: 'overview-section-wrapper',
  EXTERNAL_DOCS: 'external-docs',
  CHANNEL_ADDRESS: 'channel-address',
  MESSAGE_LINKS: 'message-links',
  INFO_METADATA: 'info-metadata',
  EXTENSIONS: 'extensions',
} as const;

export type NodeTypes = ObjectValues<typeof nodeTypes>;

export const panelKind = {
  LOCATIONS: 'locations',
  GROUP_ITEMS: 'group-items',
  EXTERNAL_LINK: 'externallink',
  EMAIL: 'email',
  PAYLOAD: 'payload',
  TAGS: 'tags',
  CONNECT_MCP_BUTTON: 'connect-mcp-button',
  ATTRIBUTE: 'attribute',
  DOWNLOAD: 'download',
  SERVERS: 'servers',
  BROKERS: 'brokers',
  CHANNEL_BINDING: 'channel-binding',
  OPERATION_BINDING: 'operation-binding',
  MESSAGE_BINDING: 'message-binding',
  MESSAGE_REFERENCES: 'message-references',
  REFERENCES: 'references',
  CODE_SAMPLE: 'code-sample',
  CALLBACK_PAYLOAD: 'callback-payload',
  RESPONSE: 'response',
  GRAPHQL_QUERY: 'graphql-query',
  GRAPHQL_RESPONSE: 'graphql-response',
  GRAPHQL_VARIABLES: 'graphql-variables',
  GRAPHQL_TYPE_SAMPLE: 'graphql-type-sample',
  MCP_EXAMPLE: 'mcp-example',
} as const;

export type PanelKind = ObjectValues<typeof panelKind>;

export const schemaKind = {
  JSON_SCHEMA: 'json-schema',
  GRAPHQL_TYPE: 'graphql-type',
} as const;

export type SchemaKind = ObjectValues<typeof schemaKind>;

/** A logo as authored, keyed by `url`: OpenAPI `info.x-logo` and the standalone `logo` prop. */
export type RawLogo = {
  url?: string;
  href?: string;
  altText?: string;
  backgroundColor?: string;
};

/**
 * A logo normalized to what the `SidebarLogo` component renders, keyed by `imageUrl`.
 * Also the shape of the `apiLogo` option, which is authored this way already.
 */
export type SidebarLogo = {
  imageUrl?: string;
  href?: string;
  altText?: string;
  backgroundColor?: string;
};
