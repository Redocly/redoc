'use strict';
import { JsonPointer } from '../utils/JsonPointer';
import { operations as swaggerOperations, keywordTypes } from  '../utils/swagger-defs';
import { WarningsService } from './warnings.service';
import * as slugify from 'slugify';

export interface PropertyPreprocessOptions {
  childFor?: string;
  skipReadOnly?: boolean;
  discriminator?: string;
}

// global var for this module
var specMgrInstance;

const injectors = {
  notype: {
    check: (propertySchema) => !propertySchema.type,
    inject: (injectTo, propertySchema, pointer) => {
      injectTo.type = SchemaHelper.detectType(propertySchema);
      propertySchema.type = injectTo.type;
      if (injectTo.type) {
        let message = `No "type" specified at "${pointer}". Automatically detected: "${injectTo.type}"`;
        WarningsService.warn(message);
      }
    }
  },
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
        if (propertySchema.enum && propertySchema.enum.length === 1) {
          injectTo._enumItem = propertySchema.enum[0];
          injectTo.enum = null;
        }
      }
    }
  },
  discriminator: {
    check: (propertySchema) => propertySchema.discriminator || propertySchema['x-extendedDiscriminator'],
    inject: (injectTo, propertySchema = injectTo) => {
      injectTo.discriminator = propertySchema.discriminator;
      injectTo['x-extendedDiscriminator'] = propertySchema['x-extendedDiscriminator'];
    }
  },
  simpleArray: {
    check: (propertySchema) => {
      return propertySchema.type === 'array' && !Array.isArray(propertySchema.items);
    },
    inject: (injectTo, propertySchema = injectTo, propPointer) => {
      if (!propertySchema.items) propertySchema.items = {};
      if (!(SchemaHelper.detectType(propertySchema.items) === 'object')) {
        injectTo._isArray = true;
        injectTo._pointer = propertySchema.items._pointer
          || JsonPointer.join(propertySchema._pointer || propPointer, ['items']);

        SchemaHelper.runInjectors(injectTo, propertySchema.items, propPointer);
      } else {
        injectors.object.inject(injectTo, propertySchema.items);
      }
      if (!injectTo.description) injectTo.description = propertySchema.items.description;
      injectTo._widgetType = 'array';
    }
  },
  tuple: {
    check: (propertySchema) => {
      return propertySchema.type === 'array' && Array.isArray(propertySchema.items);
    },
    inject: (injectTo, propertySchema = injectTo, propPointer) => {
      injectTo._isTuple = true;
      injectTo._displayType = '';
      let itemsPtr = JsonPointer.join(propertySchema._pointer || propPointer, ['items']);
      for (let i=0; i < propertySchema.items.length; i++) {
        let itemSchema = propertySchema.items[i];
        itemSchema._pointer = itemSchema._pointer || JsonPointer.join(itemsPtr, [i.toString()]);
      }
      injectTo._widgetType = 'tuple';
    }
  },
  object: {
    check: (propertySchema) => {
      return propertySchema.type === 'object' && (propertySchema.properties ||
        typeof propertySchema.additionalProperties === 'object');
    },
    inject: (injectTo, propertySchema = injectTo) => {
      let baseName = propertySchema._pointer && JsonPointer.baseName(propertySchema._pointer);
      injectTo._displayType = propertySchema.title || baseName || 'object';
      injectTo._widgetType = 'object';
    }
  },
  noType: {
    check: (propertySchema) => !propertySchema.type,
    inject: (injectTo) => {
      injectTo._displayType = '< anything >';
      injectTo._displayTypeHint = 'This field may contain data of any type';
      injectTo.isTrivial = true;
      injectTo._widgetType = 'trivial';
      injectTo._pointer = undefined;
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
      injectTo._widgetType = 'trivial';
    }
  },
  integer: {
    check: (propertySchema) => (propertySchema.type === 'integer' || propertySchema.type === 'number'),
    inject: (injectTo, propertySchema = injectTo) => {
      var range = '';
      if (propertySchema.minimum != undefined && propertySchema.maximum != undefined) {
        range += propertySchema.exclusiveMinimum ? '( ' : '[ ';
        range += propertySchema.minimum;
        range += ' .. ';
        range += propertySchema.maximum;
        range += propertySchema.exclusiveMaximum ? ' )' : ' ]';
      } else if (propertySchema.maximum != undefined) {
        range += propertySchema.exclusiveMaximum? '< ' : '<= ';
        range += propertySchema.maximum;
      } else if (propertySchema.minimum != undefined) {
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
      if (propertySchema.minLength != undefined && propertySchema.maxLength != undefined) {
        if (propertySchema.minLength === propertySchema.maxLength) {
          range = `${propertySchema.minLength} characters`;
        } else {
          range = `[ ${propertySchema.minLength} .. ${propertySchema.maxLength} ] characters`;
        }
      } else if (propertySchema.maxLength != undefined) {
        range = `<= ${propertySchema.maxLength} characters`;
      } else if (propertySchema.minLength != undefined) {
        if (propertySchema.minLength === 1) {
          range = 'non-empty';
        } else {
          range = `>= ${propertySchema.minLength} characters`;
        }
      }

      injectTo._range = range;
    }
  },
  file: {
    check: propertySchema => (propertySchema.type === 'file'),
    inject: (injectTo, propertySchema = injectTo, _, hostPointer) => {
      injectTo.isFile = true;
      let parentPtr;
      if (propertySchema.in === 'formData') {
        parentPtr = JsonPointer.dirName(hostPointer, 1);
      } else {
        parentPtr = JsonPointer.dirName(hostPointer, 3);
      }

      let parentParam = specMgrInstance.byPointer(parentPtr);
      let root =specMgrInstance.schema;
      injectTo._produces = parentParam && parentParam.produces || root.produces;
      injectTo._consumes = parentParam && parentParam.consumes || root.consumes;
      injectTo._widgetType = 'file';
    }
  }
};

export class SchemaHelper {
  static setSpecManager(specMgr) {
    specMgrInstance = specMgr;
  }

  static preprocess(schema, pointer, hostPointer?) {
    //propertySchema = Object.assign({}, propertySchema);
    if (schema['x-redoc-schema-precompiled']) {
      return schema;
    }
    SchemaHelper.runInjectors(schema, schema, pointer, hostPointer);
    schema['x-redoc-schema-precompiled'] = true;
    return schema;
  }

  static runInjectors(injectTo, schema, pointer, hostPointer?) {
    for (var injName of Object.keys(injectors)) {
      let injector = injectors[injName];
      if (injector.check(schema)) {
        injector.inject(injectTo, schema, pointer, hostPointer);
      }
    }
  }

  static preprocessProperties(schema:any, pointer:string, opts: PropertyPreprocessOptions) {
    let requiredMap = {};
    if (schema.required) {
      if (Array.isArray(schema.required)) {
        schema.required.forEach(prop => requiredMap[prop] = true);
      } else {
        WarningsService.warn(`required must be an array: "${typeof schema.required}" found at ${pointer}`);
      }
    }

    let props = schema.properties && Object.keys(schema.properties).map(propName => {
      let propertySchema = Object.assign({}, schema.properties[propName]);
      let propPointer = propertySchema._pointer ||
        JsonPointer.join(pointer, ['properties', propName]);
      propertySchema = SchemaHelper.preprocess(propertySchema, propPointer);
      propertySchema.name = propName;
      // stop endless discriminator recursion
      if (propertySchema._pointer === opts.childFor) {
        propertySchema._pointer = null;
      }
      propertySchema._required = !!requiredMap[propName];
      propertySchema.isDiscriminator = opts.discriminator === propName;
      return propertySchema;
    });

    props = props || [];

    if (schema.additionalProperties && (typeof schema.additionalProperties === 'object')) {
      let propsSchema = SchemaHelper.preprocessAdditionalProperties(schema, pointer);
      propsSchema._additional = true;
      props.push(propsSchema);
    }

    // filter readOnly props for request schemas
    if (opts.skipReadOnly) {
      props = props.filter(prop => !prop.readOnly);
    }
    schema._properties = props;
  }

  static preprocessAdditionalProperties(schema:any, pointer:string) {
    var addProps = schema.additionalProperties;
    let ptr = addProps._pointer || JsonPointer.join(pointer, ['additionalProperties']);
    let res = SchemaHelper.preprocess(addProps, ptr);
    res.name = '<Additional Properties> *';
    return res;
  }

  static unwrapArray(schema, pointer) {
    var res = schema;
    if (schema && schema.type === 'array' && !Array.isArray(schema.items)) {
      let items = schema.items = schema.items || {};
      let ptr = items._pointer || JsonPointer.join(pointer, ['items']);
      res = Object.assign({}, items);
      res._isArray = true;
      res._pointer = ptr;
      res = SchemaHelper.unwrapArray(res, ptr);
    }
    return res;
  }

  static operationSummary(operation) {
    return operation.summary || operation.operationId ||
      (operation.description && operation.description.substring(0, 50)) || '<no description>';
  }

  static detectType(schema) {
    if (schema.type) return schema.type;
    let keywords = Object.keys(keywordTypes);
    for (var i=0; i < keywords.length; i++) {
      let keyword = keywords[i];
      let type = keywordTypes[keyword];
      if (schema[keyword]) {
        return type;
      }
    }
  }

  static getTagsWithOperations(schema) {
    let tags = {};
    for (let tag of schema.tags || []) {
      tags[tag.name] = tag;
      tag.operations = [];
    }

    let paths = schema.paths;
    for (let path of Object.keys(paths)) {
      let operations = Object.keys(paths[path]).filter((k) => swaggerOperations.has(k));
      for (let operation of operations) {
        let operationInfo = paths[path][operation];
        let operationTags = operationInfo.tags;

        // empty tag
        if (!(operationTags && operationTags.length)) {
          operationTags = [''];
        }
        let operationPointer = JsonPointer.compile(['paths', path, operation]);
        for (let tagName of operationTags) {
          let tag = tags[tagName];
          if (!tag) {
            tag = {
              name: tagName,
            };
            tags[tagName] = tag;
          }
          if (tag['x-traitTag']) continue;
          if (!tag.operations) tag.operations = [];
          tag.operations.push(operationInfo);
          operationInfo._pointer = operationPointer;
          operationInfo.operation = operation;
        }
      }
    }

    return tags;
  }

  static moveRequiredPropsFirst(properties: any[], _required: string[]|null) {
    let required = _required || [];
    properties.sort((a, b) => {
      if ((!a._required && b._required)) {
        return 1;
      } else if (a._required && !b._required) {
        return -1;
      } else if (a._required && b._required) {
        return required.indexOf(a.name) > required.indexOf(b.name) ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
