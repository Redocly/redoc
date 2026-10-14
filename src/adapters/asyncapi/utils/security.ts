import type {
  AsyncApiDefinition,
  AsyncApiOAuthFlow,
  AsyncApiOAuthFlows,
  AsyncApiSecurityRequirement,
  AsyncApiSecurityRequirementObject,
  AsyncApiSecurityScheme,
} from '../../../types/asyncapi.js';
import type { SecurityRequirementDetail, SecuritySchemeDetail } from '../../../types/content.js';
import type { OAuthFlowsData, SecuritySchemeEntry, StoreContext } from '../../../types/store.js';
import type { ParseMarkdownOptions } from '../../utils/parseMarkdown.js';

import { readRbacScope, rbacProp } from '../../rbac.js';
import { parseMarkdown } from '../../utils/parseMarkdown.js';
import { JsonPointer } from '../../openapi/utils/JsonPointer.js';
import { resolveInDoc } from './resolveInDoc.js';
import { isRecord } from '../../../utils/is-record.js';

const COMPONENT_SCHEME_PREFIX = '#/components/securitySchemes/';

export function buildSecuritySchemeEntry(
  id: string,
  scheme: AsyncApiSecurityScheme,
  options: ParseMarkdownOptions,
): SecuritySchemeEntry {
  return {
    id,
    type: scheme.type,
    scheme: scheme.scheme,
    bearerFormat: scheme.bearerFormat,
    description: parseMarkdown(scheme.description, options),
    in: scheme.in,
    paramName: scheme.name,
    openIdConnectUrl: scheme.openIdConnectUrl,
    scopes: scheme.scopes,
    flows: scheme.flows ? toOAuthFlows(scheme.flows) : undefined,
  };
}

/** Flows missing a URL their type requires are dropped. */
function toOAuthFlows({
  implicit,
  password,
  clientCredentials,
  authorizationCode,
}: AsyncApiOAuthFlows): OAuthFlowsData {
  const scopes = (flow: AsyncApiOAuthFlow) => flow.availableScopes ?? {};
  const flows: OAuthFlowsData = {};
  if (implicit?.authorizationUrl) {
    flows.implicit = {
      authorizationUrl: implicit.authorizationUrl,
      refreshUrl: implicit.refreshUrl,
      scopes: scopes(implicit),
    };
  }
  if (password?.tokenUrl) {
    flows.password = {
      tokenUrl: password.tokenUrl,
      refreshUrl: password.refreshUrl,
      scopes: scopes(password),
    };
  }
  if (clientCredentials?.tokenUrl) {
    flows.clientCredentials = {
      tokenUrl: clientCredentials.tokenUrl,
      refreshUrl: clientCredentials.refreshUrl,
      scopes: scopes(clientCredentials),
    };
  }
  if (authorizationCode?.authorizationUrl && authorizationCode.tokenUrl) {
    flows.authorizationCode = {
      authorizationUrl: authorizationCode.authorizationUrl,
      tokenUrl: authorizationCode.tokenUrl,
      refreshUrl: authorizationCode.refreshUrl,
      scopes: scopes(authorizationCode),
    };
  }
  return flows;
}

function toDetail(name: string, { id: _id, ...entry }: SecuritySchemeEntry): SecuritySchemeDetail {
  return { name, ...entry };
}

/**
 * One requirement per `security` entry, in order. A 2.x requirement object (`{ name: scopes }`)
 * is one requirement whose schemes are all required. Schemes that resolve to nothing are dropped,
 * and so are requirements left empty. A component scheme keeps its name, an inline one is named
 * by its type.
 */
export function buildSecurityRequirements(
  security: AsyncApiSecurityRequirement[] | undefined,
  storeCtx: StoreContext,
  document: AsyncApiDefinition,
  options: ParseMarkdownOptions,
): SecurityRequirementDetail[] {
  if (!Array.isArray(security)) return [];
  return security.flatMap((requirement) => {
    if (!isRecord(requirement)) return [];
    const schemes = isRequirementObject(requirement)
      ? Object.entries(requirement).flatMap(([name, scopes]) => {
          if (!Array.isArray(scopes)) return [];
          const detail = componentDetail(name, storeCtx);
          if (!detail) return [];
          return [
            {
              ...detail,
              ...(scopes.length > 0 ? { scopes } : {}),
              ...rbacProp(readRbacScope(requirement)),
            },
          ];
        })
      : [schemeDetail(requirement, storeCtx, document, options)].filter((detail) => !!detail);
    return schemes.length > 0 ? [{ schemes }] : [];
  });
}

function isRequirementObject(
  requirement: AsyncApiSecurityRequirement,
): requirement is AsyncApiSecurityRequirementObject {
  return !('$ref' in requirement) && typeof requirement.type !== 'string';
}

function componentDetail(name: string, storeCtx: StoreContext): SecuritySchemeDetail | undefined {
  const entry = storeCtx.securitySchemeStore[name];
  return entry ? toDetail(name, entry) : undefined;
}

function schemeDetail(
  requirement: AsyncApiSecurityScheme | { $ref: string },
  storeCtx: StoreContext,
  document: AsyncApiDefinition,
  options: ParseMarkdownOptions,
): SecuritySchemeDetail | undefined {
  if ('$ref' in requirement && requirement.$ref.startsWith(COMPONENT_SCHEME_PREFIX)) {
    const detail = componentDetail(JsonPointer.baseName(requirement.$ref), storeCtx);
    return detail && { ...detail, ...rbacProp(readRbacScope(requirement)) };
  }
  const scheme = resolveInDoc<AsyncApiSecurityScheme>(document, requirement);
  if (!scheme?.type) return undefined;
  return {
    ...toDetail(scheme.type, buildSecuritySchemeEntry(scheme.type, scheme, options)),
    ...rbacProp(readRbacScope(requirement) ?? readRbacScope(scheme)),
  };
}
