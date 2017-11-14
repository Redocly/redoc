import { Omit } from './';

export type OpenAPISpec = {
  openapi: string;
  info: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths: OpenAPIPaths;
  components?: OpenAPIComponents;
  security?: OpenAPISecurityRequirement[];
  tags?: OpenAPITag[];
  externalDocs?: OpenAPIExternalDocumentation;
};

export interface OpenAPIInfo {
  title: string;
  version: string;

  description?: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;
}

export type OpenAPIServer = {
  url: string;
  description?: string;
  variables?: { [name: string]: OpenAPIServerVariable };
};

export type OpenAPIServerVariable = {
  enum?: string[];
  default: string;
  description?: string;
};

export type OpenAPIPaths = { [path: string]: OpenAPIPath };
export type OpenAPIRef = {
  $ref: string;
};

export type Referenced<T> = OpenAPIRef | T;

export type OpenAPIPath =
  // | OpenAPIRef // paths can't be external in redoc because they are prebundled
  // | {
  {
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
    servers?: OpenAPIServer[];
    parameters?: Referenced<OpenAPIParameter>[];
  };

export type OpenAPIOperation = {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: OpenAPIExternalDocumentation;
  operationId?: string;
  parameters?: Referenced<OpenAPIParameter>[];
  requestBody?: Referenced<OpenAPIRequestBody>;
  responses: OpenAPIResponses;
  callbacks?: { [name: string]: Referenced<OpenAPICallback> };
  deprecated?: boolean;
  security?: OpenAPISecurityRequirement[];
  servers?: OpenAPIServer[];
};

export type OpenAPIParameter = {
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
};

export type OpenAPIExample = {
  value: any;
  summary?: string;
  description?: string;
  externalValue?: string;
};

export type OpenAPISchema = {
  $ref?: string;
  type?: string;
  properties?: { [name: string]: OpenAPISchema };
  additionalProperties?: boolean | OpenAPISchema;
  description?: string;
  default?: any;
  items?: OpenAPISchema;
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
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
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
};

export type OpenAPIDiscriminator = {
  propertyName: string;
  mapping?: { [name: string]: string };
};

export type OpenAPIMediaType = {
  schema?: Referenced<OpenAPISchema>;
  example?: any;
  examples?: { [name: string]: Referenced<OpenAPIExample> };
  encoding?: { [field: string]: OpenAPIEncoding };
};

export type OpenAPIEncoding = {
  contentType: string;
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  style: OpenAPIParameterStyle;
  explode: boolean;
  allowReserved: boolean;
};

export type OpenAPIParameterLocation = 'query' | 'header' | 'path' | 'cookie';
export type OpenAPIParameterStyle =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject';

export type OpenAPIRequestBody = {
  description?: string;
  required?: boolean;
  content: { [mime: string]: OpenAPIMediaType };
};

export type OpenAPIResponses = {
  [code: string]: OpenAPIResponse;
};

export type OpenAPIResponse = {
  description?: string;
  headers?: { [name: string]: Referenced<OpenAPIHeader> };
  content?: { [mime: string]: OpenAPIMediaType };
  links?: { [name: string]: Referenced<OpenAPILink> };
};

export type OpenAPILink = {};

export type OpenAPIHeader = Omit<OpenAPIParameter, 'in' | 'name'>;

export type OpenAPICallback = {};

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
};

export type OpenAPISecurityRequirement = {};
export type OpenAPISecurityScheme = {};

export type OpenAPITag = {
  name: string;
  description?: string;
  externalDocs?: OpenAPIExternalDocumentation;
  'x-displayName'?: string;
};

export type OpenAPIExternalDocumentation = {
  description?: string;
  url?: string;
};

export type OpenAPIContact = {
  name?: string;
  url?: string;
  email?: string;
};

export type OpenAPILicense = {
  name: string;
  url?: string;
};
