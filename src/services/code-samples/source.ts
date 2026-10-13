import type { OpenAPIParameterLocation } from '../../types/openapi.js';
import type { FormFieldEncoding } from '../../utils/form-urlencoded.js';
import type {
  SecuritySchemeIn,
  SecuritySchemeType,
  securitySchemeType,
  panelKind,
} from '../../types/common.js';
import type {
  OAuthFlowsData,
} from '../../types/store.js';


type ServerVariable = {
  default?: string;
  enum?: string[];
  description?: string;
};

export type ServerEntry = {
  url: string;
  name?: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
};

export type ParameterEntry = {
  name: string;
  in: OpenAPIParameterLocation;
  required?: boolean;
  deprecated?: boolean;
  example?: unknown;
  schemaId?: string;
  serializationMime?: string;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
};

export type SecuritySchemeEntry = {
  id: string;
  type: Exclude<SecuritySchemeType, typeof securitySchemeType.MUTUAL_TLS>;
  name?: string;
  in?: SecuritySchemeIn;
  scheme?: string;
  bearerFormat?: string;
  openIdConnectUrl?: string;
  flows?: OAuthFlowsData;

};

/** One AND-group: all schemes in the array must be satisfied together */
export type SecurityRequirement = {
  schemes: SecuritySchemeEntry[];
  scopes: string[];
};

export type MediaTypeEntry = {
  schemaId?: string;
  exampleIds?: string[];
  encoding?: Record<string, FormFieldEncoding>;
};

type DefinitionCodeSample = {
  lang: string;
  label?: string;
  source: string;
};


export type CodeSampleSource = {
  kind: typeof panelKind.CODE_SAMPLE;

  operationType: 'http' | 'webhook' | 'callback';
  method: string;
  path: string;

  servers: ServerEntry[];

  parameters: {
    path: ParameterEntry[];
    query: ParameterEntry[];
    querystring: ParameterEntry[];
    header: ParameterEntry[];
    cookie: ParameterEntry[];
  };

  security: SecurityRequirement[];

  /** mediaType name → { schemaId, exampleIds } */
  requestBody?: Record<string, MediaTypeEntry>;

  /** Pre-authored code samples from the spec (x-codeSamples) */
  definitionSamples?: DefinitionCodeSample[];

  /** Response status codes (for generators that include expected status) */
  responseCodes?: string[];


  /** Raw pointer into the spec (for deep linking) */
  pointer?: string;

  /** Docs route slug of the operation page, relative to the routing base path
   * (e.g. `operations/getmuseumhours`) — lets hosts link back to the description */
  href?: string;

  /** OpenAPI `operationId` — should match the loaded spec so hosts can resolve the operation */
  openApiOperationId?: string;

  /** OpenAPI operation `summary` — the human-readable operation name */
  summary?: string;

};
