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
  registerBooleanSchema,
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

const VALUE_KEYS = new Set([
  'example',
  'examples',
  'x-example',
  'x-examples',
  'default',
  'const',
  'enum',
]);
const NAME_MAP_KEYS = new Set([
  'properties',
  'patternProperties',
  'dependentSchemas',
  '$defs',
  'definitions',
  'schemas',
  'responses',
  'parameters',
  'headers',
  'requestBodies',
  'pathItems',
  'callbacks',
  'webhooks',
]);

function qualifyBareMappingNames(document: OpenAPIDefinition): void {
  const schemas = document.components?.schemas;
  if (!isRecord(schemas)) return;
  const qualify = (target: unknown) =>
    typeof target === 'string' && !/[#/]/.test(target) && Object.hasOwn(schemas, target)
      ? `#/components/schemas/${encodeJsonPointerSegment(target)}`
      : target;

  const seen = new WeakSet<object>();
  const visit = (node: unknown, keysAreNames = false): void => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    const discriminator = !keysAreNames && isRecord(node) ? node.discriminator : undefined;
    if (isRecord(discriminator) && typeof discriminator.propertyName === 'string') {
      if (isRecord(discriminator.mapping)) {
        for (const key of Object.keys(discriminator.mapping)) {
          discriminator.mapping[key] = qualify(discriminator.mapping[key]);
        }
      }
      if (discriminator.defaultMapping) {
        discriminator.defaultMapping = qualify(discriminator.defaultMapping);
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (keysAreNames || !VALUE_KEYS.has(key))
        visit(value, !keysAreNames && NAME_MAP_KEYS.has(key));
    }
  };
  visit(document);
}

export function populateOpenApiStore(
  document: OpenAPIDefinition,
  storeCtx: StoreContext,
  options: ApiDocsOptions,
): ApiStore {
  const { schemaStore, exampleStore, securitySchemeStore, hashIndex } = storeCtx;
  const { ignoreNamedSchemas } = options;
  const doc = storeCtx.document;

  qualifyBareMappingNames(document);
  normalizeImplicitDiscriminators(document);

  const components = document.components;

  if (!components) {
    return { schemaStore, exampleStore, securitySchemeStore };
  }

  if (components.schemas) {
    const { sectionRbac, entries } = splitRbacSection(components.schemas);
    for (const [name, rawSchema] of entries) {
      const resolved = resolveRef(doc, rawSchema, ignoreNamedSchemas) ?? rawSchema;
      if (typeof resolved === 'boolean') {
        registerBooleanSchema(schemaStore, {
          id: `components/schemas/${name}`,
          kind: schemaKind.JSON_SCHEMA,
          title: name,
          booleanSchema: resolved,
          ...rbacProp(sectionRbac),
        });
        continue;
      }
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
        ...rbacProp(readRbacScope(rawSchema) ?? readRbacScope(schema) ?? sectionRbac),
      };

      registerSecurityScheme(securitySchemeStore, entry);
    }
  }

  return { schemaStore, exampleStore, securitySchemeStore };
}
