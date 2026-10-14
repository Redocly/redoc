import { isRecord } from '../../utils/is-record.js';
import { fixParamRef, processParameter } from './swagger/parameters.js';
import type { Context, Obj, RequestBodyEntry } from './swagger/refs.js';
import {
  cloneJson,
  escapePointer,
  fixRefs,
  hashString,
  moveKey,
  rec,
  renameStrict,
  resolvePointer,
  sanitise,
  sanitiseAll,
  sanitiseRequirements,
  setPointer,
  toCamelCase,
} from './swagger/refs.js';
import { processResponse } from './swagger/responses.js';
import { fixUpSchema } from './swagger/schema.js';

const TARGET_VERSION = '3.2.0';

const OPERATION_KEYS = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'head',
  'options',
  'trace',
  'x-amazon-apigateway-any-method',
];

/**
 * Converts a Swagger 2.0 document to OpenAPI 3.2.0. The input is never mutated. An OpenAPI 3.x
 * input is returned as a copy with only its `info` and `paths` patched. Throws an `Error` when the
 * version is unsupported, `info` is not an object, or two security schemes, parameters or
 * responses sanitise to the same component name.
 */
export function convertSwaggerToOpenApi(
  document: Record<string, unknown>,
): Record<string, unknown> {
  const source = cloneJson(document);
  if (typeof source.openapi === 'string' && source.openapi.startsWith('3.')) {
    fixInfo(source);
    if (source.paths === undefined) source.paths = {};
    return source;
  }
  if (source.swagger !== '2.0' && source.swagger !== 2) {
    throw new Error(
      `Unsupported swagger/OpenAPI version: ${String(source.openapi ?? source.swagger)}`,
    );
  }

  const doc: Obj = { openapi: TARGET_VERSION, ...source };
  doc.openapi = TARGET_VERSION;
  delete doc.swagger;
  pruneNulls(doc, false);
  if (typeof doc.schemes === 'string') doc.schemes = [doc.schemes];
  buildServers(doc);
  fixInfo(doc);
  if (doc.paths === undefined) doc.paths = {};
  if (typeof doc.consumes === 'string') doc.consumes = [doc.consumes];
  if (typeof doc.produces === 'string') doc.produces = [doc.produces];

  const components: Obj = {};
  if (doc['x-callbacks']) components.callbacks = doc['x-callbacks'];
  const examples: Obj = (components.examples = {});
  components.headers = {};
  if (doc['x-links']) components.links = doc['x-links'];
  const parameters = (components.parameters = rec(doc.parameters) ?? {});
  const responses = (components.responses = rec(doc.responses) ?? {});
  components.requestBodies = {};
  const securitySchemes = (components.securitySchemes = rec(doc.securityDefinitions) ?? {});
  const schemas = (components.schemas = rec(doc.definitions) ?? {});
  for (const key of ['x-callbacks', 'x-links', 'definitions', 'responses', 'parameters']) {
    delete doc[key];
  }
  delete doc.securityDefinitions;
  doc.components = components;

  const ctx: Context = {
    doc,
    parameters,
    examples,
    schemaNames: new Map(),
    refMap: new Map(),
    folded: new WeakSet(),
    bodyNames: new WeakMap(),
  };

  sanitiseRequirements(doc.security);
  renameStrict(securitySchemes, 'securityScheme', processSecurityScheme);
  for (const name of Object.keys(schemas)) {
    const clean = sanitiseAll(name);
    let suffix: number | '' = '';
    if (name !== clean) {
      while (schemas[`${clean}${suffix}`]) suffix = suffix ? suffix + 1 : 2;
      schemas[`${clean}${suffix}`] = schemas[name];
      delete schemas[name];
    }
    ctx.schemaNames.set(name, `${clean}${suffix}`);
    fixUpSchema(schemas[`${clean}${suffix}`]);
  }

  fixRefs(ctx, doc, [], '');
  for (const [from, to] of ctx.refMap) setPointer(doc, from, { $ref: to });

  renameStrict(parameters, 'parameter', (param) => processParameter(ctx, param));
  renameStrict(responses, 'response', (response) => processResponse(ctx, response));

  const cache: Record<string, RequestBodyEntry> = {};
  processPaths(ctx, rec(doc.paths), 'paths', cache);
  processPaths(ctx, rec(doc['x-ms-paths']), 'x-ms-paths', cache);

  for (const [name, param] of Object.entries(parameters)) {
    if (isRecord(param) && ctx.folded.has(param)) delete parameters[name];
  }
  delete doc.consumes;
  delete doc.produces;
  delete doc.schemes;

  const requestBodies: Obj = (components.requestBodies = {});
  const generated: string[] = [];
  let counter = 1;
  for (const entry of Object.values(cache)) {
    if (entry.refs.length < 2) continue;
    let base = entry.name;
    let suffix: number | '' = '';
    if (!base) {
      base = 'requestBody';
      suffix = counter++;
    }
    while (generated.includes(`${base}${suffix}`)) suffix = suffix ? suffix + 1 : 2;
    const name = `${base}${suffix}`;
    generated.push(name);
    requestBodies[name] = cloneJson(entry.body);
    for (const ref of entry.refs)
      setPointer(doc, ref, { $ref: `#/components/requestBodies/${name}` });
  }

  for (const key of [
    'responses',
    'parameters',
    'examples',
    'requestBodies',
    'securitySchemes',
    'headers',
    'schemas',
  ]) {
    const section = rec(components[key]);
    if (section && Object.keys(section).length === 0) delete components[key];
  }
  if (Object.keys(components).length === 0) delete doc.components;

  return doc;
}

function pruneNulls(node: unknown, inExample: boolean): void {
  if (Array.isArray(node)) {
    for (const item of node) pruneNulls(item, inExample);
    return;
  }
  if (!isRecord(node)) return;
  for (const key of Object.keys(node)) {
    const example = inExample || key.startsWith('example');
    if (node[key] !== null) pruneNulls(node[key], example);
    else if (!key.startsWith('x-') && key !== 'default' && !example) delete node[key];
  }
}

function buildServers(doc: Obj): void {
  const basePath = doc.basePath;
  const schemes = doc.schemes;
  const servers: Obj[] = [];
  if (doc.host) {
    const base = typeof basePath === 'string' ? basePath.replace(/\/$/, '') : '';
    for (const scheme of Array.isArray(schemes) ? schemes : ['']) {
      const prefix = scheme ? `${String(scheme)}:` : '';
      servers.push(serverFor(`${prefix}//${String(doc.host)}${base}`));
    }
  } else if (basePath) {
    servers.push(serverFor(String(basePath)));
  }
  if (servers.length) doc.servers = servers;
  delete doc.host;
  delete doc.basePath;

  if (Array.isArray(doc['x-servers'])) {
    doc.servers = doc['x-servers'];
    delete doc['x-servers'];
  }

  const hostTemplate = rec(doc['x-ms-parameterized-host']);
  if (!hostTemplate) return;
  const url = `${String(hostTemplate.hostTemplate)}${basePath ? String(basePath) : ''}`;
  const variables: Obj = {};
  const names = url.match(/\{\w+\}/g) ?? [];
  const params = hostTemplate.parameters;
  for (const [index, raw] of Object.entries(
    isRecord(params) || Array.isArray(params) ? params : {},
  )) {
    if (index.startsWith('x-')) continue;
    const param =
      isRecord(raw) && typeof raw.$ref === 'string'
        ? cloneJson(resolvePointer(doc, raw.$ref))
        : raw;
    if (!isRecord(param)) continue;
    delete param.required;
    delete param.type;
    delete param.in;
    if (param.default === undefined) {
      param.default = Array.isArray(param.enum) ? param.enum[0] : 'none';
    }
    const name = param.name || (names[Number(index)] ?? '').replace('{', '').replace('}', '');
    variables[String(name)] = param;
    delete param.name;
  }
  const server = { url, variables };
  const hosts = Array.isArray(doc.servers) ? doc.servers : (doc.servers = []);
  if (hostTemplate.useSchemePrefix === false) {
    hosts.push(server);
  } else {
    for (const scheme of Array.isArray(schemes) ? schemes : []) {
      hosts.push({ ...cloneJson(server), url: `${String(scheme)}://${url}` });
    }
  }
  delete doc['x-ms-parameterized-host'];
}

function serverFor(rawUrl: string): Obj {
  const url = rawUrl.split('{{').join('{').split('}}').join('}');
  const server: Obj = { url };
  const variables: Obj = {};
  let open = url.indexOf('{');
  while (open >= 0) {
    const close = url.indexOf('}', open + 2);
    if (close < 0) break;
    variables[url.slice(open + 1, close)] = { default: 'unknown' };
    open = url.indexOf('{', close + 1);
  }
  if (Object.keys(variables).length) server.variables = variables;
  return server;
}

function fixInfo(doc: Obj): void {
  if (doc.info === undefined || doc.info === null) doc.info = { version: '', title: '' };
  const info = doc.info;
  if (!isRecord(info)) throw new Error('info must be an object');
  if (info.title === undefined || info.title === null) info.title = '';
  if (info.version === undefined || info.version === null) info.version = '';
  if (typeof info.version !== 'string') info.version = String(info.version);
  if (info.logo !== undefined) {
    info['x-logo'] = info.logo;
    delete info.logo;
  }
  if (info.termsOfService === undefined) return;
  if (info.termsOfService === null) info.termsOfService = '';
  if (!isAbsoluteUrl(String(info.termsOfService))) delete info.termsOfService;
}

function isAbsoluteUrl(value: string): boolean {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
}

function processPaths(
  ctx: Context,
  container: Obj | undefined,
  containerName: string,
  cache: Record<string, RequestBodyEntry>,
): void {
  if (!container) return;
  for (const pathKey of Object.keys(container)) {
    const path = rec(container[pathKey]);
    if (!path) continue;
    if (isRecord(path['x-trace'])) moveKey(path, 'x-trace', 'trace');
    if (path['x-summary'] && typeof path['x-summary'] === 'string')
      moveKey(path, 'x-summary', 'summary');
    if (path['x-description'] && typeof path['x-description'] === 'string') {
      moveKey(path, 'x-description', 'description');
    }
    if (Array.isArray(path['x-servers'])) moveKey(path, 'x-servers', 'servers');

    for (const method of Object.keys(path)) {
      if (!OPERATION_KEYS.includes(method)) continue;
      const op = processOperation(ctx, path, method);
      if (!op) continue;
      const body = rec(op.requestBody);
      if (!body) continue;
      const fallback = op.operationId
        ? sanitiseAll(String(op.operationId))
        : toCamelCase(sanitiseAll(method + pathKey));
      const name = sanitise(ctx.bodyNames.get(body) || fallback || '');
      const key = String(hashString(JSON.stringify(body)));
      cache[key] ??= { name, body, refs: [] };
      cache[key].refs.push(
        `#/${containerName}/${encodeURIComponent(escapePointer(pathKey))}/${method}/requestBody`,
      );
    }

    if (Array.isArray(path.parameters)) {
      for (const param of path.parameters) processParameter(ctx, param, undefined, path);
      path.parameters = path.parameters.filter((param) => keepParameter(ctx, param));
    }
  }
}

function processOperation(ctx: Context, path: Obj, method: string): Obj | undefined {
  let op = rec(path[method]);
  if (!op) return undefined;
  const ownParams = op.parameters;
  if (Array.isArray(ownParams)) {
    // Path-level body and form parameters are folded only into operations that declare parameters.
    for (const param of Array.isArray(path.parameters) ? path.parameters : []) {
      let resolved: unknown = param;
      if (isRecord(param) && typeof param.$ref === 'string') {
        fixParamRef(param);
        resolved = resolvePointer(ctx.doc, String(param.$ref));
      }
      if (!isRecord(resolved)) continue;
      const match = ownParams.some(
        (own) => isRecord(own) && own.name === resolved.name && own.in === resolved.in,
      );
      if (
        !match &&
        (resolved.in === 'formData' || resolved.in === 'body' || resolved.type === 'file')
      ) {
        op = processParameter(ctx, resolved, op, path, method) ?? op;
      }
    }
    for (const param of ownParams) op = processParameter(ctx, param, op, path, method) ?? op;
    op.parameters = ownParams.filter((param) => keepParameter(ctx, param));
  }
  sanitiseRequirements(op.security);

  op.responses ||= { default: { description: 'Default response' } };
  for (const response of Object.values(rec(op.responses) ?? {})) processResponse(ctx, response, op);

  if (Array.isArray(op['x-servers'])) {
    moveKey(op, 'x-servers', 'servers');
  } else if (typeof op.schemes === 'string' || Array.isArray(op.schemes)) {
    const opSchemes: unknown[] = typeof op.schemes === 'string' ? [op.schemes] : op.schemes;
    const rootSchemes = ctx.doc.schemes;
    for (const scheme of opSchemes) {
      if (Array.isArray(rootSchemes) && rootSchemes.includes(scheme)) continue;
      const servers: unknown[] = Array.isArray(op.servers) ? op.servers : (op.servers = []);
      for (const server of Array.isArray(ctx.doc.servers) ? ctx.doc.servers : []) {
        const copy = cloneJson(server);
        if (isRecord(copy) && typeof copy.url === 'string') {
          copy.url = withProtocol(copy.url, String(scheme));
        }
        const url = isRecord(copy) ? copy.url : undefined;
        if (servers.some((known) => isRecord(known) && known.url === url)) continue;
        servers.push(copy);
      }
    }
  }
  delete op.consumes;
  delete op.produces;
  delete op.schemes;
  if (op['x-ms-examples']) applyMsExamples(ctx, op, path);
  if (Array.isArray(op.parameters) && op.parameters.length === 0) delete op.parameters;
  return op;
}

function keepParameter(ctx: Context, param: unknown): boolean {
  return Boolean(param) && !(isRecord(param) && ctx.folded.has(param));
}

/** Swaps the protocol of a server URL; the host is lowercased and an empty path becomes `/`. A URL without an authority is returned unchanged. */
function withProtocol(url: string, scheme: string): string {
  const match = /^(?:[A-Za-z][A-Za-z0-9+.-]*:)?\/\/([^/?#]*)/.exec(url);
  if (!match) return url;
  const rest = url.slice(match[0].length);
  return `${scheme}://${(match[1] ?? '').toLowerCase()}${rest.startsWith('/') ? rest : `/${rest}`}`;
}

function applyMsExamples(ctx: Context, op: Obj, path: Obj): void {
  for (const [name, raw] of Object.entries(rec(op['x-ms-examples']) ?? {})) {
    const example = rec(raw);
    if (!example) continue;
    const id = sanitiseAll(name);
    for (const [paramName, value] of Object.entries(rec(example.parameters) ?? {})) {
      const params = [
        ...(Array.isArray(op.parameters) ? op.parameters : []),
        ...(Array.isArray(path.parameters) ? path.parameters : []),
      ];
      for (const entry of params) {
        const param =
          isRecord(entry) && typeof entry.$ref === 'string'
            ? resolvePointer(ctx.doc, entry.$ref)
            : entry;
        if (!isRecord(param) || param.name !== paramName || param.example) continue;
        const examples = rec(param.examples) ?? {};
        param.examples = examples;
        examples[name] = { value };
      }
    }
    for (const [code, rawResponse] of Object.entries(rec(example.responses) ?? {})) {
      const exampleResponse = rec(rawResponse);
      const response = rec(rec(op.responses)?.[code]);
      if (!exampleResponse) continue;
      for (const [header, value] of Object.entries(rec(exampleResponse.headers) ?? {})) {
        const target = rec(rec(response?.headers)?.[header]);
        if (target) target.example = value;
      }
      if (!exampleResponse.body) continue;
      ctx.examples[id] = { value: cloneJson(exampleResponse.body) };
      for (const media of Object.values(rec(response?.content) ?? {})) {
        if (!isRecord(media)) continue;
        const examples = rec(media.examples) ?? {};
        media.examples = examples;
        examples[name] = { $ref: `#/components/examples/${id}` };
      }
    }
  }
  delete op['x-ms-examples'];
}

function processSecurityScheme(input: unknown): void {
  const scheme = rec(input);
  if (!scheme) return;
  if (scheme.type === 'basic') {
    scheme.type = 'http';
    scheme.scheme = 'basic';
  }
  if (scheme.type !== 'oauth2') return;
  const flow: Obj = {};
  let flowName = scheme.flow;
  if (flowName === 'application') flowName = 'clientCredentials';
  if (flowName === 'accessCode') flowName = 'authorizationCode';
  if (scheme.authorizationUrl !== undefined) {
    flow.authorizationUrl = withoutQuery(String(scheme.authorizationUrl));
  }
  if (typeof scheme.tokenUrl === 'string') flow.tokenUrl = withoutQuery(scheme.tokenUrl);
  flow.scopes = scheme.scopes || {};
  scheme.flows = { [String(flowName)]: flow };
  for (const key of ['flow', 'authorizationUrl', 'tokenUrl', 'scopes', 'name']) delete scheme[key];
}

function withoutQuery(url: string): string {
  const query = url.indexOf('?');
  return (query < 0 ? url : url.slice(0, query)).trim() || '/';
}
