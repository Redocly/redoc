'use strict';
import SwaggerParser from 'swagger-parser';
import JsonPointer from './JsonPointer';
import {methods as swaggerMethods} from  './swagger-defs';

export default class SchemaManager {
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

      SwaggerParser.bundle(url, {http: {withCredentials: false}})
        .then(
          (schema) => {
            this._schema = schema;
            resolve(this._schema);
            this.init();
          },
          (err) => reject(err)
        );
    });

    return promise;
  }

  /* calculate common used values */
  init() {
    this.apiUrl = this._schema.schemes[0] + '://' + this._schema.host + this._schema.basePath;
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.substr(0, this.apiUrl.length - 1);
    }
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
        let resolved = this.byPointer(obj[key].$ref);
        resolved._pointer = obj[key].$ref;
        obj[key] = resolved;
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

    // accept pointer directly to parameters as well
    if (JsonPointer.baseName(methodPtr) === 'parameters') {
      methodPtr = JsonPointer.dirName(methodPtr);
    }

    //get path params
    let pathParamsPtr = JsonPointer.join(JsonPointer.dirName(methodPtr), ['parameters']);
    let pathParams = this.byPointer(pathParamsPtr) || [];

    let methodParamsPtr = JsonPointer.join(methodPtr, ['parameters']);
    let methodParams = this.byPointer(methodParamsPtr) || [];
    pathParams = injectPointers(pathParams, pathParamsPtr);
    methodParams = injectPointers(methodParams, methodParamsPtr);

    if (resolveRefs) {
      methodParams = this.resolveRefs(methodParams);
      pathParams = this.resolveRefs(pathParams);
    }
    return methodParams.concat(pathParams);
  }

  getTagsMap() {
    let tags = this._schema.tags || [];
    var tagsMap = {};
    for (let tag of tags) {
      tagsMap[tag.name] = {
        description: tag.description,
        'x-traitTag': tag['x-traitTag'] || false
      };
    }

    return tagsMap;
  }

  /* returns ES6 Map */
  buildMenuTree() {
    let tag2MethodMapping = new Map();

    let definedTags = this._schema.tags || [];
    // add tags into map to preserve order
    for (let tag of definedTags) {
      tag2MethodMapping.set(tag.name, {
        'description': tag.description,
        'x-traitTag': tag['x-traitTag'],
        'methods': []
      });
    }

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
          let tagDetails = tag2MethodMapping.get(tag);
          if (!tagDetails) {
            tagDetails = {};
            tag2MethodMapping.set(tag, tagDetails);
          }
          if (tagDetails['x-traitTag']) continue;
          if (!tagDetails.methods) tagDetails.methods = [];
          tagDetails.methods.push({pointer: methodPointer, summary: methodSummary});
        }
      }
    }
    return tag2MethodMapping;
  }

}
