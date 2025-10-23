import type { OpenAPIRef, OpenAPISchema, OpenAPIDefinition } from '../types/index.js';
import type { MergedOpenAPISchema } from './types.js';
import type { Options } from './config-options/types.js';

import { IS_BROWSER, isObject, isString, isUndefined } from '@redocly/theme/core/openapi';

import { tryDecodeURIComponent, getDefinitionName } from '../utils/index.js';
import { JsonPointer } from '../utils/JsonPointer.js';
import { normalizeOptions } from './config-options/normalizeOptions.js';

/**
 * Loads and keeps spec. Provides raw spec operations
 */

export function pushRef(stack: string[], ref?: string): string[] {
  return ref && stack[stack.length - 1] !== ref ? [...stack, ref] : stack;
}

export function concatRefStacks(base: string[], stack?: string[]): string[] {
  return stack ? base.concat(stack) : base;
}

export class OpenAPIParser {
  definitionUrl?: string;
  definition: OpenAPIDefinition;

  // private _refCounter: RefCounter = new RefCounter();
  private readonly allowMergeRefs: boolean = false;

  constructor(
    definition: OpenAPIDefinition,
    definitionUrl?: string,
    private options: Options & { versionId?: string } = normalizeOptions({}),
  ) {
    this.definition = Object.assign({}, definition);
    this.validate(definition);

    this.definition = definition;
    this.allowMergeRefs = definition.openapi.startsWith('3.1');

    const href = IS_BROWSER ? window.location.href : '';
    if (isString(definitionUrl)) {
      this.definitionUrl = new URL(definitionUrl, href).href;
    }
  }

  validate(spec: GenericObject): void {
    if (isUndefined(spec.openapi)) {
      throw new Error('Document must be valid OpenAPI 3.0.0 definition');
    }
  }

  /**
   * get spec part by JsonPointer ($ref)
   */
  byRef = <T>(ref: string): T | undefined => {
    let res;
    if (!this.definition) {
      return;
    }
    if (ref.charAt(0) !== '#') {
      ref = '#' + ref;
    }
    ref = tryDecodeURIComponent(ref);
    try {
      res = JsonPointer.get(this.definition, ref);
    } catch {
      // do nothing
    }
    return res || {};
  };

  /**
   * checks if the object is OpenAPI reference (contains $ref property)
   */
  isRef<T>(obj: OpenAPIRef | T): obj is OpenAPIRef {
    if (!obj) {
      return false;
    }
    obj = <OpenAPIRef>obj;
    return obj.$ref !== undefined && obj.$ref !== null;
  }

  /**
   * Resolve given reference object or return as is if it is not a reference
   * @param obj object to dereference
   * @param baseRefsStack
   * @param mergeAsAllOf
   */
  deref<T>(
    obj: OpenAPIRef | T,
    baseRefsStack: string[] = [],
    mergeAsAllOf = false,
    level = 0,
  ): { resolved: T; refsStack: string[] } {
    // this can be set by all of when it merges props from different sources
    const objRefsStack = obj?.['x-refsStack'];
    baseRefsStack = concatRefStacks(baseRefsStack, objRefsStack);

    if (level > 5) {
      return {
        resolved: Object.assign({}, obj, { 'x-complex': true }) as T,
        refsStack: baseRefsStack,
      };
    }

    if (this.isRef(obj)) {
      const schemaName = getDefinitionName(obj.$ref);
      if (schemaName && this.options.ignoreNamedSchemas.has(schemaName)) {
        return { resolved: { type: 'object', title: schemaName } as T, refsStack: baseRefsStack };
      }

      let resolved = this.byRef<T>(obj.$ref);
      if (!resolved) {
        throw new Error(`Failed to resolve $ref "${obj.$ref}"`);
      }

      if (baseRefsStack.includes(obj.$ref)) {
        resolved = Object.assign({}, resolved, { 'x-circular-ref': true });
      } else if (this.isRef(resolved)) {
        const res = this.deref(resolved, baseRefsStack, mergeAsAllOf, level);
        resolved = res.resolved;
      }

      if (this.allowMergeRefs) {
        resolved = this.mergeRefs(obj, resolved, mergeAsAllOf);
      }

      return { resolved, refsStack: pushRef(baseRefsStack, obj.$ref) };
    }
    return {
      resolved: obj,
      refsStack: concatRefStacks(baseRefsStack, objRefsStack),
    };
  }

  mergeRefs<T>(ref: OpenAPIRef, resolved: T, mergeAsAllOf: boolean): T {
    const { $ref, ...rest } = ref;
    const keys = Object.keys(rest);
    if (keys.length === 0) {
      return {
        ...resolved,
        $ref,
      };
    }
    if (
      mergeAsAllOf &&
      keys.some(
        (k) =>
          ![
            'description',
            'title',
            'externalDocs',
            'x-refsStack',
            'x-parentRefs',
            'readOnly',
            'writeOnly',
            'x-complex',
          ].includes(k),
      )
    ) {
      const { description, title, readOnly, writeOnly, ...restSchema } = rest as OpenAPISchema;
      return {
        allOf: [{ description, title, readOnly, writeOnly }, resolved, restSchema],
      } as T;
    } else {
      // small optimization
      return {
        ...(resolved as GenericObject),
        ...rest,
      } as T;
    }
  }

  /**
   * Merge allOf constraints.
   * @param schema schema with allOF
   * @param $ref pointer of the schema
   * @param refsStack
   * @param absolutePointer
   */
  mergeAllOf(
    schema: MergedOpenAPISchema,
    $ref: string | undefined,
    refsStack: string[],
    absolutePointer = '',
    level = 0,
  ): MergedOpenAPISchema {
    if (schema['x-circular-ref']) {
      return schema;
    }

    schema = this.hoistOneOfs(schema);

    if (schema.allOf === undefined) {
      return { absolutePointer, ...schema };
    }

    let receiver: MergedOpenAPISchema = {
      ...schema,
      'x-parentRefs': [],
      absolutePointer: JsonPointer.join(absolutePointer, ['allOf']),
      allOf: undefined,
      title: level === 0 ? schema.title || getDefinitionName($ref) : schema.title,
    };

    // avoid mutating inner objects
    if (!isUndefined(receiver.properties) && isObject(receiver.properties)) {
      receiver.properties = { ...receiver.properties };
    }
    if (!isUndefined(receiver.items) && isObject(receiver.items)) {
      receiver.items = { ...receiver.items };
    }

    const allOfSchemas = schema.allOf
      .map((subSchema: OpenAPISchema, index) => {
        const { resolved, refsStack: subRefsStack } = this.deref(subSchema, refsStack, true, level);

        const subRef = subSchema.$ref;
        const subAbsolutePointer = subRef || JsonPointer.join(absolutePointer, [String(index)]);
        if (resolved['x-complex']) {
          return {
            $ref: subRef,
            refsStack: pushRef(subRefsStack, subRef),
            schema: { 'x-complex': true },
            absolutePointer: subAbsolutePointer,
          };
        }
        const subMerged = this.mergeAllOf(
          resolved,
          subRef,
          subRefsStack,
          subAbsolutePointer,
          level + 1,
        );

        if (subMerged['x-circular-ref'] && subMerged.allOf) {
          // if mergeAllOf is circular and still contains allOf, we should ignore it
          return undefined;
        }
        if (subRef) {
          // collect information for implicit descriminator lookup
          receiver['x-parentRefs']?.push(...(subMerged['x-parentRefs'] || []), subRef);
        }
        return {
          $ref: subRef,
          refsStack: pushRef(subRefsStack, subRef),
          schema: subMerged,
          absolutePointer: subAbsolutePointer,
        };
      })
      .filter(Boolean) as Array<{
      schema: MergedOpenAPISchema;
      refsStack: string[];
      absolutePointer: string;
    }>;

    for (const [
      index,
      { schema: subSchema, refsStack: subRefsStack, absolutePointer },
    ] of allOfSchemas.entries()) {
      const {
        type,
        enum: enumProperty,
        properties,
        items,
        required,
        title,
        description,
        readOnly,
        writeOnly,
        oneOf,
        anyOf,
        'x-circular-ref': isCircular,
        'x-complex': isComplex,
        ...otherConstraints
      } = subSchema || {};
      if (receiver.type !== type && !isUndefined(receiver.type) && !isUndefined(type) && !level) {
        // console.warn(`Incompatible types in allOf at "${$ref}": "${receiver.type}" and "${type}"`);
        continue;
      }

      if (!isUndefined(type)) {
        if (Array.isArray(type) && Array.isArray(receiver.type)) {
          receiver.type = [...type, ...receiver.type];
        } else {
          receiver.type = type;
        }
      }

      if (!isUndefined(enumProperty)) {
        if (Array.isArray(enumProperty) && Array.isArray(receiver.enum)) {
          receiver.enum = Array.from(new Set([...enumProperty, ...receiver.enum]));
        } else {
          receiver.enum = enumProperty;
        }
      }

      if (!isUndefined(properties) && isObject(properties)) {
        receiver.properties = receiver.properties || {};
        for (const prop in properties) {
          const propRefsStack = concatRefStacks(subRefsStack, properties[prop]?.['x-refsStack']);
          if (!receiver.properties[prop]) {
            receiver.properties[prop] = {
              ...properties[prop],
              absolutePointer: JsonPointer.join(absolutePointer, ['properties', prop]),
              'x-refsStack': propRefsStack,
            } as MergedOpenAPISchema;
          } else if (!isCircular) {
            // merge inner properties
            const mergedProp = this.mergeAllOf(
              {
                allOf: [receiver.properties[prop], properties[prop]],
                'x-refsStack': propRefsStack,
              },
              $ref + '/properties/' + prop,
              propRefsStack,
              JsonPointer.join(absolutePointer, ['allOf', String(index), 'properties', prop]),
              level + 1,
            );
            receiver.properties[prop] = mergedProp;
          }
        }
      }

      if (!isUndefined(items) && !isCircular && !isComplex) {
        const receiverItems =
          typeof receiver.items === 'boolean'
            ? {}
            : (Object.assign({}, receiver.items) as OpenAPISchema);
        const subSchemaItems =
          typeof subSchema.items === 'boolean'
            ? {}
            : (Object.assign({}, subSchema.items) as OpenAPISchema);
        // merge inner properties
        receiver.items = this.mergeAllOf(
          {
            allOf: [receiverItems, subSchemaItems],
          },
          $ref + '/items',
          subRefsStack,
          '',
          level + 1,
        );
      }
      if (!isUndefined(oneOf)) {
        receiver.oneOf = oneOf;
      }

      if (!isUndefined(anyOf)) {
        receiver.anyOf = anyOf;
      }

      if (Array.isArray(required)) {
        receiver.required = [...(receiver.required || []), ...required];
      }

      // merge rest of constraints
      // TODO: do more intelligent merge
      receiver = {
        ...receiver,
        title: receiver.title || title,
        description: receiver.description || description,
        readOnly: !isUndefined(receiver.readOnly) ? receiver.readOnly : readOnly,
        writeOnly: !isUndefined(receiver.writeOnly) ? receiver.writeOnly : writeOnly,
        'x-circular-ref': receiver['x-circular-ref'] || isCircular,
        'x-complex': receiver['x-complex'] || isComplex,
        ...otherConstraints,
      };
    }

    return receiver;
  }

  /**
   * Find all derived definitions among #/components/schemas from any of $refs
   * returns map of definition pointer to definition name
   * @param $refs array of references to find derived from
   */
  findDerived($refs: string[]): Record<string, string[] | string> {
    const res: Record<string, string[]> = {};
    const schemas = (this.definition.components && this.definition.components.schemas) || {};
    for (const defName in schemas) {
      const { resolved: def } = this.deref(schemas[defName]);
      if (
        !isUndefined(def.allOf) &&
        def.allOf.find(
          (obj: OpenAPISchema) => !isUndefined(obj.$ref) && $refs.indexOf(obj.$ref) > -1,
        )
      ) {
        res['#/components/schemas/' + defName] = [def['x-discriminator-value'] || defName];
      }
    }
    return res;
  }

  private hoistOneOfs(schema: OpenAPISchema) {
    if (isUndefined(schema.allOf)) {
      return schema;
    }

    const { allOf, ...restSchema } = schema;
    for (let i = 0; i < allOf.length; i++) {
      const { oneOf, ...sub } = allOf[i];
      if (!oneOf) {
        continue;
      }
      if (Array.isArray(oneOf)) {
        const beforeAllOf = allOf.slice(0, i);
        const afterAllOf = allOf.slice(i + 1);
        const siblingValues = Object.keys(sub).length > 0 ? [sub] : [];
        return {
          ...restSchema,
          oneOf: oneOf.map((part: OpenAPISchema) => {
            return {
              allOf: [...beforeAllOf, ...siblingValues, part, ...afterAllOf],
            };
          }),
        };
      }
    }

    return schema;
  }
}
