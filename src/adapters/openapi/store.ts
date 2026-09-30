import type { ApiStore, SecuritySchemeEntry, StoreContext } from '../../types/store.js';
import type {
  OpenAPIDefinition,
  OpenAPIExample,
  OpenAPISchema,
  OpenAPISecurityScheme,
} from '../../types/openapi.js';
import type { ApiDocsOptions } from '../../types/options.js';

import { schemaKind } from '../../types/common.js';
import { encodeJsonPointerSegment } from '../../utils/refPointer.js';
import { getImplicitDiscriminatorChildren } from '../../services/schema/dialects/jsonSchema.js';
import {
  registerSchema,
  registerExample,
  pickRenderableDescription,
  registerSecurityScheme,
  resolveRef,
  isRecord,
} from '../helpers.js';
import { readRbacScope, rbacProp, splitRbacSection } from '../rbac.js';
import { applyIgnoreNamedSchemasDeep } from './utils/applyIgnoreNamedSchemasDeep.js';
import { parseMarkdown } from '../utils/parseMarkdown.js';
import { resolveOpenApiExampleValue } from './resolve-openapi-example-value.js';

const extensionKeys = [
  'x-defaultClientId',
  'x-defaultAccessToken',
  'x-defaultTokenType',
  'x-defaultClientSecret',
  'x-defaultUsername',
  'x-defaultPassword',
] as const;

function extractExtensionFields(schema: OpenAPISecurityScheme): Partial<SecuritySchemeEntry> {
  const result: Record<string, unknown> = {};
  const raw = schema as unknown as Record<string, unknown>;
  for (const key of extensionKeys) {
    if (raw[key]) result[key] = raw[key];
  }
  if (raw['x-serverValues']) result.serverValues = raw['x-serverValues'];
  return result as Partial<SecuritySchemeEntry>;
}

function normalizeImplicitDiscriminators(document: OpenAPIDefinition): void {
  const schemas = document.components?.schemas;
  if (!schemas || typeof schemas !== 'object') return;

  const implicitChildren = getImplicitDiscriminatorChildren(document);

  for (const [name, rawSchema] of Object.entries(schemas)) {
    if (!isRecord(rawSchema)) continue;
    const schema: OpenAPISchema = rawSchema;
    const { discriminator } = schema;
    if (
      !discriminator?.propertyName ||
      discriminator.mapping ||
      discriminator['x-explicitMappingOnly'] ||
      Array.isArray(schema.oneOf) ||
      Array.isArray(schema.anyOf)
    ) {
      continue;
    }

    const children = implicitChildren[`#/components/schemas/${encodeJsonPointerSegment(name)}`];
    if (!children?.length) continue;

    const mapping: Record<string, string> = {};
    for (const { ref, value } of children) mapping[value] = ref;
    schemas[name] = { ...schema, discriminator: { ...discriminator, mapping } };
  }
}

export function populateOpenApiStore(
  document: OpenAPIDefinition,
  storeCtx: StoreContext,
  options: ApiDocsOptions,
): ApiStore {
  const { schemaStore, exampleStore, securitySchemeStore, hashIndex } = storeCtx;
  const { ignoreNamedSchemas } = options;
  const doc = storeCtx.document;

  normalizeImplicitDiscriminators(document);

  const components = document.components;

  const xRoot = document['x-root'];
  if (isRecord(xRoot)) {
    const processed = applyIgnoreNamedSchemasDeep(xRoot, ignoreNamedSchemas);
    const schema = isRecord(processed) ? processed : xRoot;
    registerSchema(schemaStore, hashIndex, {
      id: 'x-root',
      kind: schemaKind.JSON_SCHEMA,
      title: typeof schema.title === 'string' ? schema.title : 'Root',
      data: schema,
    });
  }

  if (!components) {
    return { schemaStore, exampleStore, securitySchemeStore };
  }

  if (components.schemas) {
    const { sectionRbac, entries } = splitRbacSection(components.schemas);
    for (const [name, rawSchema] of entries) {
      const resolved = resolveRef(doc, rawSchema, ignoreNamedSchemas) ?? rawSchema;
      const schema = applyIgnoreNamedSchemasDeep(resolved, ignoreNamedSchemas);
      if (!isRecord(schema)) continue;
      registerSchema(schemaStore, hashIndex, {
        id: `components/schemas/${name}`,
        kind: schemaKind.JSON_SCHEMA,
        title: typeof schema.title === 'string' ? schema.title : name,
        data: schema,
        ...rbacProp(sectionRbac),
      });
    }
  }

  if (components.examples) {
    const { sectionRbac, entries } = splitRbacSection(components.examples);
    for (const [name, rawExample] of entries) {
      const example = (resolveRef(doc, rawExample, ignoreNamedSchemas) ??
        rawExample) as OpenAPIExample;
      if (!example || typeof example !== 'object') continue;
      registerExample(exampleStore, {
        id: `components/examples/${name}`,
        value: resolveOpenApiExampleValue(example),
        summary: typeof example.summary === 'string' ? example.summary : undefined,
        description: pickRenderableDescription(example.description),
        externalValue: example.externalValue,
        ...rbacProp(readRbacScope(rawExample) ?? readRbacScope(example) ?? sectionRbac),
      });
    }
  }

  if (components.securitySchemes) {
    const { sectionRbac, entries } = splitRbacSection(components.securitySchemes);
    for (const [name, rawSchema] of entries) {
      if (!rawSchema || typeof rawSchema !== 'object') continue;
      const schema =
        resolveRef<OpenAPISecurityScheme>(doc, rawSchema, ignoreNamedSchemas) ??
        (rawSchema as OpenAPISecurityScheme);
      if (!schema) continue;

      const entry: SecuritySchemeEntry = {
        id: name,
        type: schema.type,
        scheme: schema.scheme,
        bearerFormat: schema.bearerFormat,
        description: schema.description ? parseMarkdown(schema.description, options) : undefined,
        in: schema.in,
        paramName: schema.name,
        openIdConnectUrl: schema.openIdConnectUrl,
        oauth2MetadataUrl: schema.oauth2MetadataUrl,
        deprecated: schema.deprecated,
        flows: schema.flows,
        ...extractExtensionFields(schema),
        ...rbacProp(readRbacScope(rawSchema) ?? readRbacScope(schema) ?? sectionRbac),
      };

      registerSecurityScheme(securitySchemeStore, entry);
    }
  }

  return { schemaStore, exampleStore, securitySchemeStore };
}
