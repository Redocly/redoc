import type { OpenAPIServer } from '../types/index.js';

export type EnvironmentData = Record<string, Record<string, string>>;

export function mergeEnvData(env1: EnvironmentData, env2?: EnvironmentData): EnvironmentData {
  if (!env2) return env1;
  const allKeys = Array.from(new Set([...Object.keys(env1), ...Object.keys(env2)]));
  return allKeys.reduce((acc, key) => {
    acc[key] = { ...env1[key], ...env2[key] };
    return acc;
  }, {} as EnvironmentData);
}

export function getServerEnvName(server: OpenAPIServer): string {
  return server.description || server.url;
}
