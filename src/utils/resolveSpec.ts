import type { ApiSpecType } from '../types/common.js';

import { dump } from 'js-yaml';

import { DefinitionLoadError, errorMessage } from './definitionLoadError.js';
import { loadAndBundleDefinition } from './loadAndBundleSpec.js';
import {
  convertSwaggerToOpenApi,
  normalizeAsyncApiDefinition,
} from '../services/spec-convert/index.js';
import { isRecord } from './is-record.js';
import { parseYaml } from './yaml.js';
import { apiSpecType } from '../types/common.js';

const GRAPHQL_URL_PATTERN = /\.(graphql|gql)([?#]|$)/i;
const JSON_START_PATTERN = /^\s*[[{]/;
/** The first line that is not blank, a comment or `---` names an OpenAPI or AsyncAPI version. */
const API_KEY_FIRST_LINE =
  /^(?:[ \t]*(?:#[^\r\n]*)?\r?\n|---[ \t]*\r?\n)*[ \t]*['"]?(?:openapi|swagger|asyncapi)['"]?[ \t]*:/;

/** `convertedFrom` is the Swagger 2.0 or AsyncAPI 2.x version the document was converted from. */
export type ResolvedSpec = {
  document: unknown;
  type: ApiSpecType;
  sdl?: string;
  convertedFrom?: string;
};

function documentSpecType(document: Record<string, unknown>): ApiSpecType {
  const isIntrospection =
    '__schema' in document || (isRecord(document.data) && '__schema' in document.data);
  if (isIntrospection) {
    throw new DefinitionLoadError(
      'unsupported',
      'GraphQL introspection results are not supported; provide the schema as SDL',
    );
  }
  return 'asyncapi' in document ? apiSpecType.ASYNCAPI : apiSpecType.OPENAPI;
}

function isApiDocument(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && ('openapi' in value || 'swagger' in value || 'asyncapi' in value);
}

/**
 * The document that JSON or YAML text describes, or `undefined` when the text is not an OpenAPI or
 * AsyncAPI document (GraphQL SDL). Throws `DefinitionLoadError` when JSON or YAML text is broken.
 */
function parseTextSpec(text: string): Record<string, unknown> | undefined {
  if (JSON_START_PATTERN.test(text)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (jsonError) {
      parsed = parseFlowYaml(text);
      if (parsed === undefined) throw new DefinitionLoadError('parse', errorMessage(jsonError));
    }
    if (!isRecord(parsed))
      throw new DefinitionLoadError('unsupported', 'A JSON "spec" must be an object');
    return parsed;
  }
  try {
    const parsed = parseYaml(text);
    return isApiDocument(parsed) ? parsed : undefined;
  } catch (yamlError) {
    if (API_KEY_FIRST_LINE.test(text)) {
      throw new DefinitionLoadError('parse', errorMessage(yamlError));
    }
    return undefined;
  }
}

function parseFlowYaml(text: string): unknown {
  try {
    return parseYaml(text);
  } catch {
    return undefined;
  }
}

/** Deep copy; falls back to a JSON copy for values `structuredClone` rejects (proxies, functions). */
function cloneDocument<T>(document: T): T {
  try {
    return structuredClone(document);
  } catch {
    return JSON.parse(JSON.stringify(document)) as T;
  }
}

async function bundle(source: Record<string, unknown> | string): Promise<Record<string, unknown>> {
  const bundled: unknown = await loadAndBundleDefinition(source);
  if (!isRecord(bundled)) {
    throw new DefinitionLoadError(
      'unsupported',
      'The spec did not resolve to an OpenAPI or AsyncAPI document',
    );
  }
  return bundled;
}

async function resolveGraphqlSdl(sdl: string): Promise<ResolvedSpec> {
  const { parse } = await import('./graphql-parse.js');
  try {
    return { document: parse(sdl), type: apiSpecType.GRAPHQL, sdl };
  } catch (error) {
    throw new DefinitionLoadError('parse', errorMessage(error));
  }
}

async function fetchText(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new DefinitionLoadError('fetch', errorMessage(error), 0);
  }
  if (response.ok === false) {
    throw new DefinitionLoadError(
      'fetch',
      `Request failed with status ${response.status}`,
      response.status,
    );
  }
  return response.text();
}

async function resolveDocument(
  document: Record<string, unknown>,
  skipBundle: boolean,
): Promise<ResolvedSpec> {
  return convert({
    document: skipBundle ? document : await bundle(document),
    type: documentSpecType(document),
  });
}

function convert(resolved: ResolvedSpec): ResolvedSpec {
  const { document } = resolved;
  if (!isRecord(document)) return resolved;
  if (document.swagger !== undefined) {
    return {
      ...resolved,
      document: convertSwaggerToOpenApi(document),
      convertedFrom: String(document.swagger),
    };
  }
  if (resolved.type !== apiSpecType.ASYNCAPI) return resolved;
  const version = String(document.asyncapi);
  // The bundle can share objects with a caller-provided spec object, and the conversion is in place.
  const converted = normalizeAsyncApiDefinition(cloneDocument(document));
  return {
    ...resolved,
    document: converted,
    convertedFrom: version.startsWith('2.') ? version : undefined,
  };
}

export function convertedFileName(specUrl: string): string {
  const name = specUrl.split(/[?#]/)[0].split('/').pop() || 'asyncapi';
  return `${name.replace(/\.(json|ya?ml)$/i, '')}.yaml`;
}

/** A download URL serving the converted document, so Download matches what the page shows. */
export function convertedDownloadUrl(document: unknown): string | undefined {
  if (typeof window === 'undefined' || typeof URL.createObjectURL !== 'function') return undefined;
  const yaml = dump(document, { noRefs: true, lineWidth: -1 });
  return URL.createObjectURL(new Blob([yaml], { type: 'application/yaml' }));
}

async function resolveUrl(url: string, skipBundle: boolean): Promise<ResolvedSpec> {
  if (skipBundle) {
    throw new DefinitionLoadError(
      'unsupported',
      '"spec" must be an object, JSON or YAML text when "skipBundle" is enabled',
    );
  }
  if (GRAPHQL_URL_PATTERN.test(url)) {
    return resolveGraphqlSdl(await fetchText(url));
  }
  try {
    const document = await bundle(url);
    return convert({ document, type: documentSpecType(document) });
  } catch (bundleError) {
    const text = await fetchText(url);
    if (/^\s*<(!doctype|html)/i.test(text)) {
      throw new DefinitionLoadError(
        'unsupported',
        `${url} returned an HTML page instead of an API description. Check that your server serves the file at this URL.`,
      );
    }
    try {
      return await resolveGraphqlSdl(text);
    } catch {
      throw bundleError;
    }
  }
}

/**
 * Loads `spec` (an object, its JSON or YAML text, or GraphQL SDL) or else `specUrl`, bundles it
 * unless `skipBundle`, and converts Swagger 2.0 and AsyncAPI 2.x. Throws `DefinitionLoadError`.
 */
export async function resolveSpec({
  spec,
  specUrl,
  skipBundle,
}: {
  spec?: Record<string, unknown> | string;
  specUrl?: string;
  skipBundle: boolean;
}): Promise<ResolvedSpec> {
  if (typeof spec === 'string') {
    const text = spec.replace(/^\uFEFF/, '');
    const document = parseTextSpec(text);
    return document ? resolveDocument(document, skipBundle) : resolveGraphqlSdl(text);
  }
  if (spec !== undefined) {
    return resolveDocument(spec, skipBundle);
  }
  if (specUrl !== undefined) {
    return resolveUrl(specUrl, skipBundle);
  }
  throw new DefinitionLoadError('unsupported', 'Either "spec" or "specUrl" must be provided');
}
