'use strict';
import {Component, View, OnInit, CORE_DIRECTIVES, ChangeDetectionStrategy} from 'angular2/angular2';
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
  let pipes = safeConcat(options.pipes, [JsonPointerEscapePipe, MarkedPipe]);

  return function decorator(target) {

    let componentDecorator = Component({
      selector: options.selector,
      inputs: inputs,
      outputs: options.outputs,
      lifecycle: [OnInit],
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
  onInit() {
    this.componentSchema = this.schemaMgr.byPointer(this.pointer || '');
    this.prepareModel();
    this.init();
  }

  /**
   * simple in-place schema dereferencing. Schema is already bundled so no need in global dereferencing.
   * TODO: doesn't support circular references
   */
  dereference(schema = Object.assign({}, this.componentSchema)) {
    //schema = Object.assign({}, schema);
    if (schema && schema.$ref) {
      let resolved = this.schemaMgr.byPointer(schema.$ref);
      let baseName = JsonPointer.baseName(schema.$ref);
      // if resolved schema doesn't have title use name from ref
      resolved.title = resolved.title || baseName;
      resolved._pointer = schema.$ref;
      Object.assign(schema, resolved);
      delete schema.$ref;
    }

    Object.keys(schema).forEach((key) => {
      let value = schema[key];
      if (value && typeof value === 'object') {
        this.dereference(value);
      }
    });
    this.componentSchema = schema;
  }

  joinAllOf(schema = this.componentSchema) {
    var self = this;
    function merge(into, schemas) {
      if (into.required || into.properties) {
        console.warn('WARN: properties or required field set on the same level as allOf');
      }
      into.required = [];
      into.properties = {};
      for (let subSchema of schemas) {
        if (typeof subSchema !== 'object' || subSchema.type !== 'object') {
          console.warn('WARN: incorrect allOf element skipped\nObject: ', subSchema);
        }

        self.joinAllOf(subSchema);

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
}
BaseComponent.parameters = [[SchemaManager]];
