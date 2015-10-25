'use strict';
import SwaggerParser from 'swagger-parser';
import JsonPointer from './JsonPointer';
import {methods as swaggerMethods} from  './swagger-defs';

export class SchemaManager {
  constructor() {
    if (SchemaManager.prototype._instance) {
      return SchemaManager.prototype._instance;
    }

    SchemaManager.prototype._instance = this;

    this._schema = {};
  }

  static instance() {
    return new SchemaManager();
  }

  load(url) {
    let promise = new Promise((resolve, reject) => {
      this._schema = {};

      SwaggerParser.bundle(url)
        .then(
          (schema) => {
            this._schema = schema;
            resolve(this._schema);
          },
          (err) => reject(err)
        );
    });

    return promise;
  }

  get schema() {
    // TODO: consider returning promise
    return this._schema;
  }

  byPointer(pointer) {
    let res = null;
    try {
      res = JsonPointer.get(this._schema, pointer);
    } catch(e)  {/*skip*/ }
    return res;
  }

  resolveRefs(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key].$ref) {
        obj[key] = this.byPointer(obj[key].$ref);
      }
    });
    return obj;
  }

  getMethodParams(methodPtr, resolveRefs) {
    /* inject JsonPointer into array elements */
    function injectPointers(array, root) {
      if (!array) return array;
      return array.map((element, idx) => {
        element._pointer = JsonPointer.join(root, idx);
        return element;
      });
    }

    //get path params
    let ptr = JsonPointer.dirName(methodPtr, 2) + '/parameters';
    let pathParams = this.byPointer(ptr);
    if (Array.isArray(pathParams)) {
      pathParams = injectPointers(pathParams, ptr);
    } else if (pathParams && pathParams.$ref) {
      pathParams = injectPointers(this.byPointer(pathParams.$ref), pathParams.$ref);
    } else {
      pathParams = [];
    }

    let methodParams = injectPointers(this.byPointer(methodPtr), methodPtr) || [];
    if (resolveRefs) {
      methodParams = this.resolveRefs(methodParams);
    }
    return methodParams.concat(pathParams);
  }

  /* returns ES6 Map */
  buildMenuTree() {
    let tag2MethodMapping = new Map();
    let paths = this._schema.paths;
    for (let path of Object.keys(paths)) {
      let methods = Object.keys(paths[path]).filter((k) => swaggerMethods.has(k));
      for (let method of methods) {
        let methodInfo = paths[path][method];
        let tags = methodInfo.tags;

        //TODO: mb need to do something cleverer
        if (!tags || !tags.length) {
          tags = ['[Other]'];
        }
        let methodPointer = JsonPointer.compile(['paths', path, method]);
        let methodSummary = methodInfo.summary;
        for (let tag of tags) {
          let tagMethods = tag2MethodMapping.get(tag);
          if (!tagMethods) {
            tagMethods = [];
            tag2MethodMapping.set(tag, tagMethods);
          }

          tagMethods.push({pointer: methodPointer, summary: methodSummary});
        }
      }
    }
    return tag2MethodMapping;
  }

}
