import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';
import { SchemaNormalizer } from './schema-normalizer.service';
import { JsonPointer, groupBy, SpecManager, StringMap, snapshot, MarkdownHeading } from '../utils/';
import { operations as swaggerOperations } from '../utils/swagger-defs';
import slugify from 'slugify';

import {
  SwaggerSpec,
  SwaggerOperation,
  SwaggerSchema,
  SwaggerBodyParameter,
  SwaggerResponse
} from '../utils/swagger-typings';

import * as lunr from 'lunr';

export interface IndexElement {
  menuId: string;
  title: string;
  body: string;
  pointer: string;
}

const index = lunr(function () {
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

  ensureSearchVisible(containingPointers: string|null[]) {
    this.app.searchContainingPointers.next(containingPointers);
  }

  indexAll() {
    console.time('Indexing');
    this.indexPaths(this.spec.schema);
    this.indexTags(this.spec.schema);
    this.indexDescriptionHeadings(this.spec.schema.info['x-redoc-markdown-headers']);
    console.time('Indexing end');
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

  indexDescriptionHeadings(headings:StringMap<MarkdownHeading>) {
    if (!headings) return;
    Object.keys(headings).forEach(k => {
      let heading = headings[k];
      this.index({
        menuId: heading.id,
        title: heading.title,
        body: heading.content,
        pointer: '/heading/' + heading.id
      });

      this.indexDescriptionHeadings(heading.children);
    });
  }

  indexTags(swagger:SwaggerSpec) {
    let tags = swagger.tags;
    if (!tags) return;
    for (let tag of tags) {
      if (tag['x-traitTag']) continue;
      let id = `tag/${slugify(tag.name)}`;
      this.index({
        menuId: id,
        title: tag.name,
        body: tag.description,
        pointer: id
      });
    }
  }

  indexPaths(swagger:SwaggerSpec) {
    const paths = swagger.paths;
    const basePtr = '#/paths';
    Object.keys(paths).forEach(path => {
      let opearations = paths[path];
      Object.keys(opearations).forEach(verb => {
        if (!swaggerOperations.has(verb)) return;
        const opearation = opearations[verb];
        const ptr = JsonPointer.join(basePtr, [path, verb]);

        this.indexOperation(opearation, ptr);
      });
    });
  }

  indexOperation(operation:SwaggerOperation, operationPointer:string) {
    this.index({
      pointer: operationPointer,
      menuId: operationPointer,
      title: operation.summary,
      body: operation.description
    });
    this.indexOperationResponses(operation, operationPointer);
    this.indexOperationParameters(operation, operationPointer);
  }

  indexOperationParameters(operation: SwaggerOperation, operationPointer: string) {
    const parameters = this.spec.getOperationParams(operationPointer);
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
        this.indexSchema((<SwaggerBodyParameter>param).schema,
          '', JsonPointer.join(paramPointer, ['schema']), operationPointer);
      }
    }
  }

  indexOperationResponses(operation:SwaggerOperation, operationPtr:string) {
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
      if (resp.headers) {
        this.indexOperationResponseHeaders(resp, respPtr, operationPtr);
      }
    });
  }

  indexOperationResponseHeaders(response: SwaggerResponse, responsePtr: string, operationPtr: string, ) {
    let headers = response.headers || [];
    Object.keys(headers).forEach(headerName => {
      let header = headers[headerName];
      this.index({
        pointer: `${responsePtr}/${headerName}`,
        menuId: operationPtr,
        title: headerName,
        body: header.description
      });
    });
  }

  indexSchema(_schema:SwaggerSchema, name: string, absolutePointer: string,
    menuPointer: string, parent?: string) {
    if (!_schema) return;
    let schema = _schema;
    let title = name;
    schema = this.normalizer.normalize(schema, schema._pointer || absolutePointer, { childFor: parent });

    // prevent endless discriminator recursion
    if (schema._pointer && schema._pointer === parent) return;

    let body = schema.description;  // TODO: defaults, examples, etc...

    if (schema.type === 'array') {
      if (Array.isArray(schema.items)) {
        schema.items.map((itemSchema, idx) => {
          this.indexSchema(itemSchema, title, JsonPointer.join(absolutePointer, ['items', idx]), menuPointer, parent);
        });
      } else {
        this.indexSchema(schema.items, title, JsonPointer.join(absolutePointer, ['items']), menuPointer, parent);
      }
      return;
    }

    if (schema.discriminator) {
      let derived = this.spec.findDerivedDefinitions(schema._pointer, schema);
      for (let defInfo of derived ) {
        let subSpec = this.spec.getDescendant(defInfo, schema);
        this.indexSchema(snapshot(subSpec), '', absolutePointer, menuPointer, schema._pointer);
      }
    }

    if (schema.type === 'string' && schema.enum) {
      body += ' ' + schema.enum.join(' ');
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
        let prop:SwaggerSchema = schema.properties[propName];
        this.indexSchema(prop, propName, propPtr, menuPointer, parent);
      });
    }
  }
}
