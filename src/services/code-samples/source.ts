import type { OpenAPIParameterLocation } from '../../types/openapi.js';
import type {
  SecuritySchemeIn,
  SecuritySchemeType,
  securitySchemeType,
  panelKind,
} from '../../types/common.js';
import type { OAuthFlowsData, SecuritySchemeCredentials } from '../../types/store.js';

export type { OAuthFlowsData, SecuritySchemeCredentials };

export type ServerVariable = {
  default?: string;
  enum?: string[];
  description?: string;
};

export type ServerEntry = {
  url: string;
  name?: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
  /** Set on entries injected by `mergeInMockServer` (never present in specs). */
  isMockServer?: boolean;
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
  /** Per-server example overrides: serverUrl → example value */
  serverValues?: Record<string, { example?: unknown }>;
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

  'x-defaultAccessToken'?: string;
  'x-defaultTokenType'?: string;
  'x-defaultClientId'?: string;
  'x-defaultClientSecret'?: string;
  'x-defaultUsername'?: string;
  'x-defaultPassword'?: string;

  /** Per-server auth overrides */
  serverValues?: Record<string, SecuritySchemeCredentials>;
};

/** One AND-group: all schemes in the array must be satisfied together */
export type SecurityRequirement = {
  schemes: SecuritySchemeEntry[];
  scopes: string[];
};

export type MediaTypeEntry = {
  schemaId?: string;
  exampleIds?: string[];
};

export type DefinitionCodeSample = {
  lang: string;
  label?: string;
  source: string;
};

export type CodeSampleRequestValues = {
  security?: Record<string, unknown>;
  envVariables?: Record<string, string>;
  serverEnvVariables?: Record<string, Record<string, string>>;
  body?: unknown;
  serverBody?: Record<string, unknown>;
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

  /** Configure request values (security credentials, env vars, per-server env vars) */
  requestValues?: CodeSampleRequestValues;

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
