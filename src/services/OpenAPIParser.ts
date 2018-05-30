import { observable } from 'mobx';
import { resolve as urlResolve } from 'url';

import { OpenAPIRef, OpenAPISchema, OpenAPISpec, Referenced } from '../types';

import { appendToMdHeading, IS_BROWSER } from '../utils/';
import { JsonPointer } from '../utils/JsonPointer';
import { isNamedDefinition } from '../utils/openapi';
import { buildComponentComment, COMPONENT_REGEXP } from './MarkdownRenderer';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';

export type DereferedOpenAPISchema = OpenAPISchema & { parentRefs?: string[] };

/**
 * Helper class to keep track of visited references to avoid
 * endless recursion because of circular refs
 */
class RefCounter {
  _counter = {};

  reset(): void {
    this._counter = {};
  }

  visit(ref: string): void {
    this._counter[ref] = this._counter[ref] ? this._counter[ref] + 1 : 1;
  }

  exit(ref: string): void {
    this._counter[ref] = this._counter[ref] && this._counter[ref] - 1;
  }

  visited(ref: string): boolean {
    return !!this._counter[ref];
  }
}

/**
 * Loads and keeps spec. Provides raw spec operations
 */
export class OpenAPIParser {
  @observable specUrl: string;
  @observable.ref spec: OpenAPISpec;

  private _refCounter: RefCounter = new RefCounter();

  constructor(
    spec: OpenAPISpec,
    specUrl?: string,
    private options: RedocNormalizedOptions = new RedocNormalizedOptions({}),
  ) {
    this.validate(spec);
    this.preprocess(spec);

    this.spec = spec;

    const href = IS_BROWSER ? window.location.href : '';
    if (typeof specUrl === 'string') {
      this.specUrl = urlResolve(href, specUrl);
    } else {
      this.specUrl = href;
    }
  }

  validate(spec: any) {
    if (spec.openapi === undefined) {
      throw new Error('Document must be valid OpenAPI 3.0.0 definition');
    }
  }

  preprocess(spec: OpenAPISpec) {
    if (
      !this.options.noAutoAuth &&
      spec.info &&
      spec.components &&
      spec.components.securitySchemes
    ) {
      // Automatically inject Authentication section with SecurityDefinitions component
      const description = spec.info.description || '';
      const securityRegexp = new RegExp(
        COMPONENT_REGEXP.replace('{component}', '<security-definitions>'),
        'gmi',
      );
      if (!securityRegexp.test(description)) {
        const comment = buildComponentComment('security-definitions');
        spec.info.description = appendToMdHeading(description, 'Authentication', comment);
      }
    }
  }

  /**
   * get spec part by JsonPointer ($ref)
   */
  byRef = <T extends any = any>(ref: string): T | undefined => {
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
    return JSON.parse(JSON.stringify(res)) || {};
  };

  /**
   * checks if the objectt is OpenAPI reference (containts $ref property)
   */
  isRef(obj: any): obj is OpenAPIRef {
    if (!obj) {
      return false;
    }
    return obj.$ref !== undefined && obj.$ref !== null;
  }

  /**
   * resets visited enpoints. should be run after
   */
  resetVisited() {
    if (process.env.NODE_ENV !== 'production') {
      // check in dev mode
      for (const k in this._refCounter._counter) {
        if (this._refCounter._counter[k] > 0) {
          console.warn('Not exited reference: ' + k);
        }
      }
    }
    this._refCounter = new RefCounter();
  }

  exitRef<T>(ref: Referenced<T>) {
    if (!this.isRef(ref)) {
      return;
    }
    this._refCounter.exit(ref.$ref);
  }

  /**
   * Resolve given reference object or return as is if it is not a reference
   * @param obj object to dereference
   * @param forceCircular whether to dereference even if it is cirular ref
   */
  deref<T extends object>(obj: OpenAPIRef | T, forceCircular: boolean = false): T {
    if (this.isRef(obj)) {
      const resolved = this.byRef<T>(obj.$ref)!;
      const visited = this._refCounter.visited(obj.$ref);
      this._refCounter.visit(obj.$ref);
      if (visited && !forceCircular) {
        // circular reference detected
        // tslint:disable-next-line
        return Object.assign({}, resolved, { 'x-circular-ref': true });
      }
      // deref again in case one more $ref is here
      if (this.isRef(resolved)) {
        const res = this.deref(resolved);
        this.exitRef(resolved);
        return res;
      }
      return resolved;
    }
    return obj;
  }

  /**
   * Resolve given reference object or return as is if it is not a reference
   * @param obj object to dereference
   * @param forceCircular whether to dereference even if it is cirular ref
   */
  derefSchema(schema: OpenAPISchema): DereferedOpenAPISchema {
    if (schema['x-derefered']) {
      return schema;
    }

    const receiver: DereferedOpenAPISchema = {
      ...JSON.parse(JSON.stringify(this.deref<OpenAPISchema>(schema)!)),
      parentRefs: [],
    };

    if (this.isRef(schema)) {
      receiver.parentRefs!.push(schema.$ref);
    }

    if (this.isRef(schema) && receiver.title === undefined && isNamedDefinition(schema.$ref)) {
      receiver.title = JsonPointer.baseName(schema.$ref);
    }

    if (receiver['x-circular-ref']) {
      this.exitRef(schema);
      return receiver;
    }

    for (const property of ['properties', 'anyOf', 'allOf', 'oneOf']) {
      if (receiver[property] !== undefined) {
        for (const prop in receiver[property]) {
          const subSchema = this.derefSchema(receiver[property][prop]);
          receiver.parentRefs!.push(...(subSchema.parentRefs || []));

          receiver[property][prop] = subSchema;
        }
      }
    }
    for (const property of ['items']) {
      if (receiver[property] !== undefined) {
        const subSchema = this.derefSchema(receiver[property]);
        receiver.parentRefs!.push(...(subSchema.parentRefs || []));

        receiver[property] = subSchema;
      }
    }

    this.exitRef(schema);

    // tslint:disable-next-line
    return Object.assign({}, receiver, { 'x-derefered': true });
  }

  shalowDeref<T extends object>(obj: OpenAPIRef | T): T {
    if (this.isRef(obj)) {
      return this.byRef<T>(obj.$ref)!;
    }
    return obj;
  }

  /**
   * Merge allOf contsraints.
   * @param schema schema with allOF
   * @param $ref pointer of the schema
   * @param forceCircular whether to dereference children even if it is a cirular ref
   */
  mergeAllOf(
    schema: OpenAPISchema,
  ): OpenAPISchema {
    if (schema.allOf === undefined || schema['x-circular-ref']) {
      return schema;
    }

    let receiver: OpenAPISchema = {
      ...schema,
      allOf: undefined,
    };

    for (const subSchemaRaw of schema.allOf) {
      const subSchema = this.mergeAllOf(subSchemaRaw);
      if (
        receiver.type !== subSchema.type &&
        receiver.type !== undefined &&
        subSchema.type !== undefined
      ) {
        throw new Error(`Incompatible types in allOf at "${schema.title}"`);
      }

      if (subSchema.type !== undefined) {
        receiver.type = subSchema.type;
      }

      if (receiver.title === undefined) {
        receiver.title = subSchema.title;
      }

      if (!!subSchema['x-circular-ref']) {
        receiver = { ...subSchema, ...receiver };
        continue;
      }

      receiver.required = [...(receiver.required || []), ...(subSchema.required || [])];
      if (subSchema.properties !== undefined) {
        receiver.properties = receiver.properties || {};
        for (const prop in subSchema.properties) {
          const mergedProp = this.mergeAllOf(subSchema.properties[prop]);
          if (!receiver.properties[prop]) {
            receiver.properties[prop] = mergedProp;
          } else {
            // merge inner properties
            receiver.properties[prop] = this.mergeAllOf(
              { allOf: [receiver.properties[prop], mergedProp] },
            );
          }
        }
      }

      if (subSchema.items !== undefined) {
        receiver.items = receiver.items || {};
        const mergedItems = this.mergeAllOf(subSchema.items);
        if (!receiver.items) {
          receiver.items = mergedItems;
        } else {
          // merge inner items
          receiver.items = this.mergeAllOf(
            { allOf: [receiver.items, mergedItems] },
          );
        }
      }

      // merge rest of constraints
      // TODO: do more intelegent merge
      receiver = { ...subSchema, ...receiver };
    }

    return receiver;
  }

  /**
   * Find all derived definitions among #/components/schemas from any of $refs
   * returns map of definition pointer to definition name
   * @param $refs array of references to find derived from
   */
  findDerived($refs: string[]): Dict<string> {
    const res: Dict<string> = {};
    const schemas = (this.spec.components && this.spec.components.schemas) || {};
    for (const defName in schemas) {
      const def = this.deref(schemas[defName]);
      if (
        def.allOf !== undefined &&
        def.allOf.find(obj => obj.$ref !== undefined && $refs.includes(obj.$ref))
      ) {
        res['#/components/schemas/' + defName] = defName;
      }
      this.exitRef(schemas[defName]);
    }
    return res;
  }
}
