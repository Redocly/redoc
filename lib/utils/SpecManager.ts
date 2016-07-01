'use strict';

import JsonSchemaRefParser from 'json-schema-ref-parser';
import JsonPointer from './JsonPointer';

export class SpecManager {
  public _schema:any = {};
  public apiUrl: string;
  private _instance:any;

  static instance() {
    return new SpecManager();
  }

  constructor() {
    if (SpecManager.prototype._instance) {
      return SpecManager.prototype._instance;
    }

    SpecManager.prototype._instance = this;
  }

  load(url) {
    let promise = new Promise((resolve, reject) => {
      this._schema = {};

      JsonSchemaRefParser.bundle(url, {http: {withCredentials: false}})
      .then(schema => {
          this._schema = schema;
          resolve(this._schema);
          this.init();
      }, err => reject(err));
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
    return this._schema;
  }

  byPointer(pointer) {
    let res = null;
    try {
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

  findDerivedDefinitions(defPointer) {
    let definition = this.byPointer(defPointer);
    if (!definition) throw new Error(`Can't load schema at ${defPointer}`);
    if (!definition.discriminator) return [];

    let globalDefs = this._schema.definitions || {};
    let res = [];
    for (let defName of Object.keys(globalDefs)) {
      if (!globalDefs[defName].allOf &&
        !globalDefs[defName]['x-derived-from']) continue;
      let subTypes = globalDefs[defName]['x-derived-from'] ||
        globalDefs[defName].allOf.map(subType => subType.$ref);
      let idx = subTypes.findIndex(ref => ref === defPointer);
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
