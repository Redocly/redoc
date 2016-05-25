'use strict';

import JsonSchemaRefParser from 'json-schema-ref-parser/dist/ref-parser';
import JsonPointer from './JsonPointer';
import {methods as swaggerMethods} from  './swagger-defs';

export class SchemaManager {
  private _schema:any = {};
  private _instance:any;
  
  apiUrl: string;
  constructor() {
    if (SchemaManager.prototype._instance) {
      return SchemaManager.prototype._instance;
    }

    SchemaManager.prototype._instance = this;
  }

  static instance() {
    return new SchemaManager();
  }

  load(url) {
    let promise = new Promise((resolve, reject) => {
      this._schema = {};

      JsonSchemaRefParser.bundle(url, {http: {withCredentials: false}})
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
    if (!this._schema || !this._schema.schemes) return;
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
      // TODO: remove decodeURIComponent after this issue is fixed: https://github.com/BigstickCarpet/swagger-parser/issues/31
      res = JsonPointer.get(this._schema, decodeURIComponent(pointer));
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
      if (!Array.isArray(array)) {
        throw new Error(`parameters must be an array. Got ${typeof array} at ${root}`);
      }
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
  buildMenuTree():Map<string, any> {
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
        let methodSummary = methodInfo.summary || methodInfo.operationId;
        for (let tag of tags) {
          let tagDetails = tag2MethodMapping.get(tag);
          if (!tagDetails) {
            tagDetails = {};
            tag2MethodMapping.set(tag, tagDetails);
          }
          if (tagDetails['x-traitTag']) continue;
          if (!tagDetails.methods) tagDetails.methods = [];
          tagDetails.methods.push({
            pointer: methodPointer,
            summary: methodSummary,
            operationId: methodInfo.operationId
          });
        }
      }
    }
    return tag2MethodMapping;
  }

  findDerivedDefinitions(defPointer) {
    let definition = this.byPointer(defPointer);
    if (!definition) throw new Error(`Can't load schema at ${defPointer}`);
    if (!definition.discriminator) return [];

    let globalDefs = this._schema.definitions || {};
    let res = [];
    for (let defName of Object.keys(globalDefs)) {
      if (!globalDefs[defName].allOf) continue;

      let subTypes = globalDefs[defName].allOf;
      let idx = subTypes.findIndex((subType) => {
        if (subType.$ref === defPointer) return true;
        return false;
      });
      if (idx < 0) continue;

      let empty = false;
      if (subTypes.length === 1) {
        empty = true;
      }
      res.push({name: defName, $ref: `#/definitions/${defName}`, empty});
    }
    return res;
  }

}
