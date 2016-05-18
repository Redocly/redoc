'use strict';

import { ElementRef } from '@angular/core';

import { RedocComponent, BaseComponent, SchemaManager } from '../base';
import { DropDown } from '../../shared/components/index';
import JsonPointer from '../../utils/JsonPointer';

@RedocComponent({
  selector: 'json-schema',
  templateUrl: './lib/components/JsonSchema/json-schema.html',
  styleUrls: ['./lib/components/JsonSchema/json-schema.css'],
  directives: [JsonSchema, DropDown],
  inputs: ['isArray', 'final', 'nestOdd', 'childFor', 'isRequestSchema'],
  detect: true
})
@Reflect.metadata('parameters', [[SchemaManager], [ElementRef]])
export class JsonSchema extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.$element = elementRef.nativeElement;
    this.final = false;
  }

  selectDerived(subClassIdx) {
    let subClass = this.schema.derived[subClassIdx];
    if (!subClass || subClass.active) return;
    this.schema.derived.forEach((subSchema) => {
      subSchema.active = false;
    });
    subClass.active = true;
    this.derivedEmtpy = false;
    if (subClass.empty) this.derivedEmtpy = true;
  }

  unwrapArray(schema) {
    var res = schema;
    if (schema && schema.type === 'array') {
      let ptr = schema.items._pointer
        || JsonPointer.join(schema._pointer || this.pointer, ['items']);
      res = schema.items;
      res._isArray = true;
      res._pointer = ptr;
      res = this.unwrapArray(res);
    }
    return res;
  }

  prepareModel() {
    if (!this.componentSchema) {
      throw new Error(`Can't load component schema at ${this.pointer}`);
    }
    this.dereference();

    let schema = this.componentSchema;
    BaseComponent.joinAllOf(schema, {omitParent: true});
    this.schema = schema = this.unwrapArray(schema);
    runInjectors(schema, schema, schema._pointer || this.pointer, this.pointer);

    schema.derived = schema.derived || [];

    if (!schema.isTrivial) {
      this.prepareObjectPropertiesData(schema);
    }

    this.initDerived();
  }

  initDerived() {
    if (!this.schema.derived.length) return;
    let enumArr = this.schema.properties[this.schema.properties.length - 1].enum;
    if (enumArr) {
      let enumOrder = {};
      enumArr.forEach((enumItem, idx) => {
        enumOrder[enumItem.val] = idx;
      });

      this.schema.derived.sort((a, b) => {
        return enumOrder[a.name] > enumOrder[b.name];
      });
    }
    this.selectDerived(0);
  }

  prepareObjectPropertiesData(schema) {
    let requiredMap = {};
    if (schema.required) {
      schema.required.forEach(prop => requiredMap[prop] = true);
    }

    let discriminatorFieldIdx = -1;
    let props = schema.properties && Object.keys(schema.properties).map((prop, idx) => {
      let propertySchema = schema.properties[prop];
      let propPointer = propertySchema._pointer ||
        JsonPointer.join(schema._pointer || this.pointer, ['properties', prop]);
      propertySchema = JsonSchema.injectPropertyData(propertySchema, prop, propPointer);
      // stop endless discriminator recursion
      if (propertySchema._pointer === this.childFor) {
        propertySchema._pointer = null;
      }
      propertySchema.required = !!requiredMap[prop];
      propertySchema.isDiscriminator = (schema.discriminator === prop);
      if (propertySchema.isDiscriminator) {
        discriminatorFieldIdx = idx;
      }
      return propertySchema;
    });

    props = props || [];

    if (schema.additionalProperties && schema.additionalProperties !== false) {
      let propsSchema = this.prepareAdditionalProperties(schema);
      propsSchema._additional = true;
      props.push(propsSchema);
    }

    // Move discriminator field to the end of properties list
    if (discriminatorFieldIdx > -1) {
      let discrProp = props.splice(discriminatorFieldIdx, 1);
      props.push(discrProp[0]);
    }
    // filter readOnly props for request schemas
    if (this.isRequestSchema) {
      props = props.filter(prop => !prop.readOnly);
    }
    schema.properties = props;
  }

  prepareAdditionalProperties(schema) {
    var addProps = schema.additionalProperties;
    return JsonSchema.injectPropertyData(addProps, '<Additional Properties> *',
      JsonPointer.join(addProps._pointer || schema._pointer || this.pointer, ['additionalProperties']));
  }

  static injectPropertyData(propertySchema, propertyName, propPointer, hostPointer) {
    propertySchema = Object.assign({}, propertySchema);

    propertySchema._name = propertyName;
    runInjectors(propertySchema, propertySchema, propPointer, hostPointer);

    return propertySchema;
  }
}

function runInjectors(injectTo, propertySchema, propertyPointer, hostPointer) {
  for (var injName in injectors) {
    let injector = injectors[injName];
    if (injector.check(propertySchema)) {
      injector.inject(injectTo, propertySchema, propertyPointer, hostPointer);
    }
  }
}

const injectors = {
  general: {
    check: () => true,
    inject: (injectTo, propertySchema, pointer) => {
      injectTo._pointer = propertySchema._pointer || pointer;
      injectTo._displayType = propertySchema.type;
      if (propertySchema.format) injectTo._displayFormat = `<${propertySchema.format}>`;
      if (propertySchema.enum) {
        injectTo.enum = propertySchema.enum.map((value) => {
          return {val: value, type: typeof value};
        });
      }
    }
  },
  discriminator: {
    check: (propertySchema) => propertySchema.discriminator,
    inject: (injectTo, propertySchema = injectTo, pointer) => {
      injectTo.derived = SchemaManager.instance().findDerivedDefinitions(pointer);
      injectTo.discriminator = propertySchema.discriminator;
    }
  },
  array: {
    check: (propertySchema) => {
      return propertySchema.type === 'array';
    },
    inject: (injectTo, propertySchema = injectTo, propPointer) => {
      injectTo._isArray = true;
      injectTo._pointer = propertySchema.items._pointer
        || JsonPointer.join(propertySchema._pointer || propPointer, ['items']);

      runInjectors(injectTo, propertySchema.items, propPointer);
    }
  },
  object: {
    check: (propertySchema) => {
      return propertySchema.type === 'object' && propertySchema.properties;
    },
    inject: (injectTo, propertySchema = injectTo) => {
      let baseName = propertySchema._pointer && JsonPointer.baseName(propertySchema._pointer);
      injectTo._displayType = propertySchema.title || baseName || 'object';
    }
  },
  noType: {
    check: (propertySchema) => !propertySchema.type,
    inject: (injectTo) => {
      injectTo._displayType = '< * >';
      injectTo._displayTypeHint = 'This field may contain data of any type';
      injectTo.isTrivial = true;
    }
  },
  simpleType: {
    check: (propertySchema) => {
      if (propertySchema.type === 'object') {
        return (!propertySchema.properties || !Object.keys(propertySchema.properties).length)
          && (typeof propertySchema.additionalProperties !== 'object');
      }
      return (propertySchema.type !== 'array') && propertySchema.type;
    },
    inject: (injectTo, propertySchema = injectTo) => {
      injectTo.isTrivial = true;
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
  },
  string: {
    check: propertySchema => (propertySchema.type === 'string'),
    inject: (injectTo, propertySchema = injectTo) => {
      var range;
      if (propertySchema.minLength && propertySchema.maxLength) {
        range = `[ ${propertySchema.minLength} .. ${propertySchema.maxLength} ]`;
      } else if (propertySchema.maxLength) {
        range = '<= ' + propertySchema.maxLength;
      } else if (propertySchema.minimum) {
        range = '>= ' + propertySchema.minLength;
      }

      if (range) {
        injectTo._range = range + ' characters';
      }
    }
  },
  file: {
    check: propertySchema => (propertySchema.type === 'file'),
    inject: (injectTo, propertySchema = injectTo, propPointer, hostPointer) => {
      injectTo.isFile = true;
      let parentPtr;
      if (propertySchema.in === 'formData') {
        parentPtr = JsonPointer.dirName(hostPointer, 1);
      } else {
        parentPtr = JsonPointer.dirName(hostPointer, 3);
      }

      let parentParam = SchemaManager.instance().byPointer(parentPtr);
      let root = SchemaManager.instance().schema;
      injectTo._produces = parentParam && parentParam.produces || root.produces;
      injectTo._consumes = parentParam && parentParam.consumes || root.consumes;

    }
  }
};
