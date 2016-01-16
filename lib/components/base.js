'use strict';
import {Component, View, OnInit, OnDestroy, ChangeDetectionStrategy} from 'angular2/core';
import {CORE_DIRECTIVES, JsonPipe} from 'angular2/common';
import SchemaManager from '../utils/SchemaManager';
import JsonPointer from '../utils/JsonPointer';
import {MarkedPipe, JsonPointerEscapePipe} from '../utils/pipes';

// common inputs for all components
let commonInputs = ['pointer']; // json pointer to the schema chunk

// internal helper function
function safeConcat(a, b) {
  let res = a && a.slice() || [];
  b = (b == null) ? [] : b;
  return res.concat(b);
}

function snapshot(obj) {
  if(obj == null || typeof(obj) != 'object') {
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
  let pipes = safeConcat(options.pipes, [JsonPointerEscapePipe, MarkedPipe, JsonPipe]);

  return function decorator(target) {

    let componentDecorator = Component({
      selector: options.selector,
      inputs: inputs,
      outputs: options.outputs,
      lifecycle: [OnInit, OnDestroy],
      providers: options.providers,
      changeDetection: options.changeDetection || ChangeDetectionStrategy.Detached
    });
    let viewDecorator = View({
      templateUrl: options.templateUrl,
      template: options.template,
      styles: options.styles,
      directives: directives,
      pipes: pipes
    });

    return componentDecorator(viewDecorator(target) || target) || target;
  };
}

/**
 * Generic Component
 * @class
 */
export class BaseComponent {
  constructor(schemaMgr) {
    this.schemaMgr = schemaMgr;
    this.schema = schemaMgr.schema;
    this.componentSchema = null;
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
      if (schema && schema.$ref) {
        let resolved = this.schemaMgr.byPointer(schema.$ref);
        let baseName = JsonPointer.baseName(schema.$ref);
        if (!dereferencedCache[schema.$ref]) {
          // if resolved schema doesn't have title use name from ref
          resolved = Object.assign({}, resolved);
          resolved._pointer = schema.$ref;
        } else {
          // for circular referenced save only title and type
          resolved = {
            title: resolved.title
          };
        }

        dereferencedCache[schema.$ref] = true;

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
        //for (var prop in schema) delete schema[prop];
        Object.assign(schema, resolved);
      }

      Object.keys(schema).forEach((key) => {
        let value = schema[key];
        if (value && typeof value === 'object') {
          schema[key] = resolve(value);
        }
      });
      return schema;
    };

    this.componentSchema = resolve(schema);
  }

  joinAllOf(schema = this.componentSchema, opts) {
    var self = this;
    function merge(into, schemas) {
      if (into.required || into.properties) {
        let errMessage = `Can\'t merge allOf: properties or required fields are specified on the same level as allOf
          ${into}`;
        throw new Error(errMessage);
      }
      into.required = [];
      into.properties = {};
      for (let subSchema of schemas) {
        if (opts && opts.omitParent && subSchema.discriminator) continue;

        // TODO: add support for merge array schemas
        if (typeof subSchema !== 'object' || subSchema.type !== 'object') {
          let errMessage = `Can\'t merge allOf: only subschemas with type: object can be merged
            ${subSchema}`;
          throw new Error(errMessage);
        }

        self.joinAllOf(subSchema);

        // TODO: add check if can be merged correctly (no different properties with the same name)
        if (subSchema.properties) {
          Object.assign(into.properties, subSchema.properties);
        }
        if (subSchema.required) {
          into.required.push(...subSchema.required);
        }
      }
      into.type = 'object';
      into.allOf = null;
    }
    if (schema.allOf) {
      merge(schema, schema.allOf);
    }
  }

  /**
   * Used to prepare model based on component schema
   * @abstract
   */
  prepareModel() {}

  /**
   * Used to initialize component. Run after prepareModel
   * @abstract
   */
  init() {}

  /**
   + Used to destroy component
   * @abstract
   */
  destroy() {}
}
BaseComponent.parameters = [[SchemaManager]];
