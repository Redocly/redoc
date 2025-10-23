import type { Node } from '@markdoc/markdoc';
import type {
  OpenAPISecurityScheme,
  OpenAPIEncoding,
  OpenAPIMediaType,
  OpenAPIParameterLocation,
  OpenAPIParameterStyle,
  OpenAPIExternalDocumentation,
  OpenAPIServer,
  OpenAPIXCodeSample,
  OpenAPIXBadges,
  OpenAPISchema,
  Referenced,
  OpenAPIInfo,
} from '../types/index.js';
import type { OpenAPIParser } from '../services/OpenAPIParser.js';
import type { Options } from '../services/config-options/index.js';
import type {
  ExtendedOpenAPIOperation,
  MenuItemGroupType,
  MenuItemType,
  MergedOpenAPISchema,
  Unstable_ExternalCodeSample,
} from '../services/types.js';

export type ContentItemModel = GroupModel | OperationMenuItem;

export interface SecurityCredentials {
  'x-defaultClientId'?: string;
  'x-defaultClientSecret'?: string;
  'x-defaultUsername'?: string;
  'x-defaultPassword'?: string;
  'x-defaultAccessToken'?: string;
  'x-defaultTokenType'?: string;
  scopes?: string[];
}

export interface ExtendedOpenAPISecurityScheme extends OpenAPISecurityScheme, SecurityCredentials {
  id: string;
  sectionId: string;
  scopes: string[];
  serverUrl?: string;
  serverValues?: {
    [serverUrl: string]: SecurityCredentials;
  };
}

export interface SecurityRequirement {
  schemes: ExtendedOpenAPISecurityScheme[];
}

export interface SecurityScheme {
  id: string;
  sectionId: string;
  type: OpenAPISecurityScheme['type'];
  description: string | GenericObject;

  apiKey?: {
    name: string;
    in: OpenAPISecurityScheme['in'];
  };

  http?: {
    scheme: string;
    bearerFormat?: string;
  };

  openId?: {
    connectUrl: string;
  };

  flows: OpenAPISecurityScheme['flows'];
}

export type RequestBodyModel = {
  description: string | GenericObject;
  required?: boolean;
  content: MediaContentModel | undefined;
};

export type ExampleModel = {
  value: any;
  rawValue: any;
  summary?: string | GenericObject;
  description?: string | GenericObject;
  mime: string;
  encoding?: { [field: string]: OpenAPIEncoding };
  serverValues?: {
    [serverUrl: string]: {
      value: any;
      rawValue: any;
    };
  };
};

export type MediaTypeModel = {
  examples?: { [name: string]: ExampleModel };
  formExamples?: { [name: string]: ExampleModel };
  schema?: SchemaModel;
  name: string;
  isRequestType: boolean;
  onlyRequiredInSamples: boolean;
  operation: OperationModel;
};

export type MediaContentModel = {
  mediaTypes: MediaTypeModel[];
  isRequestType: boolean;
  hasSample: boolean;
  operation: OperationModel;
};

export type MediaContentModelInput = {
  parser: OpenAPIParser;
  info: Record<string, OpenAPIMediaType>;
  isRequestType: boolean;
  options: Options;
  data: {
    operation: OperationModel;
    type?: 'request' | 'response';
    response?: ResponseModel;
    absolutePointer?: string;
  };
};

export type ResponseModel = {
  content?: MediaContentModel;
  code: string;
  summary: string | GenericObject;
  description: string | GenericObject;
  type: string;
  headers: FieldModel[];
};

export type FieldModel = {
  schema: SchemaModel;
  name: string;
  required: boolean;
  description: string | GenericObject;
  example?: string;
  examples?: Record<string, ExampleModel>;
  deprecated: boolean;
  in?: OpenAPIParameterLocation;
  kind: string;
  extensions?: GenericObject;
  explode: boolean;
  style?: OpenAPIParameterStyle;
  const?: any;
  serializationMime?: string;
  fieldFullPath?: string;
  deps: Deps;
  absolutePointer?: string;
  serverValues?: {
    [serverUrl: string]: {
      example?: string;
    };
  };
};

export type CallbackModel = {
  name: string;
  operations: OperationModel[];
};

export type OperationModel = {
  id: string;
  absoluteIdx?: number;
  name: string;
  description?: string | GenericObject;
  ast?: Node[];
  href: string;
  type: MenuItemType;

  parent?: GroupModel;
  externalDocs?: OpenAPIExternalDocumentation;
  items: ContentItemModel[];
  depth: number;

  pointer: string;
  operationId?: string;
  httpVerb: string;
  deprecated: boolean;
  path: string;
  servers: OpenAPIServer[];
  security: SecurityRequirement[];
  extensions: GenericObject;
  isCallback: boolean;
  isWebhook: boolean;
  isEvent: boolean;
  callbackId: string;
  requestBody?: RequestBodyModel;
  payload?: {
    lang: string;
    label?: string;
    source: string;
    requestBodyContent?: MediaContentModel;
  };
  definitionSamples: OpenAPIXCodeSample[] | Unstable_ExternalCodeSample[];
  badges: OpenAPIXBadges[];
  hasSamples: boolean;
  parameters: FieldModel[];
  responses: ResponseModel[];
  callbacks: CallbackModel[];
  envVariables?: {
    values?: Record<string, string>;
    serverValues?: {
      [serverUrl: string]: Record<string, string>;
    };
  };
};

export type GroupModel = {
  id: string;
  href: string;
  name: string;
  description?: string | GenericObject;
  isSchema?: boolean;
  type: MenuItemGroupType;
  deprecated?: boolean;
  badges?: OpenAPIXBadges[];

  items: ContentItemModel[];
  ast?: Node[];
  parent?: GroupModel;
  externalDocs?: OpenAPIExternalDocumentation;
  infoDefinition?: OpenAPIInfo;

  depth: number;
  level: number;
};

export type OperationMenuItem = {
  id: string;
  href: string;
  name: string;
  operationDefinition: ExtendedOpenAPIOperation;
  depth: number;
  items: ContentItemModel[];
  parent?: GroupModel;
  deprecated: boolean;
  type: 'operation';
  httpVerb: string;
  path: string;
  isWebhook: boolean;
  operationId?: string;
  badges?: OpenAPIXBadges[];
};

export type SchemaModel = {
  operationPointer: string;
  schemaOrRef: Referenced<OpenAPISchema>;
  isChild: boolean;
  refsStack: string[];
  pointer: string;

  absolutePointer?: string;

  type: string | string[];
  displayType: string;
  typePrefix: string;
  title: string;
  description: string | GenericObject;
  externalDocs?: OpenAPIExternalDocumentation;
  isPrimitive: boolean;
  isCircular: boolean;
  isComplex: boolean;

  format?: string;
  displayFormat?: string;
  nullable: boolean;
  deprecated: boolean;
  pattern?: string;
  example?: any;
  enum: any[];
  default?: any;
  readOnly: boolean;
  writeOnly: boolean;
  constraints: string[];

  fields?: FieldModel[];
  items?: SchemaModel;

  oneOf?: SchemaModel[];
  oneOfType: string;
  discriminatorProp?: string;

  rawSchema: OpenAPISchema;
  schema: MergedOpenAPISchema;
  extensions?: GenericObject;
  'x-enumDescriptions'?: { [name: string]: string };
  const: any;
  contentEncoding?: string;
  contentMediaType?: string;
  minItems?: number;
  maxItems?: number;
};

export type Deps = {
  parentFieldFullPath?: string;
  operation: OperationModel;
  type?: 'request' | 'response';
  response?: ResponseModel;
  in?: string; // TODO: fix me. Find better way to pass 'in' via parent schema/field!
};
