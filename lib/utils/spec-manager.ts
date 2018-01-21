'use strict';
import { Injectable } from '@angular/core';
import * as JsonSchemaRefParser from 'json-schema-ref-parser';
import { JsonPointer } from './JsonPointer';
import { parse as urlParse, resolve as urlResolve } from 'url';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MdRenderer } from './md-renderer';

import { SwaggerOperation, SwaggerParameter } from './swagger-typings';
import { snapshot } from './helpers';
import { OptionsService, Options } from '../services/options.service';
import { WarningsService } from '../services/warnings.service';

function getDiscriminator(obj) {
  return obj.discriminator || obj['x-extendedDiscriminator'];
}

export interface DescendantInfo {
  $ref: string;
  name: string;
  active?: boolean;
  idx?: number;
}

@Injectable()
export class SpecManager {
  public _schema: any = {};
  public rawSpec: any;
  public apiUrl: string;
  public apiProtocol: string;
  public swagger: string;
  public basePath: string;

  public spec = new BehaviorSubject<any|null>(null);
  public specUrl: string;
  private parser: any;
  private options: Options;

  constructor(optionsService: OptionsService) {
    this.options = optionsService.options;
  }

  load(urlOrObject: string|Object) {
    let promise = new Promise((resolve, reject) => {
      this.parser = new JsonSchemaRefParser();
      this.parser.bundle(urlOrObject, {http: {withCredentials: false}})
      .then(schema => {
        if (typeof urlOrObject === 'string') {
          this.specUrl = urlOrObject;
        }
        this.rawSpec = schema;
        this._schema = snapshot(schema);
        try {
          this.init();
          this.spec.next(this._schema);
          resolve(this._schema);
        } catch(err) {
          reject(err);
        }
      }, err => reject(err));
    });

    return promise;
  }

  /* calculate common used values */
  init() {
    let urlParts = this.specUrl ? urlParse(urlResolve(window.location.href, this.specUrl)) : {
      protocol: undefined,
      host: undefined
    };
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
    this.basePath = this._schema.basePath || '';
    this.apiUrl = protocol + '://' + host + this.basePath;
    this.apiProtocol = protocol;
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.substr(0, this.apiUrl.length - 1);
    }

    this.preprocess();
  }

  preprocess() {
    let mdRender = new MdRenderer();
    if (!this._schema.info) {
      throw Error('Specification Error: Required field "info" is not specified at the top level of the specification');
    }
    if (!this._schema.info.description) this._schema.info.description = '';
    if (this._schema.securityDefinitions && !this.options.noAutoAuth) {
      let SecurityDefinitions =
        require('../components/SecurityDefinitions/security-definitions').SecurityDefinitions;
      mdRender.addPreprocessor(SecurityDefinitions.insertTagIntoDescription);
    }
    this._schema.info['x-redoc-html-description'] = mdRender.renderMd(this._schema.info.description);
    this._schema.info['x-redoc-markdown-headers'] = mdRender.headings;
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

  getOperationParams(operationPtr:string):SwaggerParameter[] {
    /* inject JsonPointer into array elements */
    function injectPointers(array:SwaggerParameter[], root) {
      if (!Array.isArray(array)) {
        throw new Error(`parameters must be an array. Got ${typeof array} at ${root}`);
      }
      return array.map((element, idx) => {
        element._pointer = JsonPointer.join(root, idx);
        return element;
      });
    }

    // accept pointer directly to parameters as well
    if (JsonPointer.baseName(operationPtr) === 'parameters') {
      operationPtr = JsonPointer.dirName(operationPtr);
    }

    //get path params
    let pathParamsPtr = JsonPointer.join(JsonPointer.dirName(operationPtr), ['parameters']);
    let pathParams:SwaggerParameter[] = this.byPointer(pathParamsPtr) || [];

    let operationParamsPtr = JsonPointer.join(operationPtr, ['parameters']);
    let operationParams:SwaggerParameter[] = this.byPointer(operationParamsPtr) || [];

    const operationParamNames = {};
    operationParams.forEach(param => operationParamNames[param.name] = true);

    // filter out path params overriden by operation ones with the same name
    pathParams = pathParams.filter(pathParam => !operationParamNames[pathParam.name]);
    pathParams = injectPointers(pathParams, pathParamsPtr);
    operationParams = injectPointers(operationParams, operationParamsPtr);

    // resolve references
    operationParams = this.resolveRefs(operationParams);
    pathParams = this.resolveRefs(pathParams);
    return operationParams.concat(pathParams);
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

  findDerivedDefinitions(defPointer: string, schema?: any): DescendantInfo[] {
    let definition = schema || this.byPointer(defPointer);
    if (!definition) throw new Error(`Can't load schema at ${defPointer}`);
    if (!definition.discriminator && !definition['x-extendedDiscriminator']) return [];

    let globalDefs = this._schema.definitions || {};
    let res:DescendantInfo[] = [];


    // from the spec: When used, the value MUST be the name of this schema or any schema that inherits it.
    // but most of people use it as an abstract class so here is workaround to allow using it other way
    // check if parent definition name is in the enum of possible values
    if (definition.discriminator) {
      let prop = definition.properties[definition.discriminator];
      if (prop && prop.enum && prop.enum.indexOf(JsonPointer.baseName(defPointer)) > -1) {
        res.push({
          name: JsonPointer.baseName(defPointer),
          $ref: defPointer
        });
      }
    }

    let extendedDiscriminatorProp = definition['x-extendedDiscriminator'];

    let pointers;
    if (definition['x-derived-from']) {
      // support inherited discriminator o_O
      let derivedDiscriminator = definition['x-derived-from'].filter(ptr => {
        if (!ptr) return false;
        let def = this.byPointer(ptr);
        return def && def.discriminator;
      });
      pointers = [defPointer, ...derivedDiscriminator];
    } else {
      pointers = [defPointer];
    }


    for (let defName of Object.keys(globalDefs)) {
      let def = globalDefs[defName];
      if (!def.allOf &&
        !def['x-derived-from']) continue;
      let subTypes = def['x-derived-from'] ||
        def.allOf.map(subType => subType._pointer || subType.$ref);

      let idx = -1;

      for (let ptr of pointers) {
        idx = subTypes.findIndex(ref => ptr && ref === ptr);
        if (idx >= 0) break;
      }

      if (idx < 0) continue;

      let derivedName;
      if (extendedDiscriminatorProp) {
        let subDefs = def.allOf || [];
        for (let def of subDefs) {
          let prop = def.properties && def.properties[extendedDiscriminatorProp];
          if (prop && prop.enum && prop.enum.length === 1) {
            derivedName = prop.enum[0];
            break;
          }
        }
        if (derivedName == undefined) {
          WarningsService.warn(`Incorrect usage of x-extendedDiscriminator at ${defPointer}: `
            + `can't find corresponding enum with single value in definition "${defName}"`);
          continue;
        }
      } else {
        derivedName = defName;
      }

      res.push({name: derivedName, $ref: `#/definitions/${defName}`});
    }
    return res;
  }

  getDescendant(descendant:DescendantInfo, componentSchema:any) {
    let res;
    if (!getDiscriminator(componentSchema) && componentSchema.allOf) {
      // discriminator inherited from parents
      // only one discriminator and only one level of inheritence is supported at the moment
      res = Object.assign({}, componentSchema);
      let idx = res.allOf.findIndex(subSpec => !!getDiscriminator(subSpec));
      res.allOf[idx] = this.byPointer(descendant.$ref);
    } else {
      // this.pointer = activeDescendant.$ref;
      res = this.byPointer(descendant.$ref);
    }
    return res;
  }

}
