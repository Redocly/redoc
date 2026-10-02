import { hasRbacScope } from '../../../adapters/rbac.js';

import type { OperationParameter } from '@redocly/theme/core/openapi';
import type { SchemaEntry } from '../../../types/store.js';
import type { DiscriminatorObject, SchemaNode } from '../../../types/schema.js';
import type { AsyncMessageSubsection, DescriptionFormatter, WalkScope } from './context.js';

import { schemaKind } from '../../../types/common.js';
import { appendArraySuffix, appendVariantSuffix } from '../../../utils/deep-link.js';
import { buildAsyncMessageDeepLink, buildFieldDeepLink } from './deep-links.js';
import { getParameterId, truncateIndexedExample } from './param.js';
import { asyncSubsectionOf, responseCodeOf } from './places.js';

const MAX_SCHEMA_DEPTH = 10;

type SchemaWalkFrame = {
  path: string[];
  linkPath: string[];
  depth: number;
  inDiscriminatorVariant?: boolean;
  discriminatorPropertyName?: string;
  discriminatorLinkPath?: string[];
  discriminatorValues?: string[];
};

type SchemaWalkFn = (next: SchemaNode, nextFrame: SchemaWalkFrame) => void;

type SchemaWalkContext = {
  place: string;
  mediaType: string | undefined;
  deepLinkContentType: string | undefined;
  isResponse: boolean;
  /** `t=` of field anchors; defaults to `request`/`response` from `isResponse`. */
  linkType: string | undefined;
  paramsMap: Record<string, OperationParameter>;
  visited: Set<string>;
  slug: string;
  scope: WalkScope;
};

export type SchemaFieldsArgs = {
  schemaId: string;
  place: string;
  paramsMap: Record<string, OperationParameter>;
  slug: string;
  mediaType?: string;
  hasMultipleMediaTypes?: boolean;
  isResponse?: boolean;
  linkType?: string;
  visited?: Set<string>;
};

/** Walks raw JSON schemas from the schema store into flat `OperationParameter` rows. */
export class SchemaWalker {
  #schemaStore: Record<string, SchemaEntry> | undefined;
  #document: Record<string, unknown> | undefined;
  #formatDescription: DescriptionFormatter;

  constructor(deps: {
    schemaStore?: Record<string, SchemaEntry>;
    document?: Record<string, unknown>;
    formatDescription: DescriptionFormatter;
  }) {
    this.#schemaStore = deps.schemaStore;
    this.#document = deps.document;
    this.#formatDescription = deps.formatDescription;
  }

  extractSchemaFields({ schemaId, ...args }: SchemaFieldsArgs, scope: WalkScope = {}): void {
    const entry = this.#schemaStore?.[schemaId];
    if (!entry || entry.kind !== schemaKind.JSON_SCHEMA) return;
    if (hasRbacScope(entry)) return;
    this.extractSchemaNodeFields(entry.data as SchemaNode, args, scope);
  }

  /** Walks a schema that is not in the store (MCP input/output schemas, prompt arguments). */
  extractSchemaNodeFields(
    schema: SchemaNode,
    {
      place,
      paramsMap,
      slug,
      mediaType,
      hasMultipleMediaTypes = false,
      isResponse = false,
      linkType,
      visited = new Set(),
    }: Omit<SchemaFieldsArgs, 'schemaId'>,
    scope: WalkScope = {},
  ): void {
    this.#walkSchemaNode(
      schema,
      { path: [], linkPath: [], depth: 0 },
      {
        place,
        mediaType,
        deepLinkContentType: hasMultipleMediaTypes ? mediaType : undefined,
        isResponse,
        linkType,
        paramsMap,
        visited,
        slug,
        scope,
      },
    );
  }

  resolveParameterType(schemaId: string): string {
    const entry = this.#schemaStore?.[schemaId];
    if (!entry || entry.kind !== schemaKind.JSON_SCHEMA) return 'unknown';
    const schema = entry.data as SchemaNode;
    const effective = this.resolveEffectiveSchema(schema);
    return this.#detectType(effective);
  }

  resolveEffectiveSchema(schema: SchemaNode): SchemaNode {
    if (schema.allOf) {
      const merged = this.#mergeAllOf(schema.allOf);
      if (schema.description) merged.description = schema.description;
      return merged;
    }
    if (schema.$ref) {
      const resolved = this.#resolveRef(schema.$ref);
      if (resolved) {
        const merged = { ...resolved };
        if (schema.description) merged.description = schema.description;
        return merged;
      }
    }
    return schema;
  }

  #detectType(schema: SchemaNode): string {
    if (Array.isArray(schema.type)) return schema.type.join(' | ');
    if (schema.type) return schema.type;
    if (schema.properties || schema.additionalProperties) return 'object';
    if (schema.items) return 'array';
    if (schema.enum) return 'string';
    return 'any';
  }

  #resolveRef(ref: string): SchemaNode | undefined {
    if (!ref.startsWith('#/')) return undefined;
    const segments = ref.slice(2).split('/');
    let current: unknown = this.#document;
    for (const segment of segments) {
      if (current == null || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[segment];
    }
    return current != null && typeof current === 'object' ? (current as SchemaNode) : undefined;
  }

  #walkSchemaNode(schema: SchemaNode, frame: SchemaWalkFrame, ctx: SchemaWalkContext): void {
    if (frame.depth > MAX_SCHEMA_DEPTH || hasRbacScope(schema)) return;

    const walk = (next: SchemaNode, nextFrame: SchemaWalkFrame): void =>
      this.#walkSchemaNode(next, nextFrame, ctx);

    if (schema.$ref) {
      this.#walkRefTarget(schema.$ref, walk, frame, ctx.visited);
      return;
    }

    if (schema.allOf) {
      walk(this.#mergeAllOf(schema.allOf, ctx.visited), frame);
      return;
    }

    const discriminator = schema.discriminator ?? schema['x-discriminator'];
    if (discriminator?.propertyName && !frame.inDiscriminatorVariant) {
      this.#walkDiscriminatorVariants(schema, discriminator, walk, frame);
      return;
    }

    const variants = schema.oneOf ?? schema.anyOf;
    if (variants) {
      this.#walkVariants(schema, variants, walk, frame, ctx.visited);
      return;
    }

    if (schema.if && (schema.then || schema.else)) {
      this.#walkConditional(schema, walk, frame);
      return;
    }

    if (schema.properties) {
      this.#walkProperties(schema, walk, frame, ctx);
    }

    this.#walkItems(schema, walk, frame, ctx.visited);
  }

  #walkRefTarget(
    ref: string,
    walk: SchemaWalkFn,
    frame: SchemaWalkFrame,
    visited: Set<string>,
  ): void {
    if (visited.has(ref)) return;
    visited.add(ref);
    const resolved = this.#resolveRef(ref);
    if (resolved) {
      walk(resolved, frame);
    }
  }

  /** Spread-merges `allOf` parts; `visited` (when given) skips and tracks `$ref` parts. */
  #mergeAllOf(subschemas: SchemaNode[], visited?: Set<string>): SchemaNode {
    const merged: SchemaNode = {};
    for (const sub of subschemas) {
      let resolved: SchemaNode | undefined = sub;
      if (sub.$ref) {
        if (visited) {
          if (visited.has(sub.$ref)) continue;
          visited.add(sub.$ref);
        }
        resolved = this.#resolveRef(sub.$ref);
      }
      if (!resolved) continue;
      const prevProperties = merged.properties;
      const prevRequired = merged.required;
      Object.assign(merged, resolved);
      if (prevProperties || resolved.properties) {
        merged.properties = { ...(prevProperties || {}), ...(resolved.properties || {}) };
      }
      if (prevRequired || resolved.required) {
        merged.required = [...(prevRequired || []), ...(resolved.required || [])];
      }
    }
    delete merged.allOf;
    return merged;
  }

  #walkVariants(
    schema: SchemaNode,
    variants: SchemaNode[],
    walk: SchemaWalkFn,
    frame: SchemaWalkFrame,
    visited: Set<string>,
  ): void {
    if (schema.properties) {
      walk({ ...schema, oneOf: undefined, anyOf: undefined } as SchemaNode, {
        ...frame,
        linkPath: appendVariantSuffix(frame.linkPath, '&oneof=0'),
      });
    }
    variants.forEach((variant, index) => {
      if (variant.$ref) {
        if (visited.has(variant.$ref)) return;
        visited.add(variant.$ref);
      }
      const resolved = variant.$ref ? this.#resolveRef(variant.$ref) : variant;
      if (resolved) {
        walk(resolved, {
          ...frame,
          linkPath: appendVariantSuffix(frame.linkPath, `&oneof=${index}`),
          depth: frame.depth + 1,
        });
      }
    });
  }

  #walkConditional(schema: SchemaNode, walk: SchemaWalkFn, frame: SchemaWalkFrame): void {
    const { if: ifSchema, then: thenSchema, else: elseSchema, ...base } = schema;
    const branches: SchemaNode[] = [
      { allOf: [base, thenSchema ?? {}, ifSchema ?? {}] },
      { allOf: [base, elseSchema ?? {}] },
    ];
    branches.forEach((branch, index) => {
      walk(branch, {
        ...frame,
        linkPath: appendVariantSuffix(frame.linkPath, `&oneof=${index}`),
        depth: frame.depth + 1,
      });
    });
  }

  #walkProperties(
    schema: SchemaNode,
    walk: SchemaWalkFn,
    frame: SchemaWalkFrame,
    ctx: SchemaWalkContext,
  ): void {
    const { isResponse, paramsMap, visited, scope } = ctx;
    const requiredList = schema.required || [];
    const responseCode = responseCodeOf(ctx.place);
    const type = ctx.linkType ?? (isResponse ? 'response' : 'request');
    const asyncSubsection = asyncSubsectionOf(ctx.place);

    for (const [name, prop] of Object.entries(schema.properties ?? {})) {
      if (hasRbacScope(prop)) continue;
      const resolved = this.#resolvePropertySchema(prop, visited);
      if (!resolved) continue;

      const skipRecurse = this.#shouldSkipAllOfRecurse(resolved, visited);
      const effective = this.resolveEffectiveSchema(resolved);
      if (!this.#isIndexableProperty(resolved, effective, isResponse, scope.pathOnly)) continue;
      const isFreeFormMap = resolved.additionalProperties !== undefined && !resolved.properties;

      const isDiscriminatorRow = name === frame.discriminatorPropertyName;
      const fieldPath = [...frame.path, name];
      const fieldLinkPath = this.#resolveFieldLinkPath(name, isDiscriminatorRow, frame);
      const param = this.#buildPropertyParam(name, resolved, effective, fieldLinkPath, {
        requiredList,
        responseCode,
        type,
        asyncSubsection,
        frame,
        ctx,
      });

      // Every variant's discriminator row shares one anchor, so those merge their values
      // into one row (id without the values); other fields keep one row per value set.
      const paramId = getParameterId(
        isDiscriminatorRow ? { ...param, enum: undefined } : param,
        scope.callbackId,
        scope.messageKey,
      );
      const existing = paramsMap[paramId];
      if (existing != null) {
        if (isDiscriminatorRow && param.enum) {
          existing.enum = [...new Set([...(existing.enum ?? []), ...param.enum])];
        }
        continue;
      }
      paramsMap[paramId] = param;

      if (!skipRecurse && !isDiscriminatorRow && !isFreeFormMap) {
        walk(effective, {
          path: fieldPath,
          linkPath: fieldLinkPath,
          depth: frame.depth + 1,
        });
      }
    }
  }

  /** Resolves a property `$ref`; returns undefined for already-visited or unresolvable refs. */
  #resolvePropertySchema(prop: SchemaNode, visited: Set<string>): SchemaNode | undefined {
    if (!prop.$ref) return prop;
    if (visited.has(prop.$ref)) return undefined;
    visited.add(prop.$ref);
    return this.#resolveRef(prop.$ref);
  }

  /** True when every `allOf` part was already visited, so recursing adds nothing new. */
  #shouldSkipAllOfRecurse(resolved: SchemaNode, visited: Set<string>): boolean {
    if (!resolved.allOf) return false;
    let hasNewContent = false;
    for (const sub of resolved.allOf) {
      if (sub.$ref) {
        if (!visited.has(sub.$ref)) {
          visited.add(sub.$ref);
          hasNewContent = true;
        }
      } else {
        hasNewContent = true;
      }
    }
    return !hasNewContent;
  }

  #isIndexableProperty(
    resolved: SchemaNode,
    effective: SchemaNode,
    isResponse: boolean,
    pathOnly?: boolean,
  ): boolean {
    if (hasRbacScope(resolved) || hasRbacScope(effective)) return false;
    // Schema pages render both readOnly and writeOnly fields.
    const respectsDirection = !pathOnly;
    if (respectsDirection && effective.readOnly && !isResponse) return false;
    if (respectsDirection && effective.writeOnly && isResponse) return false;
    return true;
  }

  #resolveFieldLinkPath(
    name: string,
    isDiscriminatorRow: boolean,
    frame: SchemaWalkFrame,
  ): string[] {
    const parentLinkPath =
      isDiscriminatorRow && frame.discriminatorLinkPath
        ? frame.discriminatorLinkPath
        : frame.linkPath;
    return [...parentLinkPath, name];
  }

  #buildPropertyParam(
    name: string,
    resolved: SchemaNode,
    effective: SchemaNode,
    fieldLinkPath: string[],
    args: {
      requiredList: string[];
      responseCode: string | undefined;
      type: string;
      asyncSubsection: AsyncMessageSubsection | undefined;
      frame: SchemaWalkFrame;
      ctx: SchemaWalkContext;
    },
  ): OperationParameter {
    const { requiredList, responseCode, type, asyncSubsection, frame, ctx } = args;
    const rawDesc = resolved.description ?? effective.description;
    const description = rawDesc ? this.#formatDescription(rawDesc) : '';
    const rawExample = resolved.example ?? effective.example;
    const example =
      rawExample !== undefined
        ? truncateIndexedExample(
            typeof rawExample === 'string' ? rawExample : JSON.stringify(rawExample),
          )
        : undefined;
    const enumValues = this.#resolveIndexedValues(name, resolved, effective, frame);

    return {
      name,
      description,
      place: ctx.place,
      mediaType: ctx.mediaType,
      path: frame.path,
      type: this.#detectType(effective),
      required: requiredList.includes(name),
      deepLink: asyncSubsection
        ? buildAsyncMessageDeepLink(ctx.slug, ctx.scope.messageKey, asyncSubsection, fieldLinkPath)
        : buildFieldDeepLink({
            slug: ctx.slug,
            type,
            contentType: ctx.deepLinkContentType,
            responseCode,
            fieldPath: fieldLinkPath,
            scope: ctx.scope,
          }),
      example: example as string | undefined,
      enum: enumValues,
    };
  }

  #resolveIndexedValues(
    name: string,
    resolved: SchemaNode,
    effective: SchemaNode,
    frame: SchemaWalkFrame,
  ): string[] | undefined {
    if (Array.isArray(effective.enum) && effective.enum.length) {
      return effective.enum.map(String);
    }
    const constValue = resolved.const ?? effective.const;
    if (constValue !== undefined) return [String(constValue)];
    if (name === frame.discriminatorPropertyName && frame.discriminatorValues?.length) {
      return frame.discriminatorValues;
    }
    return undefined;
  }

  #walkItems(
    schema: SchemaNode,
    walk: SchemaWalkFn,
    frame: SchemaWalkFrame,
    visited: Set<string>,
  ): void {
    if (!schema.items || typeof schema.items !== 'object' || Array.isArray(schema.items)) return;
    if (schema.items.$ref) {
      if (visited.has(schema.items.$ref)) return;
      visited.add(schema.items.$ref);
    }
    const resolved = schema.items.$ref ? this.#resolveRef(schema.items.$ref) : schema.items;
    if (resolved) {
      walk(resolved, {
        ...frame,
        linkPath: appendArraySuffix(frame.linkPath),
        depth: frame.depth + 1,
      });
    }
  }

  #walkDiscriminatorVariants(
    schema: SchemaNode,
    discriminator: DiscriminatorObject,
    walk: SchemaWalkFn,
    frame: SchemaWalkFrame,
  ): void {
    const options = this.#resolveDiscriminatorOptions(schema, discriminator);
    const variantFrame = (index: number, values: string[] | undefined): SchemaWalkFrame => ({
      ...frame,
      linkPath: appendVariantSuffix(frame.linkPath, `&d=${index}`),
      inDiscriminatorVariant: true,
      discriminatorPropertyName: discriminator.propertyName,
      discriminatorLinkPath: frame.linkPath,
      discriminatorValues: values,
    });

    if (schema.properties) {
      const allValues = options.flatMap((option) =>
        option.value !== undefined ? [option.value] : [],
      );
      walk(
        {
          ...schema,
          discriminator: undefined,
          'x-discriminator': undefined,
          oneOf: undefined,
          anyOf: undefined,
        } as SchemaNode,

        options.length ? variantFrame(0, allValues.length ? allValues : undefined) : frame,
      );
    }

    options.forEach((option, index) => {
      walk(option.schema, {
        ...variantFrame(index, option.value !== undefined ? [option.value] : undefined),
        depth: frame.depth + 1,
      });
    });
  }

  #resolveDiscriminatorOptions(
    schema: SchemaNode,
    discriminator: DiscriminatorObject,
  ): { schema: SchemaNode; value?: string }[] {
    const variants = schema.oneOf ?? schema.anyOf ?? [];
    const mapping = Object.entries(discriminator.mapping ?? {});
    if (mapping.length === 0) return variants.map((variant) => ({ schema: variant }));

    const resolveMapped = (ref: string): SchemaNode =>
      variants.find((variant) => variant.$ref === ref || variant['x-original-ref'] === ref) ??
      this.#resolveRef(ref) ??
      {};

    const options: { schema: SchemaNode; value?: string }[] = mapping
      .filter(([, ref]) => ref !== discriminator.defaultMapping)
      .map(([value, ref]) => ({ schema: resolveMapped(ref), value }));
    if (discriminator.defaultMapping) {
      const defaultEntry = mapping.find(([, ref]) => ref === discriminator.defaultMapping);
      options.push({
        schema: resolveMapped(discriminator.defaultMapping),
        value: defaultEntry?.[0],
      });
    }
    return options;
  }
}
