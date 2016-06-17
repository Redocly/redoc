'use strict';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CORE_DIRECTIVES, JsonPipe, AsyncPipe } from '@angular/common';
import { SchemaManager } from '../utils/SchemaManager';
import JsonPointer from '../utils/JsonPointer';
import { MarkedPipe, JsonPointerEscapePipe } from '../utils/pipes';

export { SchemaManager };

// common inputs for all components
let commonInputs = ['pointer']; // json pointer to the schema chunk

// internal helper function
function safeConcat(a, b) {
  let res = a && a.slice() || [];
  b = (b == undefined) ? [] : b;
  return res.concat(b);
}

function defaults(target, src) {
  var props = Object.keys(src);

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    if (target[key] === undefined) {
      target[key] = src[key];
    }
  }
  return target;
}

function snapshot(obj) {
  if(obj == undefined || typeof(obj) !== 'object') {
    return obj;
  }

  var temp = new obj.constructor();

  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = snapshot(obj[key]);
    }
  }

  return temp;
}

/**
 * Class decorator
 * Simplifies setup of component metainfo
 * All options are options from either Component or View angular2 decorator
 * For detailed info look angular2 doc
 * @param {Object} options - component options
 * @param {string[]} options.inputs - component inputs
 * @param {*[]} options.directives - directives used by component
 *   (except CORE_DIRECTIVES)
 * @param {*[]} options.pipes - pipes used by component
 * @param {*[]} options.providers - component providers
 * @param {string} options.templateUrl - path to component template
 * @param {string} options.template - component template html
 * @param {string} options.styles - component css styles
 */
export function RedocComponent(options) {
  let inputs = safeConcat(options.inputs, commonInputs);
  let directives = safeConcat(options.directives, CORE_DIRECTIVES);
  let pipes = safeConcat(options.pipes, [JsonPointerEscapePipe, MarkedPipe, JsonPipe, AsyncPipe]);
  if (options.onPushOnly === undefined) options.onPushOnly = true;

  return function decorator(target) {

    let componentDecorator = Component({
      selector: options.selector,
      inputs: inputs,
      outputs: options.outputs,
      providers: options.providers,
      changeDetection: options.detect ?
        (options.onPushOnly ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default) :
        ChangeDetectionStrategy.Detached,
      templateUrl: options.templateUrl,
      template: options.template,
      styles: options.styles,
      directives: directives,
      pipes: pipes
    });

    return componentDecorator(target) || target;
  };
}

/**
 * Generic Component
 * @class
 */
export class BaseComponent implements OnInit, OnDestroy {
  componentSchema: any = null;
  pointer: String;

  static joinAllOf(schema: any, opts?: any) {
    function merge(into, schemas) {
      for (let subSchema of schemas) {
        if (opts && opts.omitParent && subSchema.discriminator) continue;
        // TODO: add support for merge array schemas
        if (typeof subSchema !== 'object') {
          let errMessage = `Items of allOf should be Object: ${typeof subSchema} found
            ${subSchema}`;
          throw new Error(errMessage);
        }

        if (into.type && subSchema.type && into.type !== subSchema.type) {
          let errMessage = `allOf merging error: schemas with different types can't be merged`;
          throw new Error(errMessage);
        }


        if (into.type === 'array') {
          console.warn('allOf: subschemas with type array are not supported yet');
        }

        // TODO: add check if can be merged correctly (no different properties with the same name)
        into.type = into.type || subSchema.type;
        if (into.type === 'object' && subSchema.properties) {
          if (!into.properties) into.properties = {};
          Object.assign(into.properties, subSchema.properties);
          Object.keys(subSchema.properties).forEach(propName => {
            if (!subSchema.properties[propName]._pointer) {
              subSchema.properties[propName]._pointer = subSchema._pointer ?
                JsonPointer.join(subSchema._pointer, ['properties', propName]) : null;
            }
          });
        }
        if (into.type === 'object' && subSchema.required) {
          if (!into.required) into.required = [];
          into.required.push(...subSchema.required);
        }
        // don't merge _pointer
        subSchema._pointer = null;
        defaults(into, subSchema);
      }
      into.allOf = null;
    }

    function traverse(obj) {
      if (obj === undefined || typeof(obj) !== 'object') {
        return;
      }

      for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
          traverse(obj[key]);
        }
      }

      if (obj.allOf) {
        merge(obj, obj.allOf);
      }
    }

    traverse(schema);
  }

  constructor(public schemaMgr: SchemaManager) {
  }

  /**
   * onInit method is run by angular2 after all component inputs are resolved
   */
  ngOnInit() {
    this.componentSchema = snapshot(this.schemaMgr.byPointer(this.pointer || ''));
    this.prepareModel();
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   * simple in-place schema dereferencing. Schema is already bundled so no need in global dereferencing.
   */
  dereference(schema = Object.assign({}, this.componentSchema)) {
    let dereferencedCache = {};

    let resolve = (schema) => {
      let resolvedRef;
      if (schema && schema.$ref) {
        resolvedRef = schema.$ref;
        let resolved = this.schemaMgr.byPointer(schema.$ref);
        let baseName = JsonPointer.baseName(schema.$ref);
        if (!dereferencedCache[schema.$ref]) {
          // if resolved schema doesn't have title use name from ref
          resolved = Object.assign({}, resolved);
          resolved._pointer = schema.$ref;
        } else {
          // for circular referenced save only title and type
          resolved = {
            title: resolved.title,
            type: resolved.type
          };
        }

        dereferencedCache[schema.$ref] = dereferencedCache[schema.$ref] ? dereferencedCache[schema.$ref] + 1 : 1;

        resolved.title = resolved.title || baseName;

        let keysCount = Object.keys(schema).length;
        if ( keysCount > 2 || (keysCount === 2 && !schema.description) ) {
          // allow only description field on the same level as $ref because it is
          // common pattern over specs in the wild
          console.warn(`other properties defined at the same level as $ref at '${this.pointer}'.
            They are IGNORRED according to JsonSchema spec`);
        }

        schema = schema.description ? {
          description: schema.description
        } : {};
        Object.assign(schema, resolved);
      }

      Object.keys(schema).forEach((key) => {
        let value = schema[key];
        if (value && typeof value === 'object') {
          schema[key] = resolve(value);
        }
      });
      if (resolvedRef) dereferencedCache[resolvedRef] = dereferencedCache[resolvedRef] ? dereferencedCache[resolvedRef] - 1 : 0;
      return schema;
    };

    this.componentSchema = snapshot(resolve(schema));
  }

  /**
   * Used to prepare model based on component schema
   * @abstract
   */
  prepareModel():any {
    // emtpy
  }

  /**
   * Used to initialize component. Run after prepareModel
   * @abstract
   */
  init() {
    // empty
  }

  /**
   + Used to destroy component
   * @abstract
   */
  destroy() {
    // emtpy
  }
}
