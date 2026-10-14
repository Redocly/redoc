import type { Node } from '@markdoc/markdoc';
import type {
  OpenAPIRef,
  RawLogo,
  Referenced,
  ExternalDocsData,
  SecuritySchemeType,
  SecuritySchemeIn,
  ObjectValues,
} from './common.js';
import type { StoreContext } from './store.js';
import type { ApiDocsOptions, NormalizedDownloadUrl } from './options.js';
import type { securitySchemeType } from './common.js';
import type { ExampleType } from './schema.js';

export type OpenAPIDefinition = {
  openapi: string;
  info: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths: OpenAPIPaths;
  components?: OpenAPIComponents;
  security?: OpenAPISecurityRequirement[];
  tags?: OpenAPITag[];
  externalDocs?: OpenAPIExternalDocumentation;
  webhooks?: OpenAPIPaths;
  'x-mcp'?: OpenAPIMcp;
  'x-webhooks'?: OpenAPIPaths;
  'x-tagGroups'?: Array<{
    name: string;
    tags: Array<string>;
  }>;
  'x-keywords'?: unknown;
};

export type OpenAPIInfo = {
  title: string;
  version: string;

  description?: string | Node[] | Node;
  summary?: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;
  externalDocs?: OpenAPIExternalDocumentation;
  'x-logo'?: XLogo;
};

export type XLogo = RawLogo;


export type OpenAPIServer = {
  url: string;
  description?: string | Node | Node[];
  name?: string;
  variables?: OpenAPIServerVariables;
};

export type OpenAPIServerVariables = {
  [name: string]: OpenAPIServerVariable;
};

export type OpenAPIServerVariable = {
  enum?: string[];
  default: string;
  description?: string | Node[] | Node;
};

export type OpenAPIPaths = {
  [path: string]: OpenAPIPath;
};

export { type OpenAPIRef } from './common.js';

export type OpenAPIPath = Partial<OpenAPIRef> & {
  summary?: string;
  description?: string | Node[] | Node;
  get?: OpenAPIOperation;
  put?: OpenAPIOperation;
  post?: OpenAPIOperation;
  query?: OpenAPIOperation;
  'x-query'?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  options?: OpenAPIOperation;
  head?: OpenAPIOperation;
  patch?: OpenAPIOperation;
  trace?: OpenAPIOperation;
  additionalOperations?: Record<string, OpenAPIOperation>;
  servers?: OpenAPIServer[];
  parameters?: Array<Referenced<OpenAPIParameter>>;
};

export type Sample = {
  lang: string;
  label?: string;
};
export type OpenAPIXCodeSample = Sample & {
  source: string;
};

export type OpenAPIXBadges = {
  name: string;
  color?: string;
  position?: 'before' | 'after';
  icon?: string;
  description?: string;
};

export type OpenAPIOperation = {
  tags?: string[];
  summary?: string;
  description?: string | Node[];
  externalDocs?: OpenAPIExternalDocumentation;
  operationId?: string;
  parameters?: Array<Referenced<OpenAPIParameter>>;
  requestBody?: Referenced<OpenAPIRequestBody>;
  responses: OpenAPIResponses;
  callbacks?: { [name: string]: Referenced<OpenAPICallback> };
  deprecated?: boolean;
  security?: OpenAPISecurityRequirement[];
  servers?: OpenAPIServer[];
  'x-codeSamples'?: OpenAPIXCodeSample[];
  'x-badges'?: OpenAPIXBadges[];
};

export type OpenAPIParameter = {
  name: string;
  in?: OpenAPIParameterLocation;
  description?: string | Node[] | Node;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: OpenAPIParameterStyle;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Referenced<OpenAPISchema>;
  example?: unknown;
  examples?: { [media: string]: Referenced<OpenAPIExample> };
  content?: { [media: string]: Referenced<OpenAPIMediaType> };
  encoding?: Record<string, OpenAPIEncoding>;
  const?: unknown;
};

export type OpenAPIExample = {
  value?: unknown;
  dataValue?: unknown;
  serializedValue?: string;
  summary?: string;
  description?: string | Node[] | Node;
  externalValue?: string;
};

export type XMLNodeType = 'element' | 'attribute' | 'text' | 'cdata' | 'none';

export type XMLObject = {
  nodeType?: XMLNodeType;
  name?: string;
  namespace?: string;
  prefix?: string;
  /** @deprecated Use nodeType: "attribute" instead */
  attribute?: boolean;
  /** @deprecated Use nodeType: "element" instead (for wrapped arrays) */
  wrapped?: boolean;
};

export type OpenAPISchema = {
  $ref?: string;
  type?: string | string[];
  properties?: { [name: string]: OpenAPISchema };
  patternProperties?: { [name: string]: OpenAPISchema };
  additionalProperties?: boolean | OpenAPISchema;
  unevaluatedProperties?: boolean | OpenAPISchema;
  description?: string | Node[] | Node;
  default?: unknown;
  items?: OpenAPISchema | OpenAPISchema[] | boolean;
  required?: string[];
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  format?: string;
  externalDocs?: OpenAPIExternalDocumentation;
  discriminator?: OpenAPIDiscriminator;
  nullable?: boolean;
  oneOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  allOf?: OpenAPISchema[];
  not?: OpenAPISchema;

  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean | number;
  minimum?: number;
  exclusiveMinimum?: boolean | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  enum?: unknown[];
  example?: unknown;
  examples?: unknown[] | Record<string, ExampleType>;
  const?: string;
  contentEncoding?: string;
  contentMediaType?: string;
  if?: OpenAPISchema;
  else?: OpenAPISchema;
  then?: OpenAPISchema;
  prefixItems?: OpenAPISchema[];
  additionalItems?: OpenAPISchema | boolean;
  xml?: XMLObject;
};

export type OpenAPIDiscriminator = {
  propertyName: string;
  mapping?: { [name: string]: string };
  'x-explicitMappingOnly'?: boolean;
  defaultMapping?: string;
};

export type OpenAPIMediaType = {
  schema?: Referenced<OpenAPISchema>;
  itemSchema?: Referenced<OpenAPISchema>;
  example?: unknown;
  examples?: { [name: string]: Referenced<OpenAPIExample> };
  encoding?: { [field: string]: OpenAPIEncoding };
};

export type OpenAPIEncoding = {
  contentType?: string;
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  style?: OpenAPIParameterStyle;
  explode?: boolean;
  allowReserved?: boolean;
};

export const parameterLocation = {
  QUERY: 'query',
  HEADER: 'header',
  PATH: 'path',
  COOKIE: 'cookie',
  QUERYSTRING: 'querystring',
} as const;

export type OpenAPIParameterLocation = ObjectValues<typeof parameterLocation>;
export type OpenAPIParameterStyle =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject';

export type OpenAPIRequestBody = {
  $ref?: string;
  description?: string | Node[] | Node;
  required?: boolean;
  content?: { [mime: string]: Referenced<OpenAPIMediaType> };

  'x-examples'?: { [mime: string]: { [name: string]: Referenced<OpenAPIExample> } };
  'x-example'?: { [mime: string]: unknown };
};

export type OpenAPIResponses = {
  [code: string]: OpenAPIResponse;
};

export type OpenAPIResponse = {
  description?: string | Node[] | Node;
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  content?: { [mime: string]: Referenced<OpenAPIMediaType> };
  links?: { [name: string]: Referenced<OpenAPILink> };
  $ref?: string;

  'x-examples'?: { [mime: string]: { [name: string]: Referenced<OpenAPIExample> } };
  'x-example'?: { [mime: string]: unknown };
  'x-summary'?: string;
};

export type OpenAPILink = {
  $ref?: string;
};

export type OpenAPIHeader = Omit<OpenAPIParameter, 'in' | 'name'>;

export type OpenAPICallback = {
  [name: string]: OpenAPIPath;
};

export type OpenAPIComponents = {
  schemas?: { [name: string]: Referenced<OpenAPISchema> };
  responses?: { [name: string]: Referenced<OpenAPIResponse> };
  parameters?: { [name: string]: Referenced<OpenAPIParameter> };
  examples?: { [name: string]: Referenced<OpenAPIExample> };
  requestBodies?: { [name: string]: Referenced<OpenAPIRequestBody> };
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  securitySchemes?: { [name: string]: Referenced<OpenAPISecurityScheme> };
  links?: { [name: string]: Referenced<OpenAPILink> };
  callbacks?: { [name: string]: Referenced<OpenAPICallback> };
  mediaTypes?: { [name: string]: Referenced<OpenAPIMediaType> };
};

export type OpenAPISecurityRequirement = {
  [name: string]: string[];
};

export type OpenAPISecurityScheme = {
  type: Exclude<SecuritySchemeType, typeof securitySchemeType.MUTUAL_TLS>;
  description?: string | Node[] | Node;
  name?: string;
  in?: SecuritySchemeIn;
  scheme?: string;
  bearerFormat: string;
  deprecated?: boolean;
  oauth2MetadataUrl?: string;
  flows: {
    implicit?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      authorizationUrl: string;
    };
    deviceAuthorization?: {
      deviceAuthorizationUrl: string;
      scopes: Record<string, string>;
      tokenUrl: string;
      refreshUrl?: string;
    };
    password?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      tokenUrl: string;
    };
    clientCredentials?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      tokenUrl: string;
    };
    authorizationCode?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      authorizationUrl: string;
      tokenUrl: string;
    };
  };
  openIdConnectUrl?: string;
};

export type OpenAPITag = {
  name: string;
  description?: string | Node[] | Node;
  summary?: string;
  externalDocs?: OpenAPIExternalDocumentation;
  parent?: string;
  kind?: 'badge' | 'audience' | 'nav';
  'x-displayName'?: string;
  'x-keywords'?: unknown;
};

export type OpenAPIExternalDocumentation = {
  description?: string | Node[] | Node;
  url: string;
};

export type OpenAPIContact = {
  name?: string;
  url?: string;
  email?: string;
};

export type OpenAPILicense = {
  name: string;
  url?: string;
  identifier?: string;
};

export type ParsedDocument = OpenAPIDefinition & {
  swagger: unknown;
};

export type OpenAPIMcp = {
  protocolVersion: string;
  capabilities: McpCapabilities;
  servers: OpenAPIServer[];
  tools: McpTool[];
  resources: McpResource[];
  prompts: McpPrompt[];
};

export type McpCapabilities = {
  [key: string]:
    | boolean
    | {
        listChanged?: boolean;
        subscribe?: boolean;
        [key: string]: unknown;
      };
};

export type McpTool = {
  name: string;
  title?: string;
  description?: string | Node[] | Node;
  inputSchema: OpenAPISchema;
  outputSchema?: OpenAPISchema;
  security?: OpenAPISecurityRequirement[];
  tags?: string[];
  'x-badges'?: OpenAPIXBadges[];
};

export type McpResource = {
  name: string;
  title?: string;
  description?: string | Node[] | Node;
  uri: string;
  mimeType: string;
  blob?: string;
  text?: string;

  security?: OpenAPISecurityRequirement[];
  tags?: string[];
  'x-badges'?: OpenAPIXBadges[];
};

export type McpPrompt = {
  name: string;
  title?: string;
  description: string | Node[] | Node;
  arguments: McpPromptArgument[];
  security?: OpenAPISecurityRequirement[];
  tags?: string[];
  'x-badges'?: OpenAPIXBadges[];
};

export type McpPromptArgument = {
  name: string;
  description: string | Node[] | Node;
  required: boolean;
  example?: string;
};


export type OpenAPITagExtended = OpenAPITag & {
  'x-traitTag'?: boolean;
  'x-displayName'?: string;
  parent?: string;
  summary?: string;
  kind?: string;
};

export type NormalizedCallbackOperation = {
  httpVerb: string;
  pathName: string;
  summary?: string;
  operationId?: string;
  description?: string | Node[] | Node;
  deprecated?: boolean;
  requestBody?: Referenced<OpenAPIRequestBody>;
  responses?: OpenAPIResponses;
  security?: OpenAPISecurityRequirement[];
  servers?: OpenAPIServer[];
  parameters?: Array<Referenced<OpenAPIParameter>>;
  externalDocs?: { url: string; description?: string | Node | Node[] };
  [key: string]: unknown;
};

export type NormalizedCallback = {
  name: string;
  url?: string;
  operations?: NormalizedCallbackOperation[];
};

export type OperationInfo = {
  pointer: string;
  pathName: string;
  httpVerb: string;
  operationId?: string;
  summary?: string;
  description?: string | Node[] | Node;
  deprecated?: boolean;
  isWebhook: boolean;
  isAdditionalOperation: boolean;
  tags: string[];
  parameters?: Array<Referenced<OpenAPIParameter>>;
  requestBody?: Referenced<OpenAPIRequestBody>;
  responses?: OpenAPIResponses;
  servers?: OpenAPIServer[];
  security?: OpenAPISecurityRequirement[];
  callbacks?: NormalizedCallback[];
  externalDocs?: ExternalDocsData;
  'x-badges'?: OpenAPIXBadges[];
  'x-codeSamples'?: OpenAPIXCodeSample[];
};

export type MarkdownHeading = {
  id: string;
  name: string;
  level: number;
  items: MarkdownHeading[];
  ast: Node[];
};

export type TagData = {
  tag: OpenAPITagExtended;
  operations: OperationInfo[];
  description?: string | Node[] | Node;
  children: string[];
};

export type OpenApiBuildContext = {
  document: OpenAPIDefinition;
  options: ApiDocsOptions;
  downloadUrls?: NormalizedDownloadUrl[];
  basePath: string;
  tagsMap: Map<string, TagData>;
  collectedTagOrder: string[];
  storeCtx: StoreContext;
  badgeTags: OpenAPITag[];
  processContent: boolean;
};

export type Language = {
  key: string;
  label: string;
  lang: string;
};
