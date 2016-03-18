'use strict';

import {ElementRef} from 'angular2/core';

import {RedocComponent, BaseComponent, SchemaManager} from '../base';
import {Tabs, Tab} from '../../common/components/Tabs/tabs';
import JsonPointer from '../../utils/JsonPointer';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './lib/components/JsonSchema/json-schema.html',
  styleUrls: ['./lib/components/JsonSchema/json-schema.css'],
  directives: [JsonSchema, Tabs, Tab],
  inputs: ['isArray', 'final']
})
@Reflect.metadata('parameters', [[SchemaManager], [ElementRef]])
export default class JsonSchema extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.$element = elementRef.nativeElement;
    this.final = false;
  }

  selectDerived(subClass) {
    if (subClass.active) return;
    this.data.derived.forEach((subSchema) => {
      subSchema.active = false;
    });
    subClass.active = true;
  }

  prepareModel() {
    this.data = {};
    this.data.properties = [];
    this.data.derived = [];

    if (!this.componentSchema) {
      throw new Error(`Can't load component schema at ${this.pointer}`);
    }

    this.dereference();
    let schema = this.componentSchema;

    if (schema.type === 'array') {
      this.isArray = true;
      if (schema._pointer) {
        this.pointer = JsonPointer.join(schema._pointer, 'items');
      }
      schema = schema.items;
    }
    let normPtr = schema._pointer || this.pointer;
    let derived = this.schemaMgr.findDerivedDefinitions( normPtr );
    if (!this.final && derived.length) {
      derived[0].active = true;
      this.data.derived = derived;
      this.data.discriminator = schema.discriminator;
    }

    this.joinAllOf(schema, {omitParent: true});

    if (schema.type !== 'object') {
      this.isTrivial = true;
      this._displayType = schema.type;
      if (schema.format) this._displayType = `${this.displayType} <${schema.format}>`;
      return;
    }

    this.pointer = schema._pointer || this.pointer;

    this.requiredMap = {};
    if (this.componentSchema.required) {
      this.componentSchema.required.forEach(prop => this.requiredMap[prop] = true);
    }

    if (!schema.properties) {
      this.isTrivial = true;
      this._displayType = schema.type;
      return;
    }

    let discriminatorFieldIdx = -1;
    let props = Object.keys(schema.properties).map((prop, idx) => {
      let propertySchema = schema.properties[prop];
      let propPointer = JsonPointer.join(this.pointer, ['properties', prop]);
      propertySchema = JsonSchema.injectPropertyData(propertySchema, prop, propPointer);
      propertySchema.required = !!this.requiredMap[prop];
      propertySchema.isDiscriminator = (schema.discriminator === prop);
      if (propertySchema.isDiscriminator) discriminatorFieldIdx = idx;
      return propertySchema;
    });
    // Move discriminator field to the end of properties list
    if (discriminatorFieldIdx > -1) {
      let discrProp = props.splice(discriminatorFieldIdx, 1);
      props.push(discrProp[0]);
    }
    this.data.properties = props;
  }

  static injectPropertyData(propertySchema, propertyName, propPointer) {
    propertySchema = Object.assign({}, propertySchema);

    propertySchema._name = propertyName;
    runInjectors(propertySchema, propertySchema, propPointer);

    return propertySchema;
  }
}

function runInjectors(injectTo, propertySchema, propertyPointer) {
  for (var injName in injectors) {
    let injector = injectors[injName];
    if (injector.check(propertySchema)) {
      injector.inject(injectTo, propertySchema, propertyPointer);
    }
  }
}

const injectors = {
  general: {
    check: () => true,
    inject: (injectTo, propertySchema) => {
      injectTo._displayType = propertySchema.type;
      if (propertySchema.format) injectTo._displayFormat = `<${propertySchema.format}>`;
      if (propertySchema.enum) {
        injectTo.enum = propertySchema.enum.map((value) => {
          return {val: value, type: typeof value};
        });
      }
    }
  },

  array: {
    check: (propertySchema) => {
      return propertySchema.type === 'array';
    },
    inject: (injectTo, propertySchema = injectTo, propPointer) => {
      injectTo._isArray = true;
      injectTo._pointer = propertySchema.items._pointer
        || JsonPointer.join(propPointer, ['items']);

      runInjectors(injectTo, propertySchema.items, propPointer);
    }
  },

  object: {
    check: (propertySchema) => {
      return propertySchema.type === 'object' && propertySchema.properties;
    },
    inject: (injectTo, propertySchema = injectTo) => {
      injectTo._displayType = propertySchema.title || 'object';
    }
  },
  noType: {
    check: (propertySchema) => !propertySchema.type,
    inject: (injectTo) => {
      injectTo._displayType = '< * >';
      injectTo._displayTypeHint = 'This field may contain data of any type';
    }
  },

  simpleType: {
    check: (propertySchema) => {
      if (propertySchema.type === 'object') {
        return !propertySchema.properties;
      }
      return (propertySchema.type !== 'array') && propertySchema.type;
    },
    inject: (injectTo, propertySchema = injectTo) => {
      if (injectTo._pointer) {
        injectTo._pointer = undefined;
        injectTo._displayType = propertySchema.title ?
          `${propertySchema.title} (${propertySchema.type})` : propertySchema.type;
      }
    }
  },
  integer: {
    check: (propertySchema) => (propertySchema.type === 'integer' || propertySchema.type === 'number'),
    inject: (injectTo, propertySchema = injectTo) => {
      var range = '';
      if (propertySchema.minimum && propertySchema.maximum) {
        range += propertySchema.exclusiveMinimum ? '( ' : '[ ';
        range += propertySchema.minimum;
        range += ' .. ';
        range += propertySchema.maximum;
        range += propertySchema.exclusiveMaximum ? ' )' : ' ]';
      } else if (propertySchema.maximum) {
        range += propertySchema.exclusiveMaximum? '< ' : '<= ';
        range += propertySchema.maximum;
      } else if (propertySchema.minimum) {
        range += propertySchema.exclusiveMinimum ? '> ' : '>= ';
        range += propertySchema.minimum;
      }

      if (range) {
        injectTo._range = range;
      }
    }
  }
};
