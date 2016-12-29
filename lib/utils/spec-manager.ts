'use strict';

import * as JsonSchemaRefParser from 'json-schema-ref-parser';
import { JsonPointer } from './JsonPointer';
import { parse as urlParse, resolve as urlResolve } from 'url';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MdRenderer } from './md-renderer';

export class SpecManager {
  public _schema: any = {};
  public apiUrl: string;
  public basePath: string;

  public spec = new BehaviorSubject<any|null>(null);
  private _url: string;
  private parser: any;

  load(urlOrObject: string|Object) {
    let promise = new Promise((resolve, reject) => {
      this.parser = new JsonSchemaRefParser();
      this.parser.bundle(urlOrObject, {http: {withCredentials: false}})
      .then(schema => {
        if (typeof urlOrObject === 'string') {
          this._url = urlOrObject;
        }
        this._schema = schema;
        try {
          this.init();
          resolve(this._schema);
          this.spec.next(this._schema);
        } catch(err) {
          reject(err);
        }
      }, err => reject(err));
    });

    return promise;
  }

  /* calculate common used values */
  init() {
    let urlParts = this._url ? urlParse(urlResolve(window.location.href, this._url)) : {};
    let schemes = this._schema.schemes;
    let protocol;
    if (!schemes || !schemes.length) {
      // url parser incudles ':' in protocol so remove it
      protocol = urlParts.protocol ? urlParts.protocol.slice(0, -1) : 'http';
    } else {
      protocol = schemes[0];
      if (protocol === 'http' && schemes.indexOf('https') >= 0) {
        protocol = 'https';
      }
    }

    let host = this._schema.host || urlParts.host;
    this.basePath = this._schema.basePath || '/';
    this.apiUrl = protocol + '://' + host + this.basePath;
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.substr(0, this.apiUrl.length - 1);
    }

    this.preprocess();
  }

  preprocess() {
    let mdRender = new MdRenderer();
    if (!this._schema.info.description) this._schema.info.description = '';
    if (this._schema.securityDefinitions) {
      let SecurityDefinitions =  require('../components/').SecurityDefinitions;
      mdRender.addPreprocessor(SecurityDefinitions.insertTagIntoDescription);
    }
    this._schema.info['x-redoc-html-description'] = mdRender.renderMd(this._schema.info.description);
    this._schema.info['x-redoc-markdown-headers'] = mdRender.firstLevelHeadings;
    this._schema.info['x-redoc-markdown-subheaders'] = mdRender.secondLevelHeadings;
  }

  get schema() {
    return this._schema;
  }

  set schema(val:any) {
    this._schema = val;
    this.spec.next(this._schema);
  }

  byPointer(pointer) {
    let res = null;
    if (pointer == undefined) return null;
    try {
      res = JsonPointer.get(this._schema, decodeURIComponent(pointer));
    } catch(e)  {
      // if resolved from outer files simple jsonpointer.get fails to get correct schema
      if (pointer.charAt(0) !== '#') pointer = '#' + pointer;
      try {
        res = this.parser.$refs.get(decodeURIComponent(pointer));
      } catch(e) { /* skip */ }
    }
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
      if (tag['x-traitTag']) {
        console.warn(`x-traitTag (${tag.name}) is deprecated since v1.5.0 and will be removed in the future`);
      }
    }

    return tagsMap;
  }

  findDerivedDefinitions(defPointer) {
    let definition = this.byPointer(defPointer);
    if (!definition) throw new Error(`Can't load schema at ${defPointer}`);
    if (!definition.discriminator && !definition['x-extendedDiscriminator']) return [];

    let globalDefs = this._schema.definitions || {};
    let res = [];
    let extendedDiscriminatorProp = definition['x-extendedDiscriminator'];
    for (let defName of Object.keys(globalDefs)) {
      let def = globalDefs[defName];
      if (!def.allOf &&
        !def['x-derived-from']) continue;
      let subTypes = def['x-derived-from'] ||
        def.allOf.map(subType => subType._pointer || subType.$ref);
      let idx = subTypes.findIndex(ref => ref === defPointer);
      if (idx < 0) continue;

      let derivedName = defName;
      if (extendedDiscriminatorProp) {
        let prop = def.properties && def.properties[extendedDiscriminatorProp];
        if (prop && prop.enum && prop.enum.length === 1) {
          derivedName = prop.enum[0];
        }
      }

      res.push({name: derivedName, $ref: `#/definitions/${defName}`});
    }
    return res;
  }

}
