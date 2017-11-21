import { observable } from 'mobx';
import { resolve as urlResolve } from 'url';

import { OpenAPIRef, OpenAPISchema, OpenAPISpec, Referenced } from '../types';

import { JsonPointer } from '../utils/JsonPointer';
import { isNamedDefinition } from '../utils/openapi';
import { COMPONENT_REGEXP, buildComponentComment } from './MarkdownRenderer';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';
import { appendToMdHeading } from '../utils/index';

export type MergedOpenAPISchema = OpenAPISchema & { namedParents?: string[] };

/**
 * Helper class to keep track of visited references to avoid
 * endless recursion because of circular refs
 */
class RefCounter {
  public _counter = {};

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

  constructor(
    spec: OpenAPISpec,
    specUrl: string | undefined,
    private options: RedocNormalizedOptions,
  ) {
    this.validate(spec);
    this.preprocess(spec);

    this.spec = spec;

    if (typeof specUrl === 'string') {
      this.specUrl = urlResolve(window.location.href, specUrl);
    } else {
      this.specUrl = window.location.href;
    }
  }

  private _refCounter: RefCounter = new RefCounter();

  validate(spec: any) {
    if (spec.openapi === undefined) {
      throw new Error('Document must be valid OpenAPI 3.0.0 definition');
    }
  }

  preprocess(spec: OpenAPISpec) {
    if (!this.options.noAutoAuth && spec.info) {
      // Automatically inject Authentication section with SecurityDefinitions component
      const description = spec.info.description || '';
      const securityRegexp = new RegExp(
        COMPONENT_REGEXP.replace('{component}', '<security-definitions>'),
        'gmi',
      );
      debugger;
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
    if (this.spec === undefined) return;
    if (ref.charAt(0) !== '#') ref = '#' + ref;
    try {
      res = JsonPointer.get(this.spec, decodeURIComponent(ref));
    } catch (e) {
      // do nothing
    }
    return res;
  };

  /**
   * checks if the objectt is OpenAPI reference (containts $ref property)
   */
  isRef(obj: any): obj is OpenAPIRef {
    return obj.$ref !== undefined && obj.$ref !== null;
  }

  /**
   * resets visited enpoints. should be run after
   */
  resetVisited() {
    for (let k in this._refCounter._counter) {
      if (this._refCounter._counter[k] > 0) {
        console.log('>>>', k, this._refCounter._counter[k]);
      }
    }
    this._refCounter = new RefCounter();
  }

  exitRef<T>(ref: Referenced<T>) {
    if (!this.isRef(ref)) return;
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
      if (this._refCounter.visited(obj.$ref) && !forceCircular) {
        // circular reference detected
        return Object.assign({}, resolved, { 'x-circular-ref': true });
      }
      this._refCounter.visit(obj.$ref);
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
   * Merge allOf contsraints.
   * @param schema schema with allOF
   * @param $ref pointer of the schema
   * @param forceCircular whether to dereference children even if it is a cirular ref
   */
  mergeAllOf(
    schema: OpenAPISchema,
    $ref: string,
    forceCircular: boolean = false,
  ): MergedOpenAPISchema {
    if (schema.allOf === undefined) {
      return schema;
    }

    let receiver: MergedOpenAPISchema = {
      ...schema,
      allOf: undefined,
      namedParents: [],
    };

    const allOfSchemas = schema.allOf.map((subSchema, idx) => {
      return {
        $ref: subSchema.$ref || $ref + '/allOf/' + idx,
        schema: this.deref(subSchema, forceCircular),
      };
    });

    if (receiver.title === undefined && isNamedDefinition($ref)) {
      receiver.title = JsonPointer.baseName($ref);
    }

    for (let { $ref: subSchemaRef, schema: subSchema } of allOfSchemas) {
      if (
        receiver.type !== subSchema.type &&
        receiver.type !== undefined &&
        subSchema.type !== undefined
      ) {
        throw new Error(`Uncopatible types in allOf at "${$ref}"`);
      }

      receiver.type = subSchema.type;
      if (subSchema.properties !== undefined) {
        // TODO: merge properties contents
        receiver.properties = {
          ...(receiver.properties || {}),
          ...subSchema.properties,
        };
      }

      if (subSchema.required !== undefined) {
        receiver.required = (receiver.required || []).concat(subSchema.required);
      }

      if (isNamedDefinition(subSchemaRef)) {
        receiver.namedParents!.push(subSchemaRef);
        if (receiver.title === undefined) {
          receiver.title = JsonPointer.baseName(subSchemaRef);
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
    for (let defName in schemas) {
      const def = this.deref(schemas[defName]);
      if (
        def.allOf !== undefined &&
        def.allOf.find(obj => obj.$ref !== undefined && $refs.indexOf(obj.$ref) > -1)
      ) {
        res['#/components/schemas/' + defName] = defName;
      }
    }
    return res;
  }
}
