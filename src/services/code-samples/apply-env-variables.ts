import type { CodeSampleRequestValues } from './source.js';

/**
 * Substitutes `{{name}}` environment-variable placeholders in a sample using
 * the base env variables plus the active server's scoped overrides.
 * `requestValues.serverEnvVariables` is keyed by the raw (templated) spec
 * server URL.
 */
export function applyEnvVariables(
  sample: string,
  requestValues: CodeSampleRequestValues | undefined,
  activeServerSpecUrl: string | undefined,
): string {
  const mergedEnvVars = {
    ...requestValues?.envVariables,
    ...(activeServerSpecUrl && requestValues?.serverEnvVariables?.[activeServerSpecUrl]),
  };

  let result = sample;
  for (const [name, value] of Object.entries(mergedEnvVars)) {
    result = result.replaceAll(`{{${name}}}`, value);
  }
  return result;
}
