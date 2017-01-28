import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';
import { SchemaNormalizer } from './schema-normalizer.service';
import { JsonPointer, groupBy, SpecManager, StringMap, snapshot } from '../utils/';

import * as lunr from 'lunr';

interface IndexElement {
  menuId: string;
  title: string;
  body: string;
  pointer: string;
}

const index = lunr(function () {
  //this.field('menuId', {boost: 0});
  this.field('title', {boost: 1.5});
  this.field('body');
  this.ref('pointer');
});

const store:StringMap<IndexElement> = {};

@Injectable()
export class SearchService {
  normalizer: SchemaNormalizer;
  constructor(private app: AppStateService, private spec: SpecManager) {
    this.normalizer = new SchemaNormalizer(spec);
  }

  ensureSearchVisible(containingPointers: string[]) {
    this.app.searchContainingPointers.next(containingPointers);
  }

  indexAll() {
    this.indexPaths(this.spec.schema);
  }

  search(q):StringMap<IndexElement[]> {
    var items = {};
    const res:IndexElement[] = index.search(q).map(res => {
      items[res.menuId] = res;
      return store[res.ref];
    });
    const grouped = groupBy(res, 'menuId');
    return grouped;
  }

  index(element: IndexElement) {
     // don't reindex same pointers (for discriminator)
    if (store[element.pointer]) return;
    index.add(element);
    store[element.pointer] = element;
  }

  indexPaths(swagger:any) {
    const paths = swagger.paths;
    const basePtr = '#/paths';
    Object.keys(paths).forEach(path => {
      let opearations = paths[path];
      Object.keys(opearations).forEach(verb => {
        const opearation = opearations[verb];
        const ptr = JsonPointer.join(basePtr, [path, verb]);
        this.indexOperation(opearation, ptr);
      });
    });
  }

  indexOperation(operation:any, operationPointer:string) {
    this.index({
      pointer: operationPointer,
      menuId: operationPointer,
      title: operation.summary,
      body: operation.description
    });
    this.indexOperationResponses(operation, operationPointer);
    this.indexOperationParameters(operation, operationPointer);
  }

  indexOperationParameters(operation: any, operationPointer: string) {
    const parameters = operation.parameters;
    if (!parameters) return;
    for (let i=0; i<parameters.length; ++i) {
      const param = parameters[i];
      const paramPointer = JsonPointer.join(operationPointer, ['parameters', i]);
      this.index({
        pointer: paramPointer,
        menuId: operationPointer,
        title: param.in === 'body' ? '' : param.name,
        body: param.description
      });

      if (param.in === 'body') {
        this.normalizer.reset();
        this.indexSchema(param.schema, '', JsonPointer.join(paramPointer, ['schema']), operationPointer);
      }
    }
  }

  indexOperationResponses(operation:any, operationPtr:string) {
    const responses = operation.responses;
    if (!responses) return;
    Object.keys(responses).forEach(code => {
      const resp = responses[code];
      const respPtr = JsonPointer.join(operationPtr, ['responses', code]);
      this.index({
        pointer: respPtr,
        menuId: operationPtr,
        title: code,
        body: resp.description
      });

      if (resp.schema) {
        this.normalizer.reset();
        this.indexSchema(resp.schema, '', JsonPointer.join(respPtr, 'schema'), operationPtr);
      }
    });
  }

  indexSchema(_schema:any, name: string, absolutePointer: string, menuPointer: string, parent?: string) {
    if (!_schema) return;
    let schema = _schema;
    let title = name;
    schema = this.normalizer.normalize(schema, schema._pointer || absolutePointer, { childFor: parent });

    let body = schema.description;  // TODO: defaults, examples, etc...

    if (schema.type === 'array') {
      this.indexSchema(schema.items, title, JsonPointer.join(absolutePointer, ['items']), menuPointer);
      return;
    }

    if (schema.discriminator) {
      let derived = this.spec.findDerivedDefinitions(schema._pointer, schema);
      for (let defInfo of derived ) {
        let subSpec = this.spec.getDescendant(defInfo, schema);
        this.indexSchema(snapshot(subSpec), '', absolutePointer, menuPointer, schema._pointer);
      }
    }

    this.index({
      pointer: absolutePointer,
      menuId: menuPointer,
      title,
      body
    });

    if (schema.properties) {
      Object.keys(schema.properties).forEach(propName => {
        let propPtr = JsonPointer.join(absolutePointer, ['properties', propName]);
        this.indexSchema(schema.properties[propName], propName, propPtr, menuPointer);
      });
    }
  }
}
