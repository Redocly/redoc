import type { OpenAPIRef, OpenAPISchema, OpenAPISpec } from '../types';
import { IS_BROWSER, getDefinitionName } from '../utils/';
import { JsonPointer } from '../utils/JsonPointer';

import { RedocNormalizedOptions } from './RedocNormalizedOptions';
import type { MergedOpenAPISchema } from './types';

const MAX_DEREF_DEPTH = 999; // prevent circular detection crashes by adding hard limit on deref depth

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
  specUrl?: string;
  spec: OpenAPISpec;

  private readonly allowMergeRefs: boolean = false;

  constructor(
    spec: OpenAPISpec,
    specUrl?: string,
    private options: RedocNormalizedOptions = new RedocNormalizedOptions({}),
  ) {
    this.validate(spec);

    this.spec = spec;
    this.allowMergeRefs = spec.openapi.startsWith('3.1');

    const href = IS_BROWSER ? window.location.href : '';
    if (typeof specUrl === 'string') {
      this.specUrl = href ? new URL(specUrl, href).href : specUrl;
    }
  }

  validate(spec: Record<string, any>): void {
    if (spec.openapi === undefined) {
      throw new Error('Document must be valid OpenAPI 3.0.0 definition');
    }
  }

  /**
   * get spec part by JsonPointer ($ref)
   */
  byRef = <T = any>(ref: string): T | undefined => {
    let res;
    if (!this.spec) {
      return;
    }
    if (ref.charAt(0) !== '#') {
      ref = '#' + ref;
    }
    ref = decodeURIComponent(ref);
    try {
      res = JsonPointer.get(this.spec, ref);
    } catch (e) {
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
   * @param forceCircular whether to dereference even if it is circular ref
   * @param mergeAsAllOf
   */
  deref<T>(
    obj: OpenAPIRef | T,
    baseRefsStack: string[] = [],
    mergeAsAllOf = false,
  ): { resolved: T; refsStack: string[] } {
    // this can be set by all of when it mergers props from different sources
    const objRefsStack = obj?.['x-refsStack'];
    baseRefsStack = concatRefStacks(baseRefsStack, objRefsStack);

    if (this.isRef(obj)) {
      const schemaName = getDefinitionName(obj.$ref);
      if (schemaName && this.options.ignoreNamedSchemas.has(schemaName)) {
        return { resolved: { type: 'object', title: schemaName } as T, refsStack: baseRefsStack };
      }

      let resolved = this.byRef<T>(obj.$ref);
      if (!resolved) {
        throw new Error(`Failed to resolve $ref "${obj.$ref}"`);
      }

      let refsStack = baseRefsStack;
      if (baseRefsStack.includes(obj.$ref) || baseRefsStack.length > MAX_DEREF_DEPTH) {
        resolved = Object.assign({}, resolved, { 'x-circular-ref': true });
      } else if (this.isRef(resolved)) {
        const res = this.deref(resolved, baseRefsStack, mergeAsAllOf);
        refsStack = res.refsStack;
        resolved = res.resolved;
      }

      refsStack = pushRef(baseRefsStack, obj.$ref);
      resolved = this.allowMergeRefs ? this.mergeRefs(obj, resolved, mergeAsAllOf) : resolved;

      return { resolved, refsStack };
    }
    return {
      resolved: obj,
      refsStack: concatRefStacks(baseRefsStack, objRefsStack),
    };
  }

  mergeRefs<T>(ref: OpenAPIRef, resolved: T, mergeAsAllOf: boolean): T {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $ref, ...rest } = ref;
    const keys = Object.keys(rest);
    if (keys.length === 0) {
      return resolved;
    }
    if (
      mergeAsAllOf &&
      keys.some(
        k =>
          ![
            'description',
            'title',
            'externalDocs',
            'x-refsStack',
            'x-parentRefs',
            'readOnly',
            'writeOnly',
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
        ...(resolved as object),
        ...rest,
      } as T;
    }
  }

  /**
   * Merge allOf constraints.
   * @param schema schema with allOF
   * @param $ref pointer of the schema
   * @param forceCircular whether to dereference children even if it is a circular ref
   * @param used$Refs
   */
  mergeAllOf(
    schema: MergedOpenAPISchema,
    $ref: string | undefined,
    refsStack: string[],
  ): MergedOpenAPISchema {
    if (schema['x-circular-ref']) {
      return schema;
    }

    schema = this.hoistOneOfs(schema, refsStack);

    if (schema.allOf === undefined) {
      return schema;
    }

    let receiver: MergedOpenAPISchema = {
      ...schema,
      'x-parentRefs': [],
      allOf: undefined,
      title: schema.title || getDefinitionName($ref),
    };

    // avoid mutating inner objects
    if (receiver.properties !== undefined && typeof receiver.properties === 'object') {
      receiver.properties = { ...receiver.properties };
    }
    if (receiver.items !== undefined && typeof receiver.items === 'object') {
      receiver.items = { ...receiver.items };
    }

    const allOfSchemas = uniqByPropIncludeMissing(
      schema.allOf
        .map((subSchema: OpenAPISchema) => {
          const { resolved, refsStack: subRefsStack } = this.deref(subSchema, refsStack, true);

          const subRef = subSchema.$ref || undefined;
          const subMerged = this.mergeAllOf(resolved, subRef, subRefsStack);
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
          };
        })
        .filter(child => child !== undefined) as Array<{
        schema: MergedOpenAPISchema;
        refsStack: string[];
        $ref?: string;
      }>,
      '$ref',
    );

    for (const { schema: subSchema, refsStack: subRefsStack } of allOfSchemas) {
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
        ...otherConstraints
      } = subSchema;

      if (receiver.type !== type && receiver.type !== undefined && type !== undefined) {
        console.warn(`Incompatible types in allOf at "${$ref}": "${receiver.type}" and "${type}"`);
      }

      if (type !== undefined) {
        if (Array.isArray(type) && Array.isArray(receiver.type)) {
          receiver.type = [...type, ...receiver.type];
        } else {
          receiver.type = type;
        }
      }

      if (enumProperty !== undefined) {
        if (Array.isArray(enumProperty) && Array.isArray(receiver.enum)) {
          receiver.enum = Array.from(new Set([...enumProperty, ...receiver.enum]));
        } else {
          receiver.enum = enumProperty;
        }
      }

      if (properties !== undefined && typeof properties === 'object') {
        receiver.properties = receiver.properties || {};
        for (const prop in properties) {
          const propRefsStack = concatRefStacks(subRefsStack, properties[prop]?.['x-refsStack']);
          if (!receiver.properties[prop]) {
            receiver.properties[prop] = {
              ...properties[prop],
              'x-refsStack': propRefsStack,
            } as MergedOpenAPISchema;
          } else if (!isCircular) {
            // merge inner properties
            const mergedProp = this.mergeAllOf(
              {
                allOf: [
                  receiver.properties[prop],
                  { ...properties[prop], 'x-refsStack': propRefsStack } as any,
                ],
                'x-refsStack': propRefsStack,
              },
              $ref + '/properties/' + prop,
              propRefsStack,
            );
            receiver.properties[prop] = mergedProp;
          }
        }
      }

      if (items !== undefined && !isCircular) {
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
        );
      }
      if (oneOf !== undefined) {
        receiver.oneOf = oneOf;
      }

      if (anyOf !== undefined) {
        receiver.anyOf = anyOf;
      }

      if (required !== undefined) {
        receiver.required = [...(receiver.required || []), ...required];
      }

      // merge rest of constraints
      // TODO: do more intelligent merge
      receiver = {
        ...receiver,
        title: receiver.title || title,
        description: receiver.description || description,
        readOnly: receiver.readOnly !== undefined ? receiver.readOnly : readOnly,
        writeOnly: receiver.writeOnly !== undefined ? receiver.writeOnly : writeOnly,
        'x-circular-ref': receiver['x-circular-ref'] || isCircular,
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
    const schemas = (this.spec.components && this.spec.components.schemas) || {};
    for (const defName in schemas) {
      const { resolved: def } = this.deref(schemas[defName]);
      if (
        def.allOf !== undefined &&
        def.allOf.find(
          (obj: OpenAPISchema) => obj.$ref !== undefined && $refs.indexOf(obj.$ref) > -1,
        )
      ) {
        res['#/components/schemas/' + defName] = [def['x-discriminator-value'] || defName];
      }
    }
    return res;
  }

  private hoistOneOfs(schema: OpenAPISchema, refsStack: string[]) {
    if (schema.allOf === undefined) {
      return schema;
    }

    const allOf = schema.allOf;
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
          oneOf: oneOf.map((part: OpenAPISchema) => {
            return {
              allOf: [...beforeAllOf, ...siblingValues, part, ...afterAllOf],
              'x-refsStack': refsStack,
            };
          }),
        };
      }
    }

    return schema;
  }
}

/**
 * Unique array by property, missing properties are included
 */
function uniqByPropIncludeMissing<T extends object>(arr: T[], prop: keyof T): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const k = item[prop];
    if (!k) return true;
    return k && !seen.has(k) && seen.add(k);
  });
}
