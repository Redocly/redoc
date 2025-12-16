import type { Sample } from '../models';

export interface OpenAPIDefinition {
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
}

export interface OpenAPIInfo extends ParsedDescriptionWithSummary {
  title: string;
  version: string;

  description?: string;
  summary?: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;
  externalDocs?: OpenAPIExternalDocumentation;
  'x-logo'?: XLogo;
  'x-metadata'?: XMetadata;
  'x-seo'?: XSEO;
}

export interface XLogo {
  url?: string;
  backgroundColor?: string;
  altText?: string;
  href?: string;
}

export interface XMetadata {
  apiId?: string;
  [key: string]: unknown;
}

export interface XSEO {
  title?: string;
}

export interface OpenAPIServer extends ParsedDescription {
  url: string;
  description?: string;
  name?: string;
  variables?: OpenAPIServerVariables;
}

export interface OpenAPIServerVariables {
  [name: string]: OpenAPIServerVariable;
}

export interface OpenAPIServerVariable extends ParsedDescription {
  enum?: string[];
  default: string;
  description?: string;
}

export interface OpenAPIPaths {
  [path: string]: OpenAPIPath;
}
export interface OpenAPIRef extends ParsedDescriptionWithSummary {
  $ref: string;
  'x-refsStack'?: string[];
  summary?: string;
  description?: string;
}

export type Referenced<T> = T | OpenAPIRef;

export interface OpenAPIPath extends Partial<OpenAPIRef>, ParsedDescriptionWithSummary {
  summary?: string;
  description?: string;
  get?: OpenAPIOperation;
  put?: OpenAPIOperation;
  post?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  options?: OpenAPIOperation;
  head?: OpenAPIOperation;
  patch?: OpenAPIOperation;
  trace?: OpenAPIOperation;
  additionalOperations?: Record<string, OpenAPIOperation>;
  servers?: OpenAPIServer[];
  parameters?: Array<Referenced<OpenAPIParameter>>;
}

export interface OpenAPIXCodeSample extends Sample {
  source: string;
}

export interface OpenAPIXBadges {
  name: string;
  color?: string;
  position?: 'before' | 'after';
}

export interface OpenAPIOperation extends ParsedDescriptionWithSummary {
  tags?: string[];
  summary?: string;
  description?: string;
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
}

export interface OpenAPIParameter extends ParsedDescription {
  name: string;
  in?: OpenAPIParameterLocation;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: OpenAPIParameterStyle;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Referenced<OpenAPISchema>;
  example?: any;
  examples?: { [media: string]: Referenced<OpenAPIExample> };
  content?: { [media: string]: OpenAPIMediaType };
  encoding?: Record<string, OpenAPIEncoding>;
  const?: any;
}

export interface OpenAPIExample extends ParsedDescriptionWithSummary {
  value: any;
  summary?: string;
  description?: string;
  externalValue?: string;
}

export interface XMLObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

export interface OpenAPISchema extends ParsedDescription {
  $ref?: string;
  type?: string | string[];
  properties?: { [name: string]: OpenAPISchema };
  patternProperties?: { [name: string]: OpenAPISchema };
  additionalProperties?: boolean | OpenAPISchema;
  unevaluatedProperties?: boolean | OpenAPISchema;
  description?: string;
  default?: any;
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
  enum?: any[];
  example?: any;
  examples?: any[];
  const?: string;
  contentEncoding?: string;
  contentMediaType?: string;
  if?: OpenAPISchema;
  else?: OpenAPISchema;
  then?: OpenAPISchema;
  prefixItems?: OpenAPISchema[];
  additionalItems?: OpenAPISchema | boolean;
  xml?: XMLObject;
}

export interface OpenAPIDiscriminator {
  propertyName: string;
  mapping?: { [name: string]: string };
  'x-explicitMappingOnly'?: boolean;
  defaultMapping?: string;
}

export interface OpenAPIMediaType {
  schema?: Referenced<OpenAPISchema>;
  example?: any;
  examples?: { [name: string]: Referenced<OpenAPIExample> };
  encoding?: { [field: string]: OpenAPIEncoding };
}

export interface OpenAPIEncoding {
  contentType: string;
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  style: OpenAPIParameterStyle;
  explode: boolean;
  allowReserved: boolean;
}

export type OpenAPIParameterLocation = 'query' | 'header' | 'path' | 'cookie';
export type OpenAPIParameterStyle =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject';

export interface OpenAPIRequestBody extends ParsedDescription {
  $ref?: string;
  description?: string;
  required?: boolean;
  content?: { [mime: string]: OpenAPIMediaType };

  'x-examples'?: { [mime: string]: { [name: string]: Referenced<OpenAPIExample> } };
  'x-example'?: { [mime: string]: any };
}

export interface OpenAPIResponses {
  [code: string]: OpenAPIResponse;
}

export interface OpenAPIResponse extends ParsedDescription {
  description?: string;
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  content?: { [mime: string]: OpenAPIMediaType };
  links?: { [name: string]: Referenced<OpenAPILink> };
  $ref?: string;

  'x-examples'?: { [mime: string]: { [name: string]: Referenced<OpenAPIExample> } };
  'x-example'?: { [mime: string]: any };
}

export interface OpenAPILink {
  $ref?: string;
}

export type OpenAPIHeader = Omit<OpenAPIParameter, 'in' | 'name'>;

export interface OpenAPICallback {
  [name: string]: OpenAPIPath;
}

export interface OpenAPIComponents {
  schemas?: { [name: string]: Referenced<OpenAPISchema> };
  responses?: { [name: string]: Referenced<OpenAPIResponse> };
  parameters?: { [name: string]: Referenced<OpenAPIParameter> };
  examples?: { [name: string]: Referenced<OpenAPIExample> };
  requestBodies?: { [name: string]: Referenced<OpenAPIRequestBody> };
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  securitySchemes?: { [name: string]: Referenced<OpenAPISecurityScheme> };
  links?: { [name: string]: Referenced<OpenAPILink> };
  callbacks?: { [name: string]: Referenced<OpenAPICallback> };
}

export interface OpenAPISecurityRequirement {
  [name: string]: string[];
}

export interface OpenAPISecurityScheme extends ParsedDescription {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat: string;
  'x-defaultClientId'?: string;
  deprecated?: boolean;
  oauth2MetadataUrl?: string;
  flows: {
    implicit?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      authorizationUrl: string;
      'x-defaultClientId'?: string;
    };
    deviceAuthorization?: {
      deviceAuthorizationUrl: string;
      scopes: Record<string, string>;
      tokenUrl: string;
      refreshUrl?: string;
      'x-defaultClientId'?: string;
    };
    password?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      tokenUrl: string;
      'x-defaultClientId'?: string;
    };
    clientCredentials?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      tokenUrl: string;
      'x-defaultClientId'?: string;
    };
    authorizationCode?: {
      refreshUrl?: string;
      scopes: Record<string, string>;
      authorizationUrl: string;
      tokenUrl: string;
      'x-defaultClientId'?: string;
    };
  };
  openIdConnectUrl?: string;
}

export interface OpenAPITag extends ParsedDescription {
  name: string;
  description?: string;
  externalDocs?: OpenAPIExternalDocumentation;
  'x-displayName'?: string;
}

export interface OpenAPIExternalDocumentation extends ParsedDescription {
  description?: string;
  url: string;
}

export interface OpenAPIContact {
  name?: string;
  url?: string;
  email?: string;
}

export interface OpenAPILicense {
  name: string;
  url?: string;
  identifier?: string;
}

export interface ParsedDocument extends OpenAPIDefinition {
  swagger: unknown;
}

export interface ParsedDescription {
  'x-parsed-md-description'?: GenericObject;
}

export interface ParsedDescriptionWithSummary extends ParsedDescription {
  'x-parsed-md-summary'?: GenericObject;
}

export interface OpenAPIMcp {
  protocolVersion: string;
  capabilities: {
    [key: string]:
      | boolean
      | {
          listChanged?: boolean;
          subscribe?: boolean;
          [key: string]: unknown;
        };
  };
  servers: OpenAPIServer[];
  tools: McpTool[];
  resources: McpResource[];
  prompts: McpPrompt[];
}

export interface McpTool {
  name: string;
  title?: string;
  description?: string;
  inputSchema: OpenAPISchema;
  outputSchema?: OpenAPISchema;
  security?: OpenAPISecurityRequirement[];
  tags?: string[];
  'x-badges'?: OpenAPIXBadges[];
}

export interface McpResource {
  name: string;
  title?: string;
  description?: string;
  uri: string;
  mimeType: string;
  blob?: string;
  text?: string;

  security?: OpenAPISecurityRequirement[];
  tags?: string[];
  'x-badges'?: OpenAPIXBadges[];
}

export interface McpPrompt {
  name: string;
  title?: string;
  description: string;
  arguments: McpPromptArgument[];
  security?: OpenAPISecurityRequirement[];
  tags?: string[];
  'x-badges'?: OpenAPIXBadges[];
}

export interface McpPromptArgument {
  name: string;
  description: string;
  required: boolean;
  example?: string;
}
