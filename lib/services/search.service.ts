import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';
import { JsonPointer, groupBy, SpecManager, StringMap} from '../utils/';

import * as lunr from 'lunr';

interface IndexElement {
  menuPtr: string;
  title: string;
  body: string;
  pointer: string;
}

const index = lunr(function () {
  this.field('menuPtr', {boost: 0});
  this.field('title', {boost: 1.5});
  this.field('body');
  this.ref('pointer');
})

const store:StringMap<IndexElement> = {};

@Injectable()
export class SearchService {
  constructor(private app: AppStateService, private spec: SpecManager) {
  }

  ensureSearchVisible(containingPointers: string[]) {
    this.app.searchContainingPointers.next(containingPointers);
  }

  indexAll() {
    const swagger = this.spec.schema;

    this.indexPaths(swagger);
  }

  search(q):StringMap<IndexElement[]> {
    const res:IndexElement[] = index.search(q).map(res => {
      return store[res.ref];
    });
    const grouped = groupBy(res, 'menuPtr');
    return grouped;
  }

  index(element: IndexElement) {
    index.add(element);
    store[element.pointer] = element;
  }

  indexPaths(swagger:any) {
    const paths = swagger.paths
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

  indexOperation(operation:any, opPtr:string) {
    this.index({
      pointer: opPtr,
      menuPtr: opPtr,
      title: operation.summary,
      body: operation.description
    });
    this.indexOperationResponses(operation, opPtr);
  }

  indexOperationResponses(operation:any, operationPtr:string) {
    const responses = operation.responses;
    if (!responses) return;
    Object.keys(responses).forEach(code => {
      const resp = responses[code];
      const respPtr = JsonPointer.join(operationPtr, ['responses', code]);
      this.index({
        pointer: respPtr,
        menuPtr: operationPtr,
        title: code,
        body: resp.description
      });

      if (resp.schema) {
        this.indexSchema(resp.schema, '', JsonPointer.join(respPtr, 'schema'), operationPtr);
      }
    });
  }

  indexSchema(_schema:any, name: string, absolutePointer: string, menuPointer: string) {
    if (!_schema) return;
    let schema = _schema;
    let title = name;
    if (schema.$ref) {
      schema = this.spec.byPointer(_schema.$ref);
      title = name + ' ' + JsonPointer.baseName(_schema.$ref);
    }

    let body = schema.description;  // TODO: defaults, examples, etc...

    if (schema.type === 'array') {
      this.indexSchema(schema.items, title, JsonPointer.join(absolutePointer, ['items']), menuPointer);
      return;
    }

    this.index({
      pointer: absolutePointer,
      menuPtr: menuPointer,
      title,
      body
    })

    // TODO: allof etc
    if (schema.properties) {
      Object.keys(schema.properties).forEach(propName => {
        let propPtr = JsonPointer.join(absolutePointer, ['properties', propName]);
        this.indexSchema(schema.properties[propName], propName, propPtr, menuPointer);
      })
    }
  }
}
