import type { EventPayload } from '@redocly/redoc-opentelemetry';

import type { SecuritySchemeType } from '../types/common.js';

import { securitySchemeType } from '../types/common.js';

type SecurityDetails = EventPayload<'com.redocly.viewSecurityDetails.clicked'>[0];
export type SchemeTypeKey = keyof NonNullable<SecurityDetails['schemeTypes']>;
export type Oauth2Flow = keyof NonNullable<SecurityDetails['oauth2Flows']>;

// Typed against the SDK unions: a flow or scheme type added to the schema fails here until mapped.
const OAUTH2_FLOWS: Record<Oauth2Flow, true> = {
  authorizationCode: true,
  clientCredentials: true,
  implicit: true,
  password: true,
  deviceAuthorization: true,
};
export const OAUTH2_FLOW_NAMES: ReadonlySet<string> = new Set(Object.keys(OAUTH2_FLOWS));

const SCHEME_TYPE_KEY: Record<
  Exclude<SecuritySchemeType, typeof securitySchemeType.HTTP>,
  SchemeTypeKey
> = {
  [securitySchemeType.API_KEY]: 'apiKey',
  [securitySchemeType.OAUTH2]: 'oauth2',
  [securitySchemeType.OPEN_ID_CONNECT]: 'openIdConnect',
  [securitySchemeType.MUTUAL_TLS]: 'mutualTLS',
};

const HTTP_SCHEME_KEY: Partial<Record<string, SchemeTypeKey>> = {
  basic: 'httpBasic',
  bearer: 'httpBearer',
};

export function schemeTypeKey(type: string | undefined, scheme: string | undefined): SchemeTypeKey {
  if (type === securitySchemeType.HTTP) {
    return HTTP_SCHEME_KEY[scheme?.toLowerCase() ?? ''] ?? 'httpOther';
  }
  return (SCHEME_TYPE_KEY as Partial<Record<string, SchemeTypeKey>>)[type ?? ''] ?? 'unknown';
}

export function countSchemes(
  schemes: Iterable<{ type?: string; scheme?: string; flows?: object | null }>,
): {
  schemeTypes: Partial<Record<SchemeTypeKey, number>>;
  oauth2Flows: Partial<Record<Oauth2Flow, number>>;
} {
  const schemeTypes: Partial<Record<SchemeTypeKey, number>> = {};
  const oauth2Flows: Partial<Record<Oauth2Flow, number>> = {};
  for (const scheme of schemes) {
    const key = schemeTypeKey(scheme.type, scheme.scheme);
    schemeTypes[key] = (schemeTypes[key] ?? 0) + 1;
    for (const flow of Object.keys(scheme.flows ?? {}) as Oauth2Flow[]) {
      if (OAUTH2_FLOW_NAMES.has(flow)) oauth2Flows[flow] = (oauth2Flows[flow] ?? 0) + 1;
    }
  }
  return { schemeTypes, oauth2Flows };
}
