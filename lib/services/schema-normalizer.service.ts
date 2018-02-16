'use strict';
import { Injectable } from '@angular/core';
import { SpecManager } from '../utils/spec-manager';
import { JsonPointer } from '../utils/JsonPointer';
import { defaults } from '../utils/helpers';
import { WarningsService } from './warnings.service';

export interface Reference {
  $ref: string;
  description: string;
}

export interface Schema {
  properties: any;
  allOf: any;
  items: any;
  additionalProperties: any;
}

export class SchemaNormalizer {
  _dereferencer:SchemaDereferencer;
  constructor(_schema:any) {
    this._dereferencer = new SchemaDereferencer(_schema, this);
  }
  normalize(schema, ptr, opts:any ={}) {
    let hasPtr = !!schema.$ref;
    if (opts.resolved && !hasPtr) this._dereferencer.visit(ptr);

    if (opts.childFor) this._dereferencer.visit(opts.childFor);
    if (schema['x-redoc-normalized']) return schema;
    let res = SchemaWalker.walk(schema, ptr, (subSchema, ptr) => {
      let resolved = this._dereferencer.dereference(subSchema, ptr);
      if (resolved.allOf) {
        resolved._pointer = resolved._pointer || ptr;
        resolved = Object.assign({}, resolved);
        AllOfMerger.merge(resolved, resolved.allOf);
      }
      return resolved;
    });
    if (opts.resolved && !hasPtr) this._dereferencer.exit(ptr);
    if (opts.childFor) this._dereferencer.exit(opts.childFor);
    res['x-redoc-normalized'] = true;
    return res;
  }

  reset() {
    this._dereferencer.reset();
  }
}

class SchemaWalker {
  static walk(obj:Schema, pointer:string, visitor:Function) {
    if (obj == undefined || typeof(obj) !== 'object') {
      return;
    }
    if (obj.properties) {
      let ptr = JsonPointer.join(pointer, ['properties']);
      SchemaWalker.walkEach(obj.properties, ptr, visitor);
    }

    if (obj.additionalProperties) {
      let ptr = JsonPointer.join(pointer, ['additionalProperties']);
      if (Array.isArray(obj.additionalProperties)) {
        SchemaWalker.walkEach(obj.additionalProperties, ptr, visitor);
      } else {
        let res = SchemaWalker.walk(obj.additionalProperties, ptr, visitor);
        if (res) obj.additionalProperties = res;
      }
    }

    if (obj.allOf) {
      let ptr = JsonPointer.join(pointer, ['allOf']);
      SchemaWalker.walkEach(obj.allOf, ptr, visitor);
    }

    if (obj.items) {
      let ptr = JsonPointer.join(pointer, ['items']);
      if (Array.isArray(obj.items)) {
        SchemaWalker.walkEach(obj.items, ptr, visitor);
      } else {
        let res = SchemaWalker.walk(obj.items, ptr, visitor);
        if (res) obj.items = res;
      }
    }

    return visitor(obj, pointer);
  }

  private static walkEach(obj:Object, pointer:string, visitor:Function) {
    for(let key of Object.keys(obj)) {
      let ptr = JsonPointer.join(pointer, [key]);
      let res = SchemaWalker.walk(obj[key], ptr, visitor);
      if (res) obj[key] = res;
    }
  }
}

export class AllOfMerger {
  static merge(into, schemas) {
    into['x-derived-from'] = [];
    let hadDiscriminator = !!into.discriminator;
    for (let i=0; i < schemas.length; i++) {
      let subSchema = schemas[i];
      into['x-derived-from'].push(subSchema._pointer);

      AllOfMerger.checkCanMerge(subSchema, into);

      into.type = into.type || subSchema.type;
      if (into.type === 'object') {
        AllOfMerger.mergeObject(into, subSchema, i);
      }
      // don't merge _pointer
      let tmpPtr = subSchema._pointer;
      subSchema._pointer = null;
      defaults(into, subSchema);
      subSchema._pointer = tmpPtr;
    }
    if (!hadDiscriminator) into.discriminator = null;
    delete into.allOf;
  }

  private static mergeObject(into, subSchema, allOfNumber) {
    if (subSchema.properties) {
      into.properties = Object.assign({}, into.properties || {});
      Object.assign(into.properties, subSchema.properties);
      Object.keys(subSchema.properties).forEach(propName => {
        let prop = subSchema.properties[propName];
        if (!prop._pointer) {
          let schemaPtr = subSchema._pointer || JsonPointer.join(into._pointer, ['allOf', allOfNumber]);
          prop._pointer = prop._pointer || JsonPointer.join(schemaPtr, ['properties', propName]);
        }
      });
    }
    if (subSchema.required) {
      if (!into.required) into.required = [];
      into.required.push(...subSchema.required);
    }
  }

  private static checkCanMerge(subSchema, into) {
    // TODO: add support for merge array schemas
    if (typeof subSchema !== 'object') {
      let errMessage = `Items of allOf should be Object: ${typeof subSchema} found ` +
        `${subSchema} at "#${into._pointer}"`;
      throw new Error(errMessage);
    }

    if (into.type && subSchema.type && into.type !== subSchema.type) {
      let errMessage = `allOf merging error: schemas with different types can't be merged: ` +
      `"${into.type}" and "${subSchema.type}" at "#${into._pointer}"`;
      throw new Error(errMessage);
    }

    if (into.type === 'array') {
      WarningsService.warn('allOf: subschemas with type "array" are not supported yet');
    }
    // TODO: add check if can be merged correctly (no different properties with the same name)
    // TODO: merge properties
  }
}

class RefCounter {
  private _counter = {};

  reset():void {
    this._counter = {};
  }

  visit(ref:string):void {
    this._counter[ref] = this._counter[ref] ? this._counter[ref] + 1 : 1;
  }

  exit(ref:string):void {
    this._counter[ref] = this._counter[ref] && this._counter[ref] - 1;
  }

  visited(ref:string):boolean {
    return !!this._counter[ref];
  }
}


export class SchemaDereferencer {
  private _refCouner = new RefCounter();

  constructor(private _spec: SpecManager, private normalizator: SchemaNormalizer) {
  }
  reset() {
    this._refCouner.reset();
  }

  visit($ref) {
    this._refCouner.visit($ref);
  }

  exit($ref) {
    this._refCouner.exit($ref);
  }

  dereference(schema: Reference, pointer:string):any {
    if (!schema || !schema.$ref) return schema;
    let $ref = schema.$ref;
    let resolved = this._spec.byPointer($ref);
    if (!this._refCouner.visited($ref)) {
      resolved._pointer = $ref;
    } else {
      // for circular referenced save only title and type
      resolved = {
        title: resolved.title,
        type: resolved.type
      };
    }
    this._refCouner.visit($ref);
    // if resolved schema doesn't have title use name from ref
    resolved.title = resolved.title || JsonPointer.baseName($ref);

    let keysCount = Object.keys(schema).filter(key => !key.startsWith('x-redoc')).length;

    if ( keysCount > 2 || (keysCount === 2 && !schema.description) ) {
      WarningsService.warn(`Other properties are defined at the same level as $ref at "#${pointer}". ` +
        'They are IGNORED according to the JsonSchema spec');
      resolved.description = resolved.description || schema.description;
    }

    resolved = this.normalizator.normalize(resolved, $ref);
    this._refCouner.exit($ref);
    return resolved;
  }
}
