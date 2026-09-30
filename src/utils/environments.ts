import type { Node } from '@markdoc/markdoc';
import type { OpenAPIServer } from '../types/openapi.js';

export type EnvironmentData = Record<string, Record<string, string>>;

export function mergeEnvData(env1: EnvironmentData, env2?: EnvironmentData): EnvironmentData {
  if (!env2) return env1;
  const allKeys = Array.from(new Set([...Object.keys(env1), ...Object.keys(env2)]));
  return allKeys.reduce<EnvironmentData>((acc, key) => {
    acc[key] = { ...env1[key], ...env2[key] };
    return acc;
  }, {});
}

export function getServerEnvName(
  server: Pick<OpenAPIServer, 'name' | 'description' | 'url'>,
): string | Node[] | Node {
  return server.name || server.description || server.url;
}

export const IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;
