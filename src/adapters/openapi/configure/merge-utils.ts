import type {
  ConfigureRequestValues,
  ConfigureServerRequestValues,
  SecurityDetails,
} from '@redocly/theme/ext/configure';
import type { OpenAPIParameterLocation, OpenAPIServer } from '../../../types/openapi.js';
import type { SecuritySchemeCredentials } from '../../../services/code-samples/source.js';

import { isRecord } from '../../helpers.js';

export function getParamValueMap(
  loc: OpenAPIParameterLocation,
  source: ConfigureRequestValues,
): Record<string, string> | undefined {
  switch (loc) {
    case 'header':
      return source.headers;
    case 'query':
      return source.query;
    case 'path':
      return source.path;
    case 'cookie':
      return source.cookie;
    default:
      return undefined;
  }
}

export function mergeBodyValue(base: unknown, overlay: unknown): unknown {
  if (overlay === undefined) return base;
  if (isRecord(base) && isRecord(overlay)) {
    return updateObjectProperties(base, overlay);
  }
  return overlay;
}

export type SchemeForCredentials = {
  id: string;
  type?: string;
  scheme?: string;
  scopes?: string[];
  serverValues?: Record<string, SecuritySchemeCredentials>;
};

export function updateObjectProperties(original: unknown, updates: unknown): unknown {
  if (!isRecord(original) && !Array.isArray(original)) {
    return updates;
  }

  if (Array.isArray(original) && Array.isArray(updates)) {
    const firstItem = original[0];
    if (original.length > 0 && isRecord(firstItem)) {
      const originalKeys = Object.keys(firstItem);
      const filteredUpdates = updates.filter(
        (updateItem): updateItem is Record<string, unknown> => {
          if (!isRecord(updateItem)) return false;
          const keys = Object.keys(updateItem);
          return (
            originalKeys.some((k) => k in updateItem) && keys.every((k) => originalKeys.includes(k))
          );
        },
      );
      return filteredUpdates.length > 0 ? filteredUpdates : original;
    }
    return updates;
  }

  if (Array.isArray(original)) {
    return [...original];
  }

  const result: Record<string, unknown> = { ...original };
  if (!isRecord(updates)) {
    return result;
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!(key in original)) continue;
    const origVal = original[key];
    if (Array.isArray(origVal) || (isRecord(origVal) && isRecord(value))) {
      result[key] = updateObjectProperties(origVal, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function isDirectRequestValues(
  value: ConfigureRequestValues | ConfigureServerRequestValues | undefined | null,
): value is ConfigureRequestValues {
  if (!isRecord(value)) return false;
  return (
    'headers' in value ||
    'body' in value ||
    'query' in value ||
    'path' in value ||
    'cookie' in value ||
    'security' in value ||
    'envVariables' in value ||
    'serverVariables' in value
  );
}

export function getEffectiveRequestValues(
  requestValues: ConfigureRequestValues | ConfigureServerRequestValues | undefined,
  servers: readonly { url: string }[] | undefined,
): ConfigureRequestValues | undefined {
  if (!requestValues) return undefined;
  if (isDirectRequestValues(requestValues)) {
    return requestValues;
  }
  const serverMap: ConfigureServerRequestValues = requestValues;
  if (servers?.length) {
    for (const server of servers) {
      if (serverMap[server.url]) {
        return serverMap[server.url];
      }
    }
  }
  const firstUrl = Object.keys(serverMap)[0];
  return firstUrl ? serverMap[firstUrl] : undefined;
}

export function createSecurityUpdates(
  scheme: SchemeForCredentials,
  securityValues: Record<string, SecurityDetails>,
): SecuritySchemeCredentials {
  const resolvedSecurity: SecurityDetails =
    securityValues[scheme.id] ?? securityValues.default ?? {};

  const updates: SecuritySchemeCredentials = {};

  if (resolvedSecurity.token?.access_token !== undefined) {
    updates['x-defaultAccessToken'] = resolvedSecurity.token.access_token;
    updates['x-defaultTokenType'] = resolvedSecurity.token.token_type || 'Bearer';
  }
  if (resolvedSecurity.client_id !== undefined) {
    updates['x-defaultClientId'] = resolvedSecurity.client_id;
  }
  if (resolvedSecurity.client_secret !== undefined) {
    updates['x-defaultClientSecret'] = resolvedSecurity.client_secret;
  }
  if (resolvedSecurity.scopes !== undefined) {
    updates.scopes = resolvedSecurity.scopes;
  } else if (scheme.scopes !== undefined) {
    updates.scopes = scheme.scopes;
  }

  if (scheme.type === 'http' && scheme.scheme === 'basic') {
    if (resolvedSecurity.username !== undefined) {
      updates['x-defaultUsername'] = resolvedSecurity.username;
    }
    if (resolvedSecurity.password !== undefined) {
      updates['x-defaultPassword'] = resolvedSecurity.password;
    }
    delete updates['x-defaultAccessToken'];
    delete updates['x-defaultTokenType'];
  }

  return updates;
}

export function mergeSecurityIntoScheme<S extends SchemeForCredentials>(
  scheme: S,
  securityValues: Record<string, SecurityDetails>,
): S & SecuritySchemeCredentials;
export function mergeSecurityIntoScheme<S extends SchemeForCredentials>(
  scheme: S,
  securityValues: Record<string, SecurityDetails>,
  serverUrl: string,
): S & { serverValues: Record<string, SecuritySchemeCredentials> };
export function mergeSecurityIntoScheme<S extends SchemeForCredentials>(
  scheme: S,
  securityValues: Record<string, SecurityDetails>,
  serverUrl?: string,
): S & (SecuritySchemeCredentials | { serverValues: Record<string, SecuritySchemeCredentials> }) {
  const updates = createSecurityUpdates(scheme, securityValues);
  if (serverUrl) {
    return {
      ...scheme,
      serverValues: { ...(scheme.serverValues ?? {}), [serverUrl]: updates },
    };
  }
  return { ...scheme, ...updates };
}

export function applyServerVariableDefaults(
  servers: OpenAPIServer[] | undefined,
  serverVariables: Record<string, string> | undefined,
  targetServerUrl?: string,
): void {
  if (!serverVariables || Object.keys(serverVariables).length === 0) return;
  if (!servers?.length) return;

  const toUpdate = targetServerUrl ? servers.filter((s) => s.url === targetServerUrl) : servers;

  for (const server of toUpdate) {
    if (!server.variables) continue;
    for (const [variableName, variableValue] of Object.entries(serverVariables)) {
      const existing = server.variables[variableName];
      if (existing) {
        existing.default = variableValue;
      }
    }
  }
}

/** Immutable variant of {@link applyServerVariableDefaults} for runtime callers that must not mutate. */
export function withServerVariableDefaults<
  T extends { url: string; variables?: Record<string, { default?: string }> },
>(
  servers: readonly T[],
  serverVariables: Record<string, string> | undefined,
  targetServerUrl?: string,
): T[] {
  if (!serverVariables || Object.keys(serverVariables).length === 0) {
    return servers as T[];
  }
  return servers.map((s) => {
    if (targetServerUrl && s.url !== targetServerUrl) return s;
    if (!s.variables) return s;
    let nextVariables: Record<string, { default?: string }> | undefined;
    for (const [variableName, variableValue] of Object.entries(serverVariables)) {
      if (s.variables[variableName]) {
        if (!nextVariables) nextVariables = { ...s.variables };
        nextVariables[variableName] = { ...nextVariables[variableName], default: variableValue };
      }
    }
    if (!nextVariables) return s;
    return { ...s, variables: nextVariables };
  });
}
