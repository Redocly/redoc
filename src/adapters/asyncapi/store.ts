import type { ApiStore, StoreContext } from '../../types/store.js';
import type { AsyncApiDefinition } from '../../types/asyncapi.js';

import { schemaKind } from '../../types/common.js';
import { registerSchema, registerExample } from '../helpers.js';
import { readRbacScope, rbacProp, splitRbacSection } from '../rbac.js';
import { resolveAsyncApiSchema } from './utils/resolve-schema.js';

export function populateAsyncApiStore(
  document: AsyncApiDefinition,
  existingCtx: StoreContext,
): ApiStore {
  const { schemaStore, exampleStore, hashIndex } = existingCtx;

  const components = document.components;
  if (!components) {
    return { schemaStore, exampleStore, securitySchemeStore: {} };
  }

  if (components.schemas) {
    const { sectionRbac, entries } = splitRbacSection(components.schemas);
    for (const [name, schema] of entries) {
      const resolved = resolveAsyncApiSchema(schema);
      if (resolved) {
        registerSchema(schemaStore, hashIndex, {
          id: `components/schemas/${name}`,
          kind: schemaKind.JSON_SCHEMA,
          title: name,
          data: resolved,
          ...rbacProp(sectionRbac),
        });
      }
    }
  }

  if (components.messages) {
    const { sectionRbac, entries } = splitRbacSection(components.messages);
    for (const [name, message] of entries) {
      const messageRbac = readRbacScope(message) ?? sectionRbac;
      if (message.payload) {
        const resolvedPayload = resolveAsyncApiSchema(message.payload);
        if (resolvedPayload) {
          registerSchema(schemaStore, hashIndex, {
            id: `components/messages/${name}/payload`,
            kind: schemaKind.JSON_SCHEMA,
            title: `${name} payload`,
            data: resolvedPayload,
            ...rbacProp(messageRbac),
          });
        }
      }

      if (message.headers) {
        const resolvedHeaders = resolveAsyncApiSchema(message.headers);
        if (resolvedHeaders) {
          registerSchema(schemaStore, hashIndex, {
            id: `components/messages/${name}/headers`,
            kind: schemaKind.JSON_SCHEMA,
            title: `${name} headers`,
            data: resolvedHeaders,
            ...rbacProp(messageRbac),
          });
        }
      }

      if (message.examples) {
        for (let i = 0; i < message.examples.length; i++) {
          const ex = message.examples[i];
          registerExample(exampleStore, {
            id: `components/messages/${name}/examples/${i}`,
            value: ex.payload,
            summary: ex.summary,
            ...rbacProp(messageRbac),
          });
        }
      }
    }
  }

  return { schemaStore, exampleStore, securitySchemeStore: {} };
}
